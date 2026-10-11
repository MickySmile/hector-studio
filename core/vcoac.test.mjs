import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateFormation } from './validate-formation.mjs';

const fixture = async (s = 'program_only') => JSON.parse(await readFile(new URL(`../examples/IA017/${s}/formation.json`, import.meta.url), 'utf8'));
const has = (r, code) => r.checks.some(c=>c.code===code);
// Les tests métier n'ont pas besoin de résolution des sources locales.
const report = d => validateFormation(d);

for (const scenario of ['program_only', 'act_on_data']) test(`VCOAC ${scenario} : durées, pratique, fusions et recherche sans mutation`, async()=>{
  const d = await fixture(scenario), before=JSON.stringify(d);
  const r=await report(d); assert.equal(r.valid,true,JSON.stringify(r.errors));
  const moments=d.modules.flatMap(m=>m.moments_pedagogiques);
  assert.equal(new Set(moments.map(m=>m.id)).size,moments.length);
  for (const m of d.modules) {
    assert.equal(m.moments_pedagogiques.reduce((n,x)=>n+x.duree_minutes,0),m.duree_minutes);
    assert.equal(m.moments_pedagogiques.reduce((n,x)=>n+x.pratique_minutes,0),m.pratique_minutes);
  }
  assert.ok(moments.some(m=>m.fonctions_vcoac.length>1));
  assert.ok(moments.some(m=>m.besoin_recherche));
  assert.ok(moments.filter(m=>m.besoin_recherche).every(m=>m.questions_recherche.length));
  assert.equal(JSON.stringify(d),before);
});

test('VCOAC : champs requis et structures incorrectes sont bloquants',async()=>{
  const original=await fixture();
  for(const key of ['id','fonctions_vcoac','titre','intention','duree_minutes','pratique_minutes','contenu_prevu','concepts_concernes','besoin_recherche','status']) {
    const d=structuredClone(original); delete d.modules[0].moments_pedagogiques[0][key];
    assert.equal((await report(d)).valid,false,key);
  }
  for(const [key,value] of [['fonctions_vcoac',[]],['fonctions_vcoac',['VOIR']],['fonctions_vcoac',['voir','voir']],['duree_minutes',0],['duree_minutes',-1],['duree_minutes',1.5],['concepts_concernes','agent'],['concepts_concernes',[{}]],['concepts_concernes',['  ']],['besoin_recherche','true'],['questions_recherche',[null]],['contenu_prevu',[]]]) {
    const d=structuredClone(original);d.modules[0].moments_pedagogiques[0][key]=value;
    assert.equal((await report(d)).valid,false,`${key}: ${JSON.stringify(value)}`);
  }
  for(const value of [null,{},[],[null]]) {
    const d=structuredClone(original);d.modules[0].moments_pedagogiques=value;
    assert.equal((await report(d)).valid,false);
  }
});

for(const [name,mutate,code] of [
  ['ID dans le même module',d=>d.modules[0].moments_pedagogiques[1].id=d.modules[0].moments_pedagogiques[0].id,'duplicate_moment_id'],
  ['ID entre modules',d=>d.modules[1].moments_pedagogiques[0].id=d.modules[0].moments_pedagogiques[0].id,'duplicate_moment_id'],
  ['somme des durées',d=>d.modules[0].moments_pedagogiques[0].duree_minutes++,'moment_duration_mismatch'],
  ['somme de pratique',d=>d.modules[0].moments_pedagogiques[0].pratique_minutes=1,'moment_practice_mismatch'],
  ['pratique trop longue',d=>d.modules[0].moments_pedagogiques[0].pratique_minutes=11,'moment_practice_exceeds_duration'],
]) test(`VCOAC : ${name}`,async()=>{const d=await fixture();mutate(d);const r=await report(d);assert.ok(has(r,code));assert.equal(r.valid,false);assert.equal(has(r,'module_totals'),false);});

test('VCOAC : recherche requiert des questions spécifiques non blanches',async()=>{
  for(const value of [undefined,[],[' '],null]) {
    const d=await fixture(),m=d.modules[0].moments_pedagogiques[0];m.besoin_recherche=true;
    if(value===undefined) delete m.questions_recherche; else m.questions_recherche=value;
    assert.ok(has(await report(d),'research_questions_missing'));
  }
  const d=await fixture();delete d.modules[0].moments_pedagogiques[0].questions_recherche;
  assert.equal((await report(d)).valid,true);
});

test('VCOAC : consolidation seule >10 min warning, seuil inclusif et fusion autorisée',async()=>{
  for(const [minutes,functions,warning] of [[10,['consolider'],false],[11,['consolider'],true],[11,['agir','consolider'],false]]) {
    const d=await fixture(),m=d.modules[0];
    m.moments_pedagogiques=[{...m.moments_pedagogiques[0],fonctions_vcoac:functions,duree_minutes:minutes,pratique_minutes:0}];
    m.duree_minutes=minutes;m.pratique_minutes=0;
    const r=await report(d);assert.equal(r.valid,true);assert.equal(has(r,'consolidation_long'),warning);
    if(warning) assert.equal(r.warnings.find(c=>c.code==='consolidation_long').severity,'warning');
  }
});

test('VCOAC : une fonction seule suffit et les moments restent optionnels avant P3',async()=>{
  const d=await fixture();d.modules.forEach(m=>delete m.moments_pedagogiques);
  assert.equal((await report(d)).valid,true);
  const m=d.modules[0];m.moments_pedagogiques=[{id:'moment',fonctions_vcoac:['agir'],titre:'Pratique',intention:'Appliquer',duree_minutes:m.duree_minutes,pratique_minutes:m.pratique_minutes,contenu_prevu:['Application envisagée'],concepts_concernes:[],besoin_recherche:false,status:'proposition'}];
  assert.equal((await report(d)).valid,true);
});

test('VCOAC : scénarios réellement distincts et contexte client isolé',async()=>{
  const po=await fixture(),aod=await fixture('act_on_data');
  const text=d=>JSON.stringify(d.modules.flatMap(m=>m.moments_pedagogiques));
  assert.doesNotMatch(text(po),/Act-On|Shadow AI|MCP|managers|RH/);
  for(const word of ['Shadow AI','MCP','RGPD','RH','managers','capacité de production']) assert.ok(text(aod).includes(word),word);
  assert.match(text(po),/TP guidé|no-code/);
});

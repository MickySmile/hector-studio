import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, mkdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { loadContents, resolveProvenance } from '../../../core/content.mjs';
import { loadKnowledge } from '../../../core/knowledge.mjs';
import { loadResearchPlan } from '../../../core/research.mjs';
import { createServer } from '../../../app/server.mjs';

const base = new URL('./', import.meta.url);
const path = new URL('formation.json', base);
const formation = JSON.parse(await readFile(path, 'utf8'));
const readiness = JSON.parse(await readFile(new URL('readiness.json', base), 'utf8'));
const enriched = await loadContents(formation, path);
const notes = await loadKnowledge(fileURLToPath(new URL('../../../knowledge/', base)));
const hash = value => createHash('sha256').update(value).digest('hex');
const moments = formation.modules.flatMap(m => m.moments_pedagogiques);

test('Finalisation Act-On Data : 3/3, 6/6, 5/5, 4/4 et provenance complète des 18 contenus', () => {
  assert.equal(enriched.valid, true, JSON.stringify(enriched.errors));
  assert.deepEqual(readiness.modules.map(m => [m.ready, m.total]), [[3,3],[6,6],[5,5],[4,4]]);
  assert.deepEqual(readiness.modules.flatMap(m => m.moments.map(p => p.moment_id)).sort(), moments.map(m => m.id).sort());
  assert.equal(Object.keys(enriched.contents).length, 18);
  for (const row of readiness.modules.flatMap(m => m.moments)) {
    const c = enriched.contents[row.moment_id];
    assert.equal(row.status, 'READY'); assert.equal(row.content_ref, c.path);
    assert.ok(moments.find(m => m.id === row.moment_id).intention.trim());
    if (!row.moment_id.startsWith('AOD-M02')) assert.ok(c.content.includes('Intention pédagogique'), row.moment_id);
    assert.ok(resolveProvenance(c.metadata.knowledge_refs, c.metadata.source_refs, notes).length);
  }
  assert.deepEqual(readiness.remaining_blockers, []);
});

test('Finalisation Act-On Data : référence Module 2 conforme après les ajustements RH-042 autorisés', async () => {
  assert.equal(hash(JSON.stringify(formation.modules[1])), readiness.preserved_module2.module);
  for (const m of formation.modules[1].moments_pedagogiques) assert.equal(hash(await readFile(new URL(m.content_ref, base))), readiness.preserved_module2.contents[m.id]);
});

test('Finalisation Act-On Data : 420 min, 250 de pratique, transitions incluses et 435 conservé', () => {
  assert.equal(formation.meta.duree_minutes, 420); assert.equal(formation.meta.duree_detaillee_minutes, 435);
  assert.equal(readiness.timing.segments.reduce((n,s) => n+s.minutes,0), 420);
  assert.equal(formation.modules.reduce((n,m) => n+m.duree_minutes,0), 390);
  assert.equal(formation.modules.reduce((n,m) => n+m.pratique_minutes,0), 250);
  assert.equal(readiness.timing.practice_percent, 250/420*100);
  for(const m of formation.modules) {
    assert.equal(m.moments_pedagogiques.reduce((n,p) => n+p.duree_minutes,0), m.duree_minutes);
    assert.equal(m.moments_pedagogiques.reduce((n,p) => n+p.pratique_minutes,0), m.pratique_minutes);
  }
});

test('Finalisation Act-On Data : cinq activités finalisées avec consigne, production et correction', () => {
  const ids = moments.filter(m => !m.id.startsWith('AOD-M02') && m.fonctions_vcoac.includes('agir')).map(m=>m.id);
  assert.equal(ids.length,5);
  for (const id of ids) {
    const body = enriched.contents[id].content;
    for (const marker of [/consigne participant/i, /une slide/i, /livrable/i, /correction/i, /réussite|critères/i]) assert.match(body, marker, id);
  }
});

test('Finalisation Act-On Data : sources de valeur indispensables, confirmation client jamais couverte', async () => {
  const incomplete = notes.filter(n => n.metadata.id !== 'SRC-NIST-MESURE-IA');
  for (const m of formation.modules[3].moments_pedagogiques) {
    const c = enriched.contents[m.id];
    assert.throws(() => resolveProvenance(c.metadata.knowledge_refs, c.metadata.source_refs, incomplete), /Source non résolue/);
  }
  const research = await loadResearchPlan(new URL('research-plan.json',base),formation,{asOf:'2026-10-12'});
  assert.equal(research.validation.valid,true);
  assert.deepEqual(research.counts,{total:8,covered:7,refresh_needed:0,external_research_needed:1});
  const q = research.plan.questions.find(q=>q.id.endsWith('a1936416981d'));
  assert.equal(q.status,'external_research_needed'); assert.match(q.review.justification,/transfert/);
});

async function serve(t, options) {
  const server = createServer(options);
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}

test('Cockpit Act-On Data : readiness, activités et Knowledge visibles, texte échappé', async t => {
  const url = await serve(t);
  const response = await fetch(url+'/api/scenarios/act_on_data');
  const body = await response.json();
  assert.equal(body.readiness_error,null); assert.deepEqual(body.readiness,readiness);
  const elements = new Map();
  const document = {querySelector(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:''});return elements.get(id);},querySelectorAll(){return [];},addEventListener(){}};
  const context=vm.createContext({document,fetch: url=>fetch(`${serverUrl}${url}`)});
  const serverUrl=url;
  vm.runInContext(await readFile(new URL('../../../app/public/app.js',base),'utf8'),context);
  await vm.runInContext("loadScenario('act_on_data')",context);
  vm.runInContext("view='vcoac'; render()",context);
  const html=()=>document.querySelector('#content').innerHTML;
  for(const text of ['3/3 READY','6/6 READY','5/5 READY','4/4 READY','59,52','Consigne participant','MET-VALEUR-WORKFLOW','SRC-NIST-MESURE-IA']) assert.ok(html().includes(text),text);
  vm.runInContext("readiness.definition='<script>unsafe</script>'; render()",context);
  assert.match(html(),/&lt;script&gt;unsafe/); assert.doesNotMatch(html(),/<script>/);
  await vm.runInContext("loadScenario('program_only')",context);
  assert.doesNotMatch(html(),/READY|Readiness pédagogique|MET-VALEUR-WORKFLOW/);
});

test('Cockpit Act-On Data : manifeste absent ou incohérent ne peut afficher READY', async t => {
  const directory=await mkdtemp(join(tmpdir(),'hector-aod-final-'));
  t.after(()=>rm(directory,{recursive:true,force:true}));
  const copy=structuredClone(formation);
  copy.sources.forEach(s=>s.fichier=resolve(fileURLToPath(base),s.fichier));
  await writeFile(join(directory,'formation.json'),JSON.stringify(copy));
  await writeFile(join(directory,'research-plan.json'),await readFile(new URL('research-plan.json',base)));
  await mkdir(join(directory,'content'));
  for(const m of moments) await writeFile(join(directory,m.content_ref),await readFile(new URL(m.content_ref,base)));
  const url=await serve(t,{files:{act_on_data:join(directory,'formation.json')}});
  let body=await (await fetch(url+'/api/scenarios/act_on_data')).json();
  assert.equal(body.enriched.valid,true); assert.equal(body.readiness,null); assert.match(body.readiness_error,/indisponible/);
  const bad=structuredClone(readiness); bad.modules[0].moments[0].moment_id='AOD-INCONNU';
  await writeFile(join(directory,'readiness.json'),JSON.stringify(bad));
  body=await (await fetch(url+'/api/scenarios/act_on_data')).json();
  assert.equal(body.readiness,null); assert.match(body.readiness_error,/incohérente/);
  await writeFile(join(directory,'readiness.json'),JSON.stringify(readiness));
  await writeFile(join(directory,'content/AOD-M04-MP01.md'),'Contenu cassé');
  body=await (await fetch(url+'/api/scenarios/act_on_data')).json();
  assert.equal(body.enriched.valid,false); assert.equal(body.readiness,null);
});

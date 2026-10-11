import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { validateFormation } from '../core/validate-formation.mjs';

const source = await readFile(new URL('./public/app.js',import.meta.url),'utf8');
const fixtures = Object.fromEntries(await Promise.all(['program_only','act_on_data'].map(async s => [s,JSON.parse(await readFile(new URL(`../examples/IA017/${s}/formation.json`,import.meta.url),'utf8'))])));
async function frontend(transform = x=>x, reportTransform = x=>x) {
  const elements=new Map(), handlers={};
  const document={
    querySelector(id) { if(!elements.has(id)) elements.set(id,{innerHTML:'',textContent:''}); return elements.get(id); },
    querySelectorAll(){return [];},getElementById(){return {focus(){}};},
    addEventListener(name,handler){handlers[name]=handler;},
  };
  const responses = {};
  for (const [scenario, fixture] of Object.entries(fixtures)) {
    const formation=transform(structuredClone(fixture));
    responses[scenario]={formation,validation:reportTransform(await validateFormation(formation))};
  }
  const context=vm.createContext({document,fetch:async url=>({ok:true,json:async()=>responses[url.split('/').at(-1)]})});
  vm.runInContext(source,context);
  await new Promise(resolve=>setImmediate(resolve));
  const click=dataset=>handlers.click({target:{closest:()=>({dataset,hasAttribute:()=>false})}});
  click({view:'modules'});
  return {click,run:code=>vm.runInContext(code,context),content:document.querySelector('#content'),navigation:document.querySelector('#navigation')};
}
for (const [scenario,minutes,percentage] of [['program_only',230,'54,8'],['act_on_data',250,'59,5']]) {
  test(`Cockpit Modules ${scenario} : bilan, progression, détails et alerte conservée`, async()=>{
    const ui=await frontend(); await ui.run(`loadScenario('${scenario}')`);
    assert.match(ui.navigation.innerHTML,/data-view="modules" aria-current="page"/);
    assert.match(ui.content.innerHTML,/390 \/ 420 min/);
    assert.ok(ui.content.innerHTML.includes(`${percentage} %`));
    assert.ok(ui.content.innerHTML.includes(`${minutes} min / 420`));
    assert.match(ui.content.innerHTML,/435/);
    assert.match(ui.content.innerHTML,/30 min/);
    assert.match(ui.content.innerHTML,/<ol>/);
    assert.equal((ui.content.innerHTML.match(/<details>/g)||[]).length,4);
    assert.doesNotMatch(ui.content.innerHTML,/data-simulate/);
    for (const m of fixtures[scenario].modules) for(const value of [m.titre,m.resultat_attendu,...m.competences,...m.concepts_cles,m.justification]) assert.ok(ui.content.innerHTML.includes(value),value);
  });
}
test('Cockpit Modules : changement de scénario conserve la vue et remplace tous les modules',async()=>{
  const ui=await frontend(); ui.click({scenario:'act_on_data'});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(ui.run('view'),'modules');
  assert.match(ui.content.innerHTML,/AOD-M04/); assert.doesNotMatch(ui.content.innerHTML,/PO-M/);
  ui.click({scenario:'program_only'}); await new Promise(resolve=>setImmediate(resolve));
  assert.match(ui.content.innerHTML,/PO-M04/); assert.doesNotMatch(ui.content.innerHTML,/AOD-M/);
});
test('Cockpit Modules : absence optionnelle et textes échappés',async()=>{
  const empty=await frontend(d=>{delete d.modules;return d;});
  assert.match(empty.content.innerHTML,/Modules non définis/);
  const unsafe=await frontend(d=>{d.modules[0].titre='<script> & test';return d;});
  assert.match(unsafe.content.innerHTML,/&lt;script&gt; &amp; test/);
  assert.doesNotMatch(unsafe.content.innerHTML,/<script>/);
});
test('Cockpit Modules : affiche les calculs du core sans recalcul et ses warnings',async()=>{
  const ui=await frontend(x=>x,r=>{
    r.checks.find(c=>c.code==='module_totals').details.practicePercentage=12.3;
    r.warnings.push({path:'/modules',message:'Écart sentinelle <test>'});return r;
  });
  assert.match(ui.content.innerHTML,/12,3 %/);
  assert.match(ui.content.innerHTML,/Écart sentinelle &lt;test&gt;/);
});
test('Carte : affiche tous les modules travaillant la compétence sélectionnée',async()=>{
  const ui=await frontend(); ui.click({view:'carte'}); ui.click({competence:'PO-C02'});
  assert.match(ui.content.innerHTML,/Travaillée dans les modules/);
  assert.match(ui.content.innerHTML,/PO-M02/); assert.match(ui.content.innerHTML,/PO-M03/);
});

for(const scenario of ['program_only','act_on_data']) test(`Cockpit VCOAC ${scenario} : fusions, durées, recherche et détails`,async()=>{
  const ui=await frontend();ui.click({view:'vcoac'});await ui.run(`loadScenario('${scenario}')`);
  const html=ui.content.innerHTML,moments=fixtures[scenario].modules.flatMap(m=>m.moments_pedagogiques);
  assert.match(ui.navigation.innerHTML,/data-view="vcoac" aria-current="page"/);
  assert.equal((html.match(/class="vcoac-moment"/g)||[]).length,moments.length);
  assert.match(html,/Recherche nécessaire/);assert.match(html,/VOIR \+ COMPRENDRE/);
  assert.doesNotMatch(html,/data-simulate|<input|<textarea/);
  for(const m of moments) {
    assert.ok(html.includes(m.id));assert.ok(html.includes(`${m.duree_minutes} min`));
    for(const text of [m.titre,m.intention,...m.questions_recherche]) assert.ok(html.includes(text),text);
  }
});

test('Cockpit VCOAC : aller-retour de scénario sans contenu résiduel',async()=>{
  const ui=await frontend();ui.click({view:'vcoac'});
  ui.click({scenario:'act_on_data'});await new Promise(resolve=>setImmediate(resolve));
  assert.equal(ui.run('view'),'vcoac');assert.match(ui.content.innerHTML,/AOD-M01-MP01/);assert.doesNotMatch(ui.content.innerHTML,/PO-M/);
  ui.click({scenario:'program_only'});await new Promise(resolve=>setImmediate(resolve));
  assert.match(ui.content.innerHTML,/PO-M01-MP01/);assert.doesNotMatch(ui.content.innerHTML,/AOD-M|Shadow AI/);
});

test('Cockpit VCOAC : champs échappés, warnings et état avant P3',async()=>{
  const ui=await frontend(d=>{const m=d.modules[0].moments_pedagogiques[0];m.titre='<script>';m.questions_recherche=['<img>'];m.besoin_recherche=true;return d;},r=>{r.warnings.push({path:'/modules/0/moments_pedagogiques/0/duree_minutes',message:'Consolidation <longue>'});return r;});
  ui.click({view:'vcoac'});assert.match(ui.content.innerHTML,/&lt;script&gt;/);assert.match(ui.content.innerHTML,/&lt;img&gt;/);assert.match(ui.content.innerHTML,/Consolidation &lt;longue&gt;/);assert.doesNotMatch(ui.content.innerHTML,/<script>|<img>/);
  const absent=await frontend(d=>{d.modules.forEach(m=>delete m.moments_pedagogiques);return d;});absent.click({view:'vcoac'});assert.match(absent.content.innerHTML,/Moments pédagogiques non définis/);
});

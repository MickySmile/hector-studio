import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('./public/app.js', import.meta.url), 'utf8');
const fixtures = Object.fromEntries(await Promise.all(['program_only','act_on_data'].map(async s => [s, JSON.parse(await readFile(new URL(`../examples/IA017/${s}/formation.json`, import.meta.url), 'utf8'))])));
async function frontend(formation = fixtures.program_only) {
  const elements = new Map(), handlers = {};
  const document = {
    querySelector(key) { if (!elements.has(key)) elements.set(key, {innerHTML:'',textContent:'',open:false}); return elements.get(key); },
    querySelectorAll() { return []; },
    getElementById() { return {focus(){}}; },
    addEventListener(name, callback) { handlers[name] = callback; },
  };
  const context = vm.createContext({document, fetch:async url => ({ok:true,json:async()=>({formation:url.endsWith('act_on_data') ? fixtures.act_on_data : formation,validation:{checks:[],errors:[],warnings:[]}})})});
  vm.runInContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  const run = code => vm.runInContext(code, context);
  const click = dataset => handlers.click({target:{closest:()=>({dataset,id:'map-node-1',hasAttribute:()=>false})}});
  click({view:'carte'});
  return {run,click,content:document.querySelector('#content')};
}
for (const scenario of ['program_only','act_on_data']) {
  test(`Carte ${scenario} : nœuds, flèches et ordre issus de la fixture sans mutation`, async () => {
    const before = JSON.stringify(fixtures[scenario]);
    const ui = await frontend();
    await ui.run(`loadScenario('${scenario}')`);
    const graph = ui.run('competenceLayout(data.competences)');
    assert.equal(graph.nodes.length, fixtures[scenario].competences.length);
    assert.equal(graph.edges.length, fixtures[scenario].competences.reduce((sum,c)=>sum+c.dependances.length,0));
    for (const c of fixtures[scenario].competences) {
      assert.ok(ui.content.innerHTML.includes(c.id));
      for (const id of c.dependances) {
        assert.ok(ui.content.innerHTML.includes(`data-from="${id}" data-to="${c.id}"`));
        assert.ok(graph.nodes.find(n=>n.id===id).x < graph.nodes.find(n=>n.id===c.id).x);
      }
    }
    assert.equal(JSON.stringify(fixtures[scenario]), before);
  });
}
test('Carte : sélection par clic, détails complets et relations directes seulement', async () => {
  const ui = await frontend();
  ui.click({competence:'PO-C02'});
  const c = fixtures.program_only.competences[1];
  for (const key of ['titre','situation_professionnelle','action_attendue','niveau_cible','importance','preuve_legere']) assert.ok(ui.content.innerHTML.includes(c[key]));
  for (const criterion of c.criteres_reussite) assert.ok(ui.content.innerHTML.includes(criterion));
  for (const [id,kind] of [['PO-C01','prerequisite'],['PO-C02','selected'],['PO-C03','dependent'],['PO-C04','muted']]) {
    assert.ok(ui.content.innerHTML.includes(`class="map-node ${kind}" data-competence="${id}"`));
  }
  assert.match(ui.content.innerHTML,/aria-pressed="true" aria-controls="competence-detail"/);
  assert.match(ui.content.innerHTML,/Lecture textuelle des compétences et des relations/);
});
test('Carte : changement de scénario conserve la vue, recalcule et efface la sélection', async () => {
  const ui = await frontend();
  ui.click({competence:'PO-C02'});
  await ui.run('loadScenario("act_on_data")');
  assert.equal(ui.run('view'), 'carte');
  assert.equal(ui.run('selectedCompetence'), null);
  assert.doesNotMatch(ui.content.innerHTML,/PO-C02/);
  assert.match(ui.content.innerHTML,/AOD-C04/);
  assert.match(ui.content.innerHTML,/Sélectionnez une compétence pour afficher ses détails/);
});
test('Carte : scénario sans compétence', async () => {
  const ui = await frontend({...fixtures.program_only,competences:[]});
  assert.match(ui.content.innerHTML,/Aucune compétence/);
  assert.doesNotMatch(ui.content.innerHTML,/<svg/);
});
test('Carte : diamant, racine isolée, ordre source non topologique et déterminisme', async () => {
  const ui = await frontend();
  const expression = `competenceLayout([{id:'D',dependances:['B','C']},{id:'C',dependances:['A']},{id:'A',dependances:[]},{id:'B',dependances:['A']},{id:'E',dependances:[]}])`;
  const graph = ui.run(expression);
  assert.equal(graph.nodes.find(n=>n.id==='D').level,2);
  assert.equal(graph.nodes.find(n=>n.id==='E').level,0);
  assert.equal(graph.nodes.find(n=>n.id==='B').level,graph.nodes.find(n=>n.id==='C').level);
  assert.notEqual(graph.nodes.find(n=>n.id==='B').y,graph.nodes.find(n=>n.id==='C').y);
  const positions = g => Array.from(g.nodes,n=>[n.id,n.x,n.y]);
  assert.deepEqual(positions(graph),positions(ui.run(expression)));
});
test('Carte : référence inconnue, auto-dépendance et cycle ne bloquent pas le rendu', async () => {
  const competences = [{id:'A',titre:'A',dependances:['absent','A']},{id:'B',titre:'B',dependances:['C']},{id:'C',titre:'C',dependances:['B']}];
  const ui = await frontend({...fixtures.program_only,competences});
  assert.match(ui.content.innerHTML,/prérequis incohérent/);
  assert.match(ui.content.innerHTML,/Ordre indéterminé/);
  ui.click({competence:'A'});
  assert.match(ui.content.innerHTML,/référence introuvable/);
  const cycle = ui.run("competenceLayout([{id:'B',dependances:['C']},{id:'C',dependances:['B']}])");
  assert.ok(Number.isFinite(cycle.height));
  assert.ok(cycle.nodes.every(n => Number.isFinite(n.x) && Number.isFinite(n.y)));
});
test('Carte : données affichées échappées et plus de quatre compétences', async () => {
  const competences = Array.from({length:20},(_,i)=>({id:`C${i}`,titre:'<script> & "titre"',dependances:i ? [`C${i-1}`] : []}));
  const ui = await frontend({...fixtures.program_only,competences});
  assert.match(ui.content.innerHTML,/&lt;script&gt; &amp; &quot;titre&quot;/);
  assert.doesNotMatch(ui.content.innerHTML,/<script>/);
  assert.equal(ui.run('competenceLayout(data.competences).nodes.length'),20);
});

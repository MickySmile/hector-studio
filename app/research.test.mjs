import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { createServer } from './server.mjs';
import { loadResearchPlan } from '../core/research.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = await readFile(new URL('./public/app.js', import.meta.url), 'utf8');
const responses = {};
for (const scenario of ['program_only', 'act_on_data']) {
  const directory = join(root, 'examples', 'IA017', scenario);
  const formation = JSON.parse(await readFile(join(directory, 'formation.json'), 'utf8'));
  responses[scenario] = { formation, validation: { valid: true, errors: [], warnings: [], checks: [] }, research: await loadResearchPlan(join(directory, 'research-plan.json'), formation, { asOf: '2026-10-12' }) };
}
async function frontend(transform = x => x) {
  const elements = new Map(), handlers = {}, calls = [];
  const document = {
    querySelector(id) { if (!elements.has(id)) elements.set(id, { innerHTML: '', textContent: '' }); return elements.get(id); },
    querySelectorAll() { return []; }, getElementById() { return { focus() {} }; },
    addEventListener(event, handler) { handlers[event] = handler; },
  };
  const context = vm.createContext({ document, fetch: async url => { calls.push(url); return { ok: true, json: async () => transform(structuredClone(responses[url.split('/').at(-1)])) }; } });
  vm.runInContext(source, context); await new Promise(resolve => setImmediate(resolve));
  const click = dataset => handlers.click({ target: { closest: () => ({ dataset, hasAttribute: () => false }) } });
  click({ view: 'recherche' });
  return { click, calls, change: (id, value) => handlers.change({ target: { id, value } }), run: text => vm.runInContext(text, context), html: () => document.querySelector('#content').innerHTML };
}
for (const scenario of ['program_only', 'act_on_data']) test(`Cockpit Recherche ${scenario} : compteurs, usages et cadrage proposés`, async () => {
  const ui = await frontend(); await ui.run(`loadScenario('${scenario}')`);
  const html = ui.html();
  assert.equal((html.match(/class="card research-question"/g) || []).length, 8);
  const covered = scenario === 'program_only' ? 1 : 0;
  assert.ok(html.includes(`Couvertes</h3><strong>${covered}`));
  assert.ok(html.includes(`Recherche externe nécessaire</h3><strong>${8 - covered}`));
  assert.match(html, /propositions à valider/);
  assert.doesNotMatch(html, /data-simulate|<input|<textarea/);
  for (const q of responses[scenario].research.plan.questions) {
    for (const text of [q.question, q.objectif_pedagogique, q.preuve_recherchee, ...q.types_sources_souhaites]) assert.ok(html.includes(text), text);
    for (const use of q.used_by) assert.ok(html.includes(use.moment_id));
  }
});
test('Cockpit Recherche : filtres combinés, compteurs globaux conservés et aucun appel additionnel', async () => {
  const ui = await frontend(); await ui.run("loadScenario('act_on_data')");
  const calls = ui.calls.length;
  ui.change('research-importance', 'moyenne'); assert.match(ui.html(), /2 \/ 8 questions/);
  ui.change('research-module', 'AOD-M02'); assert.match(ui.html(), /1 \/ 8 questions/);
  ui.change('research-status', 'covered'); assert.match(ui.html(), /Aucune question pour ces filtres/);
  assert.match(ui.html(), /Recherche externe nécessaire<\/h3><strong>8/);
  assert.equal(ui.calls.length, calls);
});
test('Cockpit Recherche : aller-retour des scénarios efface filtres et contenu précédent', async () => {
  const ui = await frontend(); ui.change('research-module', 'PO-M01');
  await ui.run("loadScenario('act_on_data')");
  assert.equal(ui.run('view'), 'recherche'); assert.match(ui.html(), /8 \/ 8 questions/);
  assert.doesNotMatch(ui.html(), /PO-M/); assert.match(ui.html(), /AOD-M/);
  await ui.run("loadScenario('program_only')"); assert.doesNotMatch(ui.html(), /AOD-M|Shadow AI/);
});
test('Cockpit Recherche : candidats, fraîcheur, confiance et HTML échappé', async () => {
  const ui = await frontend(body => {
    const q = body.research.plan.questions[0]; q.question = '<script>test</script>';
    q.knowledge_matches = [{ knowledge_id: 'TEST', title: '<img>', path: '<path>', reasons: ['tags : <test>'], score: 3, freshness: { status: 'stale', verified_at: '2025-01-01', checked_at: '2026-10-12' }, confidence: 'faible' }];
    return body;
  });
  for (const text of ['&lt;script&gt;', '&lt;img&gt;', '&lt;path&gt;', '&lt;test&gt;', 'Périmée', 'faible']) assert.ok(ui.html().includes(text), text);
  assert.doesNotMatch(ui.html(), /<script>|<img>|<path>/);
});
test('Cockpit Recherche : erreur isolée sans ancien bilan ni blocage des modules', async () => {
  const ui = await frontend(body => { body.research = { plan: null, validation: { valid: false, errors: [{ message: '<plan invalide>' }] } }; return body; });
  assert.match(ui.html(), /&lt;plan invalide&gt;/); assert.doesNotMatch(ui.html(), /research-stats/);
  ui.click({ view: 'modules' }); assert.match(ui.html(), /PO-M01/);
});
test('Cockpit Recherche : connaissance utilisée, titre/type et distinction des apports partiels', async () => {
  const ui = await frontend();
  ui.change('research-status', 'covered');
  assert.match(ui.html(), /1 \/ 8 questions/);
  for (const text of ['CON-AGENT-IA', 'Agent IA — définition opérationnelle', 'Concept', 'Utilisée pour couvrir la question', 'Examen de couverture', 'Codex']) assert.ok(ui.html().includes(text), text);
  assert.doesNotMatch(ui.html(), /MET-GRILLE-CONCEPTION-AGENT —[^]*Utilisée pour couvrir la question/);
  await ui.run("loadScenario('act_on_data')");
  ui.change('research-module', 'AOD-M01');
  assert.match(ui.html(), /Apport partiel — recherche à compléter/);
  assert.match(ui.html(), /Méthode/);
  assert.match(ui.html(), /cas RH borné/);
  assert.doesNotMatch(ui.html(), /Utilisée pour couvrir la question/);
});
test('Serveur Recherche : relecture des fichiers, erreur explicite, méthodes interdites et aucune écriture', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'hector-research-'));
  const formationPath = join(directory, 'formation.json'), planPath = join(directory, 'research-plan.json');
  const formation = structuredClone(responses.program_only.formation);
  formation.sources.forEach(s => { s.fichier = resolve(root, 'examples/IA017/program_only', s.fichier); });
  await writeFile(formationPath, JSON.stringify(formation));
  const original = await readFile(join(root, 'examples/IA017/program_only/research-plan.json'), 'utf8');
  await writeFile(planPath, original);
  const server = createServer({ files: { program_only: formationPath } });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await unlink(formationPath); await unlink(planPath); await rmdir(directory); });
  const url = `http://127.0.0.1:${server.address().port}/api/scenarios/program_only`;
  const first = await (await fetch(url)).json(); assert.equal(first.research.counts.total, 8);
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) assert.equal((await fetch(url, { method })).status, 405);
  assert.equal(await readFile(planPath, 'utf8'), original);
  await writeFile(planPath, '{}');
  const invalid = await (await fetch(url)).json(); assert.ok(invalid.formation); assert.equal(invalid.research.plan, null);
  await writeFile(planPath, original); assert.equal((await (await fetch(url)).json()).research.counts.total, 8);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import vm from 'node:vm';
import { validateFormationFile } from '../core/validate-formation.mjs';
import { createServer } from './server.mjs';

test('HTTP local : fixtures originales, ressources limitées et lecture seule', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const scenario of ['program_only', 'act_on_data']) {
      const path = new URL(`../examples/IA017/${scenario}/formation.json`, import.meta.url);
      const before = await readFile(path, 'utf8');
      const response = await fetch(`${base}/api/formations/${scenario}`);
      assert.equal(response.status, 200);
      assert.equal(await response.text(), before);
      for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
        assert.equal((await fetch(`${base}/api/formations/${scenario}`, {method, body:'{}'})).status, 405);
      }
      assert.equal(await readFile(path, 'utf8'), before);
    }
    for (const path of ['/', '/app.js', '/styles.css']) assert.equal((await fetch(base+path)).status, 200);
    for (const path of ['/README.md', '/api/formations/unknown', '/examples/IA017/sources/']) assert.equal((await fetch(base+path)).status, 404);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

async function serve(t, options) {
  const server = createServer(options);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}

for (const scenario of ['program_only', 'act_on_data']) {
  test(`API santé ${scenario} : rapport du core inchangé, duration_mismatch et lecture seule`, async t => {
    const base = await serve(t);
    const path = new URL(`../examples/IA017/${scenario}/formation.json`, import.meta.url);
    const response = await fetch(`${base}/api/scenarios/${scenario}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const body = await response.json();
    assert.deepEqual(body.validation, await validateFormationFile(path));
    assert.deepEqual(body.formation, JSON.parse(await readFile(path, 'utf8')));
    assert.equal(body.validation.warnings[0].code, 'duration_mismatch');
    assert.equal(body.validation.warnings[0].details.deltaMinutes, 15);
    assert.equal((await fetch(`${base}/api/scenarios/${scenario}`, {method:'POST'})).status, 405);
  });
}

test('API santé : scénario inconnu', async t => {
  const base = await serve(t);
  const response = await fetch(`${base}/api/scenarios/inconnu`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {error:'Scénario inconnu.'});
});

test('API santé : JSON illisible, fichier absent, structure invalide et relecture après correction', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'hector-api-'));
  const file = join(directory, 'formation.json');
  t.after(async () => { await unlink(file); await rmdir(directory); });
  const base = await serve(t, {files:{program_only:file, act_on_data:join(directory, 'absent.json')}});
  await writeFile(file, '{invalide');
  for (const scenario of ['program_only','act_on_data']) {
    const response = await fetch(`${base}/api/scenarios/${scenario}`);
    assert.equal(response.status, 500);
    assert.equal((await response.json()).error, 'Impossible de valider ce scénario.');
  }
  await writeFile(file, '{}');
  const response = await fetch(`${base}/api/scenarios/program_only`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.formation, null);
  assert.equal(body.validation.valid, false);
  assert.ok(body.validation.errors.some(error => error.code === 'schema_required'));
});

// Exécute le vrai frontend avec un DOM minimal : le rapport injecté doit être
// affiché tel quel, même s'il ne correspond pas aux chiffres de la fixture.
async function frontend(fetch) {
  const elements = new Map();
  const document = {
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, {innerHTML:'',textContent:''});
      return elements.get(selector);
    },
    querySelectorAll() { return []; },
    addEventListener() {},
  };
  const context = vm.createContext({document,fetch});
  vm.runInContext(await readFile(new URL('./public/app.js', import.meta.url), 'utf8'), context);
  await new Promise(resolve => setImmediate(resolve));
  return {context, content:document.querySelector('#content')};
}
const report = (message, severity = 'warning') => {
  const check = {code: severity === 'info' ? 'validation_passed' : 'sentinel',severity,message};
  return {valid:severity !== 'error',checks:[check],errors:severity === 'error' ? [check] : [],warnings:severity === 'warning' ? [check] : []};
};
test('frontend : affiche uniquement les résultats du moteur sans recalculer les règles', async () => {
  const formation = JSON.parse(await readFile(new URL('../examples/IA017/program_only/formation.json', import.meta.url), 'utf8'));
  formation.meta.duree_detaillee_minutes = 999;
  formation.pratique.cible_pourcentage = 99;
  const ui = await frontend(async url => {
    assert.equal(url, '/api/scenarios/program_only');
    return {ok:true,json:async()=>({formation,validation:report('Bilan fourni par le moteur','info')})};
  });
  assert.match(ui.content.innerHTML, /Santé du scénario/);
  assert.match(ui.content.innerHTML, /Bilan fourni par le moteur/);
  assert.doesNotMatch(ui.content.innerHTML, /Arbitrage \/ incohérence|duration_mismatch|579 min/);
  await vm.runInContext('loadScenario("act_on_data")', ui.context); // erreur API gérée
  assert.match(ui.content.innerHTML, /Impossible de valider ce scénario/);
});
test('frontend : erreurs bloquantes et échappement HTML sans formation affichable', async () => {
  const ui = await frontend(async()=>({ok:true,json:async()=>({formation:null,validation:report('<erreur moteur>','error')})}));
  assert.match(ui.content.innerHTML, /Problème bloquant/);
  assert.match(ui.content.innerHTML, /&lt;erreur moteur&gt;/);
  assert.doesNotMatch(ui.content.innerHTML, /health-success/);
});
test('frontend : une réponse tardive ne remplace pas le scénario sélectionné', async () => {
  let finishFirst;
  const ui = await frontend(url => url.endsWith('program_only')
    ? new Promise(resolve => { finishFirst = resolve; })
    : Promise.resolve({ok:true,json:async()=>({formation:null,validation:report('Scénario Act-On Data','error')})}));
  await vm.runInContext('loadScenario("act_on_data")', ui.context);
  finishFirst({ok:true,json:async()=>({formation:null,validation:report('Ancien scénario','error')})});
  await new Promise(resolve => setImmediate(resolve));
  assert.match(ui.content.innerHTML, /Scénario Act-On Data/);
  assert.doesNotMatch(ui.content.innerHTML, /Ancien scénario/);
});

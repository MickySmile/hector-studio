import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createServer } from './server.mjs';

test('Cockpit enrichi : API, sections, provenance, lecture seule et aller-retour des scénarios', async t => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const elements = new Map(), handlers = {};
  const document = {
    querySelector(id) { if (!elements.has(id)) elements.set(id, { innerHTML: '', textContent: '' }); return elements.get(id); },
    querySelectorAll() { return []; }, addEventListener(name, handler) { handlers[name] = handler; },
  };
  const context = vm.createContext({ document, fetch: url => fetch(base + url) });
  vm.runInContext(await readFile(new URL('./public/app.js', import.meta.url), 'utf8'), context);
  await vm.runInContext("loadScenario('act_on_data')", context);
  handlers.click({ target: { closest: () => ({ dataset: { view: 'vcoac' }, hasAttribute: () => false }) } });
  const html = () => document.querySelector('#content').innerHTML;
  assert.equal((html().match(/Voir le contenu enrichi/g) || []).length, 3);
  assert.match(html(), /<details class="enriched-content"><summary>Voir le contenu enrichi<\/summary>/);
  for (const [id, count] of [['AOD-M01-MP01', 3], ['AOD-M01-MP02', 4], ['AOD-M03-MP02', 5]]) {
    const rendered = vm.runInContext(`enrichedContent(data.modules.flatMap(m => m.moments_pedagogiques).find(m => m.id === '${id}'))`, context);
    assert.ok(rendered.includes(`Knowledge réutilisée : ${count} fiches (références directes)`));
    assert.match(rendered, /Également utilisée dans ce scénario/);
    for (const other of ['AOD-M01-MP01', 'AOD-M01-MP02', 'AOD-M03-MP02'].filter(other => other !== id)) assert.ok(rendered.includes(other));
    // Seules les références directes comptent : les sources et la grille de risque
    // atteinte indirectement par le cas ne sont pas annoncées comme usages directs.
    const indirect = rendered.slice(rendered.indexOf('<summary>MET-GRILLE-RISQUE-IA'), rendered.indexOf('</details>', rendered.indexOf('<summary>MET-GRILLE-RISQUE-IA')));
    if (id !== 'AOD-M03-MP02') assert.doesNotMatch(indirect, /Également utilisée dans ce scénario/);
  }
  for (const text of ['Intention pédagogique', 'Messages essentiels', 'Exemple', 'OUTILLER', 'AGIR', 'CONSOLIDER', 'CAS-RH-REPONSE-FICTIF', 'SRC-RGPD-REPERES-RH']) assert.ok(html().includes(text));
  assert.doesNotMatch(html(), /<textarea|contenteditable|<input/);
  await vm.runInContext("loadScenario('program_only')", context);
  assert.doesNotMatch(html(), /Voir le contenu enrichi|Knowledge réutilisée|Également utilisée|CAS-RH-REPONSE-FICTIF|AOD-M01-MP01|AOD-M01-MP02|AOD-M03-MP02/);
  await vm.runInContext("loadScenario('act_on_data')", context);
  assert.equal((html().match(/Voir le contenu enrichi/g) || []).length, 3);
  vm.runInContext("enriched.contents['AOD-M03-MP02'].content = '<script>alert(1)</script>'; render()", context);
  assert.match(html(), /&lt;script&gt;/); assert.doesNotMatch(html(), /<script>/);
  vm.runInContext("enriched = { contents: {}, errors: [{ moment_id: 'AOD-M03-MP02', message: 'Source <absente>' }] }; render()", context);
  assert.match(html(), /Contenu enrichi indisponible/); assert.match(html(), /Source &lt;absente&gt;/);
  assert.doesNotMatch(html(), /Voir le contenu enrichi/);
});

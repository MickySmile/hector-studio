import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadContents, resolveProvenance } from './content.mjs';
import { loadKnowledge } from './knowledge.mjs';
import { fileURLToPath } from 'node:url';

const path = new URL('../examples/IA017/act_on_data/formation.json', import.meta.url);
const formation = JSON.parse(await readFile(path, 'utf8'));
const pilot = formation.modules[2].moments_pedagogiques[1];
const markdown = await readFile(new URL('./content/AOD-M03-MP02.md', path), 'utf8');
const notes = await loadKnowledge(fileURLToPath(new URL('../knowledge', import.meta.url)));
// Garder les contrôles du pilote indépendants du nombre de moments enrichis.
const pilotFormation = structuredClone(formation);
for (const module of pilotFormation.modules) for (const moment of module.moments_pedagogiques) {
  if (moment.id !== pilot.id) { delete moment.content_ref; delete moment.knowledge_refs; }
}
const loaded = await loadContents(pilotFormation, path);
const item = loaded.contents[pilot.id];

test('Contenu M03 enrichi : un seul moment isolé, sept Knowledge et provenance complète', () => {
  assert.deepEqual(loaded.errors, []);
  assert.deepEqual(Object.keys(loaded.contents), [pilot.id]);
  assert.equal(item.metadata.knowledge_refs.length, 7);
  assert.deepEqual(item.knowledge.filter(n => n.metadata.type === 'source').map(n => n.metadata.id).sort(), [...item.metadata.source_refs].sort());
  assert.deepEqual(item.knowledge.find(n => n.metadata.id === 'CAS-RH-REPONSE-FICTIF').source_ids, ['CON-RISQUES-IA-RH', 'MET-GRILLE-RISQUE-IA']);
  for (const section of ['Intention pédagogique', 'Messages essentiels', 'COMPRENDRE', 'Exemple', 'Mise en perspective', 'OUTILLER', 'AGIR', 'CONSOLIDER']) assert.ok(item.content.includes(`## ${section}`));
});

test('Programme seul : aucun contenu enrichi', async () => {
  const path = new URL('../examples/IA017/program_only/formation.json', import.meta.url);
  assert.deepEqual(await loadContents(JSON.parse(await readFile(path, 'utf8')), path), { contents: {}, errors: [], valid: true });
});

for (const [name, mutate] of [
  ['Knowledge inconnue', ns => { ns.splice(ns.findIndex(n => n.metadata.id === 'CON-SHADOW-AI'), 1); }],
  ['source absente', ns => { ns.splice(ns.findIndex(n => n.metadata.id === 'SRC-CNIL-USAGE-IAG'), 1); }],
  ['source de type fixture', ns => { ns.find(n => n.metadata.type === 'source').path = 'tests/fixtures/source.md'; }],
  ['cycle des sources', ns => { ns.find(n => n.metadata.id === 'CON-SHADOW-AI').metadata.sources = ['[[concepts/shadow-ai]]']; }],
  ['Knowledge sans source', ns => { ns.find(n => n.metadata.id === 'CON-SHADOW-AI').metadata.sources = []; }],
]) test(`Provenance refuse : ${name}`, () => {
  const copy = structuredClone(notes); mutate(copy);
  assert.throws(() => resolveProvenance(pilot.knowledge_refs, item.metadata.source_refs, copy));
});

test('Provenance : source_refs inexactes ou dupliquées refusées', () => {
  for (const refs of [[], ['INCONNUE'], [...item.metadata.source_refs, item.metadata.source_refs[0]]]) assert.throws(() => resolveProvenance(pilot.knowledge_refs, refs, notes));
});

for (const [name, ref, transform] of [
  ['fichier manquant', 'content/absent.md', x => x],
  ['traversée de chemin', '../tests/fixtures/note.md', x => x],
  ['moment incohérent', pilot.content_ref, x => x.replace('moment_id: "AOD-M03-MP02"', 'moment_id: "AUTRE"')],
  ['module incohérent', pilot.content_ref, x => x.replace('module_id: "AOD-M03"', 'module_id: "AUTRE"')],
  ['Knowledge incohérente', pilot.content_ref, x => x.replace('"CON-SHADOW-AI"', '"INCONNUE"')],
  ['date invalide', pilot.content_ref, x => x.replace('2026-10-12', '2026-02-30')],
]) test(`Chargement refuse : ${name}, sans masquer le scénario`, async t => {
  const directory = await mkdtemp(join(tmpdir(), 'hector-content-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, 'content'));
  await writeFile(join(directory, pilot.content_ref), transform(markdown));
  const copy = structuredClone(pilotFormation); copy.modules[2].moments_pedagogiques[1].content_ref = ref;
  const result = await loadContents(copy, join(directory, 'formation.json'));
  assert.equal(result.valid, false); assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].moment_id, pilot.id); assert.deepEqual(result.contents, {});
});

test('Chargement interdit un patrimoine de fixtures', async () => {
  const result = await loadContents(pilotFormation, path, { knowledgeRoot: fileURLToPath(new URL('../tests/fixtures/knowledge', import.meta.url)) });
  assert.equal(result.valid, false); assert.match(result.errors[0].message, /fixtures/);
});

for (const [id, count, sections] of [
  ['AOD-M01-MP01', 3, ['VOIR', 'COMPRENDRE']],
  ['AOD-M01-MP02', 4, ['AGIR', 'Support réutilisé']],
]) test(`Réutilisation ${id} : contenu existant, références cohérentes et huit sources hors fixtures`, async () => {
  const result = await loadContents(formation, path);
  assert.equal(result.valid, true);
  const item = result.contents[id];
  const moment = formation.modules[0].moments_pedagogiques.find(m => m.id === id);
  assert.equal(item.path, moment.content_ref);
  assert.equal(item.metadata.moment_id, id); assert.equal(item.metadata.module_id, 'AOD-M01');
  assert.deepEqual(item.metadata.knowledge_refs, moment.knowledge_refs);
  assert.equal(item.metadata.knowledge_refs.length, count);
  for (const section of sections) assert.ok(item.content.includes(`## ${section}`));
  for (const ref of moment.knowledge_refs) assert.ok(item.knowledge.some(n => n.metadata.id === ref));
  const sources = item.knowledge.filter(n => n.metadata.type === 'source');
  assert.equal(sources.length, 8);
  assert.deepEqual(sources.map(n => n.metadata.id).sort(), [...item.metadata.source_refs].sort());
  for (const note of item.knowledge) {
    assert.doesNotMatch(note.path, /tests|fixtures/); assert.doesNotMatch(note.metadata.id, /^T-/);
    for (const ref of note.source_ids) assert.ok(item.knowledge.some(n => n.metadata.id === ref));
  }
});

test('Réutilisation : dix-huit contenus Act-On Data, patrimoine partagé', async () => {
  const result = await loadContents(formation, path);
  const expected = formation.modules.flatMap(m => m.moments_pedagogiques.map(p => p.id)).sort();
  assert.equal(expected.length, 18);
  assert.deepEqual(Object.keys(result.contents).sort(), expected);
  const referenced = formation.modules.flatMap(m => m.moments_pedagogiques).filter(m => m.content_ref || m.knowledge_refs);
  assert.deepEqual(referenced.map(m => m.id).sort(), expected);
  for (const id of ['CON-AGENT-IA', 'CAS-RH-REPONSE-FICTIF', 'CON-RISQUES-IA-RH']) {
    const users = formation.modules.flatMap(m => m.moments_pedagogiques).filter(m => m.knowledge_refs.includes(id)).map(m => m.id).sort();
    assert.deepEqual(Object.values(result.contents).filter(c => c.metadata.knowledge_refs.includes(id)).map(c => c.metadata.moment_id).sort(), users);
  }
});

test('Réutilisation : référence invalide isolée, les dix-sept autres contenus restent lisibles', async () => {
  const copy = structuredClone(formation);
  copy.modules[0].moments_pedagogiques[0].knowledge_refs = ['INCONNUE'];
  const result = await loadContents(copy, path);
  assert.equal(result.valid, false);
  assert.deepEqual(result.errors.map(e => e.moment_id), ['AOD-M01-MP01']);
  assert.deepEqual(Object.keys(result.contents).sort(), formation.modules.flatMap(m => m.moments_pedagogiques.map(p => p.id)).filter(id => id !== 'AOD-M01-MP01').sort());
});

for (const [id, sources, minutes, role] of [['AOD-M02-MP02', 12, 15, 'comprendre'], ['AOD-M02-MP03', 11, 10, 'outiller']]) {
  test(`Réutilisation MCP ${id} : provenance complète, sources officielles et durée du rôle conservée`, async () => {
    const result = await loadContents(formation, path);
    assert.deepEqual(result.errors, []);
    const item = result.contents[id];
    const moment = formation.modules[1].moments_pedagogiques.find(m => m.id === id);
    assert.equal(item.metadata.module_id, 'AOD-M02');
    assert.equal(item.metadata.moment_id, id);
    assert.deepEqual(item.metadata.knowledge_refs, moment.knowledge_refs);
    assert.equal(item.metadata.last_generated_from_knowledge, '2026-10-12');
    assert.deepEqual(moment.fonctions_vcoac, [role]);
    assert.equal(moment.duree_minutes, minutes); assert.equal(moment.pratique_minutes, 0);
    assert.equal(item.knowledge.filter(n => n.metadata.type === 'source').length, sources);
    assert.deepEqual(item.knowledge.filter(n => n.metadata.type === 'source').map(n => n.metadata.id).sort(), [...item.metadata.source_refs].sort());
    for (const id of ['CON-MCP', 'MET-CONNEXION-MCP', 'CAS-RH-MCP-FICTIF', 'SRC-MCP-SPEC-2026-07-28', 'SRC-MCP-SECURITE']) assert.ok(item.knowledge.some(n => n.metadata.id === id));
    for (const n of item.knowledge) {
      assert.doesNotMatch(n.path, /tests|fixtures/); assert.doesNotMatch(n.metadata.id, /^T-/);
      for (const parent of n.source_ids) assert.ok(item.knowledge.some(p => p.metadata.id === parent));
    }
  });
}

test('Réutilisation MCP : une source MCP manquante invalide seulement les contenus qui en dépendent', async () => {
  const copy = notes.filter(n => n.metadata.id !== 'SRC-MCP-SECURITE');
  const result = await loadContents(formation, path);
  for (const item of Object.values(result.contents)) {
    const resolve = () => resolveProvenance(item.metadata.knowledge_refs, item.metadata.source_refs, copy);
    if (item.metadata.source_refs.includes('SRC-MCP-SECURITE')) assert.throws(resolve, /Source non résolue/);
    else assert.doesNotThrow(resolve);
  }
});

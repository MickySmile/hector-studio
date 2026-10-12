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
const loaded = await loadContents(formation, path);
const item = loaded.contents[pilot.id];

test('Contenu pilote : un seul moment, cinq Knowledge, huit sources, cas indirect résolu', () => {
  assert.deepEqual(loaded.errors, []);
  assert.deepEqual(Object.keys(loaded.contents), [pilot.id]);
  assert.equal(item.metadata.knowledge_refs.length, 5);
  assert.equal(item.knowledge.filter(n => n.metadata.type === 'source').length, 8);
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
  const copy = structuredClone(formation); copy.modules[2].moments_pedagogiques[1].content_ref = ref;
  const result = await loadContents(copy, join(directory, 'formation.json'));
  assert.equal(result.valid, false); assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].moment_id, pilot.id); assert.deepEqual(result.contents, {});
});

test('Chargement interdit un patrimoine de fixtures', async () => {
  const result = await loadContents(formation, path, { knowledgeRoot: fileURLToPath(new URL('../tests/fixtures/knowledge', import.meta.url)) });
  assert.equal(result.valid, false); assert.match(result.errors[0].message, /fixtures/);
});

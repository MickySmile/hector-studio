import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdir, mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadKnowledge, searchKnowledge, freshness, parseNote } from './knowledge.mjs';

const root = fileURLToPath(new URL('../tests/fixtures/knowledge/', import.meta.url));
const notes = await loadKnowledge(root), asOf = '2026-10-12';
const search = q => searchKnowledge(q, notes, { max_age_days: 180 }, asOf);

test('Knowledge : match par titre, accents et casse normalisés', () => {
  const matches = search('BALISE LUMINEUSE');
  assert.equal(matches[0].knowledge_id, 'T-CON-001');
  assert.ok(matches[0].reasons.some(r => r.startsWith('title :')));
  assert.equal(matches[0].confidence, 'forte');
  assert.equal(matches[0].freshness.status, 'fresh');
});
test('Knowledge : match par tag', () => {
  assert.deepEqual(search('navigation').map(m => m.knowledge_id), ['T-SRC-001']);
  assert.deepEqual(search('navigation')[0].reasons, ['tags : navigation']);
});
test('Knowledge : match par alias', () => {
  assert.equal(search('bouee temoin')[0].knowledge_id, 'T-CAS-001');
  assert.equal(search('bouee temoin')[0].freshness.status, 'unknown');
});
test('Knowledge : match dans le contenu', () => {
  assert.equal(search('scintillement')[0].knowledge_id, 'T-MET-001');
  assert.deepEqual(search('scintillement')[0].reasons, ['content : scintillement']);
});
test('Knowledge : aucun résultat, requête vide et mots vides', () => {
  for (const q of ['zébulon', '', 'Quels sont les']) assert.deepEqual(search(q), []);
});
test('Knowledge : candidats multiples ordonnés et périmé conservé explicitement', () => {
  const before = JSON.stringify(notes), matches = search('balise');
  assert.equal(matches.length, 3);
  assert.equal(matches.find(m => m.knowledge_id === 'T-OUT-001').freshness.status, 'stale');
  assert.deepEqual(matches, search('balise'));
  assert.equal(JSON.stringify(notes), before);
});
test('Knowledge : fraîcheur inconnue, future, limite inclusive et vérification à l’usage', () => {
  const note = metadata => ({ metadata });
  assert.equal(freshness(note({}), {}, asOf).status, 'unknown');
  assert.equal(freshness(note({ verified_at: asOf }), {}, asOf).status, 'unknown');
  assert.equal(freshness(note({ verified_at: '2026-10-13' }), { max_age_days: 30 }, asOf).status, 'unknown');
  const n = note({ verified_at: '2026-10-01' });
  assert.equal(freshness(n, { max_age_days: 11 }, asOf).status, 'fresh');
  assert.equal(freshness(n, { max_age_days: 10 }, asOf).status, 'stale');
  assert.equal(freshness(n, { verification_usage: true }, asOf).status, 'stale');
  assert.equal(freshness(note({ verified_at: asOf }), { verification_usage: true }, asOf).status, 'fresh');
  assert.equal(freshness(note({ review_after: '2026-10-01' }), {}, asOf).status, 'stale');
  assert.throws(() => freshness(n, {}, '2026-02-30'));
});
test('Knowledge : propriétés YAML plates, listes Obsidian et contenu riche', () => {
  const note = parseNote('---\r\nid: CON-TEST\r\naliases:\r\n  - "[[concepts/CON-TEST]]"\r\n  - \'L\'\'alias\'\r\n# commentaire\r\nconfidence: null\r\n---\r\n## Exemple\r\nTexte riche.');
  assert.deepEqual(note.metadata.aliases, ['[[concepts/CON-TEST]]', "L'alias"]);
  assert.match(note.content, /## Exemple/);
  for (const text of ['sans frontmatter', '---\nid: test', '---\nid: a\nid: b\n---', '---\nobjet:\n  champ: valeur\n---', '---\ntitle: |\n---', '---\ntags: [a, b]\n---']) assert.throws(() => parseNote(text));
});
test('Knowledge : modèles lisibles, README et modèles exclus de l’index métier', async () => {
  const actual = await loadKnowledge(fileURLToPath(new URL('../knowledge/', import.meta.url)));
  assert.ok(actual.every(n => !n.path.includes('_templates/') && !n.path.endsWith('README.md') && n.metadata.id !== 'A-REMPLACER'));
  const directory = new URL('../knowledge/_templates/', import.meta.url);
  const names = (await readdir(directory)).filter(n => n.endsWith('.md'));
  assert.equal(names.length, 5);
  for (const name of names) assert.ok(parseNote(await readFile(new URL(name, directory), 'utf8')).metadata.type);
});
test('Knowledge : fiche invalide et IDs dupliqués bloquent la lecture plutôt que simuler une absence', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'hector-knowledge-'));
  const dirs = ['concepts', 'sources', 'cases', 'methods', 'tools'];
  for (const dir of dirs) await mkdir(join(directory, dir));
  const file = join(directory, 'concepts/a.md'), second = join(directory, 'concepts/b.md');
  await writeFile(second, '');
  t.after(async () => { await unlink(file); await unlink(second); for (const dir of dirs) await rmdir(join(directory, dir)); await rmdir(directory); });
  const note = '---\nid: TEST\ntype: concept\ntitle: Test\n';
  await writeFile(file, `${note}verified_at: 2026-02-30\n---\nTexte`);
  await assert.rejects(loadKnowledge(directory), /Date invalide/);
  await writeFile(file, `${note}---\nTexte`);
  await writeFile(second, `${note}---\nAutre texte`);
  await assert.rejects(loadKnowledge(directory), /ID Knowledge dupliqué/);
});

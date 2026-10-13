import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { access } from 'node:fs/promises';
import { loadKnowledge } from './knowledge.mjs';
import { validateResearchPlan } from './research.mjs';
import { loadContents, resolveProvenance } from './content.mjs';

const asOf = '2026-10-12';
const path = new URL('../examples/IA017/act_on_data/formation.json', import.meta.url);
const formation = JSON.parse(await readFile(path, 'utf8'));
const plan = JSON.parse(await readFile(new URL('research-plan.json', path), 'utf8'));
const notes = await loadKnowledge(fileURLToPath(new URL('../knowledge/', import.meta.url)));

test('Cycle A : la documentation n8n partielle ne peut être promue en preuve de démonstration', async () => {
  assert.equal((await validateResearchPlan(plan, formation, { notes, asOf })).valid, true);
  const copy = structuredClone(plan);
  const question = copy.questions.find(q => q.id.endsWith('39188e825a6c'));
  assert.equal(question.status, 'covered');
  question.knowledge_matches.forEach(m => { m.coverage = 'partial'; });
  assert.ok(question.review.knowledge_ids.length > 0);
  question.status = 'covered';
  assert.ok((await validateResearchPlan(copy, formation, { notes, asOf })).errors.some(e => e.code === 'partial_coverage'));
});

test('Cycle A : une source d’architecture contributive seule ne couvre pas l’application au cas', async () => {
  const copy = structuredClone(plan);
  const question = copy.questions.find(q => q.id.endsWith('70cf05c4fca4'));
  assert.equal(question.status, 'covered');
  assert.deepEqual(question.review.knowledge_ids, ['MET-CHOIX-ORCHESTRATION']);
  question.review.knowledge_ids = ['SRC-GOOGLE-AGENTIC-DESIGN'];
  assert.ok((await validateResearchPlan(copy, formation, { notes, asOf })).errors.some(e => e.code === 'partial_coverage'));
});

test('Cycle A : source n8n manquante isolée à MP01, ateliers indépendants de la démonstration', async () => {
  const loaded = await loadContents(formation, path);
  assert.deepEqual(loaded.errors, []);
  const m04 = formation.modules.find(m => m.id === 'AOD-M02').moments_pedagogiques.find(m => m.id === 'AOD-M02-MP04');
  assert.equal(m04.content_ref, 'content/AOD-M02-MP04.md');
  assert.deepEqual(m04.knowledge_refs, ['CAS-RH042-ATELIER', 'MET-CONNEXION-MCP']);
  const incomplete = notes.filter(n => n.metadata.id !== 'SRC-N8N-FLUX-FICTIF');
  for (const content of Object.values(loaded.contents)) {
    const resolve = () => resolveProvenance(content.metadata.knowledge_refs, content.metadata.source_refs, incomplete);
    if (content.metadata.moment_id === 'AOD-M02-MP01') assert.throws(resolve, /Source non résolue/);
    else assert.doesNotThrow(resolve);
  }
});

test('RH-042 : dossier fictif traçable validé par le formateur et liens accessibles', async () => {
  const dossier = notes.find(n => n.metadata.id === 'CAS-RH042-ATELIER');
  assert.ok(dossier);
  assert.equal(dossier.metadata.case_nature, 'fictif');
  assert.equal(dossier.metadata.statut, 'dossier_valide_formateur_ajustements_appliques');
  assert.match(dossier.content, /validé par le formateur le 13 octobre 2026/);
  const loaded = await loadContents(formation, path);
  assert.equal(loaded.valid, true);
  for (const id of ['AOD-M02-MP04', 'AOD-M02-MP05']) {
    const c = loaded.contents[id];
    assert.ok(c.metadata.knowledge_refs.includes(dossier.metadata.id));
    assert.ok(c.knowledge.some(n => n.metadata.id === 'CAS-RH-MCP-FICTIF'));
    for (const match of c.content.matchAll(/\]\(([^)]+\.md)\)/g)) {
      await access(new URL(match[1], new URL(c.path, path)));
    }
  }
});

test('RH-042 : dossier absent bloque exactement les moments utilisateurs du fil rouge', async () => {
  const loaded = await loadContents(formation, path);
  const incomplete = notes.filter(n => n.metadata.id !== 'CAS-RH042-ATELIER');
  const broken = [];
  for (const c of Object.values(loaded.contents)) {
    try { resolveProvenance(c.metadata.knowledge_refs, c.metadata.source_refs, incomplete); }
    catch { broken.push(c.metadata.moment_id); }
  }
  const users = formation.modules.flatMap(m => m.moments_pedagogiques).filter(m => m.knowledge_refs.includes('CAS-RH042-ATELIER')).map(m => m.id).sort();
  assert.ok(users.includes('AOD-M02-MP04') && users.includes('AOD-M02-MP05'));
  assert.deepEqual(broken.sort(), users);
});

test('RH-042 : matrice courante cohérente, six READY après validation réelle du formateur, durées conservées', async () => {
  const audit = await readFile(new URL('../docs/PILOTE_INTEGRATION_VCOAC.md', import.meta.url), 'utf8');
  const current = audit.split('### Validation réelle n8n par le formateur — 12 octobre 2026')[1];
  assert.ok(current);
  const tool = notes.find(n => n.metadata.id === 'OUT-N8N-DEMO-FICTIVE');
  assert.equal(tool.metadata.statut, 'test_reel_valide_formateur');
  assert.equal(tool.metadata.version, null);
  for (const text of [current, tool.content]) {
    assert.match(text, /n8n Cloud/);
    assert.match(text, /\| A \| 8 \| 9 \| FALSE \| Dossier incomplet \| PASS \|/);
    assert.match(text, /\| B \| 8 \| 8 \| TRUE \| Dossier complet \| PASS \|/);
  }
  const rows = [...current.matchAll(/^\| (AOD-M02-MP\d{2}) \| \*\*([A-Z_]+)\*\*/gm)].map(m => [m[1], m[2]]);
  assert.deepEqual(rows, Array.from({length:6}, (_, i) => [`AOD-M02-MP0${i+1}`, 'READY']));
  const module = formation.modules.find(m => m.id === 'AOD-M02');
  assert.equal(module.duree_minutes, 140);
  assert.equal(module.pratique_minutes, 90);
  for (const [id, minutes] of [['AOD-M02-MP04',60], ['AOD-M02-MP05',30]]) {
    const m = module.moments_pedagogiques.find(m => m.id === id);
    assert.equal(m.duree_minutes, minutes);
    assert.equal(m.pratique_minutes, minutes);
    const text = await readFile(new URL(m.content_ref, path), 'utf8');
    const steps = [...text.matchAll(/^\d\. \*\*(\d+) min/gm)];
    assert.equal(steps.reduce((sum, step) => sum + Number(step[1]), 0), minutes);
  }
  assert.equal(plan.questions.find(q => q.id.endsWith('39188e825a6c')).status, 'covered');
});

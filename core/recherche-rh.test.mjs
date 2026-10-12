import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadKnowledge, searchKnowledge } from './knowledge.mjs';
import { buildResearchPlan, loadResearchPlan, validateResearchPlan } from './research.mjs';

const asOf = '2026-10-12';
const target = 'IA017-ACT-ON-DATA-R-fec8b45a3751';
const root = new URL('../', import.meta.url);
const notes = await loadKnowledge(fileURLToPath(new URL('knowledge/', root)));
const read = async name => JSON.parse(await readFile(new URL(`examples/IA017/act_on_data/${name}.json`, root), 'utf8'));
const formation = await read('formation'), plan = await read('research-plan');
const cycleIds = ['CON-SHADOW-AI', 'CON-RISQUES-IA-RH', 'MET-GRILLE-RISQUE-IA', 'CAS-RH-REPONSE-FICTIF', 'SRC-CNIL-USAGE-IAG', 'SRC-ANSSI-SECURITE-IAG', 'SRC-RGPD-REPERES-RH', 'SRC-UE-AIACT-RH'];

test('Recherche RH : huit nouvelles fiches, liens résolus et provenance Web distincte', () => {
  const cycle = notes.filter(n => cycleIds.includes(n.metadata.id));
  assert.equal(cycle.length, 8);
  assert.equal(new Set(notes.map(n => n.metadata.id)).size, notes.length);
  for (const note of cycle) {
    assert.equal(note.metadata.verified_at, asOf);
    for (const field of ['sources', 'lie_a', 'soutient', 'illustre']) {
      for (const link of note.metadata[field] || []) {
        const path = link.match(/^\[\[([^|\]]+)/)?.[1];
        assert.ok(notes.some(n => n.path === `${path}.md`), link);
      }
    }
    if (note.metadata.type === 'source') {
      assert.equal(note.metadata.accessed_at, asOf);
      assert.ok(note.metadata.organisation && note.metadata.url.startsWith('https://'));
    }
  }
  const caseNote = cycle.find(n => n.metadata.type === 'case');
  assert.equal(caseNote.metadata.case_nature, 'fictif');
  assert.match(caseNote.content, /CAS FICTIF/);
  for (const id of ['SRC-RGPD-REPERES-RH', 'SRC-UE-AIACT-RH']) {
    assert.equal(cycle.find(n => n.metadata.id === id).metadata.published_at, null);
  }
});

for (const [query, expected] of [
  ['risques IA données RH', 'CON-RISQUES-IA-RH'],
  ['shadow AI', 'CON-SHADOW-AI'],
  ['confidentialité données RH IA', 'CON-RISQUES-IA-RH'],
  ['agent IA permissions', 'MET-GRILLE-RISQUE-IA'],
  ['supervision agent', 'MET-GRILLE-RISQUE-IA'],
  ['utilisation ChatGPT données salariés', 'CON-RISQUES-IA-RH'],
]) test(`Recherche RH : réutilisation « ${query} », sans promotion de statut`, () => {
  const before = JSON.stringify(plan);
  const matches = searchKnowledge(query, notes, { max_age_days: 180 }, asOf);
  assert.equal(matches[0].knowledge_id, expected);
  assert.ok(matches[0].reasons.length);
  assert.equal(matches[0].freshness.status, 'fresh');
  assert.equal(JSON.stringify(plan), before);
  assert.ok(buildResearchPlan(formation).questions.every(q => q.status === 'external_research_needed'));
});

test('Recherche RH : Shadow AI couverte, questions juridiques et client maintenues ouvertes après le cycle MCP', async () => {
  const result = await loadResearchPlan(new URL('examples/IA017/act_on_data/research-plan.json', root), formation, { asOf });
  assert.equal(result.validation.valid, true, JSON.stringify(result.validation));
  assert.deepEqual(result.counts, { total: 8, covered: 4, refresh_needed: 0, external_research_needed: 4 });
  assert.deepEqual(plan.questions.filter(q => q.status === 'covered').map(q => q.id), ['IA017-ACT-ON-DATA-R-39188e825a6c', 'IA017-ACT-ON-DATA-R-db7e80146e37', 'IA017-ACT-ON-DATA-R-70cf05c4fca4', target]);
  for (const id of ['IA017-ACT-ON-DATA-R-224f3604aea9', 'IA017-ACT-ON-DATA-R-a1936416981d']) assert.equal(plan.questions.find(q => q.id === id).status, 'external_research_needed');
  const q = result.plan.questions.find(q => q.id === target);
  assert.equal(q.knowledge_matches.filter(m => m.assessment && m.type === 'source').length, 4);
  assert.match(q.review.justification, /Avant : recherche externe nécessaire/);
  assert.match(q.review.justification, /Après : Knowledge disponible/);
  assert.ok(q.used_by.some(u => u.module_id === 'AOD-M03' && u.moment_id === 'AOD-M03-MP02'));
});

test('Recherche RH : score lexical et sources ne remplacent pas un examen sémantique', async () => {
  const copy = structuredClone(plan), q = copy.questions.find(q => q.id === target);
  q.review = null;
  assert.ok((await validateResearchPlan(copy, formation, { notes, asOf })).errors.some(e => e.code === 'review_required'));
  q.review = structuredClone(plan.questions.find(q => q.id === target).review);
  q.review.knowledge_ids = ['SRC-CNIL-USAGE-IAG'];
  assert.ok((await validateResearchPlan(copy, formation, { notes, asOf })).errors.some(e => e.code === 'partial_coverage'));
  const stale = await validateResearchPlan(plan, formation, { notes, asOf: '2027-10-12' });
  assert.ok(stale.errors.some(e => e.code === 'coverage_not_fresh'));
});

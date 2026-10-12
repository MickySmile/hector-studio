import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadKnowledge, searchKnowledge, freshness, localDate } from './knowledge.mjs';
import { loadResearchPlan, validateResearchPlan, knowledgeMatchesForQuestion } from './research.mjs';

const root = new URL('../knowledge/', import.meta.url), asOf = '2026-10-12';
const notes = await loadKnowledge(fileURLToPath(root));
const noteById = id => notes.find(n => n.metadata.id === id);
const read = async url => JSON.parse(await readFile(url, 'utf8'));
const path = (s, name) => new URL(`../examples/IA017/${s}/${name}.json`, import.meta.url);

test('Capitalisation : le jour local à Paris peut précéder le changement de date UTC', () => {
  const instant = new Date('2026-10-11T23:35:00Z');
  assert.equal(localDate(instant, 'Europe/Paris'), '2026-10-12');
  assert.equal(localDate(instant, 'UTC'), '2026-10-11');
});

test('Capitalisation : six fiches réelles parsées, IDs uniques et liens Obsidian résolus', () => {
  const firstCycle = notes.filter(n => ['CON-AGENT-IA', 'MET-GRILLE-CONCEPTION-AGENT', 'SRC-ANTHROPIC-EFFECTIVE', 'SRC-ANTHROPIC-TRUSTWORTHY', 'SRC-GOOGLE-AGENTIC-DESIGN', 'SRC-NIST-AGENT-STANDARDS'].includes(n.metadata.id));
  assert.equal(firstCycle.length, 6);
  assert.equal(new Set(firstCycle.map(n => n.metadata.id)).size, 6);
  assert.equal(firstCycle.filter(n => n.metadata.type === 'source').length, 4);
  for (const n of firstCycle) {
    assert.equal(n.metadata.verified_at, asOf);
    assert.equal(n.metadata.confidence, 'moyenne');
    const references = [...(n.metadata.sources || []), ...(n.metadata.lie_a || []), ...(n.metadata.soutient || [])];
    for (const reference of references) {
      const target = reference.match(/^\[\[([^|\]]+)(?:\|[^\]]+)?\]\]$/)?.[1];
      assert.ok(target && notes.some(note => note.path === `${target}.md`), reference);
    }
  }
});

for (const [query, first] of [
  ['agent IA', 'CON-AGENT-IA'],
  ['définition agent IA', 'CON-AGENT-IA'],
  ['workflow vs agent', 'CON-AGENT-IA'],
  ['boucle agentique', 'CON-AGENT-IA'],
  ['concevoir un agent', 'MET-GRILLE-CONCEPTION-AGENT'],
  ['contrôle humain agent', 'MET-GRILLE-CONCEPTION-AGENT'],
]) test(`Capitalisation : recherche « ${query} »`, () => {
  const result = searchKnowledge(query, notes, { max_age_days: 180 }, asOf);
  assert.equal(result[0].knowledge_id, first);
  assert.ok(result.every(m => m.reasons.length && m.type && m.freshness.status === 'fresh'));
});

test('Capitalisation : sources, dates fournies et absence de date non inventée', () => {
  const dates = {
    'SRC-GOOGLE-AGENTIC-DESIGN': '2026-05-28',
    'SRC-NIST-AGENT-STANDARDS': '2026-08-14',
    'SRC-ANTHROPIC-TRUSTWORTHY': '2026-04-09',
    'SRC-ANTHROPIC-EFFECTIVE': null,
  };
  for (const [id, date] of Object.entries(dates)) {
    const m = noteById(id).metadata;
    assert.equal(m.page_date, date);
    assert.equal(m.last_verified, asOf);
    assert.equal(m.published_at, id === 'SRC-ANTHROPIC-EFFECTIVE' ? '2024-12-19' : null);
    assert.equal(m.accessed_at, ['SRC-ANTHROPIC-EFFECTIVE', 'SRC-GOOGLE-AGENTIC-DESIGN'].includes(id) ? asOf : null);
    assert.ok(m.organisation && m.url.startsWith('https://') && m.type_source && m.apport.length && m.fraicheur && m.soutient.length);
  }
  const undated = noteById('SRC-ANTHROPIC-EFFECTIVE');
  assert.match(undated.content, /Date de page non fournie/);
  assert.equal(freshness(undated, { max_age_days: 180 }, asOf).status, 'fresh'); // vérification du matériau, pas publication
});

test('Capitalisation : portée non normative et méthode attribuée à Hector Studio', () => {
  assert.match(noteById('CON-AGENT-IA').content, /synthèse opérationnelle pour la formation/);
  assert.match(noteById('CON-AGENT-IA').content, /non une\s+définition normative universelle/);
  assert.match(noteById('MET-GRILLE-CONCEPTION-AGENT').content, /Grille de conception pédagogique Hector Studio/);
  assert.match(noteById('MET-GRILLE-CONCEPTION-AGENT').content, /exemple fictif/i);
});

for (const scenario of ['program_only', 'act_on_data']) test(`Capitalisation ${scenario} : couverture strictement bornée et raisons conservées`, async () => {
  const f = await read(path(scenario, 'formation')), p = await read(path(scenario, 'research-plan'));
  const before = JSON.stringify(p);
  const result = await loadResearchPlan(path(scenario, 'research-plan'), f, { asOf });
  assert.equal(result.validation.valid, true, JSON.stringify(result.validation));
  const coveredIds = scenario === 'program_only' ? ['IA017-PROGRAM-ONLY-R-d6e72741b5cc'] : ['IA017-ACT-ON-DATA-R-db7e80146e37', 'IA017-ACT-ON-DATA-R-70cf05c4fca4', 'IA017-ACT-ON-DATA-R-fec8b45a3751'];
  assert.deepEqual(p.questions.filter(q => q.status === 'covered').map(q => q.id), coveredIds);
  for (const q of p.questions) {
    if (!coveredIds.includes(q.id)) assert.equal(q.status, 'external_research_needed');
    const loaded = result.plan.questions.find(item => item.id === q.id);
    for (const m of q.knowledge_matches) {
      const current = loaded.knowledge_matches.find(item => item.knowledge_id === m.knowledge_id);
      assert.equal(current.assessment, m.assessment);
      assert.equal(current.coverage, m.coverage);
      assert.equal(current.type, noteById(m.knowledge_id).metadata.type);
    }
  }
  assert.equal(JSON.stringify(p), before);
});

test('Capitalisation : un match partiel et une recherche lexicale ne créent pas de couverture', async () => {
  const f = await read(path('act_on_data', 'formation')), p = await read(path('act_on_data', 'research-plan'));
  const q = p.questions[0];
  const matches = knowledgeMatchesForQuestion(q, notes, asOf);
  assert.ok(matches.some(m => m.coverage === 'partial'));
  assert.equal(q.status, 'external_research_needed');
  q.status = 'covered';
  assert.ok((await validateResearchPlan(p, f, { notes, asOf })).errors.some(e => e.code === 'review_required'));
  q.review = { reviewer: 'Test synthétique', date: asOf, justification: 'Test de rejet, pas une revue réelle.', knowledge_ids: ['CON-AGENT-IA'] };
  assert.ok((await validateResearchPlan(p, f, { notes, asOf })).errors.some(e => e.code === 'partial_coverage'));
});

test('Capitalisation : référence examinée sans match lexical conservée, métadonnées rafraîchies', async () => {
  const p = await read(path('program_only', 'research-plan'));
  const q = structuredClone(p.questions[0]), copy = structuredClone(notes);
  q.question = 'zébulon';
  const note = copy.find(n => n.metadata.id === 'CON-AGENT-IA');
  note.metadata.title = 'Titre modifié pour ce test';
  const result = knowledgeMatchesForQuestion(q, copy, '2026-10-13');
  assert.equal(result.length, 1);
  assert.equal(result[0].score, 0);
  assert.equal(result[0].title, note.metadata.title);
  assert.equal(result[0].assessment, q.knowledge_matches[0].assessment);
  assert.equal(result[0].freshness.checked_at, '2026-10-13');
});

test('Capitalisation : fiche revue absente ou couverture devenue ancienne invalide le plan', async () => {
  const f = await read(path('program_only', 'formation')), p = await read(path('program_only', 'research-plan'));
  const withoutConcept = notes.filter(n => n.metadata.id !== 'CON-AGENT-IA');
  assert.equal((await validateResearchPlan(p, f, { notes: withoutConcept, asOf })).valid, false);
  assert.ok((await validateResearchPlan(p, f, { notes, asOf: '2027-10-12' })).errors.some(e => e.code === 'coverage_not_fresh'));
});

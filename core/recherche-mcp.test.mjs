import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadKnowledge, searchKnowledge, freshness } from './knowledge.mjs';
import { loadResearchPlan, buildResearchPlan, validateResearchPlan } from './research.mjs';

const asOf = '2026-10-12', target = 'IA017-ACT-ON-DATA-R-db7e80146e37';
const root = new URL('../', import.meta.url);
const notes = await loadKnowledge(fileURLToPath(new URL('knowledge/', root)));
const read = async file => JSON.parse(await readFile(new URL(`examples/IA017/act_on_data/${file}`, root), 'utf8'));
const formation = await read('formation.json'), plan = await read('research-plan.json');
const reuse = await read('research-mcp-reuse.json');
const ids = ['CON-MCP', 'MET-CONNEXION-MCP', 'CAS-RH-MCP-FICTIF', 'SRC-MCP-SPEC-2026-07-28', 'SRC-MCP-SECURITE', 'SRC-ANTHROPIC-MCP', 'SRC-MICROSOFT-MCP', 'SRC-GOOGLE-MCP'];

test('Cycle MCP : huit fiches réelles, provenance datée, cas fictif et liens résolus', () => {
  const cycle = notes.filter(n => ids.includes(n.metadata.id));
  assert.equal(cycle.length, 8);
  for (const n of cycle) {
    assert.equal(n.metadata.verified_at, asOf);
    assert.equal(n.metadata.review_after, '2026-11-12');
    for (const field of ['sources', 'lie_a', 'soutient', 'illustre']) for (const link of n.metadata[field] || []) {
      const path = link.match(/^\[\[([^|\]]+)/)?.[1];
      assert.ok(notes.some(n => n.path === `${path}.md`), link);
    }
    if (n.metadata.type === 'source') {
      assert.equal(n.metadata.accessed_at, asOf);
      assert.ok(n.metadata.url.startsWith('https://') && n.metadata.organisation);
    }
  }
  assert.equal(cycle.find(n => n.metadata.type === 'case').metadata.case_nature, 'fictif');
  assert.equal(cycle.find(n => n.metadata.id === 'SRC-ANTHROPIC-MCP').metadata.page_date, null);
});

for (const query of ['MCP', 'Model Context Protocol', 'connecter un agent à des outils', 'MCP vs API', 'serveur MCP', 'permissions MCP', 'sécurité MCP', 'agent accès données']) {
  test(`Cycle MCP : requête « ${query} », raisons et aucune couverture automatique`, () => {
    const before = JSON.stringify(plan);
    const results = searchKnowledge(query, notes, { max_age_days: 90, verification_usage: false }, asOf);
    assert.ok(results.slice(0, 3).some(m => m.knowledge_id === 'CON-MCP'));
    assert.ok(results.every(m => m.reasons.length));
    const recorded = reuse.queries.find(q => q.query === query);
    assert.ok(recorded.matches.some(m => m.knowledge_id === 'CON-MCP' && m.reasons.length));
    assert.equal(JSON.stringify(plan), before);
    assert.ok(buildResearchPlan(formation).questions.every(q => q.status === 'external_research_needed'));
  });
}

test('Cycle MCP : revue sémantique requise et sources partielles non suffisantes seules', async () => {
  const result = await loadResearchPlan(new URL('examples/IA017/act_on_data/research-plan.json', root), formation, { asOf });
  assert.equal(result.validation.valid, true, JSON.stringify(result.validation));
  const q = result.plan.questions.find(q => q.id === target);
  assert.equal(q.status, 'covered');
  assert.deepEqual(q.used_by.map(u => u.moment_id), ['AOD-M02-MP02']);
  assert.equal(q.knowledge_matches.filter(m => m.type === 'source' && m.assessment).length, 5);
  const copy = structuredClone(plan), changed = copy.questions.find(q => q.id === target);
  changed.review = null;
  assert.ok((await validateResearchPlan(copy, formation, { notes, asOf })).errors.some(e => e.code === 'review_required'));
  changed.review = { ...q.review, knowledge_ids: ['SRC-MCP-SPEC-2026-07-28'] };
  assert.ok((await validateResearchPlan(copy, formation, { notes, asOf })).errors.some(e => e.code === 'partial_coverage'));
});

test('Cycle MCP : échéance explicite invalide la couverture sans renouvellement automatique', async () => {
  const concept = notes.find(n => n.metadata.id === 'CON-MCP');
  assert.equal(freshness(concept, { max_age_days: 90 }, '2026-11-12').status, 'fresh');
  assert.equal(freshness(concept, { max_age_days: 90 }, '2026-11-13').status, 'stale');
  const result = await validateResearchPlan(plan, formation, { notes, asOf: '2026-11-13' });
  assert.ok(result.errors.some(e => e.code === 'coverage_not_fresh' && e.message.includes(target)));
  assert.equal(plan.questions.find(q => q.id === target).status, 'covered');
});

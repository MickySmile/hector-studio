import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { buildResearchPlan, extractResearchNeeds, validateResearchPlan, loadResearchPlan } from './research.mjs';
import { loadKnowledge, searchKnowledge } from './knowledge.mjs';

const fixture = scenario => new URL(`../examples/IA017/${scenario}/`, import.meta.url);
const read = url => readFile(url, 'utf8').then(JSON.parse);
const formation = await read(new URL('formation.json', fixture('program_only')));
// Les tests unitaires de validation partent d'un plan non examiné, indépendamment
// des connaissances progressivement capitalisées dans les vrais plans.
const saved = buildResearchPlan(formation);
saved.questions.forEach(q => { q.fraicheur_attendue.max_age_days = 180; });
const knowledgeRoot = fileURLToPath(new URL('../tests/fixtures/knowledge/', import.meta.url));
const notes = await loadKnowledge(knowledgeRoot), asOf = '2026-10-12';
const has = (report, code) => report.errors.some(e => e.code === code);
const validate = plan => validateResearchPlan(plan, formation, { notes, asOf });

for (const scenario of ['program_only', 'act_on_data']) test(`Recherche ${scenario} : 8 origines, 8 questions, aucune couverture inventée`, async () => {
  const f = await read(new URL('formation.json', fixture(scenario)));
  const before = JSON.stringify(f), plan = await read(new URL('research-plan.json', fixture(scenario)));
  assert.equal(extractResearchNeeds(f).length, 8);
  assert.equal(plan.questions.length, 8);
  const report = await loadResearchPlan(new URL('research-plan.json', fixture(scenario)), f, { asOf });
  assert.equal(report.validation.valid, true, JSON.stringify(report.validation));
  const covered = scenario === 'act_on_data' ? 2 : 1;
  assert.deepEqual(report.counts, { total: 8, covered, refresh_needed: 0, external_research_needed: 8 - covered });
  assert.equal(report.knowledge_count, 22);
  assert.ok(report.plan.questions.every(q => q.cadrage_status === 'proposition_a_valider'));
  assert.equal(JSON.stringify(f), before);
});

function synthetic() {
  return { meta: { id: 'TEST', scenario: 'test' }, modules: [
    { id: 'M1', moments_pedagogiques: [{ id: 'P1', intention: 'Comparer.', besoin_recherche: true, questions_recherche: ['Quelle balise utiliser ?', 'QUELLE BALISE UTILISER!'] }] },
    { id: 'M2', moments_pedagogiques: [{ id: 'P2', intention: 'Choisir.', besoin_recherche: true, questions_recherche: ['Quelle balise utiliser ?', 'Quel témoin lumineux choisir ?'] }] },
  ] };
}
test('Recherche : déduplication typographique multi-moments sans perte des occurrences', async () => {
  const f = synthetic(), before = JSON.stringify(f), plan = buildResearchPlan(f);
  assert.equal(plan.questions.length, 2);
  assert.equal(plan.questions[0].used_by.length, 2);
  assert.equal(plan.questions[0].used_by[0].questions_originales.length, 2);
  assert.equal((await validateResearchPlan(plan, f)).valid, true);
  assert.equal(JSON.stringify(f), before);
  f.modules.reverse();
  assert.deepEqual(buildResearchPlan(f).questions.map(q => q.id).sort(), plan.questions.map(q => q.id).sort());
});
test('Recherche : fusion sémantique explicite justifiée et traçable', async () => {
  const f = synthetic();
  const options = { groups: [{ questions: ['Quelle balise utiliser ?', 'Quel témoin lumineux choisir ?'], justification: 'Même choix dans ce contexte synthétique.' }] };
  const plan = buildResearchPlan(f, options);
  assert.equal(plan.questions.length, 1);
  assert.equal((await validateResearchPlan(plan, f)).valid, true);
  plan.questions[0].fusion_justification = null;
  assert.ok(has(await validateResearchPlan(plan, f), 'merge_unjustified'));
  assert.throws(() => buildResearchPlan(f, { groups: [{ questions: ['absente', 'Quelle balise utiliser ?'], justification: 'Test' }] }));
});
test('Recherche : besoins contradictoires signalés et absence de moments acceptée', () => {
  assert.deepEqual(buildResearchPlan({ meta: formation.meta }).questions, []);
  const f = synthetic(); f.modules[0].moments_pedagogiques[0].besoin_recherche = false;
  assert.throws(() => extractResearchNeeds(f));
});

for (const [name, mutation, code] of [
  ['ID dupliqué', p => { p.questions[1].id = p.questions[0].id; }, 'duplicate_id'],
  ['mauvais scénario', p => { p.scenario = 'autre'; }, 'scenario_mismatch'],
  ['module inexistant', p => { p.questions[0].used_by[0].module_id = 'absent'; }, 'unknown_reference'],
  ['moment du mauvais module', p => { p.questions[0].used_by[0].moment_id = 'PO-M02-MP01'; }, 'unknown_reference'],
  ['origine modifiée', p => { p.questions[0].used_by[0].questions_originales[0].question = 'Texte modifié'; }, 'origin_mismatch'],
  ['origine omise', p => { p.questions.pop(); }, 'missing_origin'],
  ['question inventée', p => { p.questions[0].question = 'Nouvelle question'; }, 'invented_question'],
  ['statut inconnu', p => { p.questions[0].status = 'ready'; }, 'schema_enum'],
  ['match incomplet', p => { p.questions[0].knowledge_matches = [{ knowledge_id: 'T-CON-001' }]; }, 'schema_required'],
  ['couverture sans revue', p => { p.questions[0].status = 'covered'; }, 'review_required'],
]) test(`Validation recherche : ${name}`, async () => {
  const p = structuredClone(saved); mutation(p); assert.ok(has(await validate(p), code));
});
test('Validation recherche : questions équivalentes non dédupliquées refusées', async () => {
  const f = synthetic(), p = buildResearchPlan(f), first = p.questions[0];
  const copy = structuredClone(first); copy.id += '-other'; copy.used_by = [first.used_by.pop()];
  p.questions.push(copy);
  assert.ok(has(await validateResearchPlan(p, f), 'duplicate_question'));
});
test('Recherche : candidat lexical frais ne suffit jamais à couvrir', async () => {
  const p = structuredClone(saved), q = p.questions[0];
  q.knowledge_matches = searchKnowledge('balise', notes, { max_age_days: 180 }, asOf);
  assert.equal((await validate(p)).valid, true);
  assert.equal(q.status, 'external_research_needed');
  q.status = 'covered'; assert.ok(has(await validate(p), 'review_required'));
  q.review = { reviewer: 'Test uniquement', date: asOf, justification: 'Revue synthétique du besoin.', knowledge_ids: ['T-CON-001'] };
  assert.equal((await validate(p)).valid, true);
  q.review.knowledge_ids = ['T-OUT-001'];
  assert.ok(has(await validate(p), 'coverage_not_fresh'));
  q.status = 'refresh_needed'; assert.equal((await validate(p)).valid, true);
  q.review.knowledge_ids = ['T-CON-001']; assert.ok(has(await validate(p), 'refresh_not_stale'));
  q.review.knowledge_ids = ['absente']; assert.ok(has(await validate(p), 'review_reference'));
});
test('Recherche : fraîcheur inconnue et revue future ne justifient pas covered', async () => {
  const p = structuredClone(saved), q = p.questions[0];
  q.status = 'covered'; q.review = { reviewer: 'Test', date: asOf, justification: 'Test', knowledge_ids: ['T-CAS-001'] };
  assert.ok(has(await validate(p), 'coverage_not_fresh'));
  q.review.date = '2026-10-13'; assert.ok(has(await validate(p), 'review_required'));
});
test('Recherche : fiche candidate inexistante refusée', async () => {
  const p = structuredClone(saved);
  p.questions[0].knowledge_matches = searchKnowledge('balise', notes, { max_age_days: 180 }, asOf);
  p.questions[0].knowledge_matches[0].knowledge_id = 'absent';
  assert.ok(has(await validate(p), 'unknown_knowledge'));
});
test('Recherche : échec de lecture explicite', async () => {
  const report = await loadResearchPlan(new URL('absent.json', fixture('program_only')), formation);
  assert.equal(report.plan, null); assert.equal(report.validation.valid, false);
});
test('Recherche : références source ambiguës refusées', () => {
  const f = synthetic(); f.modules[1].id = 'M1'; assert.throws(() => buildResearchPlan(f), /Module ambigu/);
  f.modules[1].id = 'M2'; f.modules[1].moments_pedagogiques[0].id = 'P1'; assert.throws(() => buildResearchPlan(f), /Moment ambigu/);
});
test('Recherche CLI : extraction sans écriture, vérification et erreur d’usage', () => {
  const cli = fileURLToPath(new URL('./research.mjs', import.meta.url));
  const formationPath = fileURLToPath(new URL('formation.json', fixture('program_only')));
  const options = { encoding: 'utf8' };
  const extracted = spawnSync(process.execPath, [cli, 'extract', formationPath], options);
  assert.equal(extracted.status, 0, extracted.stderr);
  assert.equal(JSON.parse(extracted.stdout).questions.length, 8);
  const checked = spawnSync(process.execPath, [cli, 'check', formationPath], options);
  assert.equal(checked.status, 0, checked.stderr); assert.equal(JSON.parse(checked.stdout).validation.valid, true);
  assert.equal(spawnSync(process.execPath, [cli], options).status, 2);
});

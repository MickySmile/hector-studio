import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { validateSchema } from './validate-formation.mjs';
import { normalize, loadKnowledge, searchKnowledge, freshness } from './knowledge.mjs';

const schema = JSON.parse(await readFile(new URL('../schemas/research-plan.schema.json', import.meta.url), 'utf8'));
const defaultKnowledge = fileURLToPath(new URL('../knowledge/', import.meta.url));
export const researchStatuses = ['covered', 'refresh_needed', 'external_research_needed'];
const keyOf = x => JSON.stringify([x.module_id, x.moment_id, x.index]);

export function extractResearchNeeds(formation) {
  const needs = [], moduleIds = new Set(), momentIds = new Set();
  for (const module of formation.modules || []) {
    if (moduleIds.has(module.id)) throw new Error(`Module ambigu : ${module.id}`);
    moduleIds.add(module.id);
    for (const moment of module.moments_pedagogiques || []) {
      if (momentIds.has(moment.id)) throw new Error(`Moment ambigu : ${moment.id}`);
      momentIds.add(moment.id);
      const questions = moment.questions_recherche || [];
      if (moment.besoin_recherche !== (questions.length > 0)) throw new Error(`Besoin et questions incohérents : ${moment.id}`);
      questions.forEach((question, index) => {
        if (typeof question !== 'string' || !question.trim()) throw new Error(`Question vide : ${moment.id}`);
        needs.push({ module_id: module.id, moment_id: moment.id, index, question, intention: moment.intention });
      });
    }
  }
  return needs;
}

/** Seules les variantes typographiques sont fusionnées automatiquement.
 * Pour une équivalence sémantique : groupes explicites {questions, justification}.
 * Aucun seuil de similarité ne décide d'une fusion. */
export function buildResearchPlan(formation, { groups = [] } = {}) {
  const needs = extractResearchNeeds(formation), available = new Set(needs.map(n => normalize(n.question)));
  const groupByQuestion = new Map();
  for (const group of groups) {
    if (!group.justification?.trim() || group.questions.length < 2) throw new Error('Fusion explicite à justifier.');
    for (const text of group.questions) {
      const key = normalize(text);
      if (!available.has(key) || groupByQuestion.has(key)) throw new Error('Question de fusion absente ou ambiguë.');
      groupByQuestion.set(key, group);
    }
  }
  const buckets = new Map();
  for (const need of needs) {
    const group = groupByQuestion.get(normalize(need.question));
    const key = group ? normalize(group.questions[0]) : normalize(need.question);
    if (!buckets.has(key)) buckets.set(key, { needs: [], justification: group?.justification ?? null });
    buckets.get(key).needs.push(need);
  }
  const questions = [...buckets].map(([key, bucket]) => {
    const uses = new Map();
    for (const need of bucket.needs) {
      const pair = JSON.stringify([need.module_id, need.moment_id]);
      if (!uses.has(pair)) uses.set(pair, { module_id: need.module_id, moment_id: need.moment_id, questions_originales: [] });
      uses.get(pair).questions_originales.push({ index: need.index, question: need.question });
    }
    return {
      id: `${formation.meta.id}-R-${createHash('sha256').update(key).digest('hex').slice(0, 12)}`,
      question: bucket.needs[0].question,
      objectif_pedagogique: [...new Set(bucket.needs.map(n => n.intention))].join(' / '),
      importance: 'a_arbitrer', types_sources_souhaites: ['À préciser'],
      fraicheur_attendue: { description: 'À arbitrer selon le sujet.', max_age_days: null, verification_usage: false },
      preuve_recherchee: 'À préciser avant recherche externe.',
      cadrage_status: 'proposition_a_valider',
      status: 'external_research_needed', used_by: [...uses.values()], knowledge_matches: [],
      fusion_justification: bucket.justification, review: null,
    };
  });
  return { schema_version: '1.0', formation_id: formation.meta.id, scenario: formation.meta.scenario, questions };
}

export async function validateResearchPlan(plan, formation, { notes = [], asOf = new Date().toISOString().slice(0, 10) } = {}) {
  const errors = validateSchema(plan, schema);
  const fail = (code, message) => errors.push({ code, message });
  if (errors.length) return { valid: false, errors };
  if (plan.formation_id !== formation.meta.id || plan.scenario !== formation.meta.scenario) fail('scenario_mismatch', 'Le plan appartient à une autre formation ou un autre scénario.');
  let needs;
  try { needs = extractResearchNeeds(formation); } catch (error) { fail('needs_invalid', error.message); return { valid: false, errors }; }
  const expected = new Map(needs.map(n => [keyOf(n), n])), seen = new Set(), ids = new Set(), canonical = new Map();
  const noteById = new Map(notes.map(n => [n.metadata.id, n]));
  for (const q of plan.questions) {
    if (ids.has(q.id)) fail('duplicate_id', `ID dupliqué : ${q.id}`);
    ids.add(q.id);
    const pairs = new Set(), originals = [];
    for (const use of q.used_by) {
      const pair = JSON.stringify([use.module_id, use.moment_id]);
      if (pairs.has(pair)) fail('duplicate_use', `Usage dupliqué : ${pair}`);
      pairs.add(pair);
      const module = formation.modules?.find(m => m.id === use.module_id);
      if (!module?.moments_pedagogiques?.some(m => m.id === use.moment_id)) fail('unknown_reference', `Module/moment inexistant : ${pair}`);
      for (const origin of use.questions_originales) {
        const key = keyOf({ ...use, index: origin.index }), source = expected.get(key);
        if (!source || source.question !== origin.question) fail('origin_mismatch', `Origine absente ou modifiée : ${key}`);
        if (seen.has(key)) fail('duplicate_origin', `Origine utilisée plusieurs fois : ${key}`);
        seen.add(key); originals.push(origin.question);
        const normalized = normalize(origin.question);
        if (canonical.has(normalized) && canonical.get(normalized) !== q.id) fail('duplicate_question', 'Variantes typographiques réparties dans plusieurs questions.');
        canonical.set(normalized, q.id);
      }
    }
    if (!originals.includes(q.question)) fail('invented_question', `La question doit reprendre une formulation VCOAC : ${q.id}`);
    if (new Set(originals.map(normalize)).size > 1 && !q.fusion_justification?.trim()) fail('merge_unjustified', `Fusion sémantique non justifiée : ${q.id}`);
    const matchIds = new Set();
    for (const match of q.knowledge_matches) {
      const note = noteById.get(match.knowledge_id);
      if (!note || note.path !== match.path) fail('unknown_knowledge', `Fiche candidate introuvable : ${match.knowledge_id}`);
      if (matchIds.has(match.knowledge_id)) fail('duplicate_match', `Match dupliqué : ${match.knowledge_id}`);
      matchIds.add(match.knowledge_id);
    }
    if (q.status !== 'external_research_needed') {
      const review = q.review;
      if (!review || !review.knowledge_ids.length || review.date > asOf) { fail('review_required', `Réexamen humain documenté nécessaire : ${q.id}`); continue; }
      const selected = review.knowledge_ids.map(id => noteById.get(id));
      if (selected.some(note => !note)) { fail('review_reference', `Référence de revue introuvable : ${q.id}`); continue; }
      const states = selected.map(note => freshness(note, q.fraicheur_attendue, asOf).status);
      if (q.status === 'covered' && states.some(s => s !== 'fresh')) fail('coverage_not_fresh', `Couverture non vérifiable ou périmée : ${q.id}`);
      if (q.status === 'refresh_needed' && !states.includes('stale')) fail('refresh_not_stale', `Aucune fiche pertinente périmée justifiée : ${q.id}`);
    }
  }
  for (const key of expected.keys()) if (!seen.has(key)) fail('missing_origin', `Question VCOAC omise : ${key}`);
  return { valid: !errors.length, errors };
}

/** Lecture interne seulement. Le score lexical ne modifie jamais le statut.
 * Les candidats sont recalculés à chaque lecture, sans écriture des fichiers. */
export async function loadResearchPlan(planPath, formation, { knowledgeRoot = defaultKnowledge, asOf = new Date().toISOString().slice(0, 10) } = {}) {
  try {
    const plan = JSON.parse(await readFile(planPath, 'utf8'));
    const notes = await loadKnowledge(knowledgeRoot);
    const validation = await validateResearchPlan(plan, formation, { notes, asOf });
    if (!validation.valid) return { plan: null, validation };
    const enriched = { ...plan, questions: plan.questions.map(q => ({ ...q, knowledge_matches: searchKnowledge(q.question, notes, q.fraicheur_attendue, asOf) })) };
    const counts = { total: enriched.questions.length, ...Object.fromEntries(researchStatuses.map(s => [s, enriched.questions.filter(q => q.status === s).length])) };
    return { plan: enriched, validation, counts, checked_at: asOf, knowledge_count: notes.length };
  } catch (error) { return { plan: null, validation: { valid: false, errors: [{ code: 'research_unavailable', message: error.message }] } }; }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, formationPath] = process.argv.slice(2);
  if (!['extract', 'check'].includes(command) || !formationPath || process.argv.length !== 4) {
    console.error('Usage : node core/research.mjs <extract|check> <formation.json>'); process.exitCode = 2;
  } else {
    try {
      const formation = JSON.parse(await readFile(formationPath, 'utf8'));
      const output = command === 'extract' ? buildResearchPlan(formation) : await loadResearchPlan(join(dirname(formationPath), 'research-plan.json'), formation);
      console.log(JSON.stringify(output, null, 2));
      if (output.validation && !output.validation.valid) process.exitCode = 1;
    } catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}

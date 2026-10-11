import { readFile, realpath, stat } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const projectDirectory = fileURLToPath(new URL('../', import.meta.url));
const schemaUrl = new URL('../schemas/formation.schema.json', import.meta.url);
const collections = ['sources', 'hypotheses', 'personas', 'gap', 'competences', 'modules', 'alertes', 'decisions_a_valider'];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const array = value => Array.isArray(value) ? value : [];
const pointer = (path, key) => `${path}/${String(key).replaceAll('~', '~0').replaceAll('/', '~1')}`;
const finding = (code, severity, message, path = '', details = {}) => ({ code, severity, message, path, details });
const result = checks => ({
  valid: !checks.some(check => check.severity === 'error'),
  errors: checks.filter(check => check.severity === 'error'),
  warnings: checks.filter(check => check.severity === 'warning'),
  checks,
});

// Sous-ensemble explicite des mots-clés présents dans le contrat V1.
// Ce composant n'est pas un validateur général JSON Schema 2020-12.
// Un futur mot-clé inconnu fait échouer le contrôle, sans être ignoré.
const supported = new Set(['$schema', '$comment', 'title', 'description', '$defs', '$ref',
  'type', 'required', 'properties', 'additionalProperties', 'items', 'minItems',
  'uniqueItems', 'allOf', 'contains', 'enum', 'const', 'minLength', 'pattern',
  'minimum', 'maximum', 'format']);

function inspectSchema(schema) {
  if (!object(schema)) throw new Error('Le sous-ensemble V1 attend un schéma objet.');
  for (const key of Object.keys(schema)) {
    if (!supported.has(key)) throw new Error(`Mot-clé non pris en charge : ${key}`);
  }
  if (schema.$ref && !/^#\/\$defs\/[^/]+$/.test(schema.$ref)) throw new Error('Seules les références locales $defs sont prises en charge.');
  if (schema.format && schema.format !== 'date') throw new Error(`Format non pris en charge : ${schema.format}`);
  if (schema.additionalProperties !== undefined && schema.additionalProperties !== false) throw new Error('additionalProperties non pris en charge.');
  for (const child of Object.values(schema.properties || {})) inspectSchema(child);
  for (const child of Object.values(schema.$defs || {})) inspectSchema(child);
  for (const child of schema.allOf || []) inspectSchema(child);
  if (schema.items) inspectSchema(schema.items);
  if (schema.contains) inspectSchema(schema.contains);
}

function matchesType(value, type) {
  if (type === 'null') return value === null;
  if (type === 'object') return object(value);
  if (type === 'array') return Array.isArray(value);
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  return typeof value === type;
}

function schemaErrors(value, schema, root, path = '', refs = []) {
  const errors = [];
  const fail = (keyword, message, at = path) => errors.push(finding(`schema_${keyword}`, 'error', message, at));
  if (schema.$ref) {
    if (refs.includes(schema.$ref)) throw new Error('Référence de schéma récursive non prise en charge.');
    const target = root.$defs[schema.$ref.slice('#/$defs/'.length)];
    if (!target) throw new Error(`Référence de schéma introuvable : ${schema.$ref}`);
    errors.push(...schemaErrors(value, target, root, path, [...refs, schema.$ref]));
  }
  for (const child of schema.allOf || []) errors.push(...schemaErrors(value, child, root, path, refs));
  if (schema.type && ![schema.type].flat().some(type => matchesType(value, type))) {
    fail('type', `Type attendu : ${[schema.type].flat().join(' ou ')}.`);
    return errors;
  }
  if ('const' in schema && !isDeepStrictEqual(value, schema.const)) fail('const', `Valeur attendue : ${JSON.stringify(schema.const)}.`);
  if (schema.enum && !schema.enum.some(item => isDeepStrictEqual(item, value))) fail('enum', `Valeur autorisée attendue : ${schema.enum.join(', ')}.`);
  if (object(value)) {
    for (const key of schema.required || []) if (!Object.hasOwn(value, key)) fail('required', `Champ obligatoire absent : ${key}.`, pointer(path, key));
    for (const [key, item] of Object.entries(value)) {
      if (Object.hasOwn(schema.properties || {}, key)) errors.push(...schemaErrors(item, schema.properties[key], root, pointer(path, key)));
      else if (schema.additionalProperties === false) fail('additionalProperties', `Champ non prévu au contrat : ${key}.`, pointer(path, key));
    }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) fail('minItems', `Au moins ${schema.minItems} élément(s) attendu(s).`);
    if (schema.uniqueItems && value.some((item, i) => value.slice(0, i).some(previous => isDeepStrictEqual(item, previous)))) fail('uniqueItems', 'Éléments dupliqués dans la liste.');
    if (schema.items) value.forEach((item, i) => errors.push(...schemaErrors(item, schema.items, root, pointer(path, i))));
    if (schema.contains && !value.some(item => schemaErrors(item, schema.contains, root).length === 0)) fail('contains', 'Un élément obligatoire est absent de la liste.');
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && [...value].length < schema.minLength) fail('minLength', 'Texte trop court.');
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(value)) fail('pattern', 'Format de texte incorrect.');
    if (schema.format === 'date') {
      const date = new Date(`${value}T00:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) fail('format', 'Date calendaire ISO invalide.');
    }
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) fail('minimum', `Minimum : ${schema.minimum}.`);
    if (schema.maximum !== undefined && value > schema.maximum) fail('maximum', `Maximum : ${schema.maximum}.`);
  }
  return errors;
}

function checkIdentifiers(data, checks) {
  for (const name of collections) {
    if (!Array.isArray(data[name])) continue;
    const seen = new Map();
    data[name].forEach((item, i) => {
      if (!object(item) || typeof item.id !== 'string') return;
      if (seen.has(item.id)) checks.push(finding('duplicate_id', 'error', `Identifiant dupliqué dans ${name} : ${item.id}.`, `/${name}/${i}/id`, { id: item.id, firstPath: `/${name}/${seen.get(item.id)}/id` }));
      else seen.set(item.id, i);
    });
  }
}

function checkCompetences(data, checks) {
  const skills = array(data.competences).filter(item => object(item) && typeof item.id === 'string');
  // Un ID ambigu empêche une interprétation fiable du graphe.
  if (new Set(skills.map(item => item.id)).size !== skills.length) {
    checks.push(finding('dependency_check_skipped', 'info', 'Graphe non analysé : identifiants de compétences dupliqués.', '/competences'));
    return;
  }
  const graph = new Map(skills.map(skill => [skill.id, array(skill.dependances).filter(id => typeof id === 'string')]));
  skills.forEach(skill => {
    const index = data.competences.indexOf(skill);
    for (const [i, id] of graph.get(skill.id).entries()) {
      const path = `/competences/${index}/dependances/${i}`;
      if (id === skill.id) checks.push(finding('self_dependency', 'error', 'Une compétence dépend d’elle-même.', path, { id }));
      else if (!graph.has(id)) checks.push(finding('unknown_dependency', 'error', `Compétence référencée inexistante : ${id}.`, path, { id }));
    }
  });
  const done = new Set(), active = [];
  function visit(id) {
    if (active.includes(id)) {
      const cycle = [...active.slice(active.indexOf(id)), id];
      checks.push(finding('competence_cycle', 'error', `Cycle de compétences : ${cycle.join(' → ')}.`, '/competences', { cycle }));
      return;
    }
    if (done.has(id) || !graph.has(id)) return;
    active.push(id);
    for (const next of graph.get(id)) if (next !== id) visit(next);
    active.pop();
    done.add(id);
  }
  for (const id of graph.keys()) visit(id);
}

function checkPersonasAndPractice(data, checks) {
  if (Array.isArray(data.personas)) {
    const levels = new Set(data.personas.filter(object).map(persona => persona.niveau));
    for (const level of ['novice', 'intermediaire', 'avance']) {
      if (!levels.has(level)) checks.push(finding('missing_persona', 'error', `Persona manquant : ${level}.`, '/personas', { niveau: level }));
    }
  }
  const p = data.pratique;
  if (!object(p) || ![p.minimum_souhaite, p.maximum_souhaite, p.cible_pourcentage].every(Number.isFinite)) return;
  if (p.minimum_souhaite > p.maximum_souhaite || p.minimum_souhaite < 0 || p.maximum_souhaite > 100) checks.push(finding('invalid_practice_bounds', 'error', 'Bornes de pratique incohérentes.', '/pratique', { minimum: p.minimum_souhaite, maximum: p.maximum_souhaite }));
  if (p.cible_pourcentage < p.minimum_souhaite || p.cible_pourcentage > p.maximum_souhaite) checks.push(finding('practice_out_of_bounds', 'error', 'Cible de pratique hors des bornes déclarées.', '/pratique/cible_pourcentage', { minimum: p.minimum_souhaite, cible: p.cible_pourcentage, maximum: p.maximum_souhaite }));
}

function checkMoments(data, checks) {
  const seen = new Map();
  array(data.modules).forEach((module, i) => {
    if (!object(module) || !Array.isArray(module.moments_pedagogiques)) return;
    const base = `/modules/${i}/moments_pedagogiques`;
    module.moments_pedagogiques.forEach((moment, j) => {
      if (!object(moment)) return;
      const path = `${base}/${j}`;
      if (typeof moment.id === 'string') {
        if (seen.has(moment.id)) checks.push(finding('duplicate_moment_id', 'error', `Identifiant de moment dupliqué : ${moment.id}.`, `${path}/id`, { firstPath: seen.get(moment.id) }));
        else seen.set(moment.id, `${path}/id`);
      }
      if (moment.besoin_recherche === true && (!Array.isArray(moment.questions_recherche) || !moment.questions_recherche.some(q => typeof q === 'string' && q.trim()))) checks.push(finding('research_questions_missing', 'error', 'Une recherche nécessaire doit comporter au moins une question explicite.', `${path}/questions_recherche`));
      if (Number.isFinite(moment.pratique_minutes) && Number.isFinite(moment.duree_minutes) && moment.pratique_minutes > moment.duree_minutes) checks.push(finding('moment_practice_exceeds_duration', 'error', 'La pratique dépasse la durée du moment.', `${path}/pratique_minutes`));
      if (array(moment.fonctions_vcoac).length === 1 && moment.fonctions_vcoac[0] === 'consolider' && moment.duree_minutes > 10) checks.push(finding('consolidation_long', 'warning', 'Consolidation seule supérieure à 10 minutes : vérifier qu’elle reste courte et ne devient pas un cours.', `${path}/duree_minutes`));
    });
    if (checks.some(c => c.severity === 'error' && c.path.startsWith(`${base}/`))) return;
    const sum = key => module.moments_pedagogiques.reduce((total, m) => total + m[key], 0);
    if (sum('duree_minutes') !== module.duree_minutes) checks.push(finding('moment_duration_mismatch', 'error', 'La somme des moments doit égaler la durée du module.', base, { actual: sum('duree_minutes'), expected: module.duree_minutes }));
    if (sum('pratique_minutes') !== module.pratique_minutes) checks.push(finding('moment_practice_mismatch', 'error', 'La pratique des moments doit égaler la pratique du module.', base, { actual: sum('pratique_minutes'), expected: module.pratique_minutes }));
  });
}

function checkModules(data, checks) {
  if (!Array.isArray(data.modules)) return;
  const modules = data.modules.filter(object);
  const skills = new Set(array(data.competences).filter(object).map(c => c.id));
  const byId = new Map(modules.map(m => [m.id, m]));
  modules.forEach(m => {
    const index = data.modules.indexOf(m);
    for (const [i, id] of array(m.competences).entries()) {
      if (!skills.has(id)) checks.push(finding('unknown_module_competence', 'error', `Compétence du module inexistante : ${id}.`, `/modules/${index}/competences/${i}`));
    }
    for (const [i, id] of array(m.dependances_modules).entries()) {
      if (!byId.has(id)) checks.push(finding('unknown_module_dependency', 'error', `Module prérequis inexistant : ${id}.`, `/modules/${index}/dependances_modules/${i}`));
    }
    if (Number.isFinite(m.pratique_minutes) && Number.isFinite(m.duree_minutes) && m.pratique_minutes > m.duree_minutes) {
      checks.push(finding('module_practice_exceeds_duration', 'error', 'La pratique dépasse la durée du module.', `/modules/${index}/pratique_minutes`));
    }
  });
  if (byId.size === modules.length) {
    const active = [], done = new Set();
    function visit(id) {
      if (active.includes(id)) {
        const cycle = [...active.slice(active.indexOf(id)), id];
        checks.push(finding('module_cycle', 'error', `Cycle de modules : ${cycle.join(' → ')}.`, '/modules', { cycle }));
        return;
      }
      if (done.has(id) || !byId.has(id)) return;
      active.push(id);
      for (const next of array(byId.get(id).dependances_modules)) visit(next);
      active.pop(); done.add(id);
    }
    for (const id of byId.keys()) visit(id);
  }
  // Ne pas publier de totaux partiels ou trompeurs sur des modules invalides.
  if (checks.some(c => c.severity === 'error' && c.path.startsWith('/modules'))) return;
  const durationMinutes = modules.reduce((sum, m) => sum + m.duree_minutes, 0);
  const practiceMinutes = modules.reduce((sum, m) => sum + m.pratique_minutes, 0);
  const envelopeMinutes = Number.isInteger(data.meta?.duree_minutes) && data.meta.duree_minutes > 0 ? data.meta.duree_minutes : null;
  // Convention V1 : pratique planifiée / enveloppe pédagogique meta.duree_minutes.
  // Le temps hors modules reste au dénominateur, sans pratique présumée.
  // Tolérance inclusive de ±5 points : convention V1, pas vérité pédagogique universelle.
  const tolerancePoints = 5;
  const practicePercentage = envelopeMinutes === null ? null : practiceMinutes / envelopeMinutes * 100;
  const targetPercentage = Number.isFinite(data.pratique?.cible_pourcentage) ? data.pratique.cible_pourcentage : null;
  const deltaPoints = practicePercentage === null || targetPercentage === null ? null : practicePercentage - targetPercentage;
  const remainingMinutes = envelopeMinutes === null ? null : envelopeMinutes - durationMinutes;
  checks.push(finding('module_totals', 'info', `${durationMinutes} min de modules ; ${practiceMinutes} min de pratique planifiée.`, '/modules', {
    count: modules.length, durationMinutes, practiceMinutes, envelopeMinutes, remainingMinutes,
    practicePercentage, targetPercentage, deltaPoints, tolerancePoints,
  }));
  if (remainingMinutes < 0) checks.push(finding('module_duration_overflow', 'warning', `Les modules dépassent l’enveloppe de ${-remainingMinutes} min.`, '/modules'));
  if (remainingMinutes > 0) checks.push(finding('module_time_remaining', 'info', `${remainingMinutes} min hors modules ; leur affectation doit être explicite.`, '/modules'));
  if (practicePercentage === null) checks.push(finding('module_practice_uncheckable', 'info', 'Pourcentage non calculable : enveloppe pédagogique inconnue.', '/meta/duree_minutes'));
  if (deltaPoints !== null && Math.abs(deltaPoints) > tolerancePoints + 1e-10) checks.push(finding('module_practice_target_mismatch', 'warning', `Pratique planifiée : ${practicePercentage.toFixed(1)} % ; cible : ${targetPercentage} % ; écart supérieur à ±${tolerancePoints} points (convention V1).`, '/modules', { deltaPoints, tolerancePoints }));
}

const within = (root, file) => {
  const difference = relative(root, file);
  return difference !== '..' && !difference.startsWith(`..${sep}`) && !isAbsolute(difference);
};

async function checkSources(data, { formationPath, projectRoot }, checks) {
  for (const [i, source] of array(data.sources).entries()) {
    if (!object(source) || typeof source.fichier !== 'string') continue;
    const path = `/sources/${i}/fichier`, value = source.fichier;
    const scheme = /^[a-z][a-z0-9+.-]*:/i.test(value) && !/^[a-z]:[\\/]/i.test(value);
    if (scheme && !value.startsWith('file:')) {
      checks.push(finding('source_remote_unchecked', 'info', 'Source distante non vérifiée (aucun accès réseau).', path, { fichier: value }));
      continue;
    }
    if (!formationPath && !isAbsolute(value) && !value.startsWith('file:')) {
      checks.push(finding('source_base_missing', 'warning', 'Chemin de formation nécessaire pour résoudre la source relative.', path));
      continue;
    }
    let target;
    try {
      target = value.startsWith('file:') ? fileURLToPath(value) : resolve(formationPath ? dirname(resolve(formationPath)) : projectRoot, value);
      if (!within(projectRoot, target)) {
        checks.push(finding('source_outside_project', 'warning', 'Source hors projet : existence non vérifiée.', path, { fichier: value }));
        continue;
      }
      const canonicalRoot = await realpath(projectRoot);
      const canonicalTarget = await realpath(target);
      if (!within(canonicalRoot, canonicalTarget)) {
        checks.push(finding('source_outside_project', 'warning', 'La source résolue pointe hors du projet.', path, { fichier: value }));
        continue;
      }
      if (!(await stat(canonicalTarget)).isFile()) {
        checks.push(finding('source_not_file', 'error', 'La source désigne un dossier, pas un fichier.', path, { resolvedPath: target }));
      } else checks.push(finding('source_exists', 'info', 'Fichier source présent.', path, { resolvedPath: target }));
    } catch (error) {
      checks.push(finding(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 'source_missing' : 'source_unreadable', 'error', 'Fichier source absent ou inaccessible.', path, { fichier: value, resolvedPath: target, reason: error.code || error.message }));
    }
  }
}

/** Comparaison numérique réutilisable ; ne modifie aucune durée. CDC-06. */
export function compareDurations(officialMinutes, detailedMinutes, path = '', details = {}) {
  if (![officialMinutes, detailedMinutes].every(value => Number.isInteger(value) && value > 0)) return finding('duration_uncheckable', 'info', 'Comparaison non effectuée : deux durées structurées en minutes entières positives sont nécessaires.', path);
  const deltaMinutes = detailedMinutes - officialMinutes;
  return finding(deltaMinutes === 0 ? 'duration_match' : 'duration_mismatch', deltaMinutes === 0 ? 'info' : 'warning',
    `${officialMinutes} min officielles ; ${detailedMinutes} min détaillées ; écart ${deltaMinutes > 0 ? '+' : ''}${deltaMinutes} min.${deltaMinutes ? ' Arbitrage nécessaire.' : ''}`,
    path, { ...details, officialMinutes, detailedMinutes, deltaMinutes });
}

function checkDuration(data, checks) {
  // Seuls ces deux nombres font autorité pour le calcul. Les alertes éditoriales
  // et les contraintes textuelles ne sont ni lues ni interprétées ici.
  checks.push(compareDurations(data.meta?.duree_minutes, data.meta?.duree_detaillee_minutes, '/meta/duree_detaillee_minutes', {
    officialPath: '/meta/duree_minutes',
    detailedPath: '/meta/duree_detaillee_minutes',
    note: 'Comparaison des durées de référence déclarées ; total non recalculé à partir de séquences. La durée client reste à confirmer si elle est hypothétique.',
  }));
}

/** Objet JSON en mémoire, jamais modifié. formationPath résout les sources
 * relativement au fichier ; projectRoot borne les vérifications locales.
 * checks contient tous les résultats ; errors/warnings en sont des sélections.
 * valid signifie absence d'erreur bloquante, pas validation pédagogique. */
export async function validateFormation(data, { formationPath, projectRoot = projectDirectory } = {}) {
  const checks = [];
  try {
    const schema = JSON.parse(await readFile(schemaUrl, 'utf8'));
    inspectSchema(schema);
    checks.push(...schemaErrors(data, schema, schema));
    checks.push(finding('schema_scope', 'info', 'Contrôles natifs du sous-ensemble utilisé par le contrat V1 ; pas de validation JSON Schema générale.'));
  } catch (error) {
    checks.push(finding('schema_unavailable', 'error', `Contrôle structurel impossible : ${error.message}.`));
    return result(checks);
  }
  if (!object(data)) return result(checks);
  const previousErrors = checks.filter(item => item.severity === 'error').length;
  checkIdentifiers(data, checks);
  checkCompetences(data, checks);
  checkPersonasAndPractice(data, checks);
  await checkSources(data, { formationPath, projectRoot: resolve(projectRoot) }, checks);
  checkDuration(data, checks);
  checkMoments(data, checks);
  checkModules(data, checks);
  if (!checks.some(item => item.severity === 'error')) checks.push(finding('validation_passed', 'info', 'Structure V1 et contrôles déterministes exécutés sans erreur bloquante.'));
  else if (previousErrors) checks.push(finding('structure_invalid', 'info', 'Structure invalide : seuls les contrôles métier applicables ont été exécutés.'));
  return result(checks);
}

export async function validateFormationFile(formationPath, options = {}) {
  let text;
  try { text = await readFile(formationPath, 'utf8'); }
  catch (error) { return result([finding('json_unreadable', 'error', 'Fichier formation illisible.', '', { file: String(formationPath), reason: error.code })]); }
  let data;
  try { data = JSON.parse(text); }
  catch (error) { return result([finding('json_invalid', 'error', 'JSON invalide.', '', { file: String(formationPath), reason: error.message })]); }
  return validateFormation(data, { ...options, formationPath: formationPath instanceof URL ? fileURLToPath(formationPath) : formationPath });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), json = args.includes('--json');
  const files = args.filter(arg => arg !== '--json');
  if (files.length !== 1 || files[0].startsWith('--')) {
    console.error('Usage : node core/validate-formation.mjs <formation.json> [--json]');
    process.exitCode = 2;
  } else {
    const report = await validateFormationFile(files[0]);
    if (json) console.log(JSON.stringify(report, null, 2));
    else {
      console.log(`${report.valid ? 'VALIDE' : 'INVALIDE'} — ${files[0]} — ${report.errors.length} erreur(s), ${report.warnings.length} avertissement(s)`);
      for (const check of report.checks) console.log(`[${check.severity}] ${check.code}${check.path ? ` (${check.path})` : ''} : ${check.message}`);
    }
    process.exitCode = report.valid ? 0 : 1;
  }
}

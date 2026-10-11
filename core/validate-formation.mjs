import { readFile, realpath, stat } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const projectDirectory = fileURLToPath(new URL('../', import.meta.url));
const schemaUrl = new URL('../schemas/formation.schema.json', import.meta.url);
const collections = ['sources', 'hypotheses', 'personas', 'gap', 'competences', 'alertes', 'decisions_a_valider'];
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

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContents } from '../../core/content.mjs';
import { validateResearchPlan } from '../../core/research.mjs';
import { projection } from './projection.mjs';
import { loadMachine, validateSpec, sha256 } from './machine.mjs';

import { safeRead, normalize, json, momentSources, projectSlides } from './project.mjs';
export { sectionsOf } from './project.mjs';

export const repository = fileURLToPath(new URL('../../', import.meta.url));
export const scenarioPath = 'examples/IA017/act_on_data/';
export const moduleId = 'AOD-M02';
export const stem = 'IA017-act-on-data-module2';
export async function generate({ root = repository, machineRoot = join(root, 'references/machine_vcoac/local/machine_vcoac'), editorial = projection } = {}) {
  const machine = await loadMachine(machineRoot);
  const lock = JSON.parse(await readFile(new URL('./sources.lock.json', import.meta.url), 'utf8'));
  if (sha256(json(editorial)) !== lock.projection_sha256) throw new Error('Projection éditoriale modifiée : revue P4 requise.');
  const inputs = {};
  for (const [path, expected] of Object.entries(lock.sources)) {
    const text = await safeRead(root, path);
    if (sha256(text) !== expected) throw new Error(`Source modifiée : ${path}. Revoir le mapping P4 et son verrou.`);
    inputs[path] = text;
  }
  const formation = JSON.parse(inputs[scenarioPath + 'formation.json']);
  if (formation.meta.id !== 'IA017-ACT-ON-DATA') throw new Error('Formation hors pilote.');
  const module = formation.modules.find(m => m.id === moduleId);
  const momentIds = Array.from({ length: 6 }, (_, i) => `${moduleId}-MP0${i + 1}`);
  if (!module || JSON.stringify(module.moments_pedagogiques.map(m => m.id)) !== JSON.stringify(momentIds)) throw new Error('Les six moments M02 sont requis.');
  if (module.duree_minutes !== 140 || module.pratique_minutes !== 90) throw new Error('Durées du pilote modifiées.');
  const selected = { ...formation, modules: [module] };
  const loaded = await loadContents(selected, resolve(root, scenarioPath, 'formation.json'), { knowledgeRoot: resolve(root, 'knowledge') });
  if (!loaded.valid) throw new Error(JSON.stringify(loaded.errors));
  const notes = [...new Map(Object.values(loaded.contents).flatMap(c => c.knowledge).map(n => [n.metadata.id, n])).values()];
  for (const note of notes) if (!inputs['knowledge/' + note.path]) throw new Error(`Knowledge non verrouillée : ${note.path}`);
  const plan = JSON.parse(inputs[scenarioPath + 'research-plan.json']);
  const focusedPlan = { ...plan, questions: plan.questions.filter(q => q.used_by.some(u => u.module_id === moduleId)).map(q => ({ ...q, used_by: q.used_by.filter(u => u.module_id === moduleId) })) };
  const research = await validateResearchPlan(focusedPlan, selected, { notes, asOf: lock.validated_at });
  if (!research.valid || focusedPlan.questions.some(q => q.status !== 'covered')) throw new Error('Recherche M02 non couverte : ' + JSON.stringify(research.errors));
  const audit = inputs['docs/PILOTE_INTEGRATION_VCOAC.md'].split('### Validation réelle n8n par le formateur — 12 octobre 2026')[1];
  if (!audit || momentIds.some(id => !audit.includes(`| ${id} | **READY** |`))) throw new Error('Readiness M02 non validée.');

  const { fragments, slides, used } = projectSlides(editorial, momentSources(selected, loaded.contents, scenarioPath));
  const spec = { deck: { titre: `Act-On Data — Module 2 — ${module.titre}`, auteur: 'Hector Studio', fichesDansNotes: false }, slides };
  const checks = validateSpec(spec, machine);
  if (!checks.valid) throw new Error('Spec refusée : ' + JSON.stringify(checks));
  const warnings = [
    'P4 : projection éditoriale proposée ; validation du formateur avant la génération PPTX.',
    'Contrat natif exécuté sans rendu : polices, géométrie, débordements, chevauchements et compteur D1 exact restent à vérifier au Cycle C.',
    'MP03 : six supports dans les 10 minutes existantes ; montrer la logique, conserver les exemples complets en notes et les gabarits en ressources.',
    'MP04/MP05 : une slide par activité, même durée et mêmes cinq étapes ; synthèse des critères à l’écran, quatre critères intacts et corrections en notes.',
    'Les corrigés MP04/MP05 restent réservés aux notes formateur ; distribuer le dossier RH-042 et les gabarits sources avant l’atelier.',
    'Version exacte et captures n8n non transmises ; la preuve est le retour explicite du formateur, pas une capture synthétique.',
  ];
  const intermediate = {
    generated: true, source_of_truth: 'Hector : formation, Markdown et Knowledge ; projection éditoriale P4 versionnée',
    formation_id: formation.meta.id, module_id: moduleId, duration_minutes: 140, practice_minutes: 90,
    moments: module.moments_pedagogiques.map(m => ({ moment_id: m.id, duration_minutes: m.duree_minutes, practice_minutes: m.pratique_minutes, slides: fragments.filter(f => f.moment_id === m.id).map(f => f.slide_id) })),
    source_fingerprints: lock.sources,
    projection_sha256: sha256(normalize(await readFile(new URL('./projection.mjs', import.meta.url), 'utf8'))),
    machine_fingerprints: machine.fingerprints,
    slides: fragments.map(({ source_text, screen, notes, sections, ...rest }, index) => ({ ...rest, machine_index: index + 1, fields: screen, trainer_notes: slides[index].notes })),
    warnings,
  };
  const validation = {
    generated: true, spec_sha256: sha256(json(spec)), mode: 'Fonctions originales controlerContrat et fr extraites en mémoire de la machine auditée ; aucun rendu',
    machine_version: machine.contract.version, machine_fingerprints: machine.fingerprints,
    native_contract: { slides_checked: slides.length, warnings: checks.nativeWarnings, violations: checks.nativeWarnings.length },
    hector: { valid: checks.valid, errors: checks.errors, conservative_word_counts: checks.volumes, covered_moments: momentIds, source_sections_preserved: used.size },
    assets_required: [], render_executed: false, warnings,
  };
  return { spec, intermediate, validation, mapping: mappingReport(intermediate, validation) };
}

function mappingReport(ir, validation) {
  const typeCounts = {};
  for (const s of ir.slides) typeCounts[s.fields.type] = (typeCounts[s.fields.type] || 0) + 1;
  const escape = value => String(value).replaceAll('|', '/').replaceAll('\n', ' ');
  const lines = [
    '# Module 2 — projection éditoriale P4 à valider', '',
    `**Artefact généré : ne pas éditer.** ${ir.slides.length} slides proposées ; 140 min dont 90 de pratique. Aucun moment fusionné. Aucun PPTX produit.`, '',
    `Types : ${Object.entries(typeCounts).map(([t, n]) => `${t} × ${n}`).join(' ; ')}.`, '',
    '| Moment | Slides | Temps total / pratique |', '| --- | --- | --- |',
    ...ir.moments.map(m => `| ${m.moment_id} | ${m.slides.map(s => s.split('-').slice(-1)[0]).join(', ')} | ${m.duration_minutes} / ${m.practice_minutes} min |`), '',
    'Toutes les slides utilisent du texte et des formes natifs, sans asset externe ni pictogramme. Les IDs complets sont ci-dessous ; les numéros courts du tableau sont propres à chaque moment.', '',
    '| slide_id | Fonction / type | Objectif et décision éditoriale | Source et notes formateur |', '| --- | --- | --- | --- |',
    ...ir.slides.map(s => `| ${s.slide_id} | ${s.phase} / ${s.fields.type} | ${escape(s.objective)} ${escape(s.reason)} | [${s.moment_id}](../../${s.provenance[0].file}) — ${escape(s.provenance[0].section)}. Sections sources intégrales en notes${s.trainer_notes.relance ? ' ; relance/réponse' : ''}${s.trainer_notes.vigilance ? ' ; vigilance' : ''}. |`), '',
    'Le manifeste intermédiaire JSON donne, pour chaque slide, **toutes** les sections sources, les champs projetés, les références Knowledge et les notes exactes. Les sections non projetées sont conservées intégralement en notes, avec leur provenance.', '',
    '## Supports à distribuer et corrections', '',
    '- [Dossier participant RH-042](../../knowledge/cases/rh-042-dossier-pedagogique.md) : pièces D1–D3 et permissions ; aucune donnée manquante à inventer.',
    '- [Canvas et grille MCP complets](../../examples/IA017/act_on_data/content/AOD-M02-MP03.md) : six rubriques, six questions, gabarits et exemples ; utiliser les parties vierges pour les participants.',
    '- Références de correction MP04/MP05 conservées dans les notes : ne pas distribuer ces notes avant les activités.', '',
    '## Validation et points à confirmer', '',
    `Contrôleur natif : **${validation.native_contract.slides_checked} slides, 0 violation, 0 warning de contrat**. Contrôles complémentaires Hector : conformes. Assets manquants : **aucun**.`, '',
    ...ir.warnings.map(w => '- ' + w), '',
    'Arbitrage de fond nécessaire : **aucun identifié**. Consignes fusionnées selon le retour du formateur ; nouvelle revue du rendu attendue. La validation des slides ne vaut pas validation du rendu graphique.', '',
  ];
  return lines.join('\n');
}

export async function writeArtifacts(result, directory = join(repository, 'outputs/vcoac'), artifactStem = stem) {
  await mkdir(directory, { recursive: true });
  for (const [suffix, value] of [['.json', json(result.spec)], ['-intermediate.json', json(result.intermediate)], ['-validation.json', json(result.validation)], ['-mapping.md', result.mapping]]) {
    await writeFile(join(directory, artifactStem + suffix), value, 'utf8');
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 2) throw new Error('V1 sans argument : seul le Module 2 pilote est accepté.');
    const result = await generate();
    await writeArtifacts(result);
    console.log(`${result.spec.slides.length} slides ; contrat natif : 0 violation ; contrôles Hector : OK ; aucun rendu.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}

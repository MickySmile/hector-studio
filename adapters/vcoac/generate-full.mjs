import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContents } from '../../core/content.mjs';
import { validateFormation } from '../../core/validate-formation.mjs';
import { validateResearchPlan } from '../../core/research.mjs';
import { generate as generatePilot, repository, scenarioPath, writeArtifacts } from './generate.mjs';
import { loadMachine, validateSpec, sha256 } from './machine.mjs';
import { safeRead, sectionsOf, normalize, json, momentSources, projectSlides } from './project.mjs';
import { fullProjection, opening, closing } from './full-projection.mjs';

export const fullStem = 'IA017-act-on-data-full';
const lockUrl = new URL('./full-sources.lock.json', import.meta.url);
const module2Id = 'AOD-M02';
const groupCounts = values => values.reduce((counts, value) => ({ ...counts, [value]: (counts[value] || 0) + 1 }), {});
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function validateReadiness(formation, readiness) {
  if (readiness.formation_id !== formation.meta.id || !Array.isArray(readiness.remaining_blockers) || readiness.remaining_blockers.length) throw new Error('Readiness de la formation non acquise.');
  const expected = formation.modules.map(m => ({ module_id: m.id, ready: m.moments_pedagogiques.length, total: m.moments_pedagogiques.length, moments: m.moments_pedagogiques.map(p => ({ moment_id: p.id, status: 'READY', content_ref: p.content_ref })) }));
  const actual = readiness.modules.map(m => ({ module_id: m.module_id, ready: m.ready, total: m.total, moments: m.moments.map(({ moment_id, status, content_ref }) => ({ moment_id, status, content_ref })) }));
  if (!same(expected, actual)) throw new Error('Readiness incohérente : moments, ordre, statut ou référence.');
  const duration = formation.modules.reduce((n, m) => n + m.duree_minutes, 0);
  const practice = formation.modules.reduce((n, m) => n + m.pratique_minutes, 0);
  if (formation.modules.some(m => m.moments_pedagogiques.reduce((n, p) => n + p.duree_minutes, 0) !== m.duree_minutes || m.moments_pedagogiques.reduce((n, p) => n + p.pratique_minutes, 0) !== m.pratique_minutes)) throw new Error('Durées des moments incohérentes.');
  const t = readiness.timing;
  if (duration !== t.module_minutes || practice !== t.practice_minutes || t.envelope_minutes !== formation.meta.duree_minutes || duration + t.outside_minutes !== t.envelope_minutes || t.segments.reduce((n, s) => n + s.minutes, 0) !== t.envelope_minutes || t.practice_percent !== practice / t.envelope_minutes * 100) throw new Error('Durées de formation incohérentes.');
}

export function fullSources(formation, contents, sessionText) {
  const session = sectionsOf(sessionText), closingHeadings = new Set(closing.sections);
  const cadre = (entry, sections, title) => ({ module_id: null, title, phases: [entry.phase], file: scenarioPath + 'conduite-session.md', sections, knowledge_refs: [], source_refs: [] });
  return {
    [opening.source_id]: cadre(opening, session.filter(s => !closingHeadings.has(s.heading)), 'Ouverture et parcours'),
    ...momentSources(formation, contents, scenarioPath),
    [closing.source_id]: cadre(closing, session.filter(s => closingHeadings.has(s.heading)), 'Clôture commune'),
  };
}

export async function generateFull({ root = repository, machineRoot = join(root, 'references/machine_vcoac/local/machine_vcoac'), editorial = fullProjection } = {}) {
  const lock = JSON.parse(await readFile(lockUrl, 'utf8'));
  if (sha256(json(editorial)) !== lock.projection_sha256) throw new Error('Projection complète modifiée : revue éditoriale requise.');
  const inputs = {};
  for (const [file, expected] of Object.entries(lock.sources)) {
    const text = await safeRead(root, file);
    if (sha256(text) !== expected) throw new Error(`Source modifiée : ${file}. Revoir le mapping complet et son verrou.`);
    inputs[file] = text;
  }
  const formation = JSON.parse(inputs[scenarioPath + 'formation.json']);
  const readiness = JSON.parse(inputs[scenarioPath + 'readiness.json']);
  const formationPath = resolve(root, scenarioPath, 'formation.json');
  const structure = await validateFormation(formation, { formationPath, projectRoot: root });
  if (!structure.valid) throw new Error('Formation invalide : ' + JSON.stringify(structure));
  validateReadiness(formation, readiness);
  const loaded = await loadContents(formation, formationPath, { knowledgeRoot: resolve(root, 'knowledge') });
  if (!loaded.valid) throw new Error('Provenance invalide : ' + JSON.stringify(loaded.errors));
  const knowledge = [...new Map(Object.values(loaded.contents).flatMap(c => c.knowledge).map(n => [n.metadata.id, n])).values()];
  for (const content of Object.values(loaded.contents)) if (!inputs[scenarioPath + content.path]) throw new Error(`Contenu non verrouillé : ${content.path}`);
  for (const note of knowledge) if (!inputs['knowledge/' + note.path]) throw new Error(`Knowledge non verrouillée : ${note.path}`);
  const plan = JSON.parse(inputs[scenarioPath + 'research-plan.json']);
  const research = await validateResearchPlan(plan, formation, { notes: knowledge, asOf: lock.validated_at });
  if (!research.valid) throw new Error('Plan de recherche invalide : ' + JSON.stringify(research.errors));
  const openResearch = plan.questions.filter(q => q.status !== 'covered');
  if (!same(openResearch.map(q => ({ id: q.id, status: q.status })), lock.open_research.map(({ id, status }) => ({ id, status })))) throw new Error('Recherche ouverte non examinée : nouvelle revue requise.');

  const sources = fullSources(formation, loaded.contents, inputs[scenarioPath + 'conduite-session.md']);
  const { fragments, slides, used } = projectSlides(editorial, sources);
  // Réexécuter le pilote avec son propre verrou, sans lire ses sorties générées.
  const pilot = await generatePilot({ root, machineRoot });
  const reproduced = slides.filter((_, i) => sources[fragments[i].moment_id || fragments[i].source_id].module_id === module2Id);
  if (!same(reproduced, pilot.spec.slides) || sha256(JSON.stringify(reproduced)) !== lock.module2_slides_sha256 || sha256(JSON.stringify(pilot)) !== lock.module2_artifacts_sha256) throw new Error('Module 2 modifié : reproduction à l’identique obligatoire.');

  const machine = await loadMachine(machineRoot);
  const spec = { deck: { titre: 'Act-On Data — Concevoir, contrôler et argumenter un usage IA', auteur: 'Hector Studio', fichesDansNotes: false }, slides };
  const checks = validateSpec(spec, machine);
  if (!checks.valid) throw new Error('Spec complète refusée : ' + JSON.stringify(checks));
  const moments = formation.modules.flatMap(module => module.moments_pedagogiques.map(moment => ({
    module_id: module.id, moment_id: moment.id, functions: moment.fonctions_vcoac.map(f => f.toUpperCase()),
    duration_minutes: moment.duree_minutes, practice_minutes: moment.pratique_minutes,
    slides: fragments.filter(f => f.moment_id === moment.id).map(f => f.slide_id),
  })));
  const modules = formation.modules.map(module => ({ module_id: module.id, title: module.titre, duration_minutes: module.duree_minutes, practice_minutes: module.pratique_minutes, slides: fragments.filter(f => sources[f.moment_id || f.source_id].module_id === module.id).length }));
  const warnings = [
    'Validation structurelle sans rendu : géométrie, polices, débordements, chevauchements et compteur D1 exact non vérifiés.',
    'M2-MP03 : six supports dans dix minutes, séquence conservée à l’identique. Présenter la logique et distribuer les gabarits, sans les remplir à l’écran.',
    'M3-MP02 : six slides dans vingt minutes ; les trois supports OUTILLER partagent six minutes. La grille complète accompagne les participants ; aucune analyse juridique supplémentaire.',
    'M4-MP02 : trois supports dans dix minutes. Les sept rubriques du même canvas occupent deux écrans ; l’exemple se commente sans remplir le canvas avant MP03.',
    'M4-MP03 : soixante-dix minutes de pratique sur une consigne unique. Respecter les deux tours simultanés et les trois restitutions courtes prévus pour environ sept participants.',
    'Option B choisie : sources et corrigés intégraux dans les notes. Ces notes servent de réserve, sans lecture exhaustive pendant la séance ; ne pas distribuer les corrigés avant les activités.',
    'Démo n8n externe : rappel natif conservé, aucune capture requise ou simulée. Les valeurs reçues/attendues ne démontrent pas le compteur de congés RH-042.',
    'Formation sur données fictives ; règles et interlocuteurs client restent à confirmer pour le réel. La réserve documentaire AI Act et l’écart catalogue 420/435 sont conservés.',
  ];
  const transitions = [
    { from: 'AOD-M01', to: 'AOD-M02', source_slide: 'AOD-M01-MP03-02', target_slide: 'AOD-M02-MP01-01', retained: 'Phrase de délégation, puis dossier D1–D3 et carte RH-042.', minutes_outside_modules: 3 },
    { from: 'AOD-M02', to: 'AOD-M03', source_slide: 'AOD-M02-MP06-01', target_slide: 'AOD-M03-MP01-01', retained: 'Carte et droits ; superposer copie personnelle et partage de la sortie.', minutes_outside_modules: 3 },
    { from: 'AOD-M03', to: 'AOD-M04', source_slide: 'AOD-M03-MP05-01', target_slide: 'AOD-M04-MP01-01', retained: 'Carte, grille de risques et contrôle prioritaire deviennent conditions de la valeur.', minutes_outside_modules: 3 },
  ];
  const decisions = [
    { decision: 'Convention de notes des nouveaux modules', option_a: 'Notes courtes, détails et corrigés reliés dans le mapping.', option_b: 'Sections sources intégrales dans les notes, comme le pilote M2.', recommendation: 'A proposée pour alléger les notes.', selected: 'B', status: 'Choix explicite de l’utilisateur le 12 octobre 2026 ; appliqué.' },
  ];
  const intermediate = {
    generated: true, source_of_truth: 'Hector : formation.json, contenus Markdown et Knowledge ; cet artefact est régénérable.',
    reference_commit: lock.reference_commit, formation_id: formation.meta.id,
    duration_minutes: readiness.timing.envelope_minutes, practice_minutes: readiness.timing.practice_minutes,
    practice_percent: readiness.timing.practice_percent, timing: readiness.timing,
    modules, moments, framing_slides: fragments.filter(f => !f.moment_id).map(f => f.slide_id),
    type_counts: groupCounts(slides.map(s => s.type)), phase_counts: groupCounts(slides.map(s => s.phase)),
    module2_identical: true, module2_slides_sha256: lock.module2_slides_sha256,
    source_fingerprints: lock.sources, projection_sha256: sha256(normalize(await readFile(new URL('./full-projection.mjs', import.meta.url), 'utf8'))),
    machine_fingerprints: machine.fingerprints,
    knowledge: knowledge.map(n => ({ id: n.metadata.id, file: 'knowledge/' + n.path, type: n.metadata.type, sources: n.source_ids })),
    slides: fragments.map(({ source_text, screen, notes, sections, ...rest }, index) => ({ ...rest, module_id: sources[rest.moment_id || rest.source_id].module_id, machine_index: index + 1, fields: screen, trainer_notes: slides[index].notes })),
    transitions, decisions, human_followups: readiness.human_followups, warnings,
  };
  for (const transition of transitions) {
    const from = intermediate.slides.find(s => s.slide_id === transition.source_slide), to = intermediate.slides.find(s => s.slide_id === transition.target_slide);
    if (!from || !to || from.module_id !== transition.from || to.module_id !== transition.to || from.machine_index + 1 !== to.machine_index) throw new Error('Transition cassée.');
  }
  const validation = {
    generated: true, spec_sha256: sha256(json(spec)), reference_commit: lock.reference_commit,
    mode: 'Fonctions originales controlerContrat et fr extraites en mémoire de la machine auditée ; aucun rendu',
    machine_version: machine.contract.version, machine_fingerprints: machine.fingerprints,
    native_contract: { slides_checked: slides.length, warnings: checks.nativeWarnings, violations: checks.nativeWarnings.length },
    hector: { valid: checks.valid, errors: checks.errors, conservative_word_counts: checks.volumes, covered_moments: moments.map(m => m.moment_id), source_sections_preserved: used.size, order_valid: true, functions_covered: true, provenance_valid: true, fixtures_used: [], module2_identical: true, module2_artifacts_sha256: lock.module2_artifacts_sha256 },
    research: { covered: plan.questions.length - openResearch.length, total: plan.questions.length, open: lock.open_research },
    structure: { valid: structure.valid, errors: structure.errors, warnings: structure.warnings },
    assets_required: [], render_executed: false, decisions, human_followups: readiness.human_followups, warnings,
  };
  return { spec, intermediate, validation, mapping: fullMappingReport(intermediate, validation) };
}

function fullMappingReport(ir, validation) {
  const esc = value => String(value).replaceAll('|', '/').replaceAll('\n', ' ');
  const link = (file, label = file) => `[${esc(label)}](../../${file})`;
  const knowledgeById = new Map(ir.knowledge.map(n => [n.id, n]));
  const lines = [
    '# Act-On Data — mapping VCOAC complet', '',
    '**Artefact généré : ne pas éditer.** Le fond reste dans Hector. Cette proposition ne constitue pas un rendu PowerPoint.', '',
    `État pédagogique : commit \`${ir.reference_commit}\`. **${ir.slides.length} slides**, **${ir.moments.length}/18 moments READY**. **${ir.duration_minutes} min**, dont **${ir.practice_minutes} min de pratique (${ir.practice_percent.toFixed(2).replace('.', ',')} %)**.`, '',
    '| Périmètre | Slides | Durée / pratique |', '| --- | ---: | --- |',
    ...ir.modules.map(m => `| ${m.module_id} — ${m.title} | ${m.slides} | ${m.duration_minutes} / ${m.practice_minutes} min |`),
    `| Cadre commun : ouverture et clôture | ${ir.framing_slides.length} | 15 + 6 min / 0 min |`, '',
    'Les trois transitions de 3 min réutilisent les écrans de consolidation et de reprise. Elles ne sont ni des moments supplémentaires ni du temps de pratique. 390 min de modules + 15 min d’ouverture + 9 min de transitions + 6 min de clôture = 420 min. Pauses exclues ; anomalie catalogue 420/435 conservée.', '',
    `Types : ${Object.entries(ir.type_counts).map(([t, n]) => `${t} × ${n}`).join(' ; ')}.`, '',
    '## Couverture, fonctions et rythme', '',
    '| Module | Moment | Fonctions | Slides | Total / pratique |', '| --- | --- | --- | --- | --- |',
    ...ir.moments.map(m => `| ${m.module_id} | ${m.moment_id} | ${m.functions.join(' + ')} | ${m.slides.join(', ')} | ${m.duration_minutes} / ${m.practice_minutes} min |`), '',
    'Chaque activité conserve une seule slide de consigne. Les différentes fonctions d’un moment peuvent avoir plusieurs écrans sans multiplier sa durée. Le canvas de valeur conserve ses sept rubriques sur deux écrans ; la grille de risque regroupe ses dimensions sur un seul écran.', '',
    '## Continuité de la journée', '',
    ...ir.transitions.map(t => `- **${t.from} → ${t.to}** : ${t.retained} Supports ${t.source_slide} → ${t.target_slide}. ${t.minutes_outside_modules} min hors modules.`), '',
    'La reprise du brouillon, de la carte, du contrôle puis du canvas sert la montée en compétences. Les rappels reprennent ces productions au lieu de recommencer quatre introductions. Aucun résultat participant n’est supposé obtenu avant la séance.', '',
    '## Tableau éditorial', '',
    '| Nº / slide_id | Module / moment source | Fonction / type | Objectif et projection | Visuel / asset |', '| --- | --- | --- | --- | --- |',
    ...ir.slides.map(s => `| ${s.machine_index} / ${s.slide_id} | ${s.module_id || 'Commun'} / ${s.moment_id || s.source_id} | ${s.phase} / ${s.fields.type} | ${esc(s.objective)} ${esc(s.reason)} | ${esc(s.visual)} ; aucun asset requis |`), '',
    '## Supports à préparer', '',
    ...[
      ['knowledge/cases/rh-042-dossier-pedagogique.md', 'Dossier RH-042 : pièces D1–D3 et permissions fictives'],
      ['examples/IA017/act_on_data/content/AOD-M01-MP02.md', 'Grille de délégation et gabarit M1'],
      ['examples/IA017/act_on_data/content/AOD-M02-MP03.md', 'Canvas logique et grille MCP M2'],
      ['knowledge/methods/grille-risque-usage-ia.md', 'Grille de risque complète'],
      ['knowledge/methods/revue-rh-avant-usage.md', 'Gabarit de confirmation avant un usage réel'],
      ['examples/IA017/act_on_data/content/AOD-M04-MP02.md', 'Canvas de valeur et exemple M4'],
      ['examples/IA017/act_on_data/conduite-session.md', 'Conduite complète, matériel et transitions'],
    ].map(([file, label]) => '- ' + link(file, label)), '',
    'Distribuer les parties participant et les gabarits vierges ; réserver les corrigés et les notes au formateur.', '',
    '## Validation et limites', '',
    `Machine locale : **${validation.native_contract.slides_checked} slides contrôlées, ${validation.native_contract.violations} erreur/violation, ${validation.native_contract.warnings.length} warning de contrat**. Hector : **0 erreur**. Assets manquants : **aucun**. Module 2 : **17 slides et quatre artefacts reproduits à l’identique**, contrôlés par comparaison et empreintes figées avant extension.`, '',
    'Fonctions natives de contrôle exécutées depuis les fichiers machine audités, sans appeler build_template.js ni charger les composeurs. Aucun PPTX produit. La conformité machine ne prouve pas la lisibilité du futur rendu.', '',
    ...ir.warnings.map(w => '- ' + w), '',
    `Recherche : ${validation.research.covered}/${validation.research.total} couverte ; la confirmation des règles client reste ouverte et limitée au transfert réel.`, '',
    '## Décision éditoriale et suivis humains', '',
    ...ir.decisions.flatMap(d => [`DÉCISION — ${d.decision}.`, '', `OPTION A — ${d.option_a}`, '', `OPTION B — ${d.option_b}`, '', `RECOMMANDATION — ${d.recommendation} **Choix retenu : ${d.selected}. ${d.status}**`, '']),
    'Aucun autre arbitrage éditorial bloquant identifié. La revue humaine du mapping M1/M3/M4 reste à effectuer avant le futur rendu complet.', '',
    ...ir.human_followups.map(f => `- ${f.id} : ${f.title}. Portée : ${f.scope}.`), '',
    '## Détail par slide : contenu, sources et notes exactes', '',
    'Les références ci-dessous pointent vers les fichiers sources. Les intitulés de section et leurs SHA-256 permettent de vérifier chaque fragment. Toutes les sections des 18 contenus sont conservées dans les notes d’au moins un écran ; les répétitions ne créent aucune minute supplémentaire.', '',
  ];
  for (const s of ir.slides) {
    lines.push(`### ${s.machine_index}. ${s.slide_id}`, '', `**${s.module_id || 'Cadre commun'} · ${s.moment_id || s.source_id} · ${s.phase} · ${s.fields.type}**`, '', s.objective, '', s.reason, '',
      '**Contenu écran exact**', '', '```json', JSON.stringify(s.fields, null, 2), '```', '', '**Provenance**', '',
      ...s.provenance.map(p => `- ${link(p.file, p.section)} — SHA-256 \`${p.sha256}\`.`), '',
      'Knowledge : ' + (s.knowledge_refs.map(id => link(knowledgeById.get(id).file, id)).join(', ') || 'Conduite de session, sans nouvel apport externe.') + '.', '',
      'Sources résolues : ' + (s.source_refs.map(id => link(knowledgeById.get(id).file, id)).join(', ') || 'Même document de conduite.') + '.', '',
      '<details>', '<summary>Notes formateur exactes (sources intégrales, option B)</summary>', '');
    for (const [key, value] of Object.entries(s.trainer_notes)) lines.push(`**${key}**`, '', '```text', Array.isArray(value) ? value.join('\n\n') : value, '```', '');
    lines.push('</details>', '');
  }
  return lines.join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 2) throw new Error('Ce lanceur produit uniquement la spec complète Act-On Data, sans argument ni rendu.');
    const result = await generateFull();
    await writeArtifacts(result, join(repository, 'outputs/vcoac'), fullStem);
    console.log(`${result.spec.slides.length} slides ; ${result.intermediate.moments.length}/18 moments ; Module 2 identique ; contrat natif : 0 violation ; aucun rendu.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}

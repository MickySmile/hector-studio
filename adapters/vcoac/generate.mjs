import { readFile, writeFile, mkdir, realpath } from 'node:fs/promises';
import { resolve, relative, isAbsolute, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContents } from '../../core/content.mjs';
import { validateResearchPlan } from '../../core/research.mjs';
import { projection } from './projection.mjs';
import { loadMachine, validateSpec, sha256 } from './machine.mjs';

export const repository = fileURLToPath(new URL('../../', import.meta.url));
export const scenarioPath = 'examples/IA017/act_on_data/';
export const moduleId = 'AOD-M02';
export const stem = 'IA017-act-on-data-module2';
const json = value => JSON.stringify(value, null, 2) + '\n';
const normalize = text => text.replace(/\r\n/g, '\n');

export function sectionsOf(content) {
  const lines = normalize(content).split('\n'), sections = [];
  let current;
  lines.forEach((line, index) => {
    const heading = /^#{1,3} (.+)$/.exec(line);
    if (heading) { current = { heading: heading[1], line: index + 1, text: '' }; sections.push(current); }
    if (current) current.text += line + '\n';
  });
  if (!sections.length || new Set(sections.map(s => s.heading)).size !== sections.length) throw new Error('Sections absentes ou ambiguës.');
  return sections;
}

async function safeRead(root, file) {
  if (/(^|[\\/])(?:tests|fixtures)([\\/]|$)/i.test(file)) throw new Error(`Fixture interdite : ${file}`);
  const base = await realpath(root), target = await realpath(resolve(base, file));
  const rel = relative(base, target);
  if (isAbsolute(rel) || rel.startsWith('..')) throw new Error(`Source hors dépôt : ${file}`);
  return normalize(await readFile(target, 'utf8'));
}

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

  const sections = Object.fromEntries(momentIds.map(id => [id, sectionsOf(loaded.contents[id].content)]));
  const used = new Set(), ids = new Set(), fragments = [];
  const addSection = (entry, section) => {
    const file = scenarioPath + loaded.contents[entry.moment_id].path;
    const source = { file, section: section.heading, sha256: sha256(section.text) };
    entry.provenance.push(source);
    entry.source_text.push(section.text.trim());
    used.add(entry.moment_id + '/' + section.heading);
  };
  for (const slide of editorial) {
    const moment = module.moments_pedagogiques.find(m => m.id === slide.moment_id);
    if (!moment || !moment.fonctions_vcoac.map(f => f.toUpperCase()).includes(slide.phase)) throw new Error('Moment ou fonction hors pilote.');
    if (!slide.slide_id.startsWith(slide.moment_id + '-') || ids.has(slide.slide_id)) throw new Error('slide_id absent, incohérent ou dupliqué.');
    ids.add(slide.slide_id);
    if (!slide.sections?.length || !slide.objective || !slide.reason) throw new Error('Provenance ou décision éditoriale absente.');
    const entry = { ...structuredClone(slide), provenance: [], source_text: [], knowledge_refs: loaded.contents[moment.id].metadata.knowledge_refs, source_refs: loaded.contents[moment.id].metadata.source_refs };
    for (const heading of slide.sections) {
      const source = sections[moment.id].find(s => s.heading === heading);
      if (!source) throw new Error(`Fragment absent : ${moment.id} / ${heading}`);
      addSection(entry, source);
    }
    fragments.push(entry);
  }
  for (const id of momentIds) {
    const entries = fragments.filter(f => f.moment_id === id);
    if (!entries.length) throw new Error(`Moment oublié : ${id}`);
    // Introduction et détails non projetés : conservation complète en notes,
    // avec provenance distincte. Aucun écrêtage pour respecter un layout.
    for (const section of sections[id]) if (!used.has(id + '/' + section.heading)) addSection(entries[0], section);
    const required = module.moments_pedagogiques.find(m => m.id === id).fonctions_vcoac;
    if (required.some(phase => !entries.some(e => e.phase === phase.toUpperCase()))) throw new Error(`Fonction perdue : ${id}`);
  }
  const slides = fragments.map(fragment => ({
    ...fragment.screen, phase: fragment.phase,
    section: `${fragment.moment_id} — ${module.moments_pedagogiques.find(m => m.id === fragment.moment_id).titre}`,
    notes: {
      essentiel: [fragment.objective, fragment.source_text.join('\n\n')],
      ...fragment.notes,
    },
  }));
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

export async function writeArtifacts(result, directory = join(repository, 'outputs/vcoac')) {
  await mkdir(directory, { recursive: true });
  for (const [suffix, value] of [['.json', json(result.spec)], ['-intermediate.json', json(result.intermediate)], ['-validation.json', json(result.validation)], ['-mapping.md', result.mapping]]) {
    await writeFile(join(directory, stem + suffix), value, 'utf8');
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

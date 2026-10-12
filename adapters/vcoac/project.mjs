import { readFile, realpath } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';
import { sha256 } from './machine.mjs';

export const normalize = text => text.replace(/\r\n/g, '\n');
export const json = value => JSON.stringify(value, null, 2) + '\n';

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

export async function safeRead(root, file) {
  if (/(^|[\\/])(?:tests|fixtures)([\\/]|$)/i.test(file)) throw new Error(`Fixture interdite : ${file}`);
  const base = await realpath(root), target = await realpath(resolve(base, file));
  const rel = relative(base, target);
  if (isAbsolute(rel) || rel.startsWith('..')) throw new Error(`Source hors dépôt : ${file}`);
  if (/(^|[\\/])(?:tests|fixtures)([\\/]|$)/i.test(rel)) throw new Error(`Fixture interdite : ${file}`);
  return normalize(await readFile(target, 'utf8'));
}

export function momentSources(formation, contents, scenarioPath) {
  return Object.fromEntries(formation.modules.flatMap(module => module.moments_pedagogiques.map(moment => {
    const content = contents[moment.id];
    if (!content) throw new Error(`Contenu absent : ${moment.id}`);
    return [moment.id, {
      module_id: module.id, title: moment.titre,
      phases: moment.fonctions_vcoac.map(f => f.toUpperCase()),
      file: scenarioPath + content.path, sections: sectionsOf(content.content),
      knowledge_refs: content.metadata.knowledge_refs, source_refs: content.metadata.source_refs,
    }];
  })));
}

// Même règle pour chaque moment et pour les séquences communes : aucune
// synthèse automatique, toute section non projetée rejoint les notes du premier
// support. L'ordre vient de la formation, jamais du numéro d'une slide.
export function projectSlides(editorial, sources) {
  const sourceIds = Object.keys(sources), used = new Set(), ids = new Set(), fragments = [];
  let previous = -1;
  const addSection = (entry, section) => {
    const sourceId = entry.moment_id || entry.source_id;
    entry.provenance.push({ file: sources[sourceId].file, section: section.heading, sha256: sha256(section.text) });
    entry.source_text.push(section.text.trim());
    used.add(sourceId + '/' + section.heading);
  };
  for (const slide of editorial) {
    const sourceId = slide.moment_id || slide.source_id, source = sources[sourceId];
    if (!source || !source.phases.includes(slide.phase)) throw new Error('Moment ou fonction hors projection.');
    const position = sourceIds.indexOf(sourceId);
    if (position < previous) throw new Error(`Ordre des moments rompu : ${sourceId}`);
    previous = position;
    if (!slide.slide_id?.startsWith(sourceId + '-') || ids.has(slide.slide_id)) throw new Error('slide_id absent, incohérent ou dupliqué.');
    ids.add(slide.slide_id);
    if (!slide.sections?.length || !slide.objective || !slide.reason) throw new Error('Provenance ou décision éditoriale absente.');
    // essentiel est construit à partir du fond ; une note éditoriale ne peut
    // l'écraser et supprimer silencieusement les sections sources.
    if (Object.hasOwn(slide.notes || {}, 'essentiel')) throw new Error('Notes essentiel réservées aux sources intégrales.');
    const entry = { ...structuredClone(slide), provenance: [], source_text: [], knowledge_refs: source.knowledge_refs, source_refs: source.source_refs };
    for (const heading of slide.sections) {
      const section = source.sections.find(s => s.heading === heading);
      if (!section) throw new Error(`Fragment absent : ${sourceId} / ${heading}`);
      addSection(entry, section);
    }
    fragments.push(entry);
  }
  for (const id of sourceIds) {
    const entries = fragments.filter(f => (f.moment_id || f.source_id) === id);
    if (!entries.length) throw new Error(`Moment oublié : ${id}`);
    for (const section of sources[id].sections) if (!used.has(id + '/' + section.heading)) addSection(entries[0], section);
    if (sources[id].phases.some(phase => !entries.some(e => e.phase === phase))) throw new Error(`Fonction perdue : ${id}`);
  }
  const slides = fragments.map(fragment => {
    const sourceId = fragment.moment_id || fragment.source_id;
    return {
      ...fragment.screen, phase: fragment.phase,
      section: `${sourceId} — ${sources[sourceId].title}`,
      notes: { essentiel: [fragment.objective, fragment.source_text.join('\n\n')], ...fragment.notes },
    };
  });
  return { fragments, slides, used };
}

import { readFile, realpath } from 'node:fs/promises';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadKnowledge, parseNote, validDate } from './knowledge.mjs';

const defaultKnowledge = fileURLToPath(new URL('../knowledge/', import.meta.url));
const fixture = value => /(^|[\\/])(?:tests|fixtures)([\\/]|$)/i.test(value);
const within = (root, file) => { const rel = relative(root, file); return rel && !rel.startsWith('..') && !isAbsolute(rel); };
const ids = value => Array.isArray(value) && value.length && value.every(x => typeof x === 'string' && x.trim()) && new Set(value).size === value.length;
const same = (a, b) => a.length === b.length && a.every(x => b.includes(x));

// Résout aussi les sources indirectes du cas (cas → concept/méthode → source).
export function resolveProvenance(refs, sourceRefs, notes) {
  if (!ids(refs) || !ids(sourceRefs)) throw new Error('knowledge_refs et source_refs : listes non vides et uniques requises.');
  const byId = new Map(notes.map(n => [n.metadata.id, n]));
  const byPath = new Map(notes.map(n => [n.path.replace(/\.md$/, ''), n]));
  const used = new Map(), sources = new Set(), visiting = new Set();
  function visit(note) {
    if (!note) throw new Error('Référence Knowledge/source introuvable.');
    const id = note.metadata.id;
    if (fixture(note.path) || /^T-/.test(id)) throw new Error('Référence vers une fixture interdite.');
    if (visiting.has(id)) throw new Error(`Cycle de provenance : ${id}`);
    if (used.has(id)) return;
    visiting.add(id);
    const parents = (note.metadata.sources || []).map(ref => {
      const match = /^\[\[([^\]|#]+)\]\]$/.exec(ref);
      const parent = match && byPath.get(match[1].replace(/\.md$/, ''));
      if (!parent) throw new Error(`Source non résolue : ${id} → ${ref}`);
      visit(parent); return parent.metadata.id;
    });
    if (note.metadata.type === 'source') sources.add(id);
    else if (!parents.length) throw new Error(`Aucune source pour ${id}`);
    visiting.delete(id);
    used.set(id, { ...note, source_ids: parents });
  }
  refs.forEach(id => visit(byId.get(id)));
  if (!same(sourceRefs, [...sources])) throw new Error('source_refs doit correspondre aux fiches Source résolues depuis Knowledge.');
  return [...used.values()];
}

export async function loadContents(formation, formationPath, { knowledgeRoot = defaultKnowledge } = {}) {
  const contents = {}, errors = [];
  const moments = (formation.modules || []).flatMap(module => (module.moments_pedagogiques || []).map(moment => ({ module, moment })));
  const referenced = moments.filter(({ moment }) => moment.content_ref !== undefined || moment.knowledge_refs !== undefined);
  if (!referenced.length) return { contents, errors, valid: true };
  try {
    const root = await realpath(knowledgeRoot);
    if (fixture(root)) throw new Error('Patrimoine de fixtures interdit pour le contenu pédagogique.');
    const notes = await loadKnowledge(root);
    const directory = dirname(formationPath instanceof URL ? fileURLToPath(formationPath) : formationPath);
    for (const { module, moment } of referenced) {
      try {
        if (typeof moment.content_ref !== 'string' || !/^content\/[A-Za-z0-9_-]+\.md$/.test(moment.content_ref)) throw new Error('content_ref doit désigner un Markdown dans content/.');
        const base = await realpath(directory), file = await realpath(resolve(directory, moment.content_ref));
        if (!within(base, file) || fixture(file)) throw new Error('Contenu hors scénario ou fixture interdit.');
        const note = parseNote(await readFile(file, 'utf8')), m = note.metadata;
        if (m.moment_id !== moment.id || m.module_id !== module.id) throw new Error('moment_id/module_id incohérent.');
        if (!validDate(m.last_generated_from_knowledge)) throw new Error('Date last_generated_from_knowledge invalide.');
        if (!ids(moment.knowledge_refs) || !ids(m.knowledge_refs) || !same(moment.knowledge_refs, m.knowledge_refs)) throw new Error('knowledge_refs incohérentes entre moment et contenu.');
        const knowledge = resolveProvenance(m.knowledge_refs, m.source_refs, notes);
        contents[moment.id] = { ...note, path: moment.content_ref, knowledge };
      } catch (error) { errors.push({ moment_id: moment.id, message: error.message }); }
    }
  } catch (error) { referenced.forEach(({ moment }) => errors.push({ moment_id: moment.id, message: error.message })); }
  return { contents, errors, valid: errors.length === 0 };
}

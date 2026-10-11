import { readdir, readFile, lstat } from 'node:fs/promises';
import { join } from 'node:path';

export const knowledgeTypes = { concepts: 'concept', sources: 'source', cases: 'case', methods: 'method', tools: 'tool' };
export const normalize = text => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const stopWords = new Set('a au aux de des du le la les un une et ou en pour par sur dans ce ces cet cette quel quelle quels quelles est sont doit doivent que qui se il elle son sa ses avec sans plus comment faut'.split(' '));
const tokens = text => [...new Set(normalize(text).split(' ').filter(t => t.length > 1 && !stopWords.has(t)))];
export const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;

// Profil YAML V1 volontairement limité : propriétés plates, scalaires et listes.
// Les constructions non prises en charge échouent explicitement (pas de lecture approximative).
function scalar(raw) {
  const value = raw.trim();
  if (!value || value === 'null' || value === '~') return null;
  if (value.startsWith('"') || value.startsWith('[')) {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed) && !parsed.every(x => typeof x === 'string')) throw new Error('Liste de textes attendue.');
    return parsed;
  }
  if (value.startsWith("'")) {
    if (!/^'(?:[^']|'')*'$/.test(value)) throw new Error('Texte YAML mal fermé.');
    return value.slice(1, -1).replaceAll("''", "'");
  }
  if (/^[>|&*!{\]}%@`]/.test(value) || /:\s|\s#/.test(value)) throw new Error('YAML hors profil V1 : utiliser une chaîne entre guillemets.');
  if (value === 'true' || value === 'false') return value === 'true';
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

export function parseNote(text) {
  const lines = text.replace(/^\uFEFF/, '').replaceAll('\r\n', '\n').split('\n');
  if (lines[0] !== '---') throw new Error('Frontmatter obligatoire.');
  const end = lines.indexOf('---', 1);
  if (end < 0) throw new Error('Frontmatter non fermé.');
  const metadata = Object.create(null);
  let key;
  for (const line of lines.slice(1, end)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const item = /^\s+-\s+(.+)$/.exec(line);
    if (item) {
      if (!key || (metadata[key] !== null && !Array.isArray(metadata[key]))) throw new Error('Liste YAML incorrecte.');
      metadata[key] ||= [];
      const value = scalar(item[1]);
      if (typeof value !== 'string') throw new Error('Élément de liste textuel attendu.');
      metadata[key].push(value); continue;
    }
    const property = /^([a-z][a-z0-9_]*):(?:\s+(.*))?$/.exec(line);
    if (!property || Object.hasOwn(metadata, property[1])) throw new Error('Propriété YAML invalide, imbriquée ou dupliquée.');
    key = property[1]; metadata[key] = scalar(property[2] || '');
  }
  return { metadata, content: lines.slice(end + 1).join('\n') };
}

export async function loadKnowledge(root) {
  const notes = [], ids = new Set();
  // README, modèles et symlinks ne sont jamais indexés.
  for (const [directory, type] of Object.entries(knowledgeTypes)) {
    if ((await lstat(join(root, directory))).isSymbolicLink()) throw new Error(`Lien symbolique Knowledge non autorisé : ${directory}`);
    async function walk(path, relative) {
      for (const entry of (await readdir(path, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
        if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
        const file = join(path, entry.name), notePath = `${relative}/${entry.name}`;
        if (entry.isSymbolicLink()) throw new Error(`Lien symbolique Knowledge non autorisé : ${notePath}`);
        if (entry.isDirectory()) { await walk(file, notePath); continue; }
        if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name === 'README.md') continue;
        try {
          const note = parseNote(await readFile(file, 'utf8')), m = note.metadata;
          if (typeof m.id !== 'string' || !/^\S+$/.test(m.id) || typeof m.title !== 'string' || !m.title.trim() || m.type !== type) throw new Error('id, title et type valides obligatoires.');
          if (ids.has(m.id)) throw new Error(`ID Knowledge dupliqué : ${m.id}`);
          for (const field of ['tags', 'aliases', 'sources', 'lie_a', 'illustre', 'soutient', 'used_by']) {
            if (m[field] !== undefined && (!Array.isArray(m[field]) || !m[field].every(x => typeof x === 'string'))) throw new Error(`Liste attendue : ${field}`);
          }
          for (const field of ['verified_at', 'review_after', 'published_at', 'accessed_at']) {
            if (m[field] != null && !validDate(m[field])) throw new Error(`Date invalide : ${field}`);
          }
          if (m.confidence != null && !['faible', 'moyenne', 'forte'].includes(m.confidence)) throw new Error('Confiance invalide.');
          if (m.verified_at && m.review_after && m.review_after < m.verified_at) throw new Error('Échéance antérieure à la vérification.');
          ids.add(m.id); notes.push({ ...note, path: notePath });
        } catch (error) { throw new Error(`${notePath} : ${error.message}`); }
      }
    }
    await walk(join(root, directory), directory);
  }
  return notes;
}

export function freshness(note, { max_age_days = null, verification_usage = false } = {}, asOf = new Date().toISOString().slice(0, 10)) {
  if (!validDate(asOf)) throw new Error('Date de contrôle invalide.');
  const { verified_at = null, review_after = null } = note.metadata;
  const age = verified_at ? Math.floor((Date.parse(asOf) - Date.parse(verified_at)) / 86400000) : null;
  const expired = (review_after && review_after < asOf) || (age !== null && max_age_days !== null && age > max_age_days) || (verification_usage && age !== null && age > 0);
  const status = age !== null && age < 0 ? 'unknown' : expired ? 'stale' : age === null || (!review_after && max_age_days === null && !verification_usage) ? 'unknown' : 'fresh';
  return { status, verified_at, review_after, age_days: age, checked_at: asOf };
}

export function searchKnowledge(query, notes, requirement = {}, asOf) {
  const words = tokens(query);
  if (!words.length) return [];
  return notes.flatMap(note => {
    const m = note.metadata;
    const fields = { title: m.title, tags: (m.tags || []).join(' '), aliases: (m.aliases || []).join(' '), content: note.content };
    const reasons = [], weights = { title: 4, tags: 3, aliases: 3, content: 1 };
    let score = 0;
    for (const [field, value] of Object.entries(fields)) {
      const haystack = new Set(tokens(value)), matches = words.filter(word => haystack.has(word));
      if (matches.length) { reasons.push(`${field} : ${matches.join(', ')}`); score += weights[field] * matches.length; }
    }
    return score ? [{ knowledge_id: m.id, path: note.path, title: m.title, reasons, score, freshness: freshness(note, requirement, asOf), confidence: m.confidence ?? null }] : [];
  }).sort((a, b) => b.score - a.score || a.knowledge_id.localeCompare(b.knowledge_id));
}

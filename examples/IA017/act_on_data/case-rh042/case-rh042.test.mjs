import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat, realpath } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadKnowledge } from '../../../../core/knowledge.mjs';
import { fullProjection } from '../../../../adapters/vcoac/full-projection.mjs';

// Contrôles documentaires : lecture des vraies sources, aucun rendu ni mutation.
const base = fileURLToPath(new URL('./', import.meta.url));
const root = resolve(base, '../../../..');
const names = ['DOSSIER_PARTICIPANT_RH042.md', 'ACTIVITES_RH042.md',
  'CORRIGE_FORMATEUR_RH042.md', 'MATRICE_COHERENCE_RH042.md'];
const docs = Object.fromEntries(await Promise.all(names.map(async name =>
  [name, (await readFile(resolve(base, name), 'utf8')).replaceAll('\r\n', '\n')])));
const [entry, activityDoc, correctionDoc, matrix] = names.map(name => docs[name]);
const formation = JSON.parse(await readFile(resolve(base, '../formation.json'), 'utf8'));
const moments = formation.modules.flatMap(m => m.moments_pedagogiques);
const acting = moments.filter(m => m.fonctions_vcoac.includes('agir'));
const knowledge = await loadKnowledge(resolve(root, 'knowledge'));
const byKnowledgeId = new Map(knowledge.map(n => [n.metadata.id, n]));

function activities(text) {
  return [...text.matchAll(/^### Activité (\d+) — ([^\n]+)\n([\s\S]*?)(?=^## |^### Activité |$(?![\s\S]))/gm)]
    .map(m => ({ number: Number(m[1]), title: m[2], body: m[3] }));
}
function section(text, heading) {
  const start = text.indexOf(`## ${heading}\n`);
  assert.ok(start >= 0, heading);
  const end = text.indexOf('\n## ', start + 4);
  return text.slice(start, end < 0 ? undefined : end);
}
function field(body, label) {
  const marker = `**${label}**`;
  const start = body.indexOf(marker);
  assert.ok(start >= 0, label);
  const end = body.indexOf('\n**', start + marker.length);
  return body.slice(start + marker.length, end < 0 ? undefined : end).trim();
}
const tasks = activities(activityDoc);

test('RH-042 : chaque activité couvre un moment AGIR existant, dans son ordre et sa durée', () => {
  assert.deepEqual(tasks.map(t => t.number), acting.map((_, i) => i + 1));
  assert.equal(tasks.length, 7);
  for (const [i, task] of tasks.entries()) {
    const moment = acting[i];
    const id = field(task.body, 'Moment(s) VCOAC :').match(/AOD-M\d{2}-MP\d{2}/)?.[0];
    assert.equal(id, moment.id);
    assert.ok(field(task.body, 'Module :').includes(moment.id.slice(0, 7)));
    const duration = field(task.body, 'Durée :').match(/(\d+) minutes de pratique ; moment de (\d+) minutes/);
    assert.ok(duration, moment.id);
    assert.deepEqual(duration.slice(1).map(Number), [moment.pratique_minutes, moment.duree_minutes]);
    const steps = [...field(task.body, 'Travail demandé').matchAll(/^\d+\. \*\*(\d+) min/gm)];
    assert.equal(steps.reduce((n, m) => n + Number(m[1]), 0), moment.pratique_minutes, id);
    for (const label of ['Organisation :', 'Situation', 'Votre mission', 'Ressources disponibles',
      'Production attendue', 'À remettre / présenter']) assert.ok(field(task.body, label).length > 20);
    const criteria = field(task.body, 'Critères de réussite').match(/^- /gm) || [];
    assert.ok(criteria.length >= 2 && criteria.length <= 5, id);
  }
  assert.equal(acting.reduce((n, m) => n + m.pratique_minutes, 0), 250);
  assert.equal(acting.reduce((n, m) => n + m.duree_minutes, 0), 255);
});

test('RH-042 : matrice exhaustive des 18 moments, fonctions et durées sans double compte', () => {
  const coverage = section(matrix, 'Couverture des 18 moments, sans exercices ajoutés');
  const rows = [...coverage.matchAll(/^\| (AOD-M\d{2}-MP\d{2}) \| ([^|]+) \| (\d+) \/ (\d+) min \|/gm)];
  assert.deepEqual(rows.map(r => r[1]), moments.map(m => m.id));
  for (const [i, row] of rows.entries()) {
    assert.deepEqual(row[2].trim().toLowerCase().split(' + '), moments[i].fonctions_vcoac);
    assert.deepEqual(row.slice(3).map(Number), [moments[i].duree_minutes, moments[i].pratique_minutes]);
  }
  assert.equal(rows.reduce((n, r) => n + Number(r[3]), 0), 390);
  assert.equal(rows.reduce((n, r) => n + Number(r[4]), 0), 250);
  const activityRows = section(matrix, 'Matrice des activités').split('\n')
    .filter(line => /^\| \d+ — /.test(line)).map(line => line.split('|').slice(1, -1).map(s => s.trim()));
  assert.equal(activityRows.length, tasks.length);
  for (const [i, row] of activityRows.entries()) {
    assert.equal(row[3], acting[i].id);
    assert.equal(row[4], `${acting[i].pratique_minutes} / ${acting[i].duree_minutes} min`);
    const competency = row[1].match(/AOD-C\d{2}/)?.[0];
    assert.ok(formation.modules.find(m => m.id === row[2]).competences.includes(competency));
    assert.ok(row[5].length > 10 && row[6].length > 5 && row[7].startsWith('Oui'));
  }
});

test('RH-042 : toutes les ressources liées existent et restent hors des fixtures de test', async () => {
  const canonicalRoot = await realpath(root);
  for (const [name, text] of Object.entries(docs)) {
    assert.doesNotMatch(text, /tests[\\/]fixtures|\bT-(?:CAS|CON|MET|OUT|SRC)-\d+\b/i, name);
    for (const [, label, href] of text.matchAll(/\[([^\]\n]+)\]\(([^)\n]+)\)/g)) {
      assert.doesNotMatch(href, /^[a-z]+:/i, `Ressource externe inattendue : ${href}`);
      const target = resolve(dirname(resolve(base, name)), decodeURIComponent(href.split('#')[0]));
      assert.ok((await stat(target)).isFile(), `${name} : ${href}`);
      const canonicalTarget = await realpath(target);
      const fromRoot = relative(canonicalRoot, canonicalTarget);
      assert.ok(fromRoot !== '..' && !fromRoot.startsWith(`..${sep}`), href);
      assert.doesNotMatch(fromRoot, /tests[\\/]fixtures/i, href);
      if (/^(?:CON|MET|CAS|OUT|SRC)-/.test(label)) {
        const note = byKnowledgeId.get(label);
        assert.ok(note, `Identifiant Knowledge introuvable : ${label}`);
        assert.equal(canonicalTarget, await realpath(resolve(root, 'knowledge', note.path)));
      }
    }
  }
});

test('RH-042 : outils et cas pédagogiques résolus dans la Knowledge de production', () => {
  const ids = new Set(Object.values(docs).join('\n').match(/\b(?:CON|MET|CAS|OUT|SRC)-[A-Z0-9-]+\b/g));
  for (const id of ids) assert.ok(byKnowledgeId.has(id), id);
  const tools = ['MET-GRILLE-CONCEPTION-AGENT', 'MET-CONNEXION-MCP', 'MET-GRILLE-RISQUE-IA',
    'MET-REVUE-RH', 'MET-VALEUR-WORKFLOW', 'MET-CHOIX-ORCHESTRATION', 'OUT-N8N-DEMO-FICTIVE'];
  for (const id of tools) {
    assert.ok(ids.has(id), id);
    assert.ok(['method', 'tool'].includes(byKnowledgeId.get(id).metadata.type), id);
  }
  for (const id of ['CAS-RH042-ATELIER', 'CAS-RH-MCP-FICTIF', 'CAS-RH-REPONSE-FICTIF']) {
    assert.equal(byKnowledgeId.get(id).metadata.case_nature, 'fictif');
    assert.ok(ids.has(id));
  }
});

test('RH-042 : sept corrections complètes et entrée sans valeurs ni incident anticipés', () => {
  const corrections = activities(correctionDoc);
  assert.deepEqual(corrections.map(c => [c.number, c.title]), tasks.map(t => [t.number, t.title]));
  for (const correction of corrections) {
    for (const label of ['Intention pédagogique', 'Éléments attendus', 'Erreurs fréquentes',
      'Questions de débrief', 'Principe de correction', 'Knowledge utilisée', 'Transition vers l’activité suivante']) {
      // Les documents emploient l'apostrophe ASCII dans les titres.
      assert.ok(field(correction.body, label.replace('’', "'")).length > 30);
    }
    assert.match(correction.body, /\*\*Exemple de production correcte/);
    assert.match(correction.body, /\.\.\/\.\.\/\.\.\/\.\.\/knowledge\//);
  }
  assert.match(entry, /CAS FICTIF/);
  assert.doesNotMatch(entry, /\b(?:8|9)\s*(?:jours|affich|sugg)|D1|D2|D3|RH-099|compte de chat personnel|20\s*%/);
  const episodes = [...activityDoc.matchAll(/^## Nouvelle information — RH-042 \/ épisode (\d)/gm)];
  assert.deepEqual(episodes.map(m => Number(m[1])), [1, 2, 3, 4]);
});

test('RH-042 : correspondances des sept consignes avec la projection VCOAC existante', () => {
  const table = section(matrix, 'Matrice des activités');
  const references = [...table.matchAll(/(\d+) — (AOD-M\d{2}-MP\d{2}-\d{2})/g)];
  const workshops = fullProjection.filter(s => s.screen.type === 'CONSIGNE_ATELIER');
  assert.deepEqual(references.map(r => r[2]), workshops.map(s => s.slide_id));
  assert.deepEqual(workshops.map(s => s.moment_id), acting.map(m => m.id));
  for (const reference of references) {
    const slide = fullProjection[Number(reference[1]) - 1];
    assert.equal(slide.slide_id, reference[2]);
    assert.equal(slide.phase, 'AGIR');
  }
});

test('RH-042 finalisé : compteur introduit après la pratique M1, choix du cas et démo n8n résolus', async () => {
  const m1 = await readFile(resolve(base, '../content/AOD-M01-MP03.md'), 'utf8');
  const beforeConsolidation = m1.split('## CONSOLIDER')[0];
  assert.doesNotMatch(beforeConsolidation, /\b(?:8|9)\b/);
  assert.match(m1.split('## CONSOLIDER')[1], /8 affichés, 9 suggérés/);
  for (const id of ['AOD-M02-MP02','AOD-M02-MP03','AOD-M02-MP04','AOD-M02-MP05','AOD-M02-MP06']) {
    const text = await readFile(resolve(base, `../content/${id}.md`), 'utf8');
    assert.doesNotMatch(text, /futur cas|pas un dossier de TP choisi|cas qui sera retenu|validation du dossier.*encore requise|doit encore valider/);
  }
  const n8n = moments.find(m=>m.id==='AOD-M02-MP01').contenu_prevu.join('\n');
  assert.doesNotMatch(n8n, /envisagée|à confirmer/);
  assert.match(n8n, /12 octobre 2026/);
  assert.match(n8n, /test A.*8.*9.*PASS/);
  assert.match(n8n, /test B.*8\/8.*PASS/);
  assert.match(n8n, /uniquement sur ces deux tests/);
  assert.equal(formation.hypotheses.find(h=>h.id==='AOD-H04').a_valider, false);
  assert.doesNotMatch(formation.decisions_a_valider.find(d=>d.id==='AOD-D02').recommandation, /reste à|avant utilisation|à obtenir/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access, mkdtemp, mkdir, writeFile, rm, copyFile } from 'node:fs/promises';
import { join, resolve, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { generate, repository, scenarioPath, writeArtifacts } from './generate.mjs';
import { generateFull, fullStem, fullSources, validateReadiness } from './generate-full.mjs';
import { fullProjection } from './full-projection.mjs';
import { loadContents } from '../../core/content.mjs';
import { parseNote } from '../../core/knowledge.mjs';
import { projectSlides, sectionsOf, safeRead, json } from './project.mjs';
import { loadMachine, validateSpec, sha256 } from './machine.mjs';

const formation = JSON.parse(await readFile(join(repository, scenarioPath, 'formation.json'), 'utf8'));
const readiness = JSON.parse(await readFile(join(repository, scenarioPath, 'readiness.json'), 'utf8'));
const loaded = await loadContents(formation, join(repository, scenarioPath, 'formation.json'));
assert.equal(loaded.valid, true);
const sources = fullSources(formation, loaded.contents, await readFile(join(repository, scenarioPath, 'conduite-session.md'), 'utf8'));
const machine = await loadMachine(join(repository, 'references/machine_vcoac/local/machine_vcoac'));
const result = await generateFull();
const project = editorial => projectSlides(editorial, sources);
const expectedIds = formation.modules.flatMap(m => m.moments_pedagogiques.map(p => p.id));

async function temporary(t) {
  const directory = await mkdtemp(join(tmpdir(), 'hector-vcoac-full-'));
  t.after(() => {
    assert.equal(dirname(resolve(directory)), resolve(tmpdir()));
    assert.ok(basename(directory).startsWith('hector-vcoac-full-'));
    return rm(directory, { recursive: true, force: true });
  });
  return directory;
}

test('VCOAC complet : 18 moments dans l’ordre, toutes fonctions, 420 min dont 250 de pratique', () => {
  assert.equal(result.spec.slides.length, 42);
  assert.deepEqual(result.intermediate.modules.map(m => m.slides), [5, 17, 10, 8]);
  assert.deepEqual(result.intermediate.moments.map(m => m.moment_id), expectedIds);
  assert.deepEqual(result.validation.hector.covered_moments, expectedIds);
  assert.equal(new Set(expectedIds).size, 18);
  assert.equal(new Set(result.intermediate.slides.map(s => s.slide_id)).size, 42);
  assert.equal(result.intermediate.duration_minutes, 420);
  assert.equal(result.intermediate.practice_minutes, 250);
  assert.equal(result.intermediate.moments.reduce((n, m) => n + m.duration_minutes, 0), 390);
  assert.equal(result.intermediate.timing.segments.reduce((n, m) => n + m.minutes, 0), 420);
  for (const moment of result.intermediate.moments) {
    const phases = result.intermediate.slides.filter(s => s.moment_id === moment.moment_id).map(s => s.phase);
    assert.deepEqual([...new Set(phases)], moment.functions);
  }
});

test('VCOAC complet : Module 2 et ses quatre artefacts strictement identiques au pilote de référence', async () => {
  const pilot = await generate();
  const m2 = result.intermediate.slides.filter(s => s.module_id === 'AOD-M02');
  const extracted = m2.map(s => result.spec.slides[s.machine_index - 1]);
  assert.deepEqual(extracted, pilot.spec.slides);
  assert.equal(sha256(JSON.stringify(pilot)), 'a3e44b20c269fb315e63937740aeea1f3c74bba3120b5faa9050e91582b5a5fe');
  assert.equal(sha256(JSON.stringify(extracted)), '21f9e9d97667704864b446bf571b7440895cb63518f7e8b20b26660602872918');
  for (const slide of m2) {
    const { module_id, machine_index, ...actual } = slide;
    const { machine_index: pilotIndex, ...expected } = pilot.intermediate.slides.find(s => s.slide_id === slide.slide_id);
    assert.deepEqual(actual, expected);
  }
});

test('VCOAC complet : chaque section source est intégrale dans les notes et son empreinte correspond', async () => {
  for (const [id, source] of Object.entries(sources)) {
    const slides = result.intermediate.slides.filter(s => (s.moment_id || s.source_id) === id);
    for (const section of source.sections) {
      const carriers = slides.filter(s => s.provenance.some(p => p.file === source.file && p.section === section.heading && p.sha256 === sha256(section.text)));
      assert.ok(carriers.length, `${id} / ${section.heading}`);
      assert.ok(carriers.some(s => s.trainer_notes.essentiel.some(n => n.includes(section.text.trim()))));
    }
  }
  for (const slide of result.intermediate.slides) {
    for (const p of slide.provenance) {
      const raw = await readFile(join(repository, p.file), 'utf8');
      const content = p.file.includes('/content/') ? parseNote(raw).content : raw;
      const section = sectionsOf(content).find(s => s.heading === p.section);
      assert.ok(section, p.section);
      assert.equal(sha256(section.text), p.sha256);
    }
    assert.deepEqual(result.spec.slides[slide.machine_index - 1].notes, slide.trainer_notes);
  }
  assert.equal(result.intermediate.decisions[0].selected, 'B');
});

test('VCOAC complet : une consigne par activité et minutes de pratique jamais multipliées', () => {
  const workshops = result.intermediate.slides.filter(s => s.fields.type === 'CONSIGNE_ATELIER');
  assert.equal(workshops.length, 7);
  for (const moment of result.intermediate.moments.filter(m => m.functions.includes('AGIR'))) {
    const slides = workshops.filter(s => s.moment_id === moment.moment_id);
    assert.equal(slides.length, 1);
    assert.equal(slides[0].fields.etapes.reduce((n, step) => n + Number(step.match(/^\d+/)[0]), 0), moment.practice_minutes);
    assert.match(slides[0].trainer_notes.essentiel.join('\n'), /correction|corrigé/i);
  }
});

test('VCOAC complet : reprises entre modules adjacents et cadre commun sans faux moment', () => {
  assert.deepEqual(result.intermediate.framing_slides, ['AOD-OUVERTURE-01', 'AOD-CLOTURE-01']);
  assert.equal(result.spec.slides[0].type, 'PROGRAMME');
  assert.equal(result.spec.slides.at(-1).type, 'BILAN');
  for (const t of result.intermediate.transitions) {
    const a = result.intermediate.slides.find(s => s.slide_id === t.source_slide);
    const b = result.intermediate.slides.find(s => s.slide_id === t.target_slide);
    assert.equal(a.module_id, t.from); assert.equal(b.module_id, t.to);
    assert.equal(a.machine_index + 1, b.machine_index);
    assert.match(a.fields.prochaineEtape, /M2|données|M4/);
    assert.match(JSON.stringify(b.fields), /RH-042|contrôle|n8n/);
  }
});

test('VCOAC complet : contrat natif réel, zéro warning, aucune référence d’asset et pas de rendu', () => {
  assert.equal(validateSpec(result.spec, machine).valid, true);
  assert.equal(result.validation.native_contract.slides_checked, 42);
  assert.deepEqual(result.validation.native_contract.warnings, []);
  assert.deepEqual(result.validation.hector.errors, []);
  assert.deepEqual(result.validation.assets_required, []);
  assert.equal(result.validation.render_executed, false);
  const bad = structuredClone(result.spec);
  bad.slides[0].colonnes[0].modules[0].titre = 'x'.repeat(41);
  assert.ok(validateSpec(bad, machine).nativeWarnings.some(w => /41 car. > 40/.test(w.message)));
  bad.slides[0].logo = 'missing.png';
  assert.ok(validateSpec(bad, machine).errors.some(e => /ASSET_REQUIRED/.test(e)));
});

test('VCOAC complet : liens du mapping, Knowledge et sources résolus, zéro fixture', async () => {
  // Les extraits sources sont littéraux dans des blocs de code : leurs liens
  // se résolvent depuis le document d'origine, pas depuis le rapport généré.
  const renderedMarkdown = result.mapping.replace(/```[\s\S]*?```/g, '');
  const links = [...renderedMarkdown.matchAll(/\]\(\.\.\/\.\.\/([^\)]+)\)/g)].map(m => m[1]);
  assert.ok(links.length > 100);
  for (const file of new Set([...links, ...Object.keys(result.intermediate.source_fingerprints)])) {
    assert.doesNotMatch(file, /(^|[\\/])(tests|fixtures)([\\/]|$)/i);
    await access(join(repository, file));
  }
  const index = new Map(result.intermediate.knowledge.map(n => [n.id, n]));
  for (const note of index.values()) {
    assert.doesNotMatch(note.id, /^T-/);
    for (const id of note.sources) assert.ok(index.has(id));
  }
  for (const slide of result.intermediate.slides.filter(s => s.moment_id)) {
    assert.ok(slide.knowledge_refs.length && slide.source_refs.length);
    for (const id of [...slide.knowledge_refs, ...slide.source_refs]) assert.ok(index.has(id), id);
  }
  for (const source of Object.values(sources)) {
    for (const match of source.sections.map(s => s.text).join('\n').matchAll(/\]\(([^)]+)\)/g)) {
      if (!/^(https?:|#)/.test(match[1])) await access(resolve(repository, dirname(source.file), match[1].split('#')[0]));
    }
  }
  await assert.rejects(safeRead(repository, 'tests/fixtures/knowledge/tools/T-OUT-001.md'), /Fixture interdite/);
});

test('VCOAC complet : sources manquantes ou altérées refusées avant toute projection', async t => {
  const directory = await temporary(t);
  const [file] = Object.keys(result.intermediate.source_fingerprints);
  await assert.rejects(generateFull({ root: directory }), /ENOENT/);
  await mkdir(dirname(join(directory, file)), { recursive: true });
  await copyFile(join(repository, file), join(directory, file));
  await writeFile(join(directory, file), 'Source pédagogique altérée.');
  await assert.rejects(generateFull({ root: directory }), /Source modifiée/);
});

test('VCOAC complet : mauvaise section, ID, fonction, ordre ou moment absent refusés', () => {
  for (const mutate of [
    e => { e[1].sections = ['Section inventée']; },
    e => { e[1].slide_id = e[2].slide_id; },
    e => { e[1].phase = 'AGIR'; },
    e => { [e[1], e[3]] = [e[3], e[1]]; },
    e => { e.splice(e.findIndex(s => s.moment_id === 'AOD-M03-MP03'), 1); },
    e => { e.splice(2, 1); },
    e => { e[1].notes.essentiel = ['Résumé qui écraserait la source']; },
  ]) {
    const bad = structuredClone(fullProjection); mutate(bad);
    assert.throws(() => project(bad));
  }
});

test('VCOAC complet : READY ne peut masquer une omission, un contenu changé ou une durée incohérente', () => {
  for (const mutate of [
    r => { r.modules[0].moments[0].status = 'PARTIAL'; },
    r => { r.modules[2].moments.pop(); },
    r => { r.modules[0].moments[0].content_ref = 'content/FAUX.md'; },
    r => { r.modules.reverse(); },
    r => { r.timing.outside_minutes = 0; },
    r => { r.remaining_blockers.push('Blocage non levé'); },
  ]) {
    const bad = structuredClone(readiness); mutate(bad);
    assert.throws(() => validateReadiness(formation, bad));
  }
});

test('VCOAC complet : calculs restent fictifs et recherche client explicitement ouverte', () => {
  const numbers = result.spec.slides.find(s => s.titre === 'Le gain complet inclut revue et reprises');
  assert.match(numbers.aRetenir, /CHIFFRES FICTIFS/);
  assert.match(numbers.b.points.join(' '), /4 min, soit 20 %/);
  assert.match(numbers.notes.reponse, /120 min.*30 dossiers/);
  assert.deepEqual([result.validation.research.covered, result.validation.research.total], [7, 8]);
  assert.equal(result.validation.research.open[0].status, 'external_research_needed');
  assert.match(result.validation.research.open[0].scope, /Transfert réel/);
});

test('VCOAC complet : spec et rapports déterministes, projection non revue refusée', async () => {
  assert.deepEqual(await generateFull(), result);
  assert.equal(result.validation.spec_sha256, sha256(json(result.spec)));
  const changed = structuredClone(fullProjection);
  changed[1].screen.cartes[0].corps = 'Un gain client établi.';
  await assert.rejects(generateFull({ editorial: changed }), /revue éditoriale requise/);
});

test('VCOAC complet : écriture des quatre artefacts sans toucher aux sorties du pilote', async t => {
  const directory = await temporary(t);
  const pilotFile = join(directory, 'IA017-act-on-data-module2.json');
  await writeFile(pilotFile, 'sortie pilote conservée');
  await writeArtifacts(result, directory, fullStem);
  assert.equal(await readFile(pilotFile, 'utf8'), 'sortie pilote conservée');
  for (const [suffix, expected] of [['.json', json(result.spec)], ['-intermediate.json', json(result.intermediate)], ['-validation.json', json(result.validation)], ['-mapping.md', result.mapping]]) {
    assert.equal(await readFile(join(directory, fullStem + suffix), 'utf8'), expected);
  }
});

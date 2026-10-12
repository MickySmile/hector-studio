import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, basename, resolve } from 'node:path';
import { generate, repository, sectionsOf, scenarioPath } from './generate.mjs';
import { loadMachine, validateSpec, sha256 } from './machine.mjs';
import { projection, criteria, screenCriteria } from './projection.mjs';

const machineRoot = join(repository, 'references/machine_vcoac/local/machine_vcoac');
const machine = await loadMachine(machineRoot);
const result = await generate();
const moments = Array.from({ length: 6 }, (_, i) => `AOD-M02-MP0${i + 1}`);
const check = spec => validateSpec(spec, machine);

test('Adaptateur VCOAC : Module 2 seul, six moments et toutes leurs fonctions, temps non multiplié', () => {
  assert.equal(result.spec.slides.length, 17);
  assert.deepEqual(result.intermediate.moments.map(m => m.moment_id), moments);
  assert.equal(result.intermediate.duration_minutes, 140);
  assert.equal(result.intermediate.practice_minutes, 90);
  assert.equal(result.intermediate.moments.reduce((n, m) => n + m.duration_minutes, 0), 140);
  assert.deepEqual(result.spec.slides.slice(0, 2).map(s => s.phase), ['VOIR', 'COMPRENDRE']);
  for (const s of result.intermediate.slides) assert.ok(moments.includes(s.moment_id));
  for (const m of result.intermediate.moments.filter(m => /MP0[45]$/.test(m.moment_id))) assert.equal(m.slides.length, 1);
});

test('Adaptateur VCOAC : sources intégrales conservées dans les notes et fragments traçables', async () => {
  for (const id of moments) {
    const raw = await readFile(join(repository, scenarioPath, `content/${id}.md`), 'utf8');
    const sourceSections = sectionsOf(raw);
    const slides = result.intermediate.slides.filter(s => s.moment_id === id);
    for (const section of sourceSections) {
      const carriers = slides.filter(s => s.provenance.some(p => p.section === section.heading && p.sha256 === sha256(section.text)));
      assert.ok(carriers.length, `${id} / ${section.heading}`);
      assert.ok(carriers.some(s => s.trainer_notes.essentiel.some(n => n.includes(section.text.trim()))));
    }
    for (const s of slides) {
      assert.ok(s.provenance.every(p => p.file === `${scenarioPath}content/${id}.md`));
      assert.ok(s.knowledge_refs.length && s.source_refs.length);
    }
  }
});

test('Adaptateur VCOAC : aucun texte ajouté à une projection sans nouvelle revue', async () => {
  const changed = structuredClone(projection);
  changed[0].screen.cartes[0].corps = 'Le test donne 100 % de conformité RH.';
  await assert.rejects(generate({ editorial: changed }), /Projection éditoriale modifiée/);
  const unknown = structuredClone(projection);
  unknown[0].sections = ['Une source inventée'];
  await assert.rejects(generate({ editorial: unknown }), /revue P4/);
});

test('Adaptateur VCOAC : six questions MCP et six rubriques du canvas, sans perte', () => {
  const sheets = result.spec.slides.filter(s => s.type === 'FICHE_OUTIL');
  const questions = sheets.filter(s => s.titre.startsWith('Grille MCP')).flatMap(s => s.champs.map(c => c.consigne));
  assert.deepEqual(questions, ['Quel résultat exige un accès externe ?', 'Pourquoi MCP pour ce besoin ?', 'Les deux côtés savent-ils échanger ?', 'Qui peut lire et qui peut agir ?', 'Quelle décision exige un humain ?', 'Comment vérifier et arrêter ?']);
  assert.deepEqual(sheets.filter(s => s.titre.startsWith('Canvas')).flatMap(s => s.champs.map(c => c.nom)), ['Objectif', 'Contexte', 'Actions', 'Boucle / trajet', 'Limites', 'Contrôle']);
});

test('Adaptateur VCOAC : quatre critères C02 et cinq étapes conservés dans chacun des ateliers', () => {
  for (const [id, minutes] of [['MP04', 60], ['MP05', 30]]) {
    const slides = result.spec.slides.filter(s => s.section.startsWith(`AOD-M02-${id}`));
    assert.equal(slides.length, 1);
    assert.deepEqual(slides[0].criteres, screenCriteria);
    for (const criterion of criteria) assert.ok(slides[0].notes.reponse.includes(criterion));
    for (const s of slides) {
      assert.equal(s.etapes.length, 5);
      assert.equal(s.etapes.reduce((n, step) => n + Number(step.match(/^\d+/)[0]), 0), minutes);
    }
    const notes = slides.flatMap(s => s.notes.essentiel).join('\n');
    assert.match(notes, /Principe de correction/);
    assert.match(notes, /référence|révision attendue/);
  }
});

test('Adaptateur VCOAC : deux branches n8n validées, aucun compteur RH assimilé au test', () => {
  const observation = result.spec.slides[0];
  assert.equal(observation.cartes[1].corps, 'FALSE → Dossier incomplet — PASS');
  assert.equal(observation.cartes[2].corps, 'TRUE → Dossier complet — PASS');
  assert.match(observation.notes.essentiel.join('\n'), /Version exacte, captures et export non transmis/);
  assert.match(result.spec.slides[1].notes.essentiel.join('\n'), /sans confondre/);
});

test('Adaptateur VCOAC : contrôleur natif réel, types et longueurs respectés', () => {
  assert.equal(check(result.spec).valid, true);
  assert.deepEqual(result.validation.native_contract.warnings, []);
  assert.equal(result.validation.native_contract.slides_checked, 17);
  assert.equal(result.validation.render_executed, false);
  for (const s of result.spec.slides) assert.ok(machine.composers.has(s.type));
  const broken = structuredClone(result.spec);
  broken.slides[0].cartes[0].corps = 'x'.repeat(111);
  assert.ok(check(broken).nativeWarnings.some(w => w.message.includes('111 car. > 110')));
  broken.slides[0].type = 'INVENTE';
  assert.ok(check(broken).nativeWarnings.some(w => /type inconnu/.test(w.message)));
});

test('Adaptateur VCOAC : champs et notes mal typés, clés inconnues et mauvaise phase refusés', () => {
  for (const mutate of [
    s => { s.slides[0].notes.essentiel = 'texte seul'; },
    s => { s.slides[0].cartes[0].titre = 42; },
    s => { s.slides[0].champInvente = 'secret'; },
    s => { s.slides[0].phase = 'AGIR'; },
    s => { delete s.slides[0].notes; },
  ]) {
    const bad = structuredClone(result.spec); mutate(bad);
    assert.equal(check(bad).valid, false);
  }
});

test('Adaptateur VCOAC : zéro asset, aucun chemin inexistant accepté', () => {
  assert.deepEqual(result.validation.assets_required, []);
  const bad = structuredClone(result.spec); bad.slides[0].image = 'capture-inventee.png';
  assert.equal(check(bad).valid, false);
  assert.ok(check(bad).errors.some(e => e.includes('ASSET_REQUIRED')));
  assert.ok(result.validation.hector.conservative_word_counts.every(s => s.conservative_words <= s.max));
});

test('Adaptateur VCOAC : spec et rapports déterministes, sans dépendance aux fixtures', async () => {
  const second = await generate();
  assert.deepEqual(second, result);
  for (const file of Object.keys(result.intermediate.source_fingerprints)) {
    assert.doesNotMatch(file, /(^|\/)(tests|fixtures)(\/|$)/i);
    assert.doesNotMatch(file, /content\/AOD-M0[134]/);
  }
  for (const s of result.intermediate.slides) assert.ok(s.knowledge_refs.every(id => !id.startsWith('T-')));
});

test('Adaptateur VCOAC : changement de machine refusé avant exécution du contrôleur', async t => {
  const folder = await mkdtemp(join(tmpdir(), 'hector-vcoac-machine-'));
  t.after(() => {
    assert.equal(dirname(resolve(folder)), resolve(tmpdir()));
    assert.ok(basename(folder).startsWith('hector-vcoac-machine-'));
    return rm(folder, { recursive: true, force: true });
  });
  await writeFile(join(folder, 'build_template.js'), 'throw new Error("ne doit pas être exécuté");');
  await assert.rejects(loadMachine(folder), /Machine modifiée/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { validateFormation, validateFormationFile, compareDurations } from './validate-formation.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const cli = fileURLToPath(new URL('./validate-formation.mjs', import.meta.url));
const fixturePath = scenario => join(root, 'examples', 'IA017', scenario, 'formation.json');
const original = JSON.parse(await readFile(fixturePath('program_only'), 'utf8'));
const copy = () => structuredClone(original);
const validate = data => validateFormation(data, { formationPath: fixturePath('program_only') });
const has = (report, code) => report.checks.some(check => check.code === code);
function freeze(value) {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
async function temporary(t) {
  const directory = await mkdtemp(join(tmpdir(), 'hector-validator-'));
  const created = [];
  t.after(async () => {
    // Seulement les fichiers créés par ce test ; aucune suppression récursive.
    for (const file of created) await unlink(file);
    await rmdir(directory);
  });
  return { directory, async write(name, text) {
    const path = join(directory, name);
    await writeFile(path, text, 'utf8'); created.push(path); return path;
  } };
}

for (const scenario of ['program_only', 'act_on_data']) {
  test(`fixture ${scenario} valide, sources présentes et écart +15 sans mutation`, async () => {
    const path = fixturePath(scenario), before = await readFile(path);
    const data = freeze(JSON.parse(before.toString('utf8')));
    const report = await validateFormation(data, { formationPath: path });
    assert.equal(report.valid, true);
    assert.deepEqual(report.errors, []);
    assert.equal(report.checks.filter(check => check.code === 'source_exists').length, data.sources.length);
    assert.equal(report.warnings.length, 1);
    const warning = report.warnings[0];
    assert.equal(warning.code, 'duration_mismatch');
    assert.equal(warning.details.officialMinutes, 420);
    assert.equal(warning.details.detailedMinutes, 435);
    assert.equal(warning.details.deltaMinutes, 15);
    assert.equal(warning.details.officialPath, '/meta/duree_minutes');
    assert.equal(warning.details.detailedPath, '/meta/duree_detaillee_minutes');
    for (const check of report.checks) {
      assert.equal(typeof check.code, 'string');
      assert.equal(typeof check.message, 'string');
      assert.ok(['error','warning','info'].includes(check.severity));
    }
    assert.deepEqual(await readFile(path), before);
    assert.deepEqual(data, JSON.parse(before.toString('utf8')));
  });
}

for (const name of ['sources', 'hypotheses', 'personas', 'gap', 'competences', 'alertes', 'decisions_a_valider']) {
  test(`identifiant dupliqué dans ${name}`, async () => {
    const data = copy();
    data[name].push({ ...structuredClone(data[name][0]), note: 'Objet différent avec le même ID' });
    const report = await validate(data);
    assert.equal(report.valid, false);
    assert.ok(has(report, 'duplicate_id'));
  });
}

test('dépendance inexistante', async () => {
  const data = copy(); data.competences[0].dependances = ['inexistante'];
  const report = await validate(data);
  assert.equal(report.valid, false); assert.ok(has(report, 'unknown_dependency'));
});
test('dépendance vers soi-même', async () => {
  const data = copy(); data.competences[0].dependances = [data.competences[0].id];
  assert.ok(has(await validate(data), 'self_dependency'));
});
test('cycle indirect avec chemin explicite', async () => {
  const data = copy(); data.competences[0].dependances = [data.competences[2].id];
  const report = await validate(data);
  const cycle = report.errors.find(check => check.code === 'competence_cycle');
  assert.ok(cycle);
  assert.deepEqual(cycle.details.cycle, ['PO-C01','PO-C03','PO-C02','PO-C01']);
});
test('graphe en diamant sans faux cycle', async () => {
  const data = copy(); data.competences[2].dependances = ['PO-C01'];
  data.competences[3].dependances = ['PO-C02','PO-C03'];
  assert.equal((await validate(data)).valid, true);
});

for (const niveau of ['novice','intermediaire','avance']) {
  test(`persona ${niveau} manquant malgré trois profils`, async () => {
    const data = copy(); data.personas.find(p => p.niveau === niveau).niveau = niveau === 'novice' ? 'avance' : 'novice';
    const report = await validate(data);
    assert.equal(report.valid, false);
    assert.ok(report.errors.some(check => check.code === 'missing_persona' && check.details.niveau === niveau));
  });
}
for (const cible of [39,71]) {
  test(`pratique hors bornes : ${cible}`, async () => {
    const data = copy(); data.pratique.cible_pourcentage = cible;
    assert.ok(has(await validate(data), 'practice_out_of_bounds'));
  });
}
test('bornes inversées et bornes V1 non respectées', async () => {
  const data = copy(); data.pratique.minimum_souhaite = 80; data.pratique.maximum_souhaite = 30;
  const report = await validate(data);
  assert.ok(has(report, 'invalid_practice_bounds')); assert.ok(has(report, 'schema_const'));
});
test('bornes inclusives et pourcentage décimal', async () => {
  for (const cible of [40,55.5,70]) {
    const data = copy(); data.pratique.cible_pourcentage = cible;
    assert.equal((await validate(data)).valid, true);
  }
});

test('source locale inexistante', async t => {
  const temp = await temporary(t), data = copy();
  data.sources[0].fichier = './absente.pdf';
  const report = await validateFormation(data, { formationPath: join(temp.directory, 'formation.json'), projectRoot: temp.directory });
  assert.equal(report.valid, false); assert.ok(has(report, 'source_missing'));
});
test('source résolue relativement au fichier de formation et dossier refusé', async t => {
  const temp = await temporary(t), data = copy();
  await temp.write('source.md', 'Source temporaire.');
  data.sources[0].fichier = './source.md';
  const options = { formationPath: join(temp.directory, 'formation.json'), projectRoot: temp.directory };
  assert.ok(has(await validateFormation(data, options), 'source_exists'));
  data.sources[0].fichier = '.';
  assert.ok(has(await validateFormation(data, options), 'source_not_file'));
});
test('sources distante et hors projet signalées sans accès réseau', async () => {
  const data = copy(); data.sources[0].fichier = 'https://example.invalid/source.pdf';
  assert.ok(has(await validate(data), 'source_remote_unchecked'));
  data.sources[0].fichier = resolve(root, '..', 'source-externe.pdf');
  assert.ok(has(await validate(data), 'source_outside_project'));
});
test('base manquante pour les sources relatives signalée', async () => {
  assert.ok(has(await validateFormation(copy()), 'source_base_missing'));
});

test('JSON invalide et fichier illisible donnent des résultats structurés', async t => {
  const temp = await temporary(t);
  const path = await temp.write('invalide.json', '{ incorrect');
  assert.ok(has(await validateFormationFile(path), 'json_invalid'));
  assert.ok(has(await validateFormationFile(join(temp.directory, 'absent.json')), 'json_unreadable'));
});
test('section manquante et entrées mal typées sans exception', async () => {
  for (const data of [null, [], 'texte', {}, { ...copy(), competences: [null, 12] }, { ...copy(), cadrage: null }]) {
    assert.equal((await validate(data)).valid, false);
  }
});
test('contraintes du schéma : champs, types, listes, enums, dates et références', async () => {
  const mutations = [
    d => { delete d.meta.id; },
    d => { d.meta.titre = ' '; },
    d => { d.hypotheses[0].confiance = 'certaine'; },
    d => { d.hypotheses[0].a_valider = 'true'; },
    d => { d.gap[0].decision = 'supprimer'; },
    d => { d.personas[0].attentes = []; },
    d => { d.personas[0].represente_participants_reels = true; },
    d => { d.competences[0].dependances = [{}]; },
    d => { d.competences[0].dependances = ['PO-C02','PO-C02']; },
    d => { d.meta.source_refs = [{ source: 'document', location: 3 }]; },
    d => { d.sources[0].date_mise_a_jour = '2026-02-30'; },
    d => { d.cadrage.niveau.suppose[0].nature = 'fait_source'; },
    d => { d.meta.typo = 'erreur'; },
    d => { d.pratique.cible_pourcentage = '55'; },
  ];
  for (const mutate of mutations) {
    const data = copy(); mutate(data);
    assert.equal((await validate(data)).valid, false);
  }
});

test('comparaison de durée : égalité, écarts positifs/négatifs et donnée absente', () => {
  assert.equal(compareDurations(100,100).code, 'duration_match');
  assert.equal(compareDurations(100,120).details.deltaMinutes, 20);
  assert.equal(compareDurations(100,80).details.deltaMinutes, -20);
  assert.equal(compareDurations(null,120).code, 'duration_uncheckable');
});
test('durées structurées non codées en dur, sans alerte ni contrainte textuelle', async () => {
  const data = copy(); data.meta.id = 'AUTRE'; data.meta.duree_minutes = 300;
  data.meta.duree_detaillee_minutes = 330;
  data.cadrage.contraintes = [];
  data.alertes = [];
  const report = await validate(data);
  assert.equal(report.warnings.find(check => check.code === 'duration_mismatch').details.deltaMinutes, 30);
});
test('textes contradictoires ignorés : les valeurs structurées font autorité', async () => {
  const data = copy(); data.alertes[0].message = data.alertes[0].message.replace('435','450');
  data.cadrage.contraintes[2].texte = 'Durées à revoir : 999 minutes.';
  const report = await validate(data);
  assert.equal(report.warnings.length, 1);
  assert.equal(report.warnings[0].code, 'duration_mismatch');
  assert.equal(report.warnings[0].details.deltaMinutes, 15);
});
test('durée officielle inconnue : aucun écart malgré les textes existants', async () => {
  const data = copy();
  data.meta.duree_minutes = null;
  const report = await validate(data);
  assert.equal(report.valid, true);
  assert.ok(has(report, 'duration_uncheckable')); assert.equal(has(report, 'duration_mismatch'), false);
});
test('total détaillé optionnel absent : aucun écart malgré les textes existants', async () => {
  const data = copy(); delete data.meta.duree_detaillee_minutes;
  const report = await validate(data);
  assert.equal(report.valid, true);
  assert.ok(has(report, 'duration_uncheckable'));
  assert.equal(report.warnings.length, 0);
});
test('durées structurées égales : aucune alerte issue des anciens textes', async () => {
  const data = copy(); data.meta.duree_detaillee_minutes = data.meta.duree_minutes;
  const report = await validate(data);
  assert.equal(report.valid, true);
  assert.ok(has(report, 'duration_match'));
  assert.equal(report.warnings.length, 0);
});
test('durée structurée invalide : erreur de schéma, jamais duration_mismatch', async () => {
  for (const field of ['duree_minutes', 'duree_detaillee_minutes']) {
    for (const value of ['435', 0, -1, 435.5, null]) {
      if (field === 'duree_minutes' && value === null) continue;
      const data = copy(); data.meta[field] = value;
      const report = await validate(data);
      assert.equal(report.valid, false);
      assert.ok(has(report, 'duration_uncheckable'));
      assert.equal(has(report, 'duration_mismatch'), false);
    }
  }
});

test('CLI : avertissement non bloquant, JSON exploitable et indépendance du cwd', () => {
  const run = spawnSync(process.execPath, [cli, fixturePath('act_on_data'), '--json'], { cwd: tmpdir(), encoding:'utf8' });
  assert.equal(run.status, 0, run.stderr);
  const report = JSON.parse(run.stdout);
  assert.equal(report.valid, true); assert.ok(has(report, 'duration_mismatch'));
});
test('CLI : erreur de validation et erreur d’usage avec codes de sortie', async t => {
  const temp = await temporary(t);
  const path = await temp.write('formation.json', '{}');
  const run = spawnSync(process.execPath, [cli, path], { encoding:'utf8' });
  assert.equal(run.status, 1); assert.match(run.stdout, /INVALIDE/);
  const usage = spawnSync(process.execPath, [cli], { encoding:'utf8' });
  assert.equal(usage.status, 2); assert.match(usage.stderr, /Usage/);
});

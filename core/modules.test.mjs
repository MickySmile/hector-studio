import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { validateFormation } from './validate-formation.mjs';

const path = scenario => new URL(`../examples/IA017/${scenario}/formation.json`, import.meta.url);
const fixture = async (scenario = 'program_only') => JSON.parse(await readFile(path(scenario), 'utf8'));
const validate = data => validateFormation(data, {formationPath:fileURLToPath(path(data.meta.scenario))});
const check = (report, code) => report.checks.find(c => c.code === code);

for (const [scenario, practice] of [['program_only',230],['act_on_data',250]]) {
  test(`Modules ${scenario} : couverture, progression, totaux et aucune mutation`, async () => {
    const data = await fixture(scenario), before = JSON.stringify(data);
    const report = await validate(data);
    assert.equal(report.valid,true);
    const totals = check(report,'module_totals').details;
    assert.equal(totals.count,4);
    assert.equal(totals.durationMinutes,390);
    assert.equal(totals.practiceMinutes,practice);
    assert.equal(totals.remainingMinutes,30);
    assert.equal(totals.practicePercentage,practice/420*100);
    assert.equal(check(report,'module_practice_target_mismatch'),undefined);
    assert.equal(check(report,'duration_mismatch').details.deltaMinutes,15);
    for (const c of data.competences) {
      const first = data.modules.findIndex(m => m.competences.includes(c.id));
      assert.ok(first >= 0);
      for (const id of c.dependances) assert.ok(data.modules.findIndex(m => m.competences.includes(id)) < first);
    }
    data.modules.forEach((m,i) => m.dependances_modules.forEach(id => assert.ok(data.modules.findIndex(x => x.id === id) < i)));
    assert.equal(JSON.stringify(data),before);
  });
}

test('Modules optionnels, liste vide et dépendances optionnelles', async () => {
  const data = await fixture(); delete data.modules;
  assert.equal((await validate(data)).valid,true);
  assert.equal(check(await validate(data),'module_totals'),undefined);
  data.modules = [];
  assert.equal(check(await validate(data),'module_totals').details.practiceMinutes,0);
  const populated = await fixture(); delete populated.modules[0].dependances_modules;
  assert.equal((await validate(populated)).valid,true);
});

test('Schéma modules : champs obligatoires, types et champs hors périmètre', async () => {
  for (const field of ['id','titre','resultat_attendu','competences','concepts_cles','duree_minutes','pratique_minutes','justification','status']) {
    const data = await fixture(); delete data.modules[0][field];
    assert.equal((await validate(data)).valid,false,field);
  }
  for (const value of [null,12,{},'modules']) {
    const data = await fixture(); data.modules = value;
    assert.equal((await validate(data)).valid,false);
  }
  for (const mutation of [m=>m.competences=[],m=>m.competences=[{}],m=>m.concepts_cles=[],m=>m.duree_minutes=0,m=>m.pratique_minutes=-1,m=>m.pratique_minutes=1.5,m=>m.pratique_minutes='25',m=>m.vcoac={}]) {
    const data = await fixture(); mutation(data.modules[0]);
    const report = await validate(data);
    assert.equal(report.valid,false);
    assert.equal(check(report,'module_totals'),undefined);
  }
});

for (const [name, mutate, code] of [
  ['ID dupliqué', d=>d.modules.push(structuredClone(d.modules[0])), 'duplicate_id'],
  ['compétence inconnue', d=>d.modules[0].competences.push('absent'), 'unknown_module_competence'],
  ['dépendance inconnue', d=>d.modules[0].dependances_modules.push('absent'), 'unknown_module_dependency'],
  ['auto-cycle', d=>d.modules[0].dependances_modules.push('PO-M01'), 'module_cycle'],
  ['cycle indirect', d=>d.modules[0].dependances_modules.push('PO-M04'), 'module_cycle'],
  ['pratique supérieure à la durée', d=>d.modules[0].pratique_minutes=61, 'module_practice_exceeds_duration'],
]) {
  test(`Modules : ${name}`, async () => {
    const data = await fixture(); mutate(data);
    const report = await validate(data);
    assert.equal(report.valid,false); assert.ok(check(report,code));
    assert.equal(check(report,'module_totals'),undefined);
  });
}

test('Modules : diamant sans cycle et ordre de tableau indépendant du contrôle', async () => {
  const data = await fixture();
  data.modules[2].dependances_modules=['PO-M01'];
  data.modules[3].dependances_modules=['PO-M02','PO-M03'];
  data.modules.reverse();
  assert.equal((await validate(data)).valid,true);
});

test('Calcul générique : dépassement, enveloppe inconnue et pratique nulle', async () => {
  const data = await fixture(); data.meta.duree_minutes=300;
  let report = await validate(data);
  assert.ok(check(report,'module_duration_overflow'));
  assert.equal(check(report,'module_totals').details.remainingMinutes,-90);
  data.meta.duree_minutes=null;
  report = await validate(data);
  assert.equal(check(report,'module_totals').details.practicePercentage,null);
  assert.ok(check(report,'module_practice_uncheckable'));
  data.meta.duree_minutes=420; data.modules.forEach(m=>{m.pratique_minutes=0; m.moments_pedagogiques.forEach(moment=>moment.pratique_minutes=0);});
  assert.equal(check(await validate(data),'module_totals').details.practicePercentage,0);
});

test('Tolérance V1 : ±5 points inclus, avertissement au-delà dans les deux sens', async () => {
  for (const [minutes, warning] of [[200,false],[240,false],[199,true],[241,true]]) {
    const data = await fixture(); data.meta.duree_minutes=400;
    data.modules=[{...data.modules[0],duree_minutes:400,pratique_minutes:minutes}];
    // Ce cas teste la tolérance P2, avant décomposition en moments P3.
    delete data.modules[0].moments_pedagogiques;
    const report = await validate(data);
    assert.equal(Boolean(check(report,'module_practice_target_mismatch')),warning);
    assert.equal(check(report,'module_totals').details.practicePercentage,minutes/400*100);
  }
});

const labels = { synthese: 'Synthèse', cadrage: 'Cadrage', personas: 'Personas', gap: 'Gap', competences: 'Compétences', alertes: 'Alertes' };
const decisions = { conserver: 'Conserver', approfondir: 'Approfondir', compresser: 'Compresser', enrichir: 'Enrichir', deplacer_en_ressource: 'Déplacer en ressource' };
const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list = items => `<ul>${items.map(x => `<li>${e(x)}</li>`).join('')}</ul>`;
const badge = (text, kind = '') => `<span class="badge ${kind}">${e(text)}</span>`;
const status = nature => nature === 'fait_source' ? badge('✓ Fait sourcé', 'known') : nature === 'constat_calcule' ? badge('✓ Constat calculé', 'known') : nature === 'inconnu' ? badge('? À préciser', 'hypothesis') : nature === 'hypothese' ? badge('? Hypothèse', 'hypothesis') : badge('◆ Proposition à valider', 'decision');
const fact = x => `<div class="fact">${status(x.nature)}<p>${e(x.texte)}</p></div>`;
const panel = (title, body, cls = '') => `<article class="card ${cls}"><h3>${e(title)}</h3>${body}</article>`;
const detail = (title, body) => `<details><summary>${e(title)}</summary>${body}</details>`;
const field = (title, value) => `<div class="field"><h4>${e(title)}</h4><p>${e(value)}</p></div>`;
const actions = () => '<div class="actions"><button data-simulate>Accepter</button><button data-simulate>Modifier</button><button data-simulate>Écarter</button><small>Simulation uniquement</small></div>';
let scenario = 'program_only', view = 'synthese', data, validation, request = 0;
let decisionFilter = '', priorityFilter = '';
const content = document.querySelector('#content');
const group = block => (block.connu || []).map(fact).join('') + (block.suppose || []).map(fact).join('') + (block.propose ? fact(block.propose) : '') + (block.inconnu || []).map(texte => fact({ texte, nature: 'inconnu' })).join('');
const hypothesis = h => panel(h.texte, `${badge('? Hypothèse', 'hypothesis')} ${badge(`Confiance ${h.confiance}`)}${field('Impact pédagogique', h.impact_pedagogique)}<small>${e(h.id)} · ${h.a_valider ? 'À valider' : 'Voir la source'}</small>`);
function durationAlert() {
  const alert = data.alertes.find(a => a.type === 'duree_irrealiste');
  return alert ? `<aside class="warning"><div>${badge('⚠ Durée · arbitrage nécessaire', 'alert')}<h3>${e(alert.message)}</h3><p>${e(alert.action)}</p></div><button data-view="alertes">Voir les arbitrages →</button></aside>` : '';
}
function scenarioHealth() {
  if (!validation) return '';
  const appearance = { error: ['⨯ Problème bloquant', 'health-error'], warning: ['⚠ Arbitrage / incohérence', 'health-warning'], info: ['ℹ Information', 'health-info'] };
  const row = check => {
    const [label, style] = appearance[check.severity] || appearance.info;
    return `<li class="${style}"><strong>${e(label)}</strong><p>${e(check.message)}</p></li>`;
  };
  const success = validation.checks.filter(check => check.code === 'validation_passed');
  const information = validation.checks.filter(check => check.severity === 'info' && check.code !== 'validation_passed');
  return panel('Santé du scénario', `${success.map(check => `<p class="health-success">✓ ${e(check.message)}</p>`).join('')}<ul class="health-results">${[...validation.errors, ...validation.warnings].map(row).join('')}</ul>${detail('Informations sur les contrôles', `<ul class="health-results">${information.map(row).join('')}</ul>`)}<small>Contrôles déterministes · Les arbitrages pédagogiques restent dans la vue Alertes.</small>`, 'health');
}
function synthese() {
  const d = data;
  return `<div class="hero"><div class="eyebrow">${scenario === 'program_only' ? 'PROGRAMME SEUL' : 'ACT-ON DATA'}</div><h2>${e(d.meta.titre)}</h2>${status('proposition')}</div>
    ${scenarioHealth()}<div class="stats">${[
      ['Durée de référence', `${d.meta.duree_minutes} min`, d.meta.duree_statut === 'annoncee_au_catalogue' ? '✓ Annoncée au catalogue' : '? Hypothèse à confirmer au client'],
      ['Compétences', d.competences.length, '◆ Proposées, à valider'],
      ['Hypothèses', d.hypotheses.length, '? À examiner'],
      ['Alertes', d.alertes.length, '⚠ Points de vigilance'],
      ['Décisions à valider', d.decisions_a_valider.length, '◆ Arbitrages ouverts']
    ].map(([name, number, note]) => `<article class="stat"><h3>${name}</h3><strong>${e(number)}</strong><small>${note}</small></article>`).join('')}</div>
    <div class="grid two">${panel('Public', (d.cadrage.public.connu || []).map(fact).join('') + (d.cadrage.public.inconnu || []).map(texte => fact({texte,nature:'inconnu'})).join(''))}${panel('Finalité proposée', fact(d.cadrage.finalite.propose))}</div>
    <article class="card practice"><div><h3>Cible de pratique</h3>${badge('◆ Proposition · non mesurée', 'decision')}<p>${e(d.pratique.justification)}</p></div><div><strong>${e(d.pratique.cible_pourcentage)}<span> %</span></strong><progress max="100" value="${e(d.pratique.cible_pourcentage)}" aria-label="Cible de pratique proposée"></progress><small>Fourchette souhaitée : ${e(d.pratique.minimum_souhaite)}–${e(d.pratique.maximum_souhaite)} %</small></div></article>`;
}
function cadrage() {
  return `<div class="grid two">${Object.entries({public:'Public',niveau:'Niveau',contexte:'Contexte',finalite:'Finalité'}).map(([key,title]) => panel(title,group(data.cadrage[key]))).join('')}${panel('Contraintes',data.cadrage.contraintes.map(fact).join(''))}${panel('Priorités pédagogiques',data.cadrage.priorites_pedagogiques.map(fact).join(''))}</div><h3 class="section-title">Hypothèses de cadrage</h3><div class="grid two">${data.hypotheses.map(hypothesis).join('')}</div>`;
}
function personas() {
  return `<p class="intro">? Trois profils de simulation pour éprouver la conception. Ils ne représentent pas les participants réels.</p><div class="grid three">${data.personas.map((p,i) => panel(({novice:'Novice',intermediaire:'Intermédiaire',avance:'Avancé'})[p.niveau] || p.niveau, `<div class="persona-index">0${i+1} ${badge('Simulation','hypothesis')}</div><h4>Attentes</h4>${list(p.attentes)}${field('Risque d’ennui',p.risque_ennui)}${field('Risque de décrochage',p.risque_decrochage)}${detail('Acquis, difficultés et adaptations', `<h4>Acquis probables</h4>${list(p.acquis_probables)}<h4>Difficultés probables</h4>${list(p.difficultes_probables)}<h4>Adaptations possibles</h4>${list(p.adaptations_possibles)}`)}`)).join('')}</div>`;
}
function gap() {
  const rows = data.gap.filter(g => (!decisionFilter || g.decision === decisionFilter) && (!priorityFilter || g.priorite === priorityFilter));
  return `<p class="intro">Chaque traitement reste une proposition à valider. Le besoin conserve son niveau de certitude.</p><div class="filters"><label>Décision <select id="decision-filter"><option value="">Toutes les décisions</option>${Object.entries(decisions).map(([k,v]) => `<option value="${k}" ${decisionFilter === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label><label>Priorité <select id="priority-filter"><option value="">Toutes les priorités</option>${['haute','moyenne','basse'].map(k => `<option ${priorityFilter === k ? 'selected' : ''}>${k}</option>`).join('')}</select></label><span>${rows.length} / ${data.gap.length} éléments</span></div><div class="table-wrap"><table><thead><tr><th>Programme</th><th>Besoin</th><th>Décision proposée</th><th>Priorité</th><th>Justification</th></tr></thead><tbody>${rows.map(g => `<tr><th scope="row">${e(g.element_programme)}</th><td>${fact(g.besoin_reel_ou_hypothese)}</td><td>${badge(decisions[g.decision] || g.decision, g.decision)}</td><td>${badge(g.priorite, g.priorite === 'haute' ? 'alert' : '')}</td><td>${e(g.justification)}</td></tr>`).join('')}</tbody></table>${rows.length ? '' : '<p class="intro">Aucun élément pour ces filtres.</p>'}</div>`;
}
function competences() {
  return `<p class="intro">Une progression proposée, des situations professionnelles aux preuves observables. Les dépendances indiquent les acquis à mobiliser.</p><div class="grid two">${data.competences.map((c,i) => panel(`${i+1}. ${c.titre}`, `${badge(c.importance)} ${badge(c.niveau_cible,'known')} ${status(c.status)}${field('Situation professionnelle',c.situation_professionnelle)}${field('Action attendue',c.action_attendue)}${field('Preuve légère',c.preuve_legere)}${detail('Dépendances et critères de réussite', `<h4>Dépendances</h4>${c.dependances.length ? list(c.dependances.map(id => data.competences.find(x=>x.id===id)?.titre || id)) : '<p>Aucune dépendance déclarée.</p>'}<h4>Critères de réussite</h4>${list(c.criteres_reussite)}`)}`)).join('')}</div>`;
}
function alertes() {
  return `${durationAlert()}<h3 class="section-title">⚠ Alertes <span>${data.alertes.length}</span></h3><div class="grid two">${data.alertes.map(a=>panel(a.message,`${badge('⚠ Alerte','alert')}${field('Action proposée',a.action)}<small>${e(a.id)}</small>`)).join('')}</div><h3 class="section-title">? Hypothèses importantes <span>${data.hypotheses.length}</span></h3><div class="grid two">${data.hypotheses.map(hypothesis).join('')}</div><h3 class="section-title">◆ Décisions à valider <span>${data.decisions_a_valider.length}</span></h3><div class="grid two">${data.decisions_a_valider.map(d=>panel(d.question,`${badge('◆ Décision nécessaire','decision')} ${badge(d.porte)}${field('Recommandation',d.recommandation)}${actions()}`)).join('')}</div>`;
}
function render() {
  document.querySelector('#navigation').innerHTML = Object.entries(labels).map(([key,label])=>`<button data-view="${key}" ${view === key ? 'aria-current="page"' : ''}>${label}${key==='alertes' && data ? ` <span>${data.alertes.length}</span>` : ''}</button>`).join('');
  if (!data) {
    if (validation) content.innerHTML = `${scenarioHealth()}<p role="alert">Ce scénario contient un problème bloquant. Corrigez les données source puis réessayez.</p><button data-retry>Réessayer</button>`;
    return;
  }
  content.innerHTML = `${view !== 'synthese' ? `<div class="view-heading"><div class="eyebrow">${scenario === 'program_only' ? 'PROGRAMME SEUL' : 'ACT-ON DATA'}</div><h2>${labels[view]}</h2></div>` : ''}${({synthese,cadrage,personas,gap,competences,alertes})[view]()}`;
}
async function loadScenario(next) {
  const token = ++request;
  scenario = next; data = null; validation = null; decisionFilter = ''; priorityFilter = '';
  document.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scenario===scenario)));
  document.querySelector('#scenario-note').textContent = '';
  document.querySelector('#source-path').textContent = `examples/IA017/${scenario}/formation.json`;
  content.innerHTML = '<p class="intro">Chargement du scénario…</p>';
  render();
  try {
    const response = await fetch(`/api/scenarios/${next}`, {cache:'no-store'});
    if (!response.ok) throw new Error('Impossible de charger la fixture.');
    const loaded = await response.json();
    if (token !== request) return;
    validation = loaded.validation;
    data = loaded.formation;
    document.querySelector('#scenario-note').textContent = data?.meta.note || '';
    render();
  } catch {
    if (token !== request) return;
    data = null; validation = null;
    content.innerHTML = '<div role="alert" class="health-error"><p>Impossible de valider ce scénario. Vérifiez le serveur et le fichier de formation.</p><button data-retry>Réessayer</button></div>';
  }
}
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.scenario) loadScenario(button.dataset.scenario);
  if (button.dataset.view) { view=button.dataset.view; render(); }
  if (button.hasAttribute('data-retry')) loadScenario(scenario);
  if (button.hasAttribute('data-simulate')) {
    const toast = document.querySelector('#toast');
    toast.textContent = 'Fonction de modification prévue dans une prochaine version. Aucune donnée modifiée.';
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(()=>{toast.textContent='';},4500);
  }
});
document.addEventListener('change', event => {
  if (event.target.id==='decision-filter' || event.target.id==='priority-filter') {
    const id=event.target.id;
    if (id==='decision-filter') decisionFilter=event.target.value; else priorityFilter=event.target.value;
    render(); document.getElementById(id).focus();
  }
});
loadScenario(scenario);

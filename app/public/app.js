const labels = { synthese: 'Synthèse', cadrage: 'Cadrage', personas: 'Personas', gap: 'Gap', competences: 'Compétences', carte: 'Carte', modules: 'Modules', vcoac: 'VCOAC', alertes: 'Alertes' };
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
let decisionFilter = '', priorityFilter = '', selectedCompetence = null;
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

// Disposition uniquement : rang = 1 + rang maximal des prérequis.
// L'ordre de la source départage les compétences d'un même rang.
function competenceLayout(competences = []) {
  const nodes = competences.map(c => ({ competence: c, id: c.id, level: 0, incoming: [], outgoing: [] }));
  const byId = new Map(nodes.map(n => [n.id, n]));
  const edges = [], issues = [];
  for (const node of nodes) {
    for (const id of new Set(node.competence.dependances || [])) {
      const source = byId.get(id);
      if (!source || source === node) { issues.push(`${node.id} : prérequis incohérent ${id}`); continue; }
      source.outgoing.push(node); node.incoming.push(source);
      edges.push({ source, target: node });
    }
  }
  const remaining = new Map(nodes.map(n => [n, n.incoming.length]));
  const queue = nodes.filter(n => !remaining.get(n));
  for (let i = 0; i < queue.length; i++) {
    const node = queue[i];
    for (const next of node.outgoing) {
      next.level = Math.max(next.level, node.level + 1);
      remaining.set(next, remaining.get(next) - 1);
      if (!remaining.get(next)) queue.push(next);
    }
  }
  // Un cycle ne doit ni bloquer le navigateur ni suggérer un ordre valide.
  if (queue.length !== nodes.length) {
    issues.push('Ordre indéterminé pour certaines compétences : vérifier les dépendances.');
    const last = queue.length ? Math.max(...queue.map(n => n.level)) + 1 : 0;
    nodes.filter(n => remaining.get(n)).forEach(n => { n.level = last; n.unresolved = true; });
  }
  const columns = [];
  for (const node of nodes) (columns[node.level] ||= []).push(node);
  const top = 60 + edges.filter(edge => edge.target.level - edge.source.level > 1).length * 14;
  const rows = Math.max(1, ...columns.map(column => column.length));
  columns.forEach(column => column.forEach((node, row) => {
    node.x = 24 + node.level * 270;
    node.y = top + (row + (rows - column.length) / 2) * 220;
  }));
  return { nodes, edges, columns, issues, width: Math.max(280, columns.length * 270), height: top + rows * 220 };
}
function mapRelation(node, selected) {
  if (!selected) return '';
  if (node === selected) return 'selected';
  if (selected.incoming.includes(node)) return 'prerequisite';
  if (selected.outgoing.includes(node)) return 'dependent';
  return 'muted';
}
function carte() {
  const graph = competenceLayout(data.competences);
  if (!graph.nodes.length) return '<p class="card">Aucune compétence dans ce scénario.</p>';
  const selected = graph.nodes.find(n => n.id === selectedCompetence);
  const relationLabels = { selected: 'Sélectionnée', prerequisite: 'Prérequis direct', dependent: 'Dépendante directe', muted: 'Autre compétence' };
  let lane = 0;
  const arrows = graph.edges.filter(({source,target}) => !source.unresolved && !target.unresolved).map(({source,target}) => {
    const x1 = source.x + 220, y1 = source.y + 95, x2 = target.x, y2 = target.y + 95;
    const skip = target.level - source.level > 1;
    const top = 35 + lane * 14;
    if (skip) lane++;
    const path = skip ? `M ${x1} ${y1} H ${x1+16} V ${top} H ${x2-16} V ${y2} H ${x2-4}` : `M ${x1} ${y1} C ${x1+24} ${y1}, ${x2-24} ${y2}, ${x2-4} ${y2}`;
    const kind = !selected ? 'normal' : target === selected ? 'prerequisite' : source === selected ? 'dependent' : 'muted';
    return `<path class="map-edge ${kind}" data-from="${e(source.id)}" data-to="${e(target.id)}" d="${path}" marker-end="url(#arrow-${kind})"/>`;
  }).join('');
  const references = ids => ids.length ? list(ids.map(id => {
    const node = graph.nodes.find(n => n.id === id);
    return node ? `${id} — ${node.competence.titre}` : `${id} — référence introuvable`;
  })) : '<p>Aucun prérequis déclaré.</p>';
  const c = selected?.competence;
  return `<p class="intro">De gauche à droite : les prérequis avant les compétences qui les mobilisent. Sélectionnez une carte pour explorer ses liens et ses détails. Les étapes indiquent un ordre de dépendance, pas une durée.</p>
    <div class="map-legend"><span class="selected">Sélectionnée</span><span class="prerequisite">Prérequis direct</span><span class="dependent">Dépendante directe</span></div>
    ${graph.issues.length ? `<div class="health-error">${list(graph.issues)}</div>` : ''}
    <div class="map-scroll" tabindex="0" role="region" aria-label="Carte des compétences, défilement horizontal si nécessaire">
    <svg class="competence-map" xmlns="http://www.w3.org/2000/svg" width="${graph.width}" height="${graph.height}" role="group" aria-label="Progression des compétences">
      <defs>${['normal','prerequisite','dependent','muted'].map(kind => `<marker id="arrow-${kind}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path class="map-arrow ${kind}" d="M 0 0 L 10 5 L 0 10 z"/></marker>`).join('')}</defs>
      <g aria-hidden="true">${graph.columns.map((column,i) => `<text class="map-step" x="${24+i*270}" y="20">${column.some(n=>n.unresolved) ? 'Ordre à vérifier' : `Étape ${i+1}`}</text>`).join('')}${arrows}</g>
      ${graph.nodes.map((node,i) => {
        const kind = mapRelation(node,selected), c = node.competence;
        return `<foreignObject x="${node.x}" y="${node.y}" width="220" height="190"><button xmlns="http://www.w3.org/1999/xhtml" id="map-node-${i}" class="map-node ${kind}" data-competence="${e(c.id)}" aria-pressed="${node===selected}" aria-controls="competence-detail" title="${e(c.titre)}"><span class="map-id">${e(c.id)}${kind ? ` · ${relationLabels[kind]}` : ''}</span><strong>${e(c.titre)}</strong><span class="map-level">${e(c.niveau_cible)}</span></button></foreignObject>`;
      }).join('')}
    </svg></div>
    <section id="competence-detail" class="card map-detail" aria-label="Détail de la compétence" aria-live="polite">${c ? `<h3>${e(c.id)} — ${e(c.titre)}</h3><div class="grid two"><div>${field('Situation professionnelle',c.situation_professionnelle)}${field('Action attendue',c.action_attendue)}${field('Niveau cible',c.niveau_cible)}${field('Importance',c.importance)}</div><div>${field('Preuve légère',c.preuve_legere)}<h4>Critères de réussite</h4>${list(c.criteres_reussite || [])}<h4>Prérequis / dépendances</h4>${references(c.dependances || [])}${field('Travaillée dans les modules',(data.modules || []).filter(m => m.competences.includes(c.id)).map(m => `${m.id} — ${m.titre}`).join(' · ') || 'Aucun module défini')}</div></div>` : '<p>Sélectionnez une compétence pour afficher ses détails.</p>'}</section>
    <details class="map-text"><summary>Lecture textuelle des compétences et des relations</summary><ul>${graph.nodes.map((node,i) => `<li><button id="map-text-${i}" data-competence="${e(node.id)}" aria-pressed="${node===selected}" aria-controls="competence-detail">${e(node.id)} — ${e(node.competence.titre)}</button> · ${node.unresolved ? 'ordre à vérifier' : `étape ${node.level+1}`}<br>Prérequis : ${e((node.competence.dependances || []).join(', ') || 'aucun')}${selected ? ` · ${relationLabels[mapRelation(node,selected)]}` : ''}</li>`).join('')}</ul></details>`;
}

function modules() {
  if (!data.modules?.length) return '<p class="card">Modules non définis : formation au stade du cadrage.</p>';
  const totals = validation?.checks.find(c => c.code === 'module_totals')?.details;
  const percent = value => value === null ? 'Non calculable' : `${Number(value).toLocaleString('fr-FR', {maximumFractionDigits:1})} %`;
  const references = (ids, collection) => ids.map(id => `${id} — ${collection.find(item => item.id === id)?.titre || 'référence introuvable'}`);
  return `<p class="intro">Architecture proposée · lecture seule. La pratique est planifiée, pas mesurée en session.</p>
    ${durationAlert()}
    ${totals ? `<div class="stats module-stats">${[
      ['Durée utilisée', `${totals.durationMinutes} / ${totals.envelopeMinutes ?? '?'} min`, 'Enveloppe de planification'],
      ['Pratique calculée', percent(totals.practicePercentage), `${totals.practiceMinutes} min / ${totals.envelopeMinutes ?? '?'} min d’enveloppe`],
      ['Cible de pratique', percent(totals.targetPercentage), `Tolérance V1 : ±${totals.tolerancePoints} points`],
      ['Temps hors modules', totals.remainingMinutes === null ? 'Inconnu' : `${totals.remainingMinutes} min`, 'Aucune pratique présumée']
    ].map(([title,value,note]) => `<article class="stat"><h3>${title}</h3><strong>${e(value)}</strong><small>${e(note)}</small></article>`).join('')}</div>` : '<p role="status">Calculs des modules indisponibles.</p>'}
    ${(validation?.warnings || []).filter(c => c.path === '/modules').map(c => `<p class="health-warning">${e(c.message)}</p>`).join('')}
    <p class="intro">${e(data.planification_modules || 'Affectation du temps hors modules à préciser.')}</p>
    <section class="card module-progression" aria-label="Progression des modules"><h3>Progression proposée</h3><ol>${data.modules.map(m => `<li><a href="#${e(m.id)}">${e(m.titre)}</a><span>${e(m.duree_minutes)} min</span></li>`).join('')}</ol><small>Ordre pédagogique proposé ; aucun suivi de réalisation.</small></section>
    <div class="grid two">${data.modules.map((m,i) => panel(`${i+1}. ${m.titre}`, `
      ${badge(`${m.duree_minutes} min`)} ${badge(`${m.pratique_minutes} min de pratique`, 'known')}
      ${field('Résultat attendu',m.resultat_attendu)}
      ${field('Compétences concernées',references(m.competences,data.competences).join(' · '))}
      ${field('Concepts clés',m.concepts_cles.join(' · '))}
      ${detail('Justification, dépendances et statut', `${field('Justification',m.justification)}${field('Modules prérequis',references(m.dependances_modules || [],data.modules).join(' · ') || 'Aucun')}${field('Statut',m.status)}<small>${e(m.id)}</small>`)}
    `, 'module-card').replace('<article ', `<article id="${e(m.id)}" `)).join('')}</div>`;
}

function vcoac() {
  if (!data.modules?.length) return '<p class="card">Moments pédagogiques non définis : formation au stade du cadrage.</p>';
  const functions = m => m.fonctions_vcoac.map(f => f.toUpperCase()).join(' + ');
  const moments = data.modules.flatMap(m => m.moments_pedagogiques || []);
  return `<p class="intro">Conception P3 · propositions à valider · lecture seule. Les fonctions peuvent être fusionnées (+) ; les flèches indiquent l’ordre des moments. Aucun contenu de recherche n’est encore produit.</p>
    <p>${badge(`${moments.length} moments`)} ${badge(`${moments.filter(m => m.besoin_recherche).length} besoins de recherche`, 'alert')}</p>
    <p class="intro">La pratique indique uniquement le temps de production des participants. Une fusion ne multiplie ni la durée ni la pratique.</p>
    ${data.modules.map((module, i) => panel(`Module ${i + 1} — ${module.titre}`, `
      ${badge(`${module.duree_minutes} min`)} ${badge(`${module.pratique_minutes} min de pratique`, 'known')}
      ${module.moments_pedagogiques?.length ? `<ol class="vcoac-flow" aria-label="Progression VCOAC du module ${i + 1}">${module.moments_pedagogiques.map(m => `<li><a href="#${e(m.id)}">${e(functions(m))}<span>${e(m.duree_minutes)} min</span></a>${m.besoin_recherche ? badge('Recherche nécessaire', 'alert') : ''}</li>`).join('')}</ol>
      ${module.moments_pedagogiques.map(m => `<details id="${e(m.id)}" class="vcoac-moment"><summary>${e(functions(m))} · ${e(m.duree_minutes)} min — ${e(m.titre)} ${m.besoin_recherche ? badge('Recherche nécessaire', 'alert') : ''}</summary>
        ${field('Intention', m.intention)}<h4>Contenu prévu</h4>${list(m.contenu_prevu)}
        ${field('Concepts concernés', m.concepts_concernes.join(' · ') || 'Aucun concept déclaré')}
        ${field('Pratique planifiée', `${m.pratique_minutes} min sur ${m.duree_minutes} min`)}
        ${m.besoin_recherche ? `<h4>Questions de recherche à instruire</h4>${list(m.questions_recherche || [])}` : '<p>Aucun besoin de recherche supplémentaire identifié pour ce moment.</p>'}
        ${(validation?.warnings || []).filter(c => c.path === `/modules/${i}/moments_pedagogiques/${module.moments_pedagogiques.indexOf(m)}/duree_minutes`).map(c => `<p class="health-warning">${e(c.message)}</p>`).join('')}
        ${field('Statut', m.status)}<small>${e(m.id)}</small></details>`).join('')}` : '<p>Moments pédagogiques non définis pour ce module.</p>'}
    `, 'vcoac-module')).join('')}`;
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
  content.innerHTML = `${view !== 'synthese' ? `<div class="view-heading"><div class="eyebrow">${scenario === 'program_only' ? 'PROGRAMME SEUL' : 'ACT-ON DATA'}</div><h2>${labels[view]}</h2></div>` : ''}${({synthese,cadrage,personas,gap,competences,carte,modules,vcoac,alertes})[view]()}`;
}
async function loadScenario(next) {
  const token = ++request;
  scenario = next; selectedCompetence = null; data = null; validation = null; decisionFilter = ''; priorityFilter = '';
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
  if (button.dataset.competence && data?.competences.some(c => c.id === button.dataset.competence)) {
    selectedCompetence = button.dataset.competence;
    const textOpen = document.querySelector('.map-text')?.open;
    const scroll = document.querySelector('.map-scroll');
    const left = scroll?.scrollLeft, top = scroll?.scrollTop;
    render();
    const nextScroll = document.querySelector('.map-scroll');
    if (nextScroll) { nextScroll.scrollLeft = left; nextScroll.scrollTop = top; }
    if (textOpen) document.querySelector('.map-text').open = true;
    document.getElementById(button.id)?.focus({preventScroll:true});
  }
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

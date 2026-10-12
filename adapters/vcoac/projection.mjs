// Choix éditoriaux P4 du seul pilote. Les sections citées restent la source du fond.
// Les phrases courtes sont des reformulations pour l'écran ; les sections complètes
// sont conservées dans les notes. Aucun résumé libre n'est effectué à l'exécution.
const cards = (titre, pairs, aRetenir) => ({ type: 'CARTES', titre, variante: { disposition: 'colonnes', entete: 'numero' }, cartes: pairs.map(([titre, corps]) => ({ titre, corps })), ...(aRetenir ? { aRetenir } : {}) });
const sheet = (titre, rows, pied) => ({ type: 'FICHE_OUTIL', titre, champs: rows.map(([nom, consigne]) => ({ nom, consigne })), pied });
const comparison = (titre, a, b, aRetenir) => ({ type: 'COMPARAISON_AB', titre, signe: '≠', a: { etiquette: 'Trajet simple', titre: a[0], points: a.slice(1) }, b: { etiquette: 'Hypothèse multi-agents', titre: b[0], points: b.slice(1) }, aRetenir });
const entries = [];
function add(moment, suffix, phase, objective, sections, reason, screen, notes = {}) {
  entries.push({ slide_id: `AOD-M02-${moment}-${suffix}`, moment_id: `AOD-M02-${moment}`, phase, objective, sections, reason, visual: 'Natif, sans asset externe', screen, notes });
}

add('MP01', '01', 'VOIR', 'Observer les deux branches de la démonstration validée.',
  ['VOIR — démonstration validée', 'Validation et provenance'],
  'Deux résultats de test et leur condition, sous forme de cartes ; aucune capture simulée.',
  cards('Une règle oriente deux branches', [
    ['Condition If', 'elements_recus = elements_attendus'],
    ['Test A : 8 / 9', 'FALSE → Dossier incomplet — PASS'],
    ['Test B : 8 / 8', 'TRUE → Dossier complet — PASS'],
  ], 'CAS FICTIF — n8n Cloud ; validation formateur du 12 octobre 2026.'),
  { relance: 'Où passe la demande, et qui pourrait autoriser une correction ?', vigilance: ['« Complet » signifie égalité des nombres, pas validité métier des pièces.'] });
add('MP01', '02', 'COMPRENDRE', 'Lire le chemin prédéfini et préparer la distinction workflow / agent.',
  ['Intention et message essentiel', 'COMPRENDRE — commentaire', 'Déroulé — durée inchangée'],
  'Rappel schématique pendant la démonstration réelle : déclencheur, données RH-042 fictives, If et branches ; même layout, résultats détaillés sur la slide précédente.',
  { type: 'PROCESSUS', titre: 'Le workflow suit une règle prédéfinie', etapes: [
    { nom: 'Départ', phrase: 'Le formateur lance.', exemple: 'Manual Trigger' },
    { nom: 'Données', phrase: 'Éléments RH-042 fictifs.', exemple: 'Edit Fields : reçus / attendus' },
    { nom: 'If', phrase: 'Tester leur égalité.', exemple: 'Reçus = attendus' },
    { nom: 'Décision', phrase: 'TRUE ou FALSE.', exemple: 'Règle fixée à l’avance' },
    { nom: 'Branches', phrase: 'Afficher le résultat.', exemple: 'Incomplet / complet' },
  ], aRetenir: 'Aucun agent IA ni validation métier n’est démontré.' },
  { reponse: 'La règle oriente le workflow ; le RH habilité garde la décision métier.', transition: 'Passer aux ressources et connexions.' });

add('MP02', '01', 'COMPRENDRE', 'Distinguer API, connecteur et MCP à partir du besoin d’accès.',
  ['Intention pédagogique', 'COMPRENDRE — partir du besoin d’accès'],
  'Trois cartes de vocabulaire ; explications complètes en notes.',
  cards('La connexion doit servir le besoin', [
    ['API', 'Interface du logiciel RH pour consulter selon ses règles.'],
    ['Connecteur', 'Adaptation concrète entre systèmes : demandes et réponses.'],
    ['MCP', 'Contrat commun entre client et serveur pour échanger des capacités.'],
  ], 'Un extrait déjà suffisant peut éviter une connexion supplémentaire.'));
add('MP02', '02', 'COMPRENDRE', 'Situer client, serveur et retour de consultation.',
  ['Représentation — lire le trajet'],
  'Cartes aller/retour/contrôles plutôt qu’un schéma linéaire qui masquerait le retour.',
  cards('La réponse revient vers l’application', [
    ['Demande', 'Application / client MCP → serveur MCP → consultation RH.'],
    ['Retour', 'La réponse revient à l’application ; le modèle reçoit les éléments utiles.'],
    ['Contrôles', 'Identité, permissions, gouvernance et contrôle humain entourent ce trajet.'],
  ]));
add('MP02', '03', 'COMPRENDRE', 'Distinguer capacités du protocole et autorisations métier.',
  ['Ce que MCP standardise, ce qui reste à décider'],
  'Trois frontières explicites ; les capacités détaillées restent en notes sourcées.',
  cards('Connecté ne signifie pas autorisé', [
    ['Échanger', 'MCP décrit et échange outils, ressources de contexte et prompts.'],
    ['Lire', 'Accès permis à des données précises ; aucun droit d’écriture déduit.'],
    ['Valider', 'Une validation humaine porte sur une action précise, pas sur une connexion.'],
  ], 'Capacités et versions compatibles à vérifier ; aucune conformité garantie.'));
add('MP02', '04', 'COMPRENDRE', 'Localiser lecture, analyse et correction conditionnelle dans RH-042.',
  ['Exemple — CAS FICTIF RH-042'],
  'Trois cartes séparent les responsabilités sans représenter une écriture automatique.',
  cards('Lire et analyser ne permettent pas de corriger', [
    ['Lecture', 'RH-042 permis ; RH-099 refusé : comportement à exiger, non testé.'],
    ['Analyse', 'Préparer « 8 → 9, à vérifier » avec les références ; ne pas corriger.'],
    ['Correction éventuelle', 'Circuit distinct, RH habilité ; refus ou silence empêchent l’écriture.'],
  ], 'CAS FICTIF — l’écart ne prouve pas une erreur métier.'),
  { relance: 'Le serveur répond et l’outil apparaît : peut-on corriger ?', reponse: 'Non : droits d’écriture et validation prévue doivent être effectivement contrôlés côté service.' });
add('MP02', '05', 'COMPRENDRE', 'Comparer le travail et la justification des rôles supplémentaires.',
  ['COMPRENDRE — faut-il plusieurs agents pour RH-042 ?'],
  'Premier volet d’une comparaison en deux slides ; aucun gain supposé.',
  comparison('Plusieurs agents doivent résoudre une difficulté',
    ['Chemin descriptible', 'Consulter, rapprocher les valeurs, préparer le brouillon.', 'Aucune difficulté mesurée n’est fournie par le cas.'],
    ['Rôles à justifier', 'Séparer événements et procédure, rapprocher les conclusions.', 'Expliquer la difficulté résolue par chaque rôle.'],
    'Même résultat attendu : une explication et un brouillon pour revue RH.'));
add('MP02', '06', 'COMPRENDRE', 'Comparer coordination et responsabilité, sans changer de décideur.',
  ['COMPRENDRE — faut-il plusieurs agents pour RH-042 ?', 'Outil de lecture et déroulé formateur', 'Knowledge utilisée et provenance'],
  'Second volet : coût de conception et décision humaine, complémentaires au premier.',
  comparison('La coordination ne remplace pas la décision RH',
    ['Un trajet à vérifier', 'Un chemin à expliquer et à contrôler.', 'Le RH habilité peut refuser le brouillon.'],
    ['Des échanges à préciser', 'Désaccord, droits, coût et délai comparatifs à vérifier.', 'Un accord entre agents ne valide pas le compteur.'],
    'Le cas ne démontre pas le besoin de multi-agents.'),
  { relance: 'L’un dit 8, l’autre 9 : avons-nous résolu le problème ?', reponse: 'Non : examiner les pièces et la règle ; le nombre d’agents ne prouve pas la valeur correcte.', vigilance: ['Un workflow peut orchestrer plusieurs agents selon des étapes fixes.'], transition: 'Préparer la carte logique avec le canvas et la grille MCP.' });

add('MP03', '01', 'OUTILLER', 'Présenter les trois premières rubriques du canvas vierge.',
  ['Intention pédagogique', 'OUTILLER — canvas global de workflow', 'Gabarit global vierge à copier'],
  'Six rubriques réparties en deux fiches de trois champs ; remplissage pendant MP04.',
  sheet('Canvas global — 1/2', [
    ['Objectif', 'Entrée … ; sortie utile et destinataire …'],
    ['Contexte', 'Données utiles … ; ressources … ; ce qui manque …'],
    ['Actions', 'Acteur … ; instruction … ; outil ou opération … ; résultat …'],
  ], 'Outil présenté ici ; à remplir pendant l’atelier.'));
add('MP03', '02', 'OUTILLER', 'Compléter les six rubriques sans supprimer limites et contrôle.',
  ['Gabarit global vierge à copier', 'Reporter les réponses sur la carte'],
  'Suite du même canvas ; les annotations et retours sont intégralement en notes.',
  sheet('Canvas global — 2/2', [
    ['Boucle / trajet', 'Étapes … ; flèches nommées … ; information transmise … ; retour si nécessaire …'],
    ['Limites', 'Actions interdites … ; inconnues … ; condition d’arrêt …'],
    ['Contrôle', 'Qui vérifie quoi et quand … ; peut corriger/refuser … ; preuve à demander …'],
  ], 'Ressource, connexion, validation et responsable à situer sur la carte.'));
add('MP03', '03', 'OUTILLER', 'Montrer comment remplir objectif, contexte et actions.',
  ['Exemple rempli — CAS FICTIF RH-042'],
  'Exemple rempli sur deux slides ; les six réponses complètes restent dans les notes.',
  cards('Le canvas rend les rôles explicites — 1/2', [
    ['Objectif', 'Demande RH-042 → brouillon sourcé pour revue RH ; aucune correction.'],
    ['Contexte', 'Compteur 8, suggestion 9 ; détails manquants et références à préciser.'],
    ['Actions', 'Manager demande ; application consulte ; service contrôle ; RH examine.'],
  ], 'CAS FICTIF — aucune architecture client déployée.'));
add('MP03', '04', 'OUTILLER', 'Montrer trajet, limites et validation dans l’exemple rempli.',
  ['Exemple rempli — CAS FICTIF RH-042'],
  'Suite du même exemple ; les retours et arrêts sont nommés explicitement.',
  cards('Le canvas rend les limites explicites — 2/2', [
    ['Trajet', 'Demande → consultation → analyse → brouillon → revue ; retour et confirmation.'],
    ['Limites', 'RH-099 exclu ; ni envoi autonome ni écriture métier.'],
    ['Contrôle', 'RH examine les pièces ; silence = aucune correction ; écriture dans un circuit distinct.'],
  ]));
add('MP03', '05', 'OUTILLER', 'Présenter les questions MCP 1 à 3, sans les raccourcir.',
  ['OUTILLER — quand et comment utiliser la grille', 'Support vierge — les six questions existantes', 'Exemple rempli — même CAS FICTIF, décision de connexion'],
  'Trois questions exactes par fiche ; réponses de l’exemple conservées dans les notes.',
  sheet('Grille MCP — questions 1 à 3', [
    ['Résultat', 'Quel résultat exige un accès externe ?'],
    ['Besoin', 'Pourquoi MCP pour ce besoin ?'],
    ['Compatibilité', 'Les deux côtés savent-ils échanger ?'],
  ], 'Réponse courte et preuve, ou « inconnu + responsable à solliciter ».'));
add('MP03', '06', 'OUTILLER', 'Présenter les questions MCP 4 à 6 et la décision argumentée.',
  ['Support vierge — les six questions existantes', 'Exemple rempli — même CAS FICTIF, décision de connexion', 'Déroulé formateur et conseils d’utilisation', 'Knowledge utilisée et provenance'],
  'Suite de la même grille ; aucun score ni septième question ajoutés.',
  sheet('Grille MCP — questions 4 à 6', [
    ['Droits', 'Qui peut lire et qui peut agir ?'],
    ['Décision humaine', 'Quelle décision exige un humain ?'],
    ['Vérifier / arrêter', 'Comment vérifier et arrêter ?'],
  ], 'Décider : essai fictif / intégration existante / connexion différée.'),
  { vigilance: ['L’exemple reporte la connexion faute de preuves ; la grille ne vaut pas autorisation.'], transition: 'Utiliser les deux gabarits pour cartographier RH-042.' });

// Une consigne par activité : synthèse à l'écran, quatre critères intacts en notes.
// Les cinq étapes et leur enveloppe de temps sont conservées.
export const criteria = [
  'Entrées, sorties et étapes lisibles.',
  'Rôles et connexions justifiés par le besoin.',
  'Contrôles et validations localisés.',
  'Complexité limitée et points restant à vérifier signalés.',
];
export const screenCriteria = [
  'Trajet lisible ; rôles et liens justifiés.',
  'Contrôles situés ; complexité limitée.',
];
function workshop(moment, title, minutes, context, steps, output, refused, sections) {
  add(moment, '01', 'AGIR',
    'Lancer l’activité et guider la relecture avec les quatre critères C02.',
    sections, 'Fusion des deux consignes : cinq étapes et durée conservées ; critères synthétisés à l’écran et intacts dans les notes avec le corrigé.',
    { type: 'CONSIGNE_ATELIER', titre: title,
      modalites: [{ texte: `${minutes} min au total`, style: 'jaune' }, { texte: '2 binômes + 1 trinôme' }, { texte: 'Papier / support partagé', style: 'contour' }],
      contexte: context, etapes: steps, livrable: output, criteres: screenCriteria, nonAcceptes: [refused] },
    { reponse: 'Quatre critères C02 :\n' + criteria.join('\n'), vigilance: ['Conserver la durée indiquée. Les quatre critères détaillés et les corrections restent dans les notes formateur.'] });
}
workshop('MP04', 'À vous : cartographier RH-042', 60,
  'CAS FICTIF — dossier D1/D2/D3, canvas et grille MCP de MP03.',
  ['10 min : lire D1–D3 ; expliciter le résultat et les inconnues.',
    '15 min : remplir le canvas ; nommer acteurs, entrées et sorties.',
    '15 min : tracer les échanges et annoter droits et connexions.',
    '10 min : traiter pièce manquante, refus et silence.',
    '10 min : relire les quatre critères ; réviser et préparer MP05.'],
  'Carte annotée + droits du lecteur, décision humaine et preuve manquante.',
  'Conclure « 9 est correct » sans preuve.',
  ['Situation et intention', 'Mission et ressources', 'Consigne et durée — 60 minutes', 'Production attendue', 'Quatre critères légers de réussite — C02', 'Principe de correction', 'Production de référence — formateur', 'Provenance et validation d’utilisation']);
workshop('MP05', 'À vous : éprouver la carte', 30,
  'CAS FICTIF RH-042 — le RH ne répond pas au brouillon. Échanger les cartes.',
  ['4 min : auteurs, marquer sortie, contrôle et incertitude.',
    '8 min : relecteurs, suivre les flèches ; annoter un manque.',
    '6 min : jouer le silence du RH ; localiser l’arrêt.',
    '8 min : auteurs, réviser et justifier ; conserver les inconnues.',
    '4 min : montrer la révision au groupe relecteur.'],
  'Carte révisée + annotation d’échec + phrase justifiant le changement.',
  'Silence ≠ accord ; aucun défaut inventé.',
  ['Situation, intention et mission', 'Ressources et organisation', 'Consigne et durée', 'Scénario d’échec et exemple de lecture', 'Production attendue et critères légers', 'Principe de correction', 'Provenance et condition de disponibilité']);
add('MP06', '01', 'CONSOLIDER', 'Ancrer entrée, responsabilité et validation.',
  ['Intention et phrase à retenir', 'CONSOLIDER — trois repères et retour illustré', 'Déroulé formateur', 'Provenance'],
  'Contraste Lire / Corriger et trois règles déjà présents dans MP06.',
  { type: 'A_RETENIR', contraste: ['Lire', 'Corriger'],
    phrase: 'Suivez la demande, nommez qui agit et situez qui valide avant toute action.',
    regles: ['Nommer la demande et les données utiles.', 'Nommer qui agit et avec quels droits.', 'Situer qui peut autoriser ou refuser l’action.'],
    prochaineEtape: 'Examiner les données qui circulent et les contrôles à instruire.' },
  { vigilance: ['Ne pas attribuer aux participants un résultat avant la séance.'] });

export const projection = entries;

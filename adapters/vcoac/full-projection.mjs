// Projection éditoriale depuis l'état pédagogique 036dd3b. Aucun fond nouveau.
// Le pilote est importé sans retouche ; les sections intégrales restent en notes
// selon l'option B choisie par l'utilisateur le 12 octobre 2026.
import { projection as module2 } from './projection.mjs';

const cards = (titre, pairs, aRetenir) => ({ type: 'CARTES', titre, variante: { disposition: 'colonnes', entete: 'numero' }, cartes: pairs.map(([titre, corps]) => ({ titre, corps })), ...(aRetenir ? { aRetenir } : {}) });
const sheet = (titre, rows, pied) => ({ type: 'FICHE_OUTIL', titre, champs: rows.map(([nom, consigne]) => ({ nom, consigne })), pied });
const workshop = (titre, minutes, contexte, etapes, livrable, criteres, nonAccepte) => ({
  type: 'CONSIGNE_ATELIER', titre,
  modalites: [{ texte: `${minutes} min de pratique`, style: 'jaune' }, { texte: '2 binômes + 1 trinôme' }, { texte: 'Papier / support partagé', style: 'contour' }],
  contexte, etapes, livrable, criteres, nonAcceptes: [nonAccepte],
});
const retain = (contraste, phrase, regles, prochaineEtape) => ({ type: 'A_RETENIR', contraste, phrase, regles, prochaineEtape });
const entries = [];
function add(moment_id, suffix, phase, objective, sections, reason, screen, notes = {}) {
  entries.push({ slide_id: `${moment_id}-${suffix}`, moment_id, phase, objective, sections, reason, visual: 'Natif, sans asset externe', screen, notes });
}

export const opening = {
  slide_id: 'AOD-OUVERTURE-01', source_id: 'AOD-OUVERTURE', phase: 'CADRE',
  objective: 'Situer les quatre productions successives dans une même journée sur données fictives.',
  sections: ['Ouverture — 15 minutes', 'Progression des productions', 'Horaire relatif hors pauses', 'Faisabilité et matériel'],
  reason: 'Un programme commun porte le positionnement et le parcours ; aucun intertitre de module ajouté.',
  visual: 'Programme natif, sans asset externe',
  screen: {
    type: 'PROGRAMME', entete: 'Act-On Data · 7 h hors pauses · données fictives', titre: 'Quatre productions pour décider d’un usage IA',
    colonnes: [
      { titre: 'Qualifier puis concevoir', modules: [
        { n: '1', titre: 'Borner la délégation', duree: '50 min', atelier: 'Grille et phrase de décision' },
        { n: '2', titre: 'Cartographier RH-042', duree: '140 min', atelier: 'Carte des flux, droits et validations' },
      ] },
      { titre: 'Contrôler puis argumenter', modules: [
        { n: '3', titre: 'Conditionner l’usage', duree: '100 min', atelier: 'Carte annotée et trois lignes de risques' },
        { n: '4', titre: 'Argumenter la valeur', duree: '100 min', atelier: 'Canvas et prochain pas vérifiable' },
      ] },
    ],
  },
  notes: { transition: 'Commencer par le brouillon de procédure d’absence ; RH-042 apportera ensuite les pièces D1–D3.', vigilance: ['15 min : objectif 5, tour bref 5, parcours et groupes 5. Ces échanges ne sont pas comptés comme pratique.', 'Sept participants est une hypothèse d’animation. Les 30 min hors modules incluent ouverture, transitions et clôture.'] },
};

// M1 : le choix de délégation précède la carte du workflow.
add('AOD-M01-MP01', '01', 'VOIR', 'Observer trois façons de préparer le même brouillon RH.',
  ['VOIR — un résultat, trois façons de le préparer', 'Déroulé formateur — 20 minutes, 0 minute de pratique'],
  'Les trois variantes partagent le même résultat ; cartes comparables, sans simuler une interface.',
  cards('Un brouillon RH, trois façons de préparer la suite', [
    ['Assistant', 'Le gestionnaire choisit les pièces, fournit l’extrait et relance le chat.'],
    ['Workflow', 'Les étapes et les branches suivent un chemin prédéfini jusqu’à la revue RH.'],
    ['Agent', 'Le modèle choisit ses consultations dans le corpus autorisé selon les résultats.'],
  ], 'CAS FICTIF — brouillon soumis au RH ; justificatif médical inutile écarté.'),
  { relance: 'Dans quelle variante avons-nous délégué le choix de la prochaine action ?', reponse: 'Dans la variante agentique. Le livrable identique ne suffit pas à distinguer les fonctionnements.' });
add('AOD-M01-MP01', '02', 'COMPRENDRE', 'Distinguer autonomie, permission d’action et validation humaine.',
  ['Message essentiel', 'COMPRENDRE — reconnaître la latitude de décision', 'Consolidation et matériel'],
  'Deux confusions et leur correction ; la comparaison précédente reste le point d’appui.',
  { type: 'OPPOSITION_LIGNES', titre: 'L’autonomie reste bornée par les droits', entetes: ['Confusion', 'Repère de conception'],
    lignes: [
      { idee: 'Tout workflow avec IA est un agent.', reponse: 'Un branchement prédéfini reste prévu par le programme.' },
      { idee: 'Un agent peut envoyer ou modifier la paie.', reponse: 'Choisir une consultation ne donne aucun droit d’envoi ou d’écriture.' },
    ], regle: 'Préciser qui choisit la suite, avec quels droits, et qui peut arrêter.' },
  { transition: 'Qualifier la demande avec les six rubriques en MP02.', vigilance: ['Une boucle agentique doit servir un besoin d’adaptation ; aucun gain n’est démontré par ce cas.'] });
add('AOD-M01-MP02', '01', 'AGIR', 'Justifier la délégation et borner le brouillon dans la grille existante.',
  ['AGIR — choisir ce que l’on délègue', 'Support réutilisé — grille de conception d’un agent', 'Consigne participant — une slide', 'Gabarit et données utiles', 'Exemple rempli et principe de correction — notes formateur'],
  'Une consigne pour les quatre étapes ; six rubriques visibles et critères détaillés conservés dans les notes.',
  workshop('À vous : borner la délégation', 20,
    'CAS FICTIF — brouillon RH. Objectif, Contexte, Actions, Boucle, Limites, Contrôle.',
    ['4 min : choisir assistant, workflow ou agent ; justifier.', '8 min : remplir les six rubriques et les permissions.', '6 min : confronter une permission ou une validation.', '2 min : réviser la décision et nommer une inconnue.'],
    'Six réponses + une décision justifiée avec une inconnue.',
    ['Délégation et action interdite explicites.', 'Revue RH capable de corriger, refuser ou arrêter.'], 'Inventer la procédure absente ou des droits salarié.'),
  { reponse: 'Assistant, workflow ou agent sont recevables si la justification tient. La procédure absente doit être demandée. Le groupe produit ses six réponses avant de voir le corrigé.', transition: 'Conserver la grille pour reformuler la limite d’autonomie.', vigilance: ['La confrontation se fait en rotation ; aucune longue restitution plénière à ajouter.'] });
add('AOD-M01-MP03', '01', 'AGIR', 'Produire une phrase expliquant le choix de la suite et la condition d’arrêt.',
  ['AGIR — consigne participant, une slide', 'Principe de correction — notes formateur'],
  'Une micro-activité de cinq minutes, distincte des cinq minutes de consolidation ; aucun temps recompté.',
  workshop('À vous : formuler la limite d’autonomie', 5,
    'Reprenez votre grille : résultat, choix de la suite, droits, refus et arrêt.',
    ['2 min : écrire une phrase qui relie ces repères.', '2 min : l’expliquer au binôme voisin.', '1 min : corriger et souligner une limite.'],
    'Une phrase révisée et une limite soulignée.',
    ['Qui choisit la suite est explicite.', 'Une condition observable permet d’arrêter.'], 'Confondre objectif demandé et permission d’agir.'),
  { reponse: 'Si la limite est « l’IA doit être fiable », demander une condition observable d’arrêt. Le corrigé RH-042 est disponible dans les sections sources.' });
add('AOD-M01-MP03', '02', 'CONSOLIDER', 'Ancrer la limite de délégation et ouvrir la cartographie RH-042.',
  ['CONSOLIDER — cinq minutes formateur', 'Provenance Knowledge → sources'],
  'Consolidation courte et transition intégrée vers M2 ; la phrase produite accompagne ensuite la carte.',
  retain(['Objectif', 'Permission'], 'Une demande précise le résultat ; les droits et la reprise humaine doivent rester explicites.',
    ['Nommer qui choisit la suite.', 'Borner les actions et les droits.', 'Nommer qui refuse et quand arrêter.'],
    'RH-042 : 8 affichés, 9 suggérés sans preuve. M2 rend ces responsabilités visibles sur une carte.'),
  { transition: 'Dans les trois minutes hors module, mettre D1–D3 à disposition. Conserver la phrase avec la future carte.', vigilance: ['La démonstration n8n compte des éléments ; ses nombres ne prouvent pas le compteur de congés RH-042.'] });

// M2 : référence éditoriale validée, ordre, contenu, notes et IDs conservés.
entries.push(...module2);

// M3 : reprendre la carte, examiner les expositions et instruire un contrôle.
add('AOD-M03-MP01', '01', 'VOIR', 'Observer les deux nouveaux trajets introduits par un compte personnel et un partage élargi.',
  ['VOIR — scène et pièces à projeter', 'Déroulé formateur', 'Repère de lecture et consolidation'],
  'Trois événements de l’incident fictif, lisibles sur un écran ; aucune capture ni sortie réelle prétendue.',
  cards('Deux nouveaux trajets exposent RH-042', [
    ['Copie hors cadre', 'D1, D2 et D3 quittent la carte prévue pour un chat personnel non autorisé.'],
    ['Réponse non vérifiée', 'Le chat affirme que 9 est correct et propose une correction, sans pièce nouvelle.'],
    ['Partage élargi', 'La réponse rejoint un espace partagé dont les lecteurs sont inconnus.'],
  ], 'INCIDENT FICTIF — stockage, réutilisation et lecteurs effectifs restent inconnus.'),
  { relance: 'Quelles frontières de notre carte ont disparu alors que l’outil semblait seulement écrire ?', reponse: 'Le trajet autorisé et la revue prévue ont été contournés ; aucune preuve ne justifie 9.', vigilance: ['Ne pas attribuer cet incident au client ni supposer un entraînement fournisseur sur les données.'] });
add('AOD-M03-MP02', '01', 'COMPRENDRE', 'Distinguer les catégories de données avant de discuter des contrôles.',
  ['Messages essentiels', 'COMPRENDRE — repères et limites', 'Exemple — CAS FICTIF RH-042'],
  'Trois catégories sur un écran ; nuances, inférences et repères juridiques intacts dans les notes.',
  cards('La catégorie dépend de la donnée et du contexte', [
    ['Donnée personnelle', 'Un compteur rattaché à une personne identifiable.'],
    ['Information de santé', 'Le justificatif médical illustre une catégorie particulière, inutile ici.'],
    ['Information confidentielle', 'Une information interne appelle aussi l’examen de ses destinataires.'],
  ], 'Enlever le nom ne garantit pas l’anonymat ; un compteur n’est pas automatiquement une donnée de santé.'),
  { vigilance: ['RH-042 n’exige aucun justificatif médical. Les repères préparent une demande de vérification, pas une qualification juridique du client.'] });
add('AOD-M03-MP02', '02', 'COMPRENDRE', 'Lire les expositions du chat jusqu’aux actions outillées.',
  ["Mise en perspective — du chat à l'action", 'Messages essentiels'],
  'Quatre expositions comparables, sans fabriquer une hiérarchie universelle des risques.',
  cards('Le risque suit la donnée et les permissions', [
    ['Chat', 'La copie suffit à exposer une donnée.'],
    ['Accès documentaire', 'Un corpus trop large peut ouvrir un autre dossier.'],
    ['Workflow', 'Une erreur peut se propager dans les étapes prévues.'],
    ['Agent', 'Les outils agissent selon leurs permissions effectives.'],
  ], 'Shadow AI : usage hors cadre, même avec un outil autorisé utilisé hors périmètre.'));
add('AOD-M03-MP02', '03', 'COMPRENDRE', 'Situer les confirmations métier, techniques et juridiques à demander.',
  ['COMPRENDRE — repères et limites', 'Provenance Knowledge → sources'],
  'Rôles et limites sur trois cartes ; pas de calendrier, classement automatique ou avis de conformité.',
  cards('Une confirmation porte sur une question précise', [
    ['RH', 'Vérifier la procédure et la décision métier.'],
    ['DSI / RSSI', 'Vérifier les droits et les garanties techniques.'],
    ['DPO / juridique', 'Conseil sur le traitement ; finalité et version applicable à instruire.'],
  ], 'Le responsable du traitement conserve sa responsabilité ; aucun accord client n’est supposé.'),
  { vigilance: ['L’article 28 ne résume pas toute la conformité. La réserve documentaire AI Act reste dans les sources ; ne pas ajouter de calendrier.'] });
add('AOD-M03-MP02', '04', 'OUTILLER', 'Lire toute la grille de risque sur un seul support de repérage.',
  ['OUTILLER — grille existante, exemple rempli'],
  'Cinq lignes regroupent les huit dimensions et les deux annotations existantes ; aucune dimension supprimée.',
  sheet('Grille de risque et preuve', [
    ['Risque / donnée', 'Événement … ; donnée ou ressource concernée …'],
    ['Exposition / conséquence', 'Où, vers qui … ; conséquence …'],
    ['Prévention / détection', 'Comment prévenir … ; comment détecter …'],
    ['Validation / preuve', 'Qui peut refuser … ; preuve ou trace …'],
    ['Propriétaire / état', 'Rôle proposé … ; confirmé dans l’exercice / à instruire …'],
  ], 'Reprendre le gabarit complet ; le remplir en MP03.'));
add('AOD-M03-MP02', '05', 'OUTILLER', 'Montrer un contrôle de propagation de la valeur 9 et sa preuve attendue.',
  ['OUTILLER — grille existante, exemple rempli', 'Exemple — CAS FICTIF RH-042'],
  'Une ligne remplie commentée avec ses trois articulations ; grille complète et corrigé en notes.',
  cards('Un contrôle doit produire une preuve observable', [
    ['Exposition', 'D1/D2 puis brouillon et partage : 9 peut devenir une décision non fondée.'],
    ['Contrôle', 'Brouillon sourcé, sans envoi ; comparer aux pièces. Le RH habilité peut refuser.'],
    ['Preuve / état', 'Demande de pièce manquante et état en attente. D3 vaut pour l’exercice seulement.'],
  ], 'CAS FICTIF — règle de l’exercice connue ; capacité du système réel inconnue.'));
add('AOD-M03-MP02', '06', 'OUTILLER', 'Préparer une demande de confirmation et nommer l’action suspendue.',
  ['OUTILLER — grille existante, exemple rempli', 'AGIR — passage aux ateliers suivants', 'CONSOLIDER et minutage'],
  'Le gabarit de confirmation reste entier sur une fiche ; il complète la grille, sans exercice supplémentaire.',
  sheet('Demande de confirmation', [
    ['Usage et donnée', 'Usage … ; donnée … ; destinataire …'],
    ['Permission et question', 'Permission … ; question précise …'],
    ['Rôle et preuve', 'Rôle sollicité … ; preuve attendue …'],
    ['Réponse et arrêt', 'Réponse ou inconnue … ; action suspendue …'],
  ], 'Une case « sécurisé » ou « DPO validé » ne fournit pas la preuve.'),
  { transition: 'Reprendre la carte M2 et analyser trois risques pendant 45 minutes.', vigilance: ['Les six dernières minutes d’outillage montrent grille, exemple et demande ; le remplissage vient dans les ateliers.'] });
add('AOD-M03-MP03', '01', 'AGIR', 'Annoter la carte et relier trois risques à leurs contrôles et preuves.',
  ['AGIR — consigne participant, une slide', 'Pièces et gabarit réutilisable', 'Exemple corrigé — notes formateur', 'Critères légers et principe de correction'],
  'Une consigne pour les cinq étapes ; trois risques nommés, détails de chaque ligne et correction dans les notes.',
  workshop('À vous : analyser les flux RH-042', 45,
    'CAS FICTIF — partage hors cadre, consultation hors périmètre, propagation du 9 non prouvé.',
    ['5 min : relire D1–D3 et l’incident.', '10 min : annoter flux, destinataires et droits.', '20 min : remplir trois lignes de la grille.', '7 min : tester les contrôles avec le groupe voisin.', '3 min : réviser la décision et garder le risque prioritaire.'],
    'Carte + trois lignes + condition de poursuite fictive et inconnue réelle.',
    ['Contrôle, rôle et preuve reliés au risque.', 'Faits fictifs et inconnues réelles séparés.'], 'Autoriser tout faute d’information.'),
  { transition: 'Conserver la ligne prioritaire pour la confrontation MP04.', reponse: 'Retirer les deux flèches ajoutées ; exiger la preuve de refus RH-099 ; maintenir le brouillon en attente sans pièce justifiant 9. Aucun test réel n’a été exécuté.' });
add('AOD-M03-MP04', '01', 'AGIR', 'Défendre un contrôle et réviser la demande de preuve après objection.',
  ['AGIR — consigne participant, une slide', 'Support de décision', 'Principe de correction et exemple', 'Consolidation et provenance'],
  'Une consigne et un seul gabarit de confirmation réutilisé ; deux tours compris dans les huit minutes.',
  workshop('À vous : défendre un contrôle', 20,
    'Reprenez le risque prioritaire. Manager et contradicteur échangent puis inversent les rôles.',
    ['4 min : préciser contrôle, rôle et preuve.', '8 min : deux tours ; demander ce qui ferait arrêter.', '5 min : réviser la ligne et la demande de confirmation.', '3 min : lire les décisions finales, une minute par groupe.'],
    'Une ligne corrigée + une demande de confirmation précise.',
    ['Risque précis et preuve attendue nommés.', 'Action suspendue et suite pédagogique possibles.'], 'Déduire une permission du gain de temps espéré.'),
  { reponse: 'D2 ne démontre pas 9. Garder le brouillon et demander les pièces au RH ; l’écriture reste hors périmètre.', vigilance: ['Avec trois groupes, organiser les objections en triangle. Le DPO ne décide pas seul des permissions métier ou techniques.'] });
add('AOD-M03-MP05', '01', 'CONSOLIDER', 'Fixer les contrôles à conserver avant d’examiner la valeur.',
  ['CONSOLIDER — script et rythme', 'Messages à retenir et correction'],
  'La mini-checklist reprend les productions ; aucune nouvelle activité ni cours juridique.',
  retain(['Inconnue', 'Permission'], 'Une inconnue appelle une preuve ; elle ne permet pas d’élargir l’usage.',
    ['Identifier données et destinataires.', 'Vérifier droits et preuve de refus.', 'Nommer qui peut corriger ou arrêter.'],
    'M4 : vérifier si le gain supposé subsiste en comptant ces contrôles.'),
  { transition: 'Conserver carte, grille et décision. Dans les trois minutes hors module, ouvrir le canvas de valeur.', vigilance: ['Citer une production réellement obtenue ; si elle manque, utiliser le corrigé MP03.'] });

// M4 : le contrôle devient une condition de l'hypothèse de valeur.
add('AOD-M04-MP01', '01', 'VOIR', 'Comparer vitesse ponctuelle et processus réutilisable avec contrôle RH.',
  ['VOIR — deux propositions fictives', 'Intention pédagogique', 'Déroulé et consolidation'],
  'Deux cartes de propositions fictives, sans présenter B comme automatiquement meilleur.',
  cards('Un brouillon rapide, quel travail pour le RH ?', [
    ['A · Gain ponctuel', 'Rédaction plus rapide, mais davantage de revue et de reprises ; prompt lié à son auteur.'],
    ['B · Processus réutilisable', 'Pièces autorisées, brouillon sourcé, contrôle et entretien ; préparation à compter.'],
  ], 'PROPOSITIONS FICTIVES — B doit justifier sa complexité ; le gain reste à mesurer.'),
  { transition: 'Comparer le travail complet en conservant les contrôles de M3.' });
add('AOD-M04-MP01', '02', 'COMPRENDRE', 'Calculer le gain complet de l’exemple fictif en incluant revue et reprises.',
  ['Exemple chiffré — entièrement fictif'],
  'La comparaison affiche toutes les composantes des deux totaux ; calcul initial et limites en notes.',
  { type: 'COMPARAISON_AB', titre: 'Le gain complet inclut revue et reprises', signe: '≠',
    a: { etiquette: 'Référence fictive', titre: '20 minutes humaines', points: ['Préparation 12 + revue 6 + reprises 2.', 'Même résultat acceptable à comparer.'] },
    b: { etiquette: 'Essai fictif', titre: '16 minutes humaines', points: ['Préparation 5 + revue 8 + reprises 3.', 'Gain complet : 4 min, soit 20 %.'] },
    aRetenir: 'CHIFFRES FICTIFS — 58,3 % sur la préparation seule ne mesure pas le gain complet.' },
  { reponse: '120 min initiales / 4 min = 30 dossiers à gain constant. Cette égalité ignore maintenance, licences, variabilité et attente ; elle ne prouve pas une rentabilité.', vigilance: ['Aucun chiffre ni niveau de qualité observé chez Act-On Data.'] });
add('AOD-M04-MP01', '03', 'COMPRENDRE', 'Distinguer temps humain, délai et capacité reproductible avant un engagement de service.',
  ["COMPRENDRE — ce qu'il faudrait observer", 'Exemple chiffré — entièrement fictif'],
  'Trois mesures différentes et leur condition commune ; aucun gain extrapolé au budget ou aux offres.',
  cards('La capacité suppose un résultat acceptable répété', [
    ['Travail complet', 'Compter préparation, revue, reprises et entretien.'],
    ['Délai de bout en bout', 'L’attente du relecteur peut rester le goulot.'],
    ['Capacité', 'Vérifier les demandes acceptables traitées avec les ressources disponibles.'],
  ], 'Même résultat acceptable, situations comparables ; aucun engagement de volume ou de délai sans mesure.'),
  { transition: 'Préparer les preuves dans le canvas ; remplissage pendant MP03.' });
add('AOD-M04-MP02', '01', 'OUTILLER', 'Montrer les quatre rubriques qui rendent la valeur testable.',
  ['OUTILLER — usage et gabarit', 'Conseils et principe de correction'],
  'Sept rubriques dépassent la capacité du type ; séparation justifiée en quatre puis trois, sans nouveau canvas.',
  sheet('Canvas de valeur — hypothèse', [
    ['Besoin', 'Bénéficiaire … ; résultat acceptable …'],
    ['Référence', 'Faits … ; inconnues …'],
    ['Hypothèse', 'Valeur … ; mécanisme … ; mesure …'],
    ['Travail complet', 'Temps humain … ; qualité … ; délai … ; coût d’exploitation …'],
  ], 'Un même canvas sur une page ; carte et grille de risques annexées.'));
add('AOD-M04-MP02', '02', 'OUTILLER', 'Compléter le même canvas avec contrôle, essai et condition de poursuite.',
  ['OUTILLER — usage et gabarit', 'Conseils et principe de correction'],
  'Les trois dernières rubriques prolongent le même outil ; aucune activité de remplissage anticipée.',
  sheet('Canvas de valeur — décision', [
    ['Limite et contrôle', 'Contrôle hérité de M3 … ; preuve …'],
    ['Essai comparable', 'Protocole … ; responsable proposé … ; date de revue …'],
    ['Condition et prochain pas', 'Poursuivre si … ; arrêter si … ; prochain pas demandé …'],
  ], 'Coût initial séparé ; gains inconnus marqués « hypothèse ».'));
add('AOD-M04-MP02', '03', 'OUTILLER', 'Commenter l’essai fictif rempli sans transformer ses seuils en règle client.',
  ['Exemple rempli à commenter', 'Conseils et principe de correction', 'Déroulé et consolidation'],
  'Un exemple rempli sur quatre cartes ; sept rubriques, protocole et critères intacts dans les notes.',
  cards('RH-042 : une hypothèse à éprouver', [
    ['Résultat / référence', 'Brouillon documenté ; temps actuel inconnu, aucune économie établie.'],
    ['Mesure', 'Temps complet, pièces citées, incertitude visible ; délai séparé.'],
    ['Essai proposé', 'Deux lots de cinq dossiers fictifs comparables ; autre opérateur au second lot.'],
    ['Condition', 'Qualité conservée ; arrêt si accès hors périmètre ou certitude sans preuve.'],
  ], 'Responsable proposé : manager avec revue RH. Aucun seuil réel décidé.'),
  { reponse: 'L’exemple propose une baisse du travail complet avec qualité préservée sur les deux lots. Le groupe peut réviser ou différer.', vigilance: ['Dix dossiers est un volume pédagogique, sans garantie statistique. Une validation absente ne devient pas un accord.'], transition: 'Reprendre carte, contrôle et canvas dans l’atelier de 70 minutes.' });
add('AOD-M04-MP03', '01', 'AGIR', 'Argumenter puis réviser un prochain pas avec une hypothèse de valeur vérifiable.',
  ['AGIR — consigne participant, une slide', 'Dossier de travail autonome', 'Déroulé détaillé — temps entièrement consacré aux productions', 'Questions du contradicteur', 'Exemple de réponse corrigée — notes formateur', 'Critères légers et principe de correction'],
  'Une consigne pour les cinq étapes et les trois angles possibles ; critères détaillés et déroulé des confrontations en notes.',
  workshop('À vous : argumenter un prochain pas', 70,
    'RH-042 : pilote interne, budget de vérification ou service borné. Reprenez carte, risques et canvas.',
    ['8 min : choisir l’angle, le bénéficiaire et le résultat.', '22 min : remplir le canvas et préparer l’argument.', '18 min : deux tours de confrontation en parallèle.', '12 min : réviser une hypothèse, un contrôle ou une mesure.', '10 min : restituer puis écrire la phrase de transfert.'],
    'Une page de décision + une phrase vers budgets, appels d’offres ou services.',
    ['Besoin clair ; valeur testable et hypothèses visibles.', 'Contrôles reliés ; responsable et preuve attendue.'], 'Présenter un gain fictif comme mesuré.'),
  { reponse: 'Poursuivre un essai fictif, réviser ou différer sont recevables. Deux questions utiles par contradicteur suffisent ; aucune revue exhaustive.', vigilance: ['Trois restitutions de 2 min maximum puis 4 min de transfert individuel ; ces 10 min sont déjà comptées.', 'Ni budget monétaire ni promesse de volume inventés.'] });
add('AOD-M04-MP04', '01', 'CONSOLIDER', 'Fixer une condition de poursuite et réunir les productions des quatre modules.',
  ['CONSOLIDER — script', 'Repères et principe de correction'],
  'Une synthèse de cinq minutes, sans refaire la phrase de transfert ni ajouter une évaluation.',
  retain(['Hypothèse', 'Preuve'], 'La prochaine décision dépend d’une valeur à tester, d’un risque à lever et d’une preuve à obtenir.',
    ['Compter travail complet et qualité.', 'Relier le contrôle à une preuve.', 'Poursuivre, réviser ou arrêter.'],
    'Réunir phrase M1, carte M2, grille M3 et canvas M4 avant la clôture commune.'),
  { vigilance: ['La phrase de transfert a déjà été produite pendant MP03 ; ne pas ajouter de pratique au décompte.'] });

export const closing = {
  slide_id: 'AOD-CLOTURE-01', source_id: 'AOD-CLOTURE', phase: 'CONSOLIDER',
  objective: 'Rassembler les quatre productions, retrouver les gabarits et recueillir un retour bref.',
  sections: ['Clôture — 6 minutes', 'Décisions humaines résiduelles, isolées'],
  reason: 'Un bilan commun dans les six minutes réservées, sans engagement obligatoire ni nouvel exercice noté.',
  visual: 'Bilan natif, sans asset externe',
  screen: { type: 'BILAN', titre: 'Un dossier pour préparer la prochaine décision',
    questions: [
      { question: 'Quelles productions emportez-vous ?', aide: 'Phrase de délégation, carte RH-042, grille de risques et canvas de valeur.' },
      { question: 'Quelle preuve manque avant un usage réel ?', aide: 'Reprendre les confirmations inscrites dans votre décision.' },
      { question: 'Quel retour sur la journée ?', aide: 'Un retour bref ; les gabarits restent les supports réutilisables.' },
    ], canal: { etiquette: 'En groupe', texte: 'Six minutes de clôture ; aucune pratique supplémentaire comptée.' },
  },
  notes: { vigilance: ['Les règles et interlocuteurs réels restent à confirmer. L’attestation, si émise, doit correspondre à la conception effectivement réalisée.'] },
};

export const fullProjection = [opening, ...entries, closing];

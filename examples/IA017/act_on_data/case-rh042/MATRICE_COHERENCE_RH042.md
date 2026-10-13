# RH-042 — Matrice de cohérence et compte rendu d'audit

**CAS FICTIF.** Audit par production du 13 octobre 2026, sur le patrimoine local
de la formation Act-On Data. **Verdict final : CAS COHÉRENT.** Le formateur a validé le dossier comme
CAS COHÉRENT AVEC AJUSTEMENTS, puis autorisé leur application le 13 octobre 2026.
Les trois écarts sont résolus ; sept activités et durées conservées.

## Périmètre et convention de comptage

Une activité est ici un moment AGIR où les participants produisent, confrontent
ou révisent un artefact : **7 activités**, **250 minutes de pratique**.
Il ne s'agit pas de 18 ateliers : les **18 moments** incluent aussi apports,
démonstration, présentation des outils et synthèses. Leur couverture est
exhaustive dans le deuxième tableau.

Les sept moments porteurs totalisent **255 minutes**, dont 5 minutes de
consolidation M1-MP03 qui ne sont pas de la pratique. Modules : 390 minutes ;
ouverture 15 + trois transitions de 3 + clôture 6 = 30 minutes ; journée :
420 minutes hors pauses. Pratique : 250/420 = 59,52 %. L'écart catalogue 420/435
est déjà documenté et reste conservé ; les activités n'ont pas été allongées.

**Progression en une phrase :** qualifier la délégation pour un brouillon RH,
la préciser avec RH-042, cartographier et éprouver ses flux, analyser un incident
Shadow AI, défendre les contrôles puis argumenter la valeur et les conditions
d'un prochain pas.

Sources maîtres : [formation.json](../formation.json),
[readiness finale](../readiness-finale.md), [conduite](../conduite-session.md),
les 18 contenus ci-dessous et les fiches Knowledge citées. Le mapping complet
existant a été consulté uniquement pour la correspondance des activités :
`outputs/vcoac/IA017-act-on-data-full-mapping.md` et son manifeste intermédiaire.
Les 42 identifiants correspondent à la
[projection complète](../../../../adapters/vcoac/full-projection.mjs), qui importe
le [pilote M2](../../../../adapters/vcoac/projection.mjs). Aucun nouveau deck,
rendu ni changement du moteur n'est nécessaire au dossier.

## Matrice des activités

Les numéros de slides sont ceux du **mapping complet à 42 slides**, pas du pilote
M2 à 17 slides. Ils sont des repères facultatifs d'animation ; le fond des
consignes et corrections vient des documents Hector.

| Activité | Compétence travaillée | Module | Moment | Durée pratique / moment | Production | Outil | Correction disponible | Slide associée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 — Qualifier la demande | AOD-C01 : justifier rôle et autonomie | AOD-M01 | AOD-M01-MP02 | 20 / 20 min | Six rubriques et décision avec inconnue | Grille conception | Oui, corrigé activité 1 | 4 — AOD-M01-MP02-01 | Couvert |
| 2 — Limite d'autonomie | AOD-C01 : rendre la limite explicite | AOD-M01 | AOD-M01-MP03 | 5 / 10 min | Phrase révisée, limite soulignée | Grille et phrase M1 existantes | Oui, corrigé activité 2 ; adaptation explicitée | 5 — AOD-M01-MP03-01 ; synthèse 6 | Couvert — I01 résolu |
| 3 — Cartographier | AOD-C02 : représenter flux, rôles et droits ; mobilisation C01 | AOD-M02 | AOD-M02-MP04 | 60 / 60 min | Carte annotée et phrase de frontière | Canvas logique + grille MCP | Oui, corrigé activité 3 | 21 — AOD-M02-MP04-01 | Couvert — I02 résolu ; V01 |
| 4 — Éprouver la carte | AOD-C02 : expliquer, tester et réviser | AOD-M02 | AOD-M02-MP05 | 30 / 30 min | Carte revue, annotation d'échec et motif | Même canvas / grille MCP | Oui, corrigé activité 4 | 22 — AOD-M02-MP05-01 | Couvert ; V01 |
| 5 — Analyser les données | AOD-C03 : relier exposition et contrôle | AOD-M03 | AOD-M03-MP03 | 45 / 45 min | Carte annotée, trois risques, décision fictif/réel | Grille risque + confirmation | Oui, corrigé activité 5 | 31 — AOD-M03-MP03-01 | Couvert |
| 6 — Défendre le contrôle | AOD-C03 : demander preuve, borner arrêt et suite | AOD-M03 | AOD-M03-MP04 | 20 / 20 min | Ligne révisée et demande de confirmation | Grille risque + confirmation | Oui, corrigé activité 6 | 32 — AOD-M03-MP04-01 | Couvert |
| 7 — Prochain pas | AOD-C04 : valeur, capacité et décision ; mobilisation C02/C03 | AOD-M04 | AOD-M04-MP03 | 70 / 70 min | Page de décision et phrase individuelle de transfert | Canvas valeur + productions antérieures | Oui, corrigé activité 7, trois angles traités | 40 — AOD-M04-MP03-01 | Couvert ; essai futur seulement |

Les critères C01–C04 sont ceux de formation.json, explicités dans les énoncés.
Le [corrigé](CORRIGE_FORMATEUR_RH042.md) contient pour chacune des sept activités
intention, attendus, exemple, erreurs, débrief, principe, Knowledge et transition.

## Couverture des 18 moments, sans exercices ajoutés

| Moment | Fonction VCOAC | Durée / pratique | Place réelle et support | Slides complètes |
| --- | --- | --- | --- | --- |
| AOD-M01-MP01 | VOIR + COMPRENDRE | 20 / 0 min | Apport : contraste assistant/workflow/agent ; [source](../content/AOD-M01-MP01.md) | 2–3 |
| AOD-M01-MP02 | AGIR | 20 / 20 min | Activité 1 ; [source](../content/AOD-M01-MP02.md) | 4 |
| AOD-M01-MP03 | AGIR + CONSOLIDER | 10 / 5 min | Activité 2 puis synthèse et annonce 8/9 ; [source](../content/AOD-M01-MP03.md) | 5–6 |
| AOD-M02-MP01 | VOIR + COMPRENDRE | 20 / 0 min | Une démonstration n8n, deux tests de branche ; [source](../content/AOD-M02-MP01.md) | 7–8 |
| AOD-M02-MP02 | COMPRENDRE | 15 / 0 min | Connexions, MCP, comparaison simple/multi-agents ; [source](../content/AOD-M02-MP02.md) | 9–14 |
| AOD-M02-MP03 | OUTILLER | 10 / 0 min | Canvas et six questions MCP, exemples remplis ; [source](../content/AOD-M02-MP03.md) | 15–20 |
| AOD-M02-MP04 | AGIR | 60 / 60 min | Activité 3 ; [source](../content/AOD-M02-MP04.md) | 21 |
| AOD-M02-MP05 | AGIR | 30 / 30 min | Activité 4 ; [source](../content/AOD-M02-MP05.md) | 22 |
| AOD-M02-MP06 | CONSOLIDER | 5 / 0 min | Entrée, responsabilité, validation ; [source](../content/AOD-M02-MP06.md) | 23 |
| AOD-M03-MP01 | VOIR | 10 / 0 min | Incident RH-042, deux flèches ajoutées ; [source](../content/AOD-M03-MP01.md) | 24 |
| AOD-M03-MP02 | COMPRENDRE + OUTILLER | 20 / 0 min | Risques, rôles, grille et confirmation ; [source](../content/AOD-M03-MP02.md) | 25–30 |
| AOD-M03-MP03 | AGIR | 45 / 45 min | Activité 5 ; [source](../content/AOD-M03-MP03.md) | 31 |
| AOD-M03-MP04 | AGIR | 20 / 20 min | Activité 6 ; [source](../content/AOD-M03-MP04.md) | 32 |
| AOD-M03-MP05 | CONSOLIDER | 5 / 0 min | Relecture de l'incident et passage à la valeur ; [source](../content/AOD-M03-MP05.md) | 33 |
| AOD-M04-MP01 | VOIR + COMPRENDRE | 15 / 0 min | Production/capacité, calcul expliqué et fictif ; [source](../content/AOD-M04-MP01.md) | 34–36 |
| AOD-M04-MP02 | OUTILLER | 10 / 0 min | Canvas valeur et exemple ; [source](../content/AOD-M04-MP02.md) | 37–39 |
| AOD-M04-MP03 | AGIR | 70 / 70 min | Activité 7 ; [source](../content/AOD-M04-MP03.md) | 40 |
| AOD-M04-MP04 | CONSOLIDER | 5 / 0 min | Conditions de poursuite, regroupement ; [source](../content/AOD-M04-MP04.md) | 41 |

Cadre hors moments : ouverture 15 min (slide 1), transitions 3 × 3 min (reprises
existantes), clôture 6 min (slide 42). Aucun nouveau moment artificiel.
Pas d'atelier MCP autonome, de configuration d'agent, de calcul des droits RH,
de charte complète ni de déploiement opérationnel dans le plan actuel. La
gouvernance est travaillée en activités 5/6 ; la trajectoire est une décision
conditionnelle en activité 7. Claude Code n'a pas de moment dédié dans ces
18 contenus : aucune démonstration supplémentaire n'est ajoutée.

## Outils, exemples et templates

Les [énoncés](ACTIVITES_RH042.md) reprennent les supports vierges utiles aux
moments où ils sont distribués. Il ne s'agit pas de nouveaux outils.

| Activité / usage | Outil existant | Exemple rempli disponible ? | Template vierge disponible ? |
| --- | --- | --- | --- |
| 1 | [MET-GRILLE-CONCEPTION-AGENT](../../../../knowledge/methods/grille-conception-agent.md), six rubriques | Oui, RH dans [M1-MP02](../content/AOD-M01-MP02.md) et corrigé 1 | Oui, M1-MP02 ; repris dans le dossier d'entrée |
| 2 | Même grille et phrase de limite M1 | Oui, corrigé 2 ; source ajustée — I01 résolu | Oui, phrase à compléter M1-MP03, reprise dans l'énoncé |
| 3 | [Canvas logique M2-MP03](../content/AOD-M02-MP03.md), adaptation de la grille conception | Oui, six rubriques et annotations RH-042 ; corrigé 3 | Oui, six rubriques et zone de dessin reprises dans les énoncés |
| 3 et 4 | [MET-CONNEXION-MCP](../../../../knowledge/methods/grille-connexion-mcp.md) | Oui, méthode et six réponses M2-MP03 ; corrigé 3 | Oui, six questions ; reprises dans les énoncés |
| 4 | Carte produite en 3, quatre critères C02 et phrase de révision | Oui, révision M2-MP05 et corrigé 4 | Oui, carte vierge précédente et phrase à compléter ; pas de nouvel outil requis |
| 5 et 6 | [MET-GRILLE-RISQUE-IA](../../../../knowledge/methods/grille-risque-usage-ia.md) | Oui, bibliothèque, cas générique et trois lignes RH-042 du corrigé 5 | Oui, huit colonnes et compléments ; repris dans les énoncés |
| 5 et 6 ; appui 7 | [MET-REVUE-RH](../../../../knowledge/methods/revue-rh-avant-usage.md) | Oui, méthode et demande détaillée du corrigé 6 | Oui, cinq entrées de confirmation ; reprises dans les énoncés |
| 7 | [MET-VALEUR-WORKFLOW](../../../../knowledge/methods/verifier-valeur-workflow.md) et gabarit M4-MP02 | Oui, méthode, M4-MP02 et corrigé 7 | Oui, sept rubriques ; reprises dans les énoncés |
| Apport M2-MP02, appui 3/7 | [MET-CHOIX-ORCHESTRATION](../../../../knowledge/methods/comparer-workflow-multi-agents.md) | Oui, comparaison RH-042 | Oui dans Knowledge ; pas un livrable supplémentaire exigé |
| Démonstration M2-MP01 | [OUT-N8N-DEMO-FICTIVE](../../../../knowledge/tools/n8n-demonstration-fictive.md) et [guide](../demo-n8n/README.md) | Oui, cinq blocs et résultats A/B déclarés PASS | Procédure et checklist disponibles ; pas d'export JSON importable fourni ni requis |

**Templates manquants : aucun indispensable aux sept activités sur papier.**
Pas de fichier Miro/Drive prêt à dupliquer ni d'export n8n dans les sources ;
ces formats ne sont pas requis. L'absence des dix dossiers d'un éventuel essai
de valeur n'est pas un template manquant pour l'activité 7 : celle-ci prépare
le plan, sans réaliser cet essai.

## Informations progressives et disponibilité réelle

| Moment de mise à disposition | Ce qui arrive | Ce qui reste absent ou réservé | Usage permis |
| --- | --- | --- | --- |
| Départ / M1-MP01–02 | Besoin de brouillon, catégories de données, limites et six rubriques | Texte de procédure, données chiffrées, incident, corrigés | Choisir et borner la délégation |
| Fin M1-MP03 puis transition | Annonce 8/9 puis D1–D3 et permissions | Détail des événements D2 ; procédure métier complète | Cartographier le traitement du manque |
| M2-MP01 | Deux tests n8n sur nombres d'éléments | Aucun lien opérationnel avec les jours RH ; pas d'agent IA | Observer le branchement |
| M2-MP02–03 | Connexions, canvas, grille MCP et exemples prévus | Compatibilité, droits et tests réels non établis | Concevoir et justifier la carte |
| Activité 4, étape 3 | RH habilité sans réponse | Aucun accord, aucune nouvelle preuve | Éprouver la règle déjà conçue |
| M3-MP01–02 | Incident avec D1–D3, flèches et outils risques | Fournisseur, stockage, réutilisation, lecteurs réels inconnus | Analyser et demander les confirmations |
| M4-MP01–02 | Contrastes et chiffres illustratifs, canvas | Temps réels, prix, volume, dix dossiers futurs non fournis | Proposer une mesure et une décision |

La séparation du dossier d'entrée et du master réduit les révélations précoces
dans les documents produits. Elle ne masque pas les limites des sources :
l'exemple M2-MP03 donne déjà une grande partie des réponses, et le dossier
Knowledge intégral contient l'épreuve de revue. Voir V01/V02 ; le formateur
applique la distribution progressive validée.

## Ajustements validés et appliqués

**I01 — résolu.** Le corrigé M1-MP03 reste sur la procédure d’absence manquante.
Il ne cite plus les valeurs du compteur pendant les cinq minutes de pratique.
L’annonce 8/9 reste en fin de consolidation, puis D1–D3 à la transition M1/M2.
Le corrigé du dossier reprend exactement ce niveau d’information.

**I02 — résolu.** M2-MP02, MP03 et MP06 présentent RH-042 comme le cas retenu.
M2-MP04, MP05, AOD-D02, l’hypothèse H04, l’alerte AL06 et la fiche du cas
enregistrent la validation du dossier. La distribution se fait par épisode ;
aucune nouvelle donnée ni architecture n’est ajoutée.

**I03 — résolu.** Le résumé de M2-MP01 et AOD-D05 enregistrent l’exécution et
la validation formateur du 12 octobre 2026 : A, 8/9 éléments → incomplet PASS ;
B, 8/8 éléments → complet PASS. Portée limitée à ces deux branches, sans
agent IA, API externe ou validation RH. Aucun nouveau test n8n n’est prétendu.

**Traçabilité.** Les empreintes de readiness et des deux verrous de sources
VCOAC sont actualisées après revue de ces corrections autorisées. Les projections
écran restent inchangées ; seules les sources et notes qui en dérivent changent.
Les références de régression sont alignées sur cette version corrigée. Aucune
modification de PowerPoint ou de machine_vcoac. Les dates Knowledge de
vérification et les seuils de fraîcheur ne sont pas renouvelés.

## Points de vigilance — sans les présenter comme de nouveaux blocages métier

**V01 — Exemple et corrigé très proches.** Le canvas rempli M2-MP03 décrit déjà
RH-042, ses limites et sa revue avant la carte à produire en MP04. Celle-ci
demande pourtant que la référence formateur ne soit pas copiée avant le travail.
Un exemple guidé est prévu et utile, mais le résultat final seul ne démontre pas
une conception autonome. Conserver les exemples validés ; examiner surtout les
justifications, les objections et les révisions. Si le formateur veut mesurer
une résolution indépendante, il devra arbitrer l'exposition du modèle ; aucun
autre cas ni nouvelle évaluation n'a été ajouté ici.

**V02 — Distribution intégrale trop révélatrice.** Le dossier Knowledge RH-042
contient l'épreuve MP05 et ses conséquences ; les contenus mélangent souvent
gabarits et corrigés. Distribuer ces fichiers entiers au départ révélerait la
suite. Les documents produits séparent entrée, épisodes et corrigés. Le master
des activités doit lui aussi être distribué par sections. Ce choix logistique
est validé ; aucune garantie de non-divulgation si les sources complètes
sont remises d'emblée.

**V03 — Homonymie des nombres.** n8n utilise 8/9 éléments puis 8/8 ; RH-042
utilise 8/9 jours. Les sources détaillées le distinguent déjà : ce n'est pas
une contradiction métier. Le dossier répète cette distinction ; « complet »
n'est jamais assimilé à « conforme », « exact » ou « validé par RH ».

**Décisions résiduelles déjà connues :** organisation effective des groupes, éventuelle attestation et transfert réel.
La validation du dossier et de ses ajustements est acquise.
Les statuts historiques `proposition_a_valider` ne sont pas assimilés à la
readiness de production, comme le précise déjà formation.json. Les règles
client ouvertes ne doivent pas être inventées. Rien dans cet audit n'étend le
périmètre à une réalisation technique ou à un déploiement.

## Résultat des contrôles de cohérence

| Contrôle demandé | Résultat et limite |
| --- | --- |
| Aucune activité sans objectif clair | 7/7 intentions reliées à C01–C04 ; prérequis et transition visibles |
| Aucune activité sans production | 7/7 artefacts définis, avec remise/restitution ; les apports n'ont pas de faux livrable |
| Aucun outil vide quand un exemple est nécessaire | Exemples et supports vierges localisés ; six supports principaux de travail disponibles |
| Corrigé conforme à la consigne | 7/7 corrections présentes ; I01 corrigé dans la source et le dossier |
| Aucune donnée exigée mais absente | D1–D3 et incident reproduits ; procédure/D2/accès/mesures absents sont des inconnues à traiter, jamais des résultats à inventer |
| Pas d'information trop tôt | Dossier d'entrée sans valeurs ni incident ; épisodes datés par moment ; I01 résolu ; V01/V02 encadrés par la distribution progressive validée |
| Pas de doublon inutile | 1→2 : développer puis formuler ; 3→4 : concevoir puis éprouver ; 5→6 : analyser puis défendre ; 7 : décider en intégrant le contrôle |
| Montée en compétences | Délégation → carte discutable → contrôle avec preuve → valeur conditionnelle ; toutes les productions sont réemployées |
| Cohérence des outils | Papier suffisant ; MCP discuté, n8n observé ; aucune connexion obligatoire ni outil nouveau |
| Déploiement | Décision et conditions d'essai seulement ; aucun déploiement réalisé ou promis |

## Vérification automatisée

Le fichier [case-rh042.test.mjs](case-rh042.test.mjs) contrôle directement les
documents produits contre les sources existantes, sans manifeste pédagogique
supplémentaire : couverture des activités et des moments, durées, ressources
locales, identifiants Knowledge, absence de ressources de test et correspondance
avec les slides de consigne. Les contrôles ne prétendent pas valider la qualité
d'une animation réelle ou l'exécution de n8n/MCP.

Résultat après corrections du 13 octobre 2026 : **238/238 tests réussis**,
zéro échec, aucun test ignoré ni annulé. Les sept contrôles documentaires RH-042
passent ; le diagnostic portable passe aussi. Le contrôle de fraîcheur au
13 octobre retourne **2 warnings** (n8n et repères réglementaires), **0 error**.
Commande : `node --test --test-reporter=spec`, hors sandbox Windows pour éviter
l'erreur EPERM de résolution de chemins. Les warnings demandent une vérification
avant usage ; ils ne sont pas des tests ignorés ou des succès artificiels.
[Journal complet](tests-hector.log).

**Fraîcheur : avertissement, structure : erreur.** Le diagnostic portable
échouait sur deux vérifications du 12 octobre : n8n et repères réglementaires,
dont le plan exige une vérification d’usage au moment de la session.
La fonction freshness et ses seuils sont conservés : ces informations restent
à réactualiser le 13 octobre. validateResearchPlan distingue désormais :

- information fraîche : OK, aucun avertissement ;
- information datée mais à réactualiser : warning coverage_refresh_needed ;
- structure incohérente, référence indispensable absente, couverture partielle
  déclarée complète ou fraîcheur non vérifiable : error, plan invalide.

La lecture reste disponible avec les avertissements, visibles dans le cockpit.
Les statuts enregistrés et toutes les dates de vérification restent inchangés ;
la lecture ne les réécrit pas. Un warning n’autorise pas un usage réel et ne
remplace pas la vérification à la session. Des tests couvrent le passage du
12 au 13 octobre, la conservation des dates et le refus d’une référence absente.
Voir [règle de validation](../../../../core/research.mjs) et
[tests de fraîcheur](../../../../core/research.test.mjs).

## Livrables et arrêt de l'audit

- [Dossier participant](DOSSIER_PARTICIPANT_RH042.md) : entrée sans révélation anticipée.
- [Activités](ACTIVITES_RH042.md) : sept énoncés, quatre épisodes et gabarits réemployés.
- [Corrigé formateur](CORRIGE_FORMATEUR_RH042.md) : vue en deux minutes et sept corrections.
- Présente matrice : couverture, outils, écarts, limites et verdict.
- Contrôles ciblés et journal d'exécution des tests.

**Corrections manquantes : aucune des sept. Templates indispensables manquants :
aucun. Les trois décalages documentaires sont résolus. CAS COHÉRENT.**

Aucune recherche externe, aucun changement de logique pédagogique, aucune
modification de PowerPoint ou de machine_vcoac. La validation du dossier est
acquise ; attestation éventuelle et conditions d’un usage réel restent à instruire
séparément. Commit et push autorisés après réussite des tests fonctionnels.

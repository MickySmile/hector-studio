# Cycle externe — risques IA et données RH

Date : 12 octobre 2026. Examen : Codex, soumis à validation utilisateur avant commit.

## Cadrage et périmètre

Question directrice reçue : « Quels risques spécifiques crée l’utilisation d’IA générative ou agentique avec des données RH et quels contrôles organisationnels, techniques et humains doivent être mis en place ? »

Rattachement **confirmé par l’utilisateur pendant ce cycle** à la seule question
`IA017-ACT-ON-DATA-R-fec8b45a3751` : « Quels risques documentés de Shadow AI sont pertinents pour les flux RH et outils envisagés ? »
Usage : `AOD-M03 / AOD-M03-MP02`, COMPRENDRE + OUTILLER, compétence AOD-C03.
Formulation, origine VCOAC, objectif et preuve attendue conservés. Les sept autres
questions du plan et tout le scénario Programme seul restent inchangés.

La formation doit permettre de qualifier donnée et usage, décrire une exposition,
en expliquer la conséquence, proposer prévention/détection/contrôle humain et
identifier la preuve et l’interlocuteur à solliciter. Distinguer données personnelles,
catégories particulières, inférences et confidentialité interne ; conversation,
RAG, workflow, agent avec outils et usages décisionnels RH. Il ne s’agit pas de
prononcer une conformité client ou de préparer une mise en production.

## Recherche interne effectuée avant le Web

Corpus initial : six fiches. Recherche effective via `loadKnowledge` et
`searchKnowledge`, fraîcheur 180 jours, date de contrôle 2026-10-12.

| Requête | Résultat interne initial | Apport / lacune |
| --- | --- | --- |
| risques IA données RH | CON-AGENT-IA, MET-GRILLE-CONCEPTION-AGENT puis les quatre sources | Repères généraux, aucun risque RH documenté |
| shadow AI | SRC-GOOGLE-AGENTIC-DESIGN, SRC-NIST-AGENT-STANDARDS | Match sur « AI » seulement, aucun apport Shadow AI |
| confidentialité données RH IA | Concept et méthode agents puis les quatre sources | Mots IA/RH, pas de doctrine de confidentialité |
| agent IA permissions | Concept, méthode, source NIST notamment | Actions et permissions identifiées ; contrôles détaillés absents |
| supervision agent | Les six fiches, sur le mot agent | Contrôle général, pas de grille risques/preuves |
| utilisation ChatGPT données salariés | MET-GRILLE-CONCEPTION-AGENT | Match sur « utilisation », pas de connaissance sur données salariés |

Réutilisation : vocabulaire d’agent et principe de contrôle déjà capitalisés.
Lacunes seules recherchées : expositions RH, gouvernance des usages non encadrés,
contrôles techniques, repères RGPD et qualification conditionnelle AI Act.
Aucun résultat lexical initial n’a été jugé suffisant.

## Sources consultées et retenues

Quatre fiches sources regroupent les pages d’un même ensemble documentaire.
Les URLs et dates par document figurent dans ces fiches :

- [CNIL, FAQ d’utilisation d’IA générative](../../../knowledge/sources/cnil-usage-ia-generative.md) : sections 2, 5–9.
- [ANSSI, guide de sécurité](../../../knowledge/sources/anssi-securite-ia-generative.md) : PDF, chapitre 4 et recommandations repérées.
- [RGPD reproduit par la CNIL](../../../knowledge/sources/rgpd-reperes-donnees-rh.md) : chapitres I à V, articles ciblés.
- [Commission européenne / Service Desk](../../../knowledge/sources/ue-ai-act-usages-rh.md) : articles 6 et 26, annexe III §4, calendrier Omnibus.

Accès Web disponible, recherche et lecture via l’outil Web de l’environnement.
Aucune API Perplexity configurée, aucun service externe payant acheté.
La vérification est une lecture documentaire réelle au jour indiqué, pas une
validation juridique de l’usage réel. Le corpus suffit au cadrage pédagogique ;
aucune recherche sur les autres modules n’a été entreprise.

## Écartés ou non retenus

- Les URLs EUR-Lex tentées pour RGPD, AI Act et texte Omnibus ont renvoyé un contrôle JavaScript ou le sommaire du JO. Elles ne servent pas de preuve d’une lecture des textes. Repli sur reproductions officielles ; réserve conservée pour la consolidation AI Act.
- Le lien canonique de l’annexe III a échoué ; sa variante indexée avec paramètre a fourni le texte effectivement lu.
- La page Commission « Guidelines for providers and deployers » présente des lignes directrices encore qualifiées de projet : pas de fondement obligatoire retenu.
- La section AI Act de la FAQ CNIL de 2024 n’est pas retenue pour le calendrier actuel.
- Résultats de presse, Reddit, cabinets, agrégateurs et projets législatifs anciens affichés par le moteur : non retenus comme preuve. Pas de statistiques de Shadow AI ni d’incident réel ajouté.
- Aucun besoin résiduel n’imposait une documentation fournisseur, EDPB ou NIST supplémentaire. Aucune garantie propre à ChatGPT/Copilot n’est affirmée.

## Capitalisation et distinction des supports

Nouvelles fiches :

1. `CON-SHADOW-AI` — définition opérationnelle des usages hors cadre.
2. `CON-RISQUES-IA-RH` — distinctions et registre des claims G1–G6, C2, A1–A3, J1–J3.
3. `MET-GRILLE-RISQUE-IA` — méthode Hector avec support vierge, contrôles et conditions d’arrêt proposés.
4. `CAS-RH-REPONSE-FICTIF` — exemple rempli, sans TP complet ni fait client inventé.
5. `SRC-CNIL-USAGE-IAG`.
6. `SRC-ANSSI-SECURITE-IAG`.
7. `SRC-RGPD-REPERES-RH`.
8. `SRC-UE-AIACT-RH`.

Obligations juridiques : articles RGPD et dispositions AI Act conditionnelles,
avec réserve sur le calendrier et l’application. Recommandations institutionnelles :
CNIL. Bonnes pratiques de sécurité : ANSSI, sans force obligatoire générale déduite.
Synthèses Hector : définition de Shadow AI, distinctions illustrées, grille,
mesures concrètes proposées et cas fictif. Chaque claim important porte une nature,
une confiance, un repère de source et une date de vérification. Les sources donnent
les dates disponibles et la provenance ; les inconnues restent explicites.

## Réexamen de la seule question sélectionnée

**Avant :** `external_research_needed`, aucun match enregistré.
**Après :** `covered` sur le plan pédagogique, par examen sémantique attribué à
Codex et soumis à validation utilisateur. Quatre contenus sont retenus ensemble
pour couvrir la preuve attendue ; les quatre sources sont identifiées comme
contributives, sans prétendre couvrir chacune tout le besoin.

Les mécanismes d’exposition, conditions d’apparition, conséquences et contrôles
sont documentés et appliqués à un trajet RH fictif. La couverture n’est ni une
autorisation d’outil ni une validation du traitement réel. Les questions distinctes
sur réglementation/interlocuteur et règles internes restent ouvertes, de même que
la question de choix chat/agent/workflow du module 1.

Act-On Data : 8 questions, **1 couverte / 0 à actualiser / 7 externes**.
Programme seul : **1 / 0 / 7**, plan inchangé. L’index commun peut proposer de
nouveaux candidats lexicaux à d’autres questions, sans modifier leurs plans ni statuts.

L’interface existante affiche le statut, les matches, les quatre sources et la
justification « Avant / Après : Knowledge disponible ». Aucune refonte nécessaire.

## Test de réutilisation après capitalisation

Résultats effectifs, trois premiers candidats (le score ne décide jamais la couverture) :

| Requête | Candidats ordonnés |
| --- | --- |
| risques IA données RH | CON-RISQUES-IA-RH ; MET-GRILLE-RISQUE-IA ; CAS-RH-REPONSE-FICTIF |
| shadow AI | CON-SHADOW-AI ; CAS-RH-REPONSE-FICTIF ; SRC-UE-AIACT-RH |
| confidentialité données RH IA | CON-RISQUES-IA-RH ; MET-GRILLE-RISQUE-IA ; CON-SHADOW-AI |
| agent IA permissions | MET-GRILLE-RISQUE-IA ; CON-AGENT-IA ; CON-RISQUES-IA-RH |
| supervision agent | MET-GRILLE-RISQUE-IA ; CON-AGENT-IA ; CON-RISQUES-IA-RH |
| utilisation ChatGPT données salariés | CON-RISQUES-IA-RH ; SRC-CNIL-USAGE-IAG ; SRC-RGPD-REPERES-RH |

Le troisième candidat de « shadow AI » reflète surtout un recouvrement lexical
avec AI : il n’est pas une preuve de couverture. Le premier candidat est pertinent.
Le classement reste lexical, explicable, sans embeddings ni promotion automatique.

## Limites et décisions restantes

Validation éditoriale de ce cycle par l’utilisateur ; validation du cas retenu
pour la session ; contrats/offres/configurations et droits du client ; responsables
nommés ; qualification juridique et droit du travail ; vérification du texte AI Act
consolidé faisant foi et des transitions avant usage opérationnel. Le seuil de
fraîcheur 180 jours est celui du plan existant ; il ne dispense pas de revérifier
les repères réglementaires au moment de leur utilisation.

Aucune modification de `formation.json`, de VCOAC ou des autres questions ; aucun
slide, TP complet, commit ou push pendant ce cycle.

## Validation technique

Suite complète : **152 tests réussis, 0 échec**. Contrôles ajoutés : huit fiches et liens, provenance/date des sources, six formulations de réutilisation, absence de promotion lexicale, refus de couverture sans revue ou par source partielle, péremption et affichage avant/après avec sources. Les tests du premier cycle conservent leurs vérifications sur ses six fiches.

Cockpit : [http://127.0.0.1:61524](http://127.0.0.1:61524), onglet Recherche.
Les deux endpoints de scénarios répondent HTTP 200 avec plans valides et 14 fiches
indexées. Le serveur a été démarré hors sandbox après blocage de la connexion
locale ; aucun changement de code n’a été nécessaire. L’affichage est vérifié par
les tests du cockpit, pas par une revue visuelle de navigateur.

Contrôle de périmètre : empreintes avant/après identiques pour les deux
`formation.json`, le plan Programme seul et les sept questions Act-On Data hors
cible. Les six fiches du premier cycle sont inchangées. Aucun commit créé.

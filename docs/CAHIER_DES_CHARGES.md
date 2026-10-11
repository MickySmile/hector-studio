# Hector Studio — Cahier des charges métier

Ce document constitue la référence métier des futurs travaux Codex. Il décrit les exigences du produit cible et précise le périmètre de la première expérimentation. Il ne constate pas l’existence de fonctionnalités déjà développées.

Les identifiants `CDC-01` à `CDC-31` servent de références stables. Les possibilités futures sont distinguées des exigences du premier prototype.

## CDC-01 — Finalité du produit

Hector Studio est un système d’assistance à la conception de formations professionnelles visant une réelle montée en compétences.

Il transforme progressivement un programme, une demande parfois succincte, un échange client, des documents métier et des recherches ou connaissances existantes en une formation cohérente.

Il aide le formateur à concevoir, arbitrer, rechercher, scénariser, produire des activités et capitaliser la connaissance. La génération automatique de PowerPoint à partir d’un programme n’est pas sa finalité ; la production de supports intervient en aval.

## CDC-02 — Fonctionnement et priorités

Le système est semi-automatique : il réalise une grande partie du travail avec quelques portes d’arbitrage humain importantes. Le formateur ne valide pas chaque micro-décision. Le système détecte les véritables ambiguïtés et propose une recommandation.

Les priorités, dans l’ordre, sont :

1. la montée en compétences réelle des participants ;
2. la rapidité de production pour le formateur.

La couverture exhaustive d’un programme catalogue ne doit jamais produire une formation surchargée et superficielle.

## CDC-03 — Entrées et cadrage

### Mode A — Contexte riche

Les entrées possibles sont : programme, compte rendu client, mails, questionnaire stagiaires, documents métier, anciennes formations et informations publiques sur l’entreprise.

### Mode B — Programme seul

Le système engage un dialogue de cadrage avec le formateur :

1. analyser le programme ;
2. identifier les ambiguïtés ;
3. formuler des hypothèses ;
4. créer des personas de simulation ;
5. proposer des orientations ;
6. procéder par échanges successifs avec le formateur ;
7. aboutir à un cadrage explicite.

Les hypothèses ne sont jamais présentées comme des faits. Si le client final est inaccessible, le cadrage repose sur des hypothèses explicites et les arbitrages du formateur.

## CDC-04 — Personas de simulation

Si les informations sur le public réel sont insuffisantes, générer au minimum trois profils : novice, intermédiaire et avancé/expert.

Chaque profil décrit les connaissances préalables probables, attentes, difficultés, risques de décrochage, éléments potentiellement trop simples et besoins d’accompagnement.

Ces personas servent à challenger la conception. Ils ne représentent pas les vrais stagiaires.

## CDC-05 — Analyse du programme et du besoin

Le programme reçu constitue un cadre dont la rigidité doit être qualifiée. Par défaut, le système peut conserver, réordonner, compresser, enrichir ou proposer de retirer des éléments ou de les déplacer en ressource.

Chaque décision reste traçable vers le programme original. Une matrice de gap comporte au minimum :

| Champ | Contenu attendu |
| --- | --- |
| Élément du programme | Élément original concerné |
| Besoin | Besoin réel ou hypothétique, explicitement distingué |
| Décision | Traitement proposé ou arbitré |
| Priorité | Importance retenue |
| Justification | Motif de la décision |

## CDC-06 — Surcharge et priorisation pédagogique

Vérifier systématiquement si le programme est réaliste dans le temps disponible. Les éléments peuvent être classés en : **Maîtriser**, **Pratiquer**, **Comprendre**, **Connaître** ou **Ressource complémentaire**.

Si une montée en compétences sérieuse semble incompatible avec le volume du programme, alerter et proposer une compression pédagogique.

## CDC-07 — Situation professionnelle et compétence

La conception est structurée prioritairement par situations professionnelles et compétences, plutôt que par thèmes :

```text
Situation professionnelle → résultat attendu → compétences nécessaires
→ connaissances / concepts → méthodes / outils → activité
→ preuve légère d’acquisition
```

Une compétence décrit la situation, l’action attendue, les conditions, les critères de réussite et, lorsque pertinent, une preuve observable. Le nombre de compétences finales doit être réaliste au regard de la durée.

## CDC-08 — Carte des dépendances

Les dépendances entre compétences et concepts influencent l’ordre pédagogique. Exemple :

```text
LLM → agent → outils et contexte → MCP → architecture agentique
```

La carte doit être exploitable par le cockpit HTML et navigable graphiquement.

## CDC-09 — Modules

Un module correspond prioritairement à un résultat professionnel cohérent. Il peut mobiliser plusieurs concepts et compétences.

Chaque module précise au minimum : résultat attendu, compétences concernées, concepts et leurs relations, méthodes et outils, activités, durée, proportion apport/pratique et éventuelle preuve d’acquisition.

## CDC-10 — Progression VCOAC

La progression mobilise **VOIR → COMPRENDRE → OUTILLER → AGIR → CONSOLIDER**.

Ces étapes représentent des fonctions cognitives, pas cinq blocs mécaniques obligatoires. Plusieurs fonctions peuvent être fusionnées ; une fonction peut être absente localement si elle est correctement assurée ailleurs. Le système vérifie la cohérence cognitive globale.

### CDC-10.1 — VOIR

Partir du réel et créer une question cognitive à travers un cas, problème, résultat, situation, démonstration, contraste, chiffre ou témoignage.

### CDC-10.2 — COMPRENDRE

Les fonctions possibles sont : définir, distinguer, décomposer, mettre en relation, expliquer un mécanisme, comparer, identifier les limites et remettre en perspective.

Pour les concepts structurants, pouvoir documenter : définition, importance, ce que le concept n’est pas, relations, exemple, limites/pièges et sources.

### CDC-10.3 — OUTILLER

Fournir un outil lorsqu’il permet réellement de reproduire la capacité. Le kit peut comprendre une méthode, un template, une checklist, une grille, un prompt, un logiciel, un tutoriel, un référentiel ou une fiche réflexe.

Un outil ne doit normalement pas être livré vide. Prévoir idéalement :

1. une explication courte ;
2. un exemple rempli ;
3. un template vierge ;
4. des conseils ou erreurs fréquentes.

Les contenus trop détaillés peuvent être réservés à la future base Notion.

### CDC-10.4 — AGIR

Choisir selon le besoin : micro-activité, exercice guidé, application, situation autonome ou TP.

La formation comporte beaucoup de pratique. La cible globale se situe généralement entre **40 et 70 %**, est définie au cadrage puis contrôlée.

Compter comme pratique les moments où le participant produit, décide, analyse, manipule, conçoit ou explique. Distinguer activité guidée, pratique autonome et évaluation éventuelle.

### CDC-10.5 — CONSOLIDER

La consolidation reste très courte et intervient généralement immédiatement après la correction. Elle fixe l’essentiel avant le module suivant : trois points clés, mini-checklist, reformulation, comparaison avant/après ou retour au problème initial.

Elle ne doit jamais devenir un nouveau mini-cours.

## CDC-11 — Fil rouge

Le fil rouge est recommandé lorsqu’il est pertinent, sans être obligatoire. Il peut évoluer progressivement ou comporter des épisodes autonomes dans le même univers.

Il illustre les concepts, qui restent compréhensibles indépendamment du cas. La logique **CityBike+** constitue une référence de qualité :

- univers métier cohérent et progression narrative ;
- chaque activité produit un livrable et utilise une méthode ;
- la méthode devient un outil transférable ;
- une activité peut faire apparaître une « limite ouverte » préparant la suite.

## CDC-12 — Modèle d’activité

Une activité doit pouvoir contenir : situation, mission, organisation, durée, ressources, consignes, production attendue, critères légers de réussite, correction, exemple de production, outil transférable et éventuelle limite ouverte.

Des variantes novice, intermédiaire et avancé peuvent être prévues lorsque pertinent.

## CDC-13 — Évaluation et priorités de production

L’évaluation n’est pas une priorité du produit. Les formations sont généralement non certifiantes, souvent avec 10 à 12 participants ; le formateur ne dispose pas du temps nécessaire pour évaluer individuellement tout le groupe.

Les principes sont :

- pas de notation systématique, de lourde grille ni de reporting complexe ;
- toute compétence majeure produit idéalement une preuve observable ;
- une preuve ne nécessite pas toujours une évaluation formelle ;
- deux à cinq critères observables suffisent généralement ;
- la correction collective peut constituer la validation.

La production donne priorité, dans l’ordre, aux **activités**, **consignes**, **corrigés** et **exemples de production**. Le reste est secondaire.

## CDC-14 — Recherche en deux temps

L’exploration légère intervient pendant le cadrage pour comprendre le domaine, l’entreprise, le contexte et les évolutions récentes.

La recherche ciblée intervient après la définition des compétences et modules. Chaque recherche doit pouvoir représenter : question, utilité pédagogique, importance, type de source, fraîcheur attendue, preuve recherchée et module concerné.

## CDC-15 — Hiérarchie des sources

Adapter les sources au type d’information, avec cette priorité générale :

1. sources primaires ou officielles ;
2. institutions et expertise forte ;
3. expertise spécialisée ;
4. communautés et médias pour l’exploration ou les retours d’expérience.

| Information | Source adaptée |
| --- | --- |
| Réglementation | Texte officiel ou autorité compétente |
| Documentation d’un outil | Éditeur |
| Concept scientifique | Littérature académique |
| Retour terrain | Communauté éventuellement pertinente |

## CDC-16 — Fraîcheur de l’information

La fraîcheur requise dépend du sujet : faible contrainte pour un concept stable, actualisation fréquente pour un outil IA, données récentes pour le marché IA, version en vigueur pour la réglementation, vérification au moment de l’utilisation pour un prix ou une licence.

Alerter lorsqu’une information peut être obsolète.

## CDC-17 — Types d’exemples

Distinguer explicitement :

- **CAS RÉEL** : sourcé ;
- **CAS RECONSTRUIT** : inspiré de faits, adapté pédagogiquement ;
- **CAS FICTIF** : conçu pour expliquer ou pratiquer.

Ne jamais présenter un cas inventé comme réel.

## CDC-18 — Niveau de certitude

Les affirmations importantes peuvent être qualifiées : **FAIT ÉTABLI**, **CONSENSUS**, **ESTIMATION**, **HYPOTHÈSE** ou **CONTROVERSE**.

Pour les sujets sensibles ou controversés, rechercher plusieurs sources.

## CDC-19 — Abstraction de recherche et outils externes

Le cœur du système ne dépend d’aucun fournisseur particulier. Prévoir une abstraction conceptuelle :

```text
research(query, besoin, type_source)
```

Selon disponibilité, le routeur pourra utiliser la base de connaissances interne, la recherche Web, Perplexity Computer MCP, des moteurs et bases scientifiques, la documentation officielle ou d’autres outils futurs.

L’API payante Perplexity ne doit pas être une dépendance obligatoire.

## CDC-20 — Capitalisation

Une nouvelle formation ne repart jamais automatiquement de zéro. L’ordre de travail est :

1. rechercher dans le patrimoine interne ;
2. vérifier fraîcheur et qualité ;
3. réutiliser ;
4. actualiser si nécessaire ;
5. rechercher uniquement les connaissances manquantes.

Les recherches sont capitalisées. La fondation préférée est **Markdown + métadonnées + Git**. Obsidian pourra servir d’interface humaine et de visualisation du graphe ; Notion pourra devenir un espace riche de diffusion aux stagiaires.

## CDC-21 — Graphe de connaissances

Prévoir progressivement les relations suivantes :

```text
SOURCE → soutient → CLAIM
CLAIM → explique → CONCEPT
CONCEPT → nécessaire pour → COMPÉTENCE
COMPÉTENCE → travaillée dans → MODULE
MODULE → appartient à → FORMATION
CONCEPT → lié à → CONCEPT
CAS → illustre → CONCEPT
ACTIVITÉ → travaille → COMPÉTENCE
TEMPLATE → outille → ACTIVITÉ
```

Ne pas introduire de base graphe complexe en V1. Markdown et métadonnées suffisent pour commencer.

## CDC-22 — Arrêt de la recherche

Arrêter lorsqu’une réponse suffisante existe et que de nouvelles recherches ne modifient plus substantiellement le contenu ou la conception. Signaler les points insuffisamment documentés.

## CDC-23 — Cockpit HTML

Le cockpit est une interface d’arbitrage permettant au formateur de comprendre et valider presque en un coup d’œil. Les textes restent courts et actionnables.

Les vues envisagées sont : Synthèse, Cadrage, Personas, Gap, Compétences, Carte de dépendances, Modules, Sources et Alertes.

Les statuts visuels sont simples : **validé**, **hypothèse**, **alerte** et **décision nécessaire**.

Les actions envisagées sont : accepter, modifier, écarter, approfondir, fusionner, déplacer et proposer des alternatives.

Le cockpit permet de naviguer entre compétences, modules, activités et concepts. Il visualise notamment les dépendances, la densité cognitive, le temps, la proportion théorie/pratique, les points non documentés et la surcharge.

## CDC-24 — Source de vérité

La source de vérité est une représentation structurée de la formation contenant notamment : contexte, hypothèses, personas, situations professionnelles, compétences, dépendances, modules, concepts, activités, outils, ressources et sources.

VCOAC est une projection pédagogique de cette source. Le PowerPoint en est ensuite une projection graphique ; il n’est jamais la source de vérité.

## CDC-25 — Machine PowerPoint VCOAC

Une machine PowerPoint VCOAC existe déjà et attendra une spec JSON conforme à son propre contrat. Hector Studio reste indépendant de cette machine, avec un adaptateur dédié dans `adapters/vcoac/`.

La chaîne cible est :

```text
Source pédagogique → projection VCOAC → adaptateur → spec JSON
→ machine VCOAC → PowerPoint
```

Les contraintes PowerPoint ne doivent pas être intégrées directement au cœur du modèle pédagogique.

## CDC-26 — Chaîne produit générale

```text
ENTRÉES → CADRAGE DIALOGUÉ → GAP & PRIORISATION
→ SITUATIONS PROFESSIONNELLES → COMPÉTENCES → DÉPENDANCES → MODULES
→ RECHERCHE / FIL ROUGE → VCOAC → ACTIVITÉS / OUTILS
→ SOURCE DE VÉRITÉ → productions multiples
```

Les productions futures possibles sont : cockpit HTML, PowerPoint, notes formateur, activités, corrigés, exemples, templates, base Notion et ressources stagiaires.

## CDC-27 — Philosophie technique V1

Privilégier les fichiers Markdown, YAML/JSON, une application Web locale légère, Git, GitHub et des tests simples.

Éviter sans besoin démontré les microservices, bases graphe, infrastructures cloud complexes, Docker obligatoire et lourdes bases de données. Complexifier seulement lorsqu’un problème réel le justifie.

## CDC-28 — Cycle de développement

Chaque cycle reste limité et suit cet ordre :

1. construire une fonctionnalité limitée ;
2. exécuter les contrôles et tests ;
3. produire quelque chose de visible ;
4. faire tester par l’utilisateur ;
5. corriger ;
6. faire valider ;
7. enregistrer seulement ensuite dans Git.

Ne jamais tenter de construire tout Hector Studio en une seule fois.

## CDC-29 — Première expérimentation

Le premier cas grandeur réelle est **IA017 — « Concevoir des agents IA et automatiser ses tâches sans développer »**, avec deux situations de test :

1. programme seul ;
2. programme et contexte client **Act-On Data**.

Le premier prototype applicatif sera un cockpit utilisant des données statiques. Il ne comportera aucune IA, recherche automatique, connexion Perplexity ni génération PowerPoint.

## CDC-30 — Critère principal de réussite V1

Le formateur doit pouvoir regarder le cockpit et répondre rapidement :

- La lecture du besoin est-elle correcte ?
- Les compétences sont-elles les bonnes ?
- La progression est-elle cohérente ?
- Le programme est-il trop chargé ?
- Où sont les hypothèses et les risques ?
- Quel niveau de pratique est prévu ?
- Que faut-il modifier avant de poursuivre ?

Le cockpit doit permettre ces décisions sans lire un rapport de plusieurs pages.

## CDC-31 — Hors périmètre V1

Pour le premier prototype décrit en CDC-29 : IA, recherche automatique, connexion Perplexity et génération PowerPoint sont exclues.

Une base graphe complexe est exclue de la V1. Les productions futures et interfaces Obsidian/Notion citées dans ce document ne constituent pas des livrables requis du premier prototype.

La tâche actuelle se limite à ce cahier des charges : aucun développement, aucun document `ARCHITECTURE_CIBLE.md` ou `DECISIONS_PEDAGOGIQUES.md`, et aucun commit Git avant validation.

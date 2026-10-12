# Pilote Hector Studio → Machine VCOAC — Act-On Data, Module 2

Étude du **12 octobre 2026**. Périmètre : `IA017-ACT-ON-DATA / AOD-M02`, « Concevoir un workflow RH explicable ». Ce document décrit l'existant et propose un raccordement ; il n'autorise pas son exécution.

**Conclusion : machine détectée, raccordement plausible, contenu du module encore incomplet.** Six moments, 140 minutes dont 90 de pratique ; deux Markdown enrichis. Classement proposé des moments complets : **0 READY, 3 PARTIAL, 2 BLOCKED_RESEARCH, 1 BLOCKED_DECISION**. Le sous-ensemble MCP est nettement plus avancé que le module entier.

Les mentions **Constat** décrivent les fichiers ou le code lus ; les mentions **Proposition** désignent les choix à valider. Aucune hypothèse de contenu n'est traitée comme une décision acquise. Les statuts de complétude ci-dessous sont un diagnostic documentaire, sans modification des statuts Hector.

## 1. Architecture de la machine observée

### 1.1. Présence et version de référence

**Constat.** `references/machine_vcoac/` contient uniquement `machine_vcoac.zip`, déjà non suivi par Git au début de l'étude. L'archive contient réellement le moteur : trois fichiers JavaScript, un manifeste npm, le contrat des types, une spec d'exemple, un rapport d'exemple, un README et sept images. Il ne s'agit donc pas d'un dossier vide ou d'une simple référence documentaire. Lecture directe de l'archive, sans extraction ni modification.

- Racine interne : `machine_vcoac/`.
- Paquet : `machine-vcoac`, version `1.0.0` ; catalogue : version `1.0`.
- SHA-256 de l'archive : `EBB56F01DADE9A290B8702BDDF82FEBD7748CCF2F9E8469C5C4F1A86153C095B`.
- **36 types définis et 36 composeurs**, avec correspondance des identifiants : 35 types de support et `GUIDE`, destiné au concepteur et à retirer d'un support réel.
- Pas de `package-lock.json`, de tests automatisés, de polices embarquées ou de PPTX dans l'archive. Une installation exécutable n'est pas encore attestée.

Les chemins et numéros de lignes de la machine cités dans ce document se rapportent aux entrées **dans cette archive**. Les liens Hector se rapportent au dépôt.

| Élément | Responsabilité constatée |
| --- | --- |
| `build_template.js` | Point d'entrée CLI et orchestration : lecture JSON, contrôle du contrat, appel des composeurs, contrôle de mise en page, écriture, post-traitement XML et rapport. Exporte aussi `construire`, `controlerContrat`, `formatChamps`, `xmlTiming`. |
| `types_vcoac.json` | Catalogue déclaratif : champs communs et par type, obligations conditionnelles, maxima, cardinalités, variantes, phases et règles éditoriales. **Ce n'est pas un JSON Schema.** |
| `vcoac_composeurs.js` | Registre `COMPOSEURS`, alimenté par `def(type, fonction)` ; une entrée de spec donne normalement une diapositive. Les composeurs portent la géométrie et certains libellés fixes. |
| `vcoac_base.js` | Thème Navy Yellow, format large, masters, typographie française, mesures de texte, images, icônes, notes et primitives graphiques. |
| `template_spec.json` | 45 entrées illustrant les types et plusieurs variantes. Exemple graphique, aucune autorité sur la pédagogie Hector. |
| `exemple_rapport.json` | Rapport fourni du 10 octobre 2026 : 45 entrées, zéro alerte. Résultat historique, non reproduit ici. |
| `assets/` | `ouverture.jpg`, `portrait.jpg`, `horizon.jpg`, `visuel_reponses.png`, `carte_trajets.jpg`, `couverture.jpg`, `fil_rouge_banner.jpg`. Assets d'exemple ; aucune adéquation au Module 2 ni provenance RH établie par leur présence. |

### 1.2. Dépendances et environnement

Node **>= 18**, exigé par `package.json` et le README. CommonJS côté machine. Dépendances déclarées : `pptxgenjs` **4.0.1**, `opentype.js` **^1.3.4**, `react` **^19.2.0**, `react-dom` **^19.2.0**, `react-icons` **^5.5.0**, `sharp` **^0.34.0**. `jszip` est chargé indirectement depuis l'arbre de dépendances de `pptxgenjs`, sans déclaration directe dans le manifeste.

`vcoac_base.js:61` charge les polices dès l'import : Arial ou Liberation Sans en normal, gras et italique, **plus Courier New Bold ou Liberation Mono Bold**. Recherche dans `VCOAC_POLICES`, puis `polices/` voisin du moteur, puis dossiers système. Une police absente fait échouer le chargement. Les icônes ne sont résolues que dans les collections `react-icons/lu` et `react-icons/md`, puis rasterisées en PNG avec React et Sharp.

**Proposition.** Garder cette installation hors des dépendances du cœur Hector. Identifier la version Node effectivement testée, les versions installées et les polices lors du cycle d'exécution. L'absence de verrouillage npm interdit de promettre aujourd'hui un environnement reproductible à partir du seul numéro `1.0.0`.

## 2. Contrat d'entrée réel

### 2.1. Racine et champs communs

Entrée : objet JSON avec `slides`, tableau ordonné d'objets. `deck` est facultatif dans le code. Ce descriptif n'est pas une spec du pilote.

| Chemin | Contrat / consommation réelle |
| --- | --- |
| `deck.titre`, `deck.auteur` | Facultatifs, utilisés dans les métadonnées PPTX. Défauts internes : `Template VCOAC`, `Machine VCOAC`. |
| `deck.fichesDansNotes` | Facultatif ; une valeur vraie ajoute la fiche technique du type aux notes. Pour un support stagiaire, proposer `false`. |
| `deck.theme`, `deck.format`, `deck.note` | Présents dans l'exemple mais non consommés par `construire`. Le thème et le format sont imposés par `vcoac_base.js`. |
| `slides` | Nécessaire au fonctionnement : accès direct à `.length`. Pas de validation structurelle de la racine ni de minimum de slides. |
| `slides[].type` | Requis ; doit exister dans `TYPES.types` **et** dans `COMPOSEURS`. |
| `slides[].phase` | Requise : `CADRE`, `SEQUENCE`, `VOIR`, `COMPRENDRE`, `OUTILLER`, `AGIR`, `CONSOLIDER`. Chaque type restreint aussi les phases habituelles ; un écart produit une alerte. |
| `section` | Facultative ; nom de section PowerPoint, pas ID pédagogique. |
| `variante` | Facultative ; chaîne pour plusieurs types, objet pour `CARTES` (`disposition`, `entete`). Les clés exactes dépendent du type. |
| `sombre` | Facultatif ; effet seulement selon le composeur. Certains types imposent leur fond. |
| `notes.essentiel` | Requis, tableau de **1 à 4** textes. |
| `notes.transition`, `notes.relance`, `notes.reponse` | Textes facultatifs, sauf `QUIZ` qui exige `notes.reponse` avec un maximum de 260 caractères. |
| `notes.vigilance` | Tableau facultatif de **0 à 3** textes. |

Hector autorise plusieurs fonctions dans `fonctions_vcoac`, tandis qu'une slide machine porte **une seule phase**. La répartition doit être explicite ; la première fonction du tableau ne peut pas être choisie automatiquement au détriment des autres. La machine ne possède ni modèle de moment, ni champ commun de durée, ni minute de pratique, ni référence de compétence, ni traçabilité pédagogique structurée.

### 2.2. Inventaire exact des types et phases

Les variantes ne constituent pas de nouveaux types. Les plafonds usuels sont 90 mots ; exceptions signalées ci-dessous.

| Types | Phases autorisées dans le catalogue |
| --- | --- |
| `GUIDE` | CADRE ; **110 mots** dans le catalogue ; concepteur uniquement. |
| `COUVERTURE`, `FORMATEUR`, `OBJECTIFS`, `PROGRAMME`, `INCLUSION` | CADRE ; **130 mots pour PROGRAMME**. |
| `FIL_ROUGE` | CADRE, VOIR |
| `BILAN` | CADRE, CONSOLIDER |
| `OUVERTURE_SEQUENCE` | SEQUENCE |
| `QUESTION_SALLE`, `CAS_DEMONSTRATION`, `SCHEMA_DIAGNOSTIC` | VOIR |
| `VISUEL_QUESTION` | VOIR, COMPRENDRE, AGIR, CONSOLIDER |
| `CAS_REEL`, `CHIFFRES_CLES`, `OPPOSITION_LIGNES` | VOIR, COMPRENDRE |
| `CARTES` | COMPRENDRE, OUTILLER, VOIR |
| `COMPARAISON_AB`, `FRISE`, `GRAPHIQUE`, `SCHEMA_HUB`, `ARCHITECTURE_FLUX` | COMPRENDRE |
| `PROCESSUS` | COMPRENDRE, OUTILLER, CONSOLIDER |
| `DEFINITION`, `MATRICE_2X2` | COMPRENDRE, OUTILLER |
| `NIVEAUX` | COMPRENDRE, CONSOLIDER |
| `METHODE`, `FICHE_OUTIL`, `GRILLE_DEMO` | OUTILLER ; **130 mots pour GRILLE_DEMO**. |
| `FEUILLE_DE_ROUTE` | OUTILLER, AGIR |
| `CONSIGNE_ATELIER`, `EVALUATION_CAS` | AGIR ; **130 mots pour CONSIGNE_ATELIER**. |
| `QUIZ` | VOIR, AGIR, CONSOLIDER |
| `CE_QUI_A_CHANGE`, `A_RETENIR`, `ENGAGEMENT` | CONSOLIDER |

### 2.3. Champs et contraintes utiles au pilote

Les champs communs restent requis en plus de ceux de cette table. `≤ n` indique des caractères ; `[a–b]` un nombre d'éléments. Les règles conditionnelles s'appliquent à la variante retenue. L'annexe A fournit l'inventaire des champs pour les 36 types ; le catalogue vendored reste la définition à consulter, sans recopier ces règles dans le cœur.

| Type candidat | Obligatoire | Facultatif / particularité |
| --- | --- | --- |
| `VISUEL_QUESTION` | `titre ≤55`, `image` ; variante `sombre` par défaut : `question ≤100` ; variante `commentee` : `commentaire.titre ≤60`, `commentaire.points[2–5] ≤60` chacun. | `kicker ≤30`, `source ≤140` ; en commentée, `annotations[0–6]`, texte ≤24, positions x/y relatives à l'image ; `commentaire.etiquette ≤30` est facultatif au catalogue mais utilisé sans garde. |
| `DEFINITION` / `voisines` | `titre ≤60`, `notions[3–5]`, chacune avec `picto`, `terme ≤18`, `definition ≤110`. | `kicker ≤30`, `aRetenir ≤110`. Le composeur de la variante `notion` ne rend pas son `aRetenir` malgré sa présence au catalogue. |
| `DEFINITION` / `notion` | `titre ≤60`, `definition ≤220`, `sertA.etiquette ≤30`, `sertA.points[2–3] ≤90`, `exemple.etiquette ≤30`, `exemple.texte ≤140`. | Critères d'exemple facultatifs. La variante `notation` remplace l'exemple par `image.titre ≤40`, `image.source ≤120` requis ; chemin d'image facultatif, donc emplacement vide possible. |
| `CARTES` | `titre ≤60`, `cartes[2–5]`, `titre ≤40` et `corps ≤110` par carte. | `disposition` : colonnes/lignes/grille ; `entete` : numero/picto/etiquette. Picto ou étiquette requis si cette variante les choisit. `aRetenir ≤110`, `source ≤140`. |
| `ARCHITECTURE_FLUX` | `titre ≤60`, `colonnes[3–5]`, `colonnes[].poids` requis. | Colonne `carte` ou `socle` ; étiquette ≤26, titre ≤24, lignes[1–4] ≤40 ; socle : blocs[1–3], titre ≤30, texte ≤40 ; bandeau ≤50. Pour `socle`, `blocs` et `etiquette` sont nécessaires au composeur malgré leur caractère facultatif au catalogue. Poids numériques positifs à contrôler avant rendu. |
| `PROCESSUS` | `titre ≤60`, `etapes[3–5]`, `nom ≤18` et `phrase ≤70` par étape. | `exemple ≤60` par étape, `aRetenir ≤110`, `source ≤140`. Ce type ajoute un sens d'enchaînement : ne pas convertir une simple liste de repères en étapes sans justification. |
| `COMPARAISON_AB` | `titre ≤60` ; de chaque côté : `etiquette ≤25`, `titre ≤30`, `points[2–3] ≤80`. | `signe` → ou ≠, `aRetenir ≤110`, anatomie facultative. La comparaison multi-agents manque aujourd'hui. |
| `FICHE_OUTIL` | `titre ≤40`, `champs[3–5]` ; `nom ≤25` et `consigne ≤80` par champ. | `kicker ≤30`, `pied ≤90`. Ne peut pas recevoir la grille MCP de six questions sur une seule slide conforme. |
| `METHODE` | `titre ≤60`, `gestes[3–5]` ; `verbe ≤35`, `question ≤80`. | `chapeau ≤100`, `origine ≤30`, `source ≤140`. Même incompatibilité de cardinalité avec les six questions ; ne pas fabriquer des gestes à partir de questions. |
| `GRILLE_DEMO` | `titre ≤60`, quatre `colonnes ≤30`, `lignes[2–6]` avec `famille ≤24`, deux `regles` avec titre ≤30 et texte ≤120. | Chaque ligne remplie exige en pratique `cellules[3] ≤60` et un `sous` textuel pour éviter « undefined » ; `aVous:true` produit « à vous ». Ces colonnes et règles ne sont pas fournies telles quelles par Hector. |
| `CONSIGNE_ATELIER` | `titre ≤50`, `modalites[2–4]` avec texte ≤24, `contexte ≤120`, `etapes[3–5] ≤90`, `livrable ≤100`, `criteres[2–3] ≤90`, `nonAcceptes[1–3] ≤70`. | `kicker ≤30`, style des modalités navy/jaune/contour. Le titre commençant par « À vous : » est une règle éditoriale, sans vérification explicite du préfixe. |
| `A_RETENIR` | Deux `contraste ≤12`, `phrase ≤130`, trois `regles ≤50`. | `kicker ≤30`, `prochaineEtape ≤120`. Les trois repères du MP06 ne fournissent pas à eux seuls le contraste exigé. |

### 2.4. Validation effective, écarts et limites

**Constat dans `build_template.js:67` (`controlerContrat`).** Le validateur parcourt les chemins du catalogue, contrôle présence non vide, tailles des tableaux, maxima des chaînes, valeurs énumérées, variantes, phases par type, date des cas réels et révélations. Les longueurs sont calculées après `B.fr`, avec retours à la ligne remplacés par des espaces, puis `.length` JavaScript. Les minima/maxima de tableaux sont inclusifs.

Ce contrôle ne vérifie pas systématiquement les types JSON : `n` s'applique seulement aux tableaux, `max` seulement aux chaînes. Les propriétés inconnues sont acceptées ; une chaîne d'espaces compte comme non vide ; les références de liens d'un schéma, les coordonnées d'annotation, les poids et l'alignement catégories/valeurs d'un graphique ne sont pas validés. Un objet `variante` inadapté peut échapper au contrôle. Il n'y a pas de validation JSON Schema globale.

Écarts utiles à prévoir à la frontière de l'adaptateur :

- `FORMATEUR` accède à `etiquettes.forEach` et à `entete` ; `OUVERTURE_SEQUENCE` accède à `entete` ; `QUESTION_SALLE` à `cas.etiquette` ; `CAS_DEMONSTRATION` à `document.etiquette` ; `VISUEL_QUESTION/commentee` à `commentaire.etiquette`. Ces champs sont facultatifs au catalogue mais leur absence peut faire échouer la composition.
- `ARCHITECTURE_FLUX/socle` accède directement à `blocs.length` et à `etiquette`. Les options `compact`, `style`, `blocs[].style` existent dans le code sans être décrites par le catalogue ; `SCHEMA_DIAGNOSTIC` lit aussi `noeuds[].externe`.
- `CARTES/lignes` affiche toujours des numéros, même si une autre valeur d'en-tête est déclarée. Les variantes admises ne garantissent donc pas toutes les combinaisons graphiques.
- Le maximum de `GUIDE` est **110**, car la construction prend `def.motsMax` ; la valeur 95 présente dans `REGLES.motsMaxExceptions` n'est pas utilisée à cet endroit.
- D3 (qualité du titre), l'unicité du fil rouge, D5 (qualité/provenance des images), D6 (présence d'inclusion, quiz et bilan) ne font pas l'objet de contrôles pédagogiques globaux. Ils ne justifient pas d'ajouter des activités à ce seul module.

**Contrôles graphiques observés.** 90 mots en général, avec exceptions ci-dessus ; texte à lire ≥14 pt, étiquettes/sources ≥12 pt ; mesure Arial avec marge de largeur de 3 % ; débordement probable si hauteur mesurée dépasse la boîte de plus de 0,04 pouce ; chevauchement au-delà de 60 pt² ; texte à cheval sur un cadre ; image/graphique/tableau sur texte ; sortie de page au-delà d'une tolérance de 0,01 pouce. Les images de fond couvrant plus de 80 % de la page sont exemptées du contrôle de recouvrement. Le squelette signale aussi les titres de plus de deux lignes ou de plus de 75 caractères dans ses titres standards.

Les comptes et mesures portent sur les éléments effectivement suivis par les primitives : étiquettes, sources et certains textes `compte:false` sont exclus du volume ; des appels directs à `addText` et des tailles dans des runs enrichis ne passent pas par tous les contrôles de `T()`. **Zéro alerte n'équivaut pas à une validation visuelle ou pédagogique.**

### 2.5. Notes, images et révélations

`vcoac_base.js:344` convertit `notes` en paragraphes de notes présentateur ; le post-traitement met les intitulés en gras et la langue en français. Les notes ne sont pas du Markdown rendu. L'obligation de notes est essentiellement contrôlée par `notes.essentiel` ; aucune analyse sémantique des notes ni contrôle final exhaustif de leur contenu n'est effectué. Un mauvais type, par exemple `essentiel` en chaîne, peut provoquer une exception lors de `.forEach` hors du bloc qui intercepte les erreurs de composition.

`resoudreImages` (`build_template.js:286`) résout **`image` chaîne, `image.chemin` et `portrait`** relativement au dossier de la spec, ou conserve un chemin absolu. Il n'effectue ni recherche, ni téléchargement, ni vérification des droits/provenances. Sharp lit les dimensions ; les composeurs utilisent recadrage ou inscription proportionnelle. Fichier manquant, illisible ou picto inconnu : erreur de composition. Le pilote ne dispose pas encore de capture n8n ni d'image de carte finalisée référencée par ses moments.

Les révélations sont implémentées dans **`METHODE` et `CAS_REEL`**, par noms de formes `R1:…`, `R2:…`, puis fondu de 0,2 seconde au clic dans le XML. Le champ `revelations` ne constitue pas un interrupteur global : les composeurs de ces deux types posent leurs marques indépendamment de ce champ. Pour les autres types, une valeur vraie déclenche une alerte D7. Les cas fictifs Hector ne doivent jamais devenir `CAS_REEL` pour profiter d'une animation. Le contrôle D4 cherche uniquement une année 1600–2099 dans kicker/titre/source et exige le champ source ; il ne prouve ni réalité ni fiabilité du cas.

## 3. Workflow d'exécution et résultats

### 3.1. Commandes observées, à exécuter seulement dans un cycle ultérieur autorisé

Après mise à disposition d'une copie d'exécution hors des sources vendored et des fixtures, depuis le dossier contenant `build_template.js` :

```powershell
npm install
node build_template.js <chemin-spec.json> --out <chemin-module2.pptx> --rapport <chemin-rapport.json> --strict
```

Le script npm `template` correspond à `node build_template.js template_spec.json --out Template_VCOAC_augmente.pptx`. Il reconstruit le template complet, pas le pilote Module 2. Aucune de ces commandes n'a été exécutée dans cette étude ; aucun paquet installé. Les dossiers de sortie devront déjà exister : le moteur ne les crée pas.

Flux réel : lecture → copie de chaque entrée → contrôle déclaratif → résolution des images → composition → contrôles graphiques → ajout des notes → écriture PPTX → post-traitement thème/langue/animations → écriture rapport → décision CLI stricte. Il n'existe **pas de mode `--dry-run`** documenté ou implémenté. Appeler `construire` produit un fichier ; passer `strict:true` à cette fonction exportée ne suffit pas, le refus strict appartient au bloc CLI.

### 3.2. Fichiers, alertes et erreurs

| Situation | Comportement réel |
| --- | --- |
| Exécution sans `--out` | `<spec-sans-.json>.pptx` ; rapport par défaut `<out-sans-.pptx>_rapport.json`. |
| Aucune alerte | PPTX final et rapport JSON ; sortie CLI 0. |
| Alertes, sans `--strict` | PPTX et rapport conservés sous noms ordinaires ; sortie normalement 0 malgré les alertes. |
| Au moins une alerte, avec `--strict` | **PPTX écrit puis renommé** `<out-sans-.pptx>_A_CORRIGER.pptx` ; rapport conservé ; sortie 1. Le champ `rapport.fichier` garde le nom initial. |
| Aucun argument de spec | Usage et sortie 2, sous réserve que les imports/dépendances/polices aient pu être chargés avant. |
| Exception non récupérée | Sortie 1 ; fichier JSON malformé, fichier/dépendance/police absent, structure racine invalide, type de notes incorrect, erreur d'écriture ou de post-traitement, notamment. PPTX partiel possible ; rapport non garanti. |

La machine n'émet pas de statut structuré **`BLOCK`**. Elle utilise des chaînes d'alertes, des exceptions et des codes de sortie. L'adaptateur pourra définir son propre refus **avant lancement** ; ne pas présenter ce refus proposé comme une fonction existante du moteur.

Types d'alertes entraînant le refus strict : champ requis absent, longueur/cardinalité dépassée, variante/valeur inconnue, phase inhabituelle, cas réel sans année, révélation interdite, type inconnu, composition impossible, débordement, chevauchement, sortie de page, taille trop petite ou budget de mots dépassé.

Le rapport comporte `deck`, `genere`, `fichier`, `slides`, `alertes` total. Par entrée : `n`, `type`, `variante`, `titre`, `mots`, `motsMax`, `alertes[]`, éventuellement `revelations`. Pas de provenance Hector, pas de statut de complétude, pas de PDF, aperçu PNG, corrigé séparé ou ressource stagiaire exportés automatiquement.

**Risque supplémentaire observé :** un type inconnu est sauté ; une composition peut échouer après création d'une slide partielle. La boucle conserve pourtant une ligne de rapport par entrée de spec. Les indices de diapositives réelles et de rapport peuvent alors diverger, notamment lors du rattachement des révélations. Une sortie avec alertes ne doit donc pas être livrée comme un support complet.

## 4. Module 2 : inventaire et complétude

### 4.1. Source et règle de classement

Sources lues intégralement : [AGENTS.md](../AGENTS.md), [cahier des charges](CAHIER_DES_CHARGES.md), [architecture cible](ARCHITECTURE_CIBLE.md), [schéma formation](../schemas/formation.schema.json), [formation Act-On Data](../examples/IA017/act_on_data/formation.json) et [plan de recherche](../examples/IA017/act_on_data/research-plan.json). Inspection des cinq fichiers `content/`, avec lecture complète des deux contenus M02 ; lecture ciblée des quatre notes Knowledge directement utilisées par M02 et de leurs liens de provenance via le chargeur existant.

Le schéma réel utilise `meta`, `modules[].moments_pedagogiques`, `content_ref` et `knowledge_refs` ; ne pas implémenter les noms conceptuels plus anciens de l'architecture (`sequences`, `contenus/`) comme s'ils étaient ceux des fixtures actuelles. L'architecture mentionne encore une machine non fournie : cette phrase historique est dépassée par l'archive présente, sans modification de ce document.

**Proposition de diagnostic :** READY = tout le contenu nécessaire au moment existe, traduction éditoriale possible sans nouvelle conception ; PARTIAL = intention/structure disponibles mais contenus à rédiger ; BLOCKED_RESEARCH = preuve explicitement attendue et encore ouverte ; BLOCKED_DECISION = choix humain structurant manquant. Un statut principal par moment pour compter sans doublon ; les dépendances secondaires sont indiquées. La validation humaine P3/P4 reste distincte de la complétude, y compris pour un éventuel READY.

Le module dépend de `AOD-M01`, travaille `AOD-C01` et `AOD-C02`, et vise une carte logique commentée sans réalisation technique obligatoire. Tous ses moments et le module restent `proposition_a_valider`. **140 = 20 + 15 + 10 + 60 + 30 + 5** ; pratique **90 = 60 + 30**, soit environ **64,3 % du module**, sans confondre ce ratio avec la cible globale de formation.

### 4.2. Les six moments exacts

| ID et titre | Fonctions ; durée / pratique | Intention exacte | Contenu enrichi et Knowledge | Recherche et classement proposé |
| --- | --- | --- | --- | --- |
| **AOD-M02-MP01** — Où une demande RH circule-t-elle réellement ? | voir + comprendre ; **20 / 0 min** | Décomposer un workflow visible avant de le cartographier. | Aucun `content_ref`, aucune `knowledge_refs`. Démonstration n8n envisagée, repli statique à confirmer. Le cas MCP peut éclairer un futur scénario, mais ne documente ni n8n ni une démonstration testée. | **BLOCKED_RESEARCH** : question n8n ouverte, pas de flux démontrable avec version et accès confirmés. Dépend aussi du choix du cas et du repli (D02/D05). |
| **AOD-M02-MP02** — Situer ressources, connexions et MCP | comprendre ; **15 / 0 min** | Distinguer les briques et borner l'ouverture architecturale. | [Markdown MP02](../examples/IA017/act_on_data/content/AOD-M02-MP02.md). Références directes : `CON-AGENT-IA`, `CON-MCP`, `CAS-RH-MCP-FICTIF`. Définitions, trajet, cas RH-042, limites, question/réponse et déroulé 3+4+6+2 min disponibles. | **BLOCKED_RESEARCH** pour le moment complet : MCP couvert, comparaison workflow simple / multi-agents toujours ouverte. Le Markdown déclare explicitement son absence et utilise déjà les 15 min pour MCP. L'ajout ou le retrait de cette comparaison nécessite aussi un arbitrage de périmètre/temps. |
| **AOD-M02-MP03** — Préparer la carte logique | outiller ; **10 / 0 min** | Identifier un support commun compréhensible par les managers. | [Markdown MP03](../examples/IA017/act_on_data/content/AOD-M02-MP03.md). Références directes : `CON-MCP`, `MET-CONNEXION-MCP`, `CAS-RH-MCP-FICTIF`. Grille six questions, mode d'emploi, exemple rempli, support vierge, annotations et déroulé 2+5+3 min présents. | **PARTIAL** à l'échelle de l'intention initiale : outil MCP suffisamment documenté, mais le canvas de workflow complet (entrées/sorties, instructions, rôles, ressources, validations) annoncé dans le JSON n'est pas livré comme support vierge commun. Aucune recherche propre ouverte. Il faut compléter le canvas ou valider explicitement le périmètre plus étroit. |
| **AOD-M02-MP04** — Cartographier le workflow RH | agir ; **60 / 60 min** | Concevoir les rôles, entrées, sorties, ressources et validations. | Aucun Markdown ni référence Knowledge directe. TP et carte attendue décrits en une ligne. `CAS-RH-MCP-FICTIF` et `MET-CONNEXION-MCP` existent dans le module, mais ne constituent pas un dossier d'atelier de 60 min validé. | **BLOCKED_DECISION** : cas fil rouge et responsable des données à confirmer (D02/H04), modalité et support selon D05. Consignes, ressources exactes, étapes, critères contextualisés, corrigé et exemple de carte à préparer après choix. `besoin_recherche:false` ne signifie pas contenu prêt. |
| **AOD-M02-MP05** — Éprouver et expliquer la carte | agir ; **30 / 30 min** | Faire apparaître une connexion ou une responsabilité manquante. | Aucun Markdown ni référence Knowledge directe. Revue croisée, scénario d'échec et révision annoncés. Le cas MCP offre des contrôles à demander, mais aucun essai réalisé ni scénario de revue complet. | **PARTIAL** : protocole de revue, scénario d'échec, attendus et repères de correction manquants. Aucune question de recherche déclarée. Dépend du choix du cas MP04 ; ce blocage hérité n'est pas compté une seconde fois en BLOCKED_DECISION. |
| **AOD-M02-MP06** — Fixer les points de lecture du workflow | consolider ; **5 / 0 min** | Ancrer trois repères après la revue croisée. | Aucun Markdown ni référence Knowledge directe. Repères explicites : entrée, responsabilité, validation ; transition vers l'analyse des données RH. | **PARTIAL** : intention et trois repères disponibles, formulation de la synthèse et retour précis au cas/corrigé à fixer. Aucun besoin de recherche déclaré. Un contraste imposé par `A_RETENIR` ne peut pas être inventé par l'adaptateur. |

**Bilan : READY 0 ; PARTIAL 3 (MP03, MP05, MP06) ; BLOCKED_RESEARCH 2 (MP01, MP02) ; BLOCKED_DECISION 1 (MP04).** Ce classement conservateur évalue la totalité du moment prévu, pas seulement son fragment exportable. L'absence de Markdown n'est pas, à elle seule, un motif de blocage ; ici les lacunes concrètes sont listées.

### 4.3. Knowledge et recherches encore ouvertes

| Knowledge utilisée directement | Disponibilité et limites constatées |
| --- | --- |
| [CON-AGENT-IA](../knowledge/concepts/agent-ia.md) | Définition opérationnelle, assistant/workflow/agent, contrôle humain. Ne couvre pas les critères détaillés multi-agents ni une plateforme. |
| [CON-MCP](../knowledge/concepts/mcp.md) | Rôles, API/connecteur/plugin, limites, permissions, provenance et versions documentées dans le patrimoine. Métadonnée `synthese_pedagogique_a_valider` : le qualificatif « Knowledge validée » du Markdown ne vaut pas validation P3 globale. |
| [MET-CONNEXION-MCP](../knowledge/methods/grille-connexion-mcp.md) | Six questions avec preuve/inconnu, exemple et options de décision ; méthode pédagogique proposée, pas norme. |
| [CAS-RH-MCP-FICTIF](../knowledge/cases/rh-connexion-mcp-fictif.md) | Exemple fictif RH-042, séparation lecture/analyse/écriture, contrôles attendus. Ne fournit ni environnement n8n testé ni le jeu complet de données de l'atelier. |

La provenance indirecte inclut notamment `MET-GRILLE-RISQUE-IA` et les fiches Source résolues par les contenus. Leur présence ne permet pas d'importer toute l'analyse des risques du Module 3 dans le pilote. Les liens `lie_a` ne sont pas une autorisation de sélectionner automatiquement d'autres contenus. Les quatre moments sans `knowledge_refs` ne sont pas réputés avoir ces références par héritage.

Trois questions du plan sont rattachées à M02 :

| ID de recherche | Question et état enregistré | Travail restant |
| --- | --- | --- |
| `IA017-ACT-ON-DATA-R-39188e825a6c` | Quel flux RH fictif peut être montré avec les capacités actuelles de n8n et les accès autorisés ? — `external_research_needed`, aucun match Knowledge. | Version, flux reproductible et accès ; fraîcheur à vérifier au moment de l'usage. Un repli statique ne clôt pas cette question sans décision de changer le périmètre. |
| `IA017-ACT-ON-DATA-R-db7e80146e37` | Quel rôle et quelles limites de la version actuelle de MCP sont utiles à la lecture de cette carte RH ? — `covered`, revue enregistrée le 12 octobre 2026. | Pas de nouvelle recherche dans cette étude. Réexamen prévu dans les notes au plus tard le 12 novembre 2026 et avant démonstration technique. Les dates sont celles du patrimoine, non une vérification externe effectuée ici. |
| `IA017-ACT-ON-DATA-R-70cf05c4fca4` | Quels critères justifieraient une orchestration multi-agents plutôt qu'un workflow simple dans ce cas ? — `external_research_needed`, aucun match. | Comparaison argumentée des conditions/coûts ; fraîcheur proposée de 180 jours, à arbitrer. |

MP02 conserve `besoin_recherche:true` dans la structure et une question MCP pourtant couverte dans le plan : c'est la lecture combinée des deux fichiers qui permet de distinguer besoin initial et avancement. Ne pas réouvrir automatiquement MCP, ni déclarer tout MP02 couvert parce qu'une des deux questions l'est.

## 5. Mapping proposé Hector → types VCOAC

Ce tableau propose des familles de diapositives et leurs conditions ; il ne fixe ni pagination ni spec finale. Les intitulés courts et la répartition entre écran, notes et ressources devront être préparés dans le contenu pédagogique, puis validés.

| Moment / fonction | Types candidats réels et raison | Données disponibles | Manques et conditions de traduction |
| --- | --- | --- | --- |
| MP01 / VOIR puis COMPRENDRE | `VISUEL_QUESTION` pour une capture/representation choisie et une question ; `ARCHITECTURE_FLUX` pour expliquer ensuite le trajet en COMPRENDRE. Plusieurs slides possibles pour l'observation puis la lecture. | Titre-question, intention, durée, observation sans pratique, rôles/flux/validations attendus. | Scénario, flux exact, démonstration ou repli validé, image et provenance, messages/notes. `ARCHITECTURE_FLUX` n'accepte pas VOIR : ne pas lui donner cette phase pour fusionner arbitrairement le moment. |
| MP02 / COMPRENDRE | `DEFINITION/voisines` ou `CARTES` pour API/connecteur/MCP ; `ARCHITECTURE_FLUX` pour client/serveur et trajet ; `OPPOSITION_LIGNES` ou `CARTES` pour les limites. `COMPARAISON_AB` seulement après traitement de la question multi-agents. | Définitions, exemple RH-042, connexion/autorisation/validation, trajet et question/réponse déjà rédigés. | Messages courts traçables et notes par slide, choix d'icônes si nécessaires, comparaison absente. Garder « CAS FICTIF » visible. Le diagramme natif est linéaire gauche→droite : il ne représente pas automatiquement un aller-retour `↔`, un branchement ou une validation conditionnelle. |
| MP03 / OUTILLER | `CARTES` pour l'explication et l'exemple rempli ; **deux `FICHE_OUTIL` de trois champs** pour les six questions, si le découpage éditorial est validé. `GRILLE_DEMO` est une alternative conditionnelle, pas une conversion immédiate. | Six questions, six réponses de l'exemple, support vierge, conseils, trajet annoté et timing. | Canvas global à compléter/valider ; libellés courts et répartition 3+3 sans perte ni regroupement sémantique. Préserver un support complet consultable. `GRILLE_DEMO` impose quatre colonnes et deux règles absentes de cette structure : ne pas les créer pour satisfaire le moteur. |
| MP04 / AGIR | `CONSIGNE_ATELIER` pour lancer le TP ; `VISUEL_QUESTION/commentee` pour un exemple de carte/correction, une fois ces ressources conçues. Plusieurs slides peuvent soutenir les 60 min, sans multiplier cette durée. | Intention, livrable carte logique, 60 min de pratique ; critères généraux C02. | Cas/données, modalités, étapes, critères contextualisés, non-acceptés, corrigé, exemple de production. C02 donne **quatre critères**, le type en accepte **deux à trois** : toute sélection/fusion exige un choix pédagogique traçable. |
| MP05 / AGIR | `CONSIGNE_ATELIER` pour la revue croisée ; `VISUEL_QUESTION/commentee` pour afficher un scénario d'échec ou une correction préparée. | Revue entre pairs, scénario d'échec et révision argumentée prévus ; 30 min de pratique. | Scénario exact, consignes, critères et correction. `EVALUATION_CAS` n'est pas retenu : il suppose un cas neuf et une visée d'évaluation que le moment n'annonce pas. |
| MP06 / CONSOLIDER | `A_RETENIR` après rédaction/validation de la phrase, des trois règles et du contraste ; éventuellement `PROCESSUS` si une véritable séquence de lecture est explicitée dans le contenu. | Entrée, responsabilité, validation ; transition M03 ; 5 min. | Ne pas transformer les trois noms en règles détaillées, contraste ou enchaînement par automatisme. `CE_QUI_A_CHANGE` exigerait un premier écrit et une consigne de relecture non prévus. |

**Proposition de lisibilité.** Réutiliser le même trajet entre MP01, MP02 et MP03 après harmonisation du cas ; éviter trois schémas concurrents. MP04 et MP05 peuvent partager une ressource de carte, mais garder leurs consignes et durées distinctes. La correction MP05 et la synthèse MP06 peuvent être rapprochées visuellement, avec phases et temps toujours traçables. Aucune fusion pédagogique n'est décidée ici.

Ne pas imposer de couverture, formateur, programme complet, inclusion, quiz ou bilan de formation à cet extrait Module 2. Une `OUVERTURE_SEQUENCE` serait possible, mais impose une image et des textes courts supplémentaires ; elle reste un choix éditorial à confirmer. Le moteur ne consomme pas les Markdown et ne réalise aucune de ces sélections.

## 6. Données manquantes et décisions préalables

| Priorité | Manque | Lieu de résolution proposé |
| --- | --- | --- |
| 1 | Cas fil rouge retenu, responsable des données fictives, dossier d'atelier complet ; le cas MCP existant reste un candidat, pas une validation implicite. | Arbitrage D02/H04, puis contenus et ressources du scénario. |
| 1 | n8n : flux, version, accès, scénario reproductible ; ou choix explicite d'une représentation statique et conséquences sur l'objectif. | D05/H05, plan de recherche puis contenu MP01. |
| 1 | Comparaison multi-agents à documenter ou à retirer/déplacer explicitement ; MP02 remplit déjà ses 15 min avec MCP. | Recherche dédiée et arbitrage pédagogique ; modification des sources seulement dans un cycle autorisé. |
| 1 | Canvas général, consignes MP04/MP05, modalités, étapes, critères/non-acceptés, exemples et corrigés. | Markdown de scénario ; Knowledge uniquement pour éléments effectivement réutilisables. |
| 2 | Synthèse MP06, textes courts écran, notes présentateur et liens de provenance associés. | Contenu riche, avec fragments identifiables ; pas de rédaction cachée dans l'adaptateur. |
| 2 | Captures/visuels pertinents, fichiers et crédits ; choix d'icônes ; fidélité des flèches et circuits d'écriture. | Ressources validées et profil de traduction externe. |
| Transverse | Accord sur le périmètre/temps et le remplacement des réalisations techniques par la conception ; validation P3/P4. | D01/D03/D04 et portes de l'architecture. Le désaccord global 420/435 ne change pas le total local constaté de 140 min. |

L'adaptateur ne doit pas faire apparaître des tests de droits, des permissions client, des licences, un résultat de démonstration ou une conformité comme acquis parce que les exemples décrivent un comportement souhaité.

## 7. Contrat proposé pour `adapters/vcoac/`

### 7.1. Frontières et sources de vérité

```text
formation.json + content/*.md + Knowledge référencée + état du plan de recherche
  → chargement et contrôles Hector existants
  → représentation pédagogique VCOAC du seul AOD-M02
  → adapters/vcoac/ : traduction selon la version vendored
  → spec générée + traçabilité de génération dans outputs/
  → copie d'exécution de machine_vcoac → PPTX + rapport machine
```

**Invariants confirmés :** `formation.json` porte structure, états, liens et temps ; Markdown porte le contenu riche ; Knowledge porte les connaissances réutilisables ; `research-plan.json` documente l'avancement des besoins ; la machine est un moteur de rendu externe. La spec, le manifeste et le PPTX sont des **artefacts dérivés**, jamais un nouveau lieu d'édition pédagogique. Une correction remonte au fichier qui fait autorité, puis déclenche une régénération.

La représentation intermédiaire conserve les IDs, l'ordre, toutes les fonctions cognitives, les durées, les fragments et leur provenance. Elle ne contient ni coordonnées, ni tailles typographiques, ni noms de composeurs. Les noms de types et contraintes graphiques apparaissent seulement à la frontière `adapters/vcoac/`. Aucun import de `pptxgenjs` ou de composeur dans `core/`, aucun champ de mise en page ajouté au schéma formation.

### 7.2. Entrées, dérivations et interdits

| Origine | Données utilisées / traitement permis |
| --- | --- |
| `formation.json` | Identité et sélection M02, compétences et critères existants, ordre des moments, fonctions, titres, intentions, temps, concepts, `content_ref`, `knowledge_refs`, hypothèses et décisions. `contenu_prevu` indique le programme du moment ; ce n'est pas un substitut aux consignes détaillées. |
| Markdown enrichis | Messages, définitions, exemples, cas fictifs, mode d'emploi, support vierge, déroulé, relances/réponses, limites et provenance. Les headings sont aujourd'hui libres : aucun contrat de blocs typés ou résumé écran n'existe. |
| Knowledge référencée | Définition, méthode, cas, statut, nature fictive/réelle, sources et dates. Réutilisation des fragments explicitement sélectionnés ; ne pas importer toutes les notes voisines ni refaire une recherche. |
| Plan de recherche | État question par question, preuve attendue, usages par moment, revue et fraîcheur ; pas de clôture automatique au score lexical. |
| Dérivations mécaniques | Mise en majuscules d'une fonction pour la phase, ordonnancement selon les sources, noms de sections/fichiers, références de fragments, chemins d'assets, numérotation, partition d'affichage prévalidée, total des minutes compté une seule fois par moment. |
| Interdits | Inventer cas, chiffres, sources, dates, résultat d'essai, consignes, corrigés, critères, modalités, permissions, décision pédagogique, réponse à une recherche ouverte, validation humaine ; supprimer une question ou réduire une activité pour respecter une cardinalité. |

**L'adaptateur traduit ; il ne conçoit pas la pédagogie.** Résumer librement un paragraphe, choisir les trois critères « importants » parmi quatre ou transformer six questions en cinq est une décision éditoriale/pédagogique. Préparer ces formulations et découpages dans les sources riches avant traduction. Préférer, pour le premier incrément, quelques fragments explicites et repérables au développement d'un interpréteur général de prose.

Les notes sont issues de fragments sélectionnés : essentiels → `notes.essentiel`, transition → `notes.transition`, question → `notes.relance`, réponse → `notes.reponse`, limites → `notes.vigilance`. Préserver les qualificatifs « fictif », « proposé », « non testé », les sources et versions. Si une longueur ou un nombre imposé ne peut être respecté sans perte, signaler le fragment et demander son traitement lors du cycle de contenu, sans troncature silencieuse.

### 7.3. Sortie et refus avant rendu

**Proposition.** L'adaptateur reçoit un module sélectionné et ses contenus validés, plus un profil de mapping explicitement approuvé et la version/empreinte de la machine. Il produit soit une spec conforme et un manifeste dérivé, soit un diagnostic de refus détaillant moment, fragment, champ cible et cause. Ne pas appeler la machine tant qu'un refus subsiste.

Le manifeste conserve formation/module/moments, position de chaque slide, fragment source, références Knowledge/sources, version du mapping, révision Git et empreintes des entrées effectivement lues (nécessaires aussi si elles ne sont pas committées), empreinte machine, politique de découpage et avertissements. Une slide peut référencer plusieurs moments et un moment plusieurs slides ; les minutes restent attachées aux moments pour éviter les doubles comptes. Ces informations restent hors du contrat de rendu et ne créent pas de seconde vérité.

Refus préalables proposés : contenu ou référence manquant, choix humain non résolu, recherche bloquante ouverte, type/phase incompatible, champ attendu absent, mauvais type JSON, texte trop long sans découpage validé, asset illisible, picto indisponible, perte de provenance, perte de fonction ou changement de durée. La politique de fraîcheur doit suivre le besoin enregistré ; la date de génération ne réinitialise jamais une vérification Knowledge.

Les contrôles supplémentaires comblant les limites du contrat restent **dans l'adaptateur et ses tests**, justifiés par la version observée. Lire le catalogue externe plutôt que dupliquer ses constantes dans le domaine Hector. Aucune modification/refactorisation de la machine pour ce pilote. Un défaut nécessitant un changement du moteur sera signalé séparément comme sujet de dépendance externe.

## 8. Stratégie de tests et vérifications

### Vérifications réalisées pendant cette étude

- Lecture statique des trois fichiers JS de la machine, du contrat complet, du README et du manifeste ; inspection des métadonnées/spec/rapport d'exemple ; inventaire des sept assets. Aucun import ni exécution du moteur.
- Décompte du catalogue et du registre : **36/36** ; décompte M02 : **6 moments, 140 min, 90 min de pratique**.
- Validateur Hector existant sur `formation.json` : **aucune erreur**, un avertissement `duration_mismatch` (420/435 min). Ce résultat ne valide pas la pédagogie.
- Chargeur `loadContents` limité aux moments M02 : **valide**, MP02/MP03 chargés et provenance résolue sans erreur. Les appels `realpath` ont d'abord été bloqués par le bac à sable (`EPERM`) ; la même vérification locale en lecture seule, autorisée hors bac à sable, a réussi. Ce n'était pas une absence de source.
- Aucun test de rendu, installation ou contrôle visuel du PPTX. Le rapport d'exemple à zéro alerte n'est pas présenté comme un test du pilote.

### Tests futurs ciblés

| Niveau | Preuve attendue |
| --- | --- |
| Sources et périmètre | Charger seulement `AOD-M02` et ses références ; aucune slide M01/M03/M04 ajoutée. Rejeter référence cassée, ID incohérent ou provenance divergente. Conserver 140/90 tant qu'aucun arbitrage ne les change. |
| Complétude | Les lacunes actuelles MP01/MP02/MP04 empêchent un export de production ; un `besoin_recherche:false` ne suffit pas. MCP couvert ne clôt pas multi-agents. |
| Traduction | Chaque fragment, fonction et critère sélectionné reste traçable ; partition 3+3 conserve les six questions ; aucun critère C02 perdu, aucun `CAS_REEL` créé à partir d'un fictif. Durées non dupliquées lors d'un découpage. |
| Contrat machine | Valeurs limites max et max+1, min/max d'éléments, champs conditionnels, variantes chaîne/objet, phase par type, notes et types JSON réels ; comparer aux contrôles existants sans recopier tout le moteur. |
| Risques du composeur | Tests ciblés des champs facultatifs mais requis en pratique, poids, chemins d'images, icônes et notes mal typées. Pas d'usage des combinaisons de variantes sans vérification de leur effet. |
| Reproductibilité et isolation | Même entrée/profil/version → même spec et même correspondance (hors métadonnées de génération) ; empreintes sources et archive inchangées après export/exécution. |
| Rendu, cycle C seulement | CLI stricte, code 0, zéro alerte, nombre réel de slides conforme et notes présentes. Contrôler aussi les sorties `_A_CORRIGER`, exceptions et absence éventuelle de rapport. |
| Inspection humaine | Lisibilité, densité, titres, schémas fidèles, cas fictifs visibles, consignes utilisables, corrigés, notes/provenance, conservation de la pratique. Vérifier les animations dans PowerPoint si utilisées ; le seul rapport ne suffit pas. |

Pas de nouveau framework ou de dépendance lourde nécessaire pour commencer ces tests. Le lanceur Node existant et quelques cas en mémoire ciblés suffisent pour la traduction ; le moteur et l'inspection visuelle ne seront mobilisés qu'au cycle autorisé correspondant.

## 9. Suite recommandée en trois mini-cycles

1. **Cycle A — rendre le Module 2 complet et arbitrable.** Choisir le cas et son responsable ; décider démonstration n8n/repli et place du multi-agents ; traiter les seules recherches conservées après autorisation ; compléter canvas, consignes, corrigés, exemples et synthèse. Préparer les fragments courts et les découpages compatibles sans modifier la pédagogie pour le moteur. Critère de sortie : six moments suffisamment documentés, décisions/temps explicites, validation P3 puis autorisation P4 pour la spec.
2. **Cycle B — traduire le seul Module 2.** Développer un adaptateur minimal, une projection neutre et les contrôles ciblés ; produire une spec dérivée et sa traçabilité dans `outputs/`, sans exécuter le moteur dans ce cycle. Critère de sortie : couverture des six moments, aucun contenu inventé ou perdu, conformité statique et revue de la spec. Les contraintes de la machine restent hors du cœur.
3. **Cycle C — exécuter et inspecter.** Préparer une copie d'exécution isolée et son environnement, lancer la machine en strict, inspecter PPTX et rapport, corriger les sources ou le mapping puis régénérer. Critère de sortie : code 0, zéro alerte, support Module 2 réellement utilisable et validation humaine. Les éventuels défauts du moteur sont signalés séparément ; le vendored reste intact.

**Périmètre réalisé : ce document uniquement.** Aucun adaptateur, aucune spec finale, aucun PowerPoint, aucune recherche Web, aucun contenu pédagogique nouveau, aucune modification des fixtures ou de la machine, aucun commit. Les cycles suivants attendent l'accord de l'utilisateur.

## Annexe A — Champs du catalogue complet

Inventaire documentaire du contrat version 1.0. Les champs communs de §2.1 s'ajoutent à chaque type. Dans la notation ci-dessous : `!` = requis ; `≤n` = maximum de caractères ; `[a–b]` = cardinalité ; `si …` = obligation/contrainte conditionnelle. Les valeurs et défauts des variantes sont indiqués. Les omissions de typage et les écarts des composeurs décrits au §2.4 restent applicables : cette annexe ne constitue pas un validateur indépendant.

### GUIDE

Phases : CADRE. Plafond : 110 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `colonnes` **!** [2–2] ; `colonnes[].titre` **!** ≤30 ; `colonnes[].items` **!** [2–6] ; `colonnes[].items[].texte` **!** ≤80.
- Autres champs déclarés : `entete` ≤60 ; `kicker` ≤30 ; `colonnes[].items[].code` ≤3 ; `chaine.titre` ≤40 ; `chaine.etapes` [3–6] ; `chaine.etapes[]` ≤22.

### COUVERTURE

Phases : CADRE. Plafond : 90 mots.

- Champs requis (selon conditions) : `image` **!** ; `code` **!** ≤30 ; `titreCouverture` **!** ≤36 (si variante = standard) ; `question` **!** ≤90 (si variante = question).
- Autres champs déclarés : `logo` ≤24 ; `signature` ≤40 ; `sousTitre` ≤40 (si variante = standard) ; `triptyque` [3–3] (si variante = standard) ; `triptyque[]` ≤14 ; `filRouge` ≤70 ; `duree` ≤40.
- Variantes : `variante` = standard / question (défaut : standard).

### FORMATEUR

Phases : CADRE. Plafond : 90 mots.

- Champs requis (selon conditions) : `titreSlide` **!** ≤40 ; `nom` **!** ≤40 ; `role` **!** ≤70 ; `approche` **!** [1–2] ; `portrait` **!**.
- Autres champs déclarés : `entete` ≤60 ; `organisme` ≤30 ; `approche[]` ≤140 ; `etiquettes` [2–4] ; `etiquettes[]` ≤25 ; `contact` ≤60.

### OBJECTIFS

Phases : CADRE. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `amorce` **!** ≤70 ; `objectifs` **!** [3–8] ; `objectifs[].verbe` **!** ≤20 ; `objectifs[].suite` **!** ≤60.
- Autres champs déclarés : `entete` ≤60 ; `source` ≤140.

### PROGRAMME

Phases : CADRE. Plafond : 130 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `colonnes` **!** [2–2] ; `colonnes[].titre` **!** ≤40 ; `colonnes[].modules` **!** [1–4] ; `colonnes[].modules[].titre` **!** ≤40.
- Autres champs déclarés : `entete` ≤60 ; `colonnes[].modules[].n` ≤3 ; `colonnes[].modules[].duree` ≤10 ; `colonnes[].modules[].atelier` ≤80.

### FIL_ROUGE

Phases : CADRE, VOIR. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `image` **!** ; `terrain` **!** ≤90 ; `contexte` **!** [2–3] ; `mission` **!** ≤120.
- Autres champs déclarés : `entete` ≤60 ; `kicker` ≤30 ; `contexte[]` ≤110.

### INCLUSION

Phases : CADRE. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤80 ; `colonnes` **!** [2–2] ; `colonnes[].picto` **!** ; `colonnes[].titre` **!** ≤30 ; `colonnes[].items` **!** [1–3] ; `recueil.titre` **!** ≤60.
- Autres champs déclarés : `entete` ≤60 ; `kicker` ≤30 ; `colonnes[].items[]` ≤70 ; `recueil.n`.

### BILAN

Phases : CADRE, CONSOLIDER. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `questions` **!** [2–3] ; `questions[].question` **!** ≤70 ; `canal.etiquette` **!** ≤20 ; `canal.texte` **!** ≤90.
- Autres champs déclarés : `entete` ≤60 ; `kicker` ≤30 ; `questions[].aide` ≤90.

### OUVERTURE_SEQUENCE

Phases : SEQUENCE. Plafond : 90 mots.

- Champs requis (selon conditions) : `numero` **!** ≤20 ; `titreSequence` **!** ≤42 ; `objectif` **!** ≤90 ; `image` **!** ; `question` **!** ≤160.
- Autres champs déclarés : `entete` ≤60 ; `organisme` ≤30 ; `production` ≤80.

### QUESTION_SALLE

Phases : VOIR. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤45 ; `cas.texte` **!** ≤260 ; `consigne.titre` **!** ≤40 ; `consigne.texte` **!** ≤110 ; `recueil.titre` **!** ≤50.
- Autres champs déclarés : `kicker` ≤30 ; `cas.etiquette` ≤40 ; `recueil.n`.

### VISUEL_QUESTION

Phases : VOIR, COMPRENDRE, AGIR, CONSOLIDER. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤55 ; `image` **!** ; `question` **!** ≤100 (si variante = sombre) ; `commentaire.titre` **!** ≤60 (si variante = commentee) ; `commentaire.points` **!** [2–5] (si variante = commentee).
- Autres champs déclarés : `kicker` ≤30 ; `annotations` [0–6] (si variante = commentee) ; `annotations[].texte` ≤24 ; `commentaire.etiquette` ≤30 (si variante = commentee) ; `commentaire.points[]` ≤60 ; `source` ≤140.
- Variantes : `variante` = sombre / commentee (défaut : sombre).

### CAS_REEL

Phases : VOIR, COMPRENDRE. Plafond : 90 mots.

- Champs requis (selon conditions) : `kicker` **!** ≤40 ; `titre` **!** ≤75 ; `recit` **!** [2–3] (si variante = avant_apres) ; `recit` **!** ≤200 (si variante = trois_temps) ; `temps` **!** [2–2] (si variante = avant_apres) ; `temps` **!** [3–3] (si variante = trois_temps) ; `temps[].etiquette` **!** ≤30 ; `temps[].texte` **!** ≤110 ; `source` **!** ≤140.
- Autres champs déclarés : `recit[]` ≤160 ; `temps[].chiffre` ≤12 ; `temps[].style` {cible / apres / alerte}.
- Variantes : `variante` = avant_apres / trois_temps (défaut : avant_apres).

### CAS_DEMONSTRATION

Phases : VOIR. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `document.titre` **!** ≤16 ; `document.champs` **!** [3–4] ; `document.champs[].libelle` **!** ≤24 ; `document.champs[].valeur` **!** ≤36 ; `question` **!** ≤70 ; `consignes` **!** [2–3].
- Autres champs déclarés : `kicker` ≤30 ; `document.etiquette` ≤40 ; `document.sousTitre` ≤40 ; `document.mention` ≤60 ; `consignes[]` ≤90.

### SCHEMA_DIAGNOSTIC

Phases : VOIR. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤75 ; `noeuds` **!** [4–8] ; `noeuds[].id` **!** ≤12 ; `noeuds[].texte` **!** ≤30 ; `noeuds[].col` **!** ; `noeuds[].ligne` **!** ; `liens` **!** [1–12] ; `annotation` **!** ≤25 ; `question` **!** ≤80 ; `legende` **!** ≤90.
- Autres champs déclarés : `kicker` ≤30 ; `noeuds[].sous` ≤24.

### CHIFFRES_CLES

Phases : VOIR, COMPRENDRE. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `chiffres` **!** [1–3] (si variante = trois) ; `chiffres[].valeur` **!** ≤6 ; `chiffres[].libelle` **!** ≤80 ; `chiffres[].source` **!** ≤60 ; `versions` **!** [2–2] (si variante = un) ; `sorties` **!** [2–2] (si variante = un) ; `chiffre.valeur` **!** ≤6 (si variante = un) ; `chiffre.libelle` **!** ≤90 (si variante = un).
- Autres champs déclarés : `kicker` ≤30 ; `chapeau` ≤100 ; `versions[].etiquette` ≤30 ; `versions[].texte` ≤60 ; `sorties[]` ≤40 ; `chiffre.detail` ≤120 (si variante = un) ; `aRetenir` ≤110 ; `source` ≤140.
- Variantes : `variante` = trois / un (défaut : trois).

### CARTES

Phases : COMPRENDRE, OUTILLER, VOIR. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `cartes` **!** [2–5] ; `cartes[].titre` **!** ≤40 ; `cartes[].corps` **!** ≤110 ; `cartes[].picto` **!** (si variante.entete = picto) ; `cartes[].etiquette` **!** ≤16 (si variante.entete = etiquette).
- Autres champs déclarés : `kicker` ≤30 ; `cartes[].couleur` {navy / jaune} (si variante.entete = etiquette) ; `cartes[].citation` ≤120 (si variante.disposition = lignes) ; `cible.titre` ≤40 (si variante.disposition = lignes) ; `cible.texte` ≤80 (si variante.disposition = lignes) ; `aRetenir` ≤110 ; `source` ≤140.
- Variantes : `variante.disposition` = colonnes / lignes / grille (défaut : colonnes) ; `variante.entete` = numero / picto / etiquette (défaut : numero).

### OPPOSITION_LIGNES

Phases : VOIR, COMPRENDRE. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `entetes` **!** [2–2] ; `lignes` **!** [2–4] ; `lignes[].idee` **!** ≤70 ; `lignes[].reponse` **!** ≤150.
- Autres champs déclarés : `kicker` ≤30 ; `entetes[]` ≤25 ; `regle` ≤100 ; `source` ≤140.

### COMPARAISON_AB

Phases : COMPRENDRE. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `a.etiquette` **!** ≤25 ; `a.titre` **!** ≤30 ; `a.points` **!** [2–3] ; `b.etiquette` **!** ≤25 ; `b.titre` **!** ≤30 ; `b.points` **!** [2–3].
- Autres champs déclarés : `kicker` ≤30 ; `a.points[]` ≤80 ; `b.points[]` ≤80 ; `a.style` {cible} ; `b.style` {cible} ; `signe` ≤1 {→ / ≠} ; `anatomie.etiquette` ≤40 ; `anatomie.pastilles` [3–6] ; `anatomie.pastilles[]` ≤18 ; `aRetenir` ≤110.

### PROCESSUS

Phases : COMPRENDRE, OUTILLER, CONSOLIDER. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `etapes` **!** [3–5] ; `etapes[].nom` **!** ≤18 ; `etapes[].phrase` **!** ≤70.
- Autres champs déclarés : `kicker` ≤30 ; `etapes[].exemple` ≤60 ; `aRetenir` ≤110 ; `source` ≤140.
- Variantes : `variante` = chevrons (défaut : chevrons).

### FRISE

Phases : COMPRENDRE. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `jalons` **!** [3–6] ; `jalons[].repere` **!** ≤20 ; `jalons[].titre` **!** ≤30 ; `jalons[].texte` **!** ≤90.
- Autres champs déclarés : `kicker` ≤30 ; `aRetenir` ≤110 ; `source` ≤140.

### GRAPHIQUE

Phases : COMPRENDRE. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤75 ; `graphique.serie` **!** ≤30 ; `graphique.categories` **!** [2–8] ; `graphique.valeurs` **!** [2–8] ; `annotation.chiffre` **!** ≤8 ; `annotation.texte` **!** ≤120 ; `source` **!** ≤140.
- Autres champs déclarés : `kicker` ≤30 ; `graphique.categories[]` ≤14 ; `graphique.format` ≤20 ; `aRetenir` ≤110.

### DEFINITION

Phases : COMPRENDRE, OUTILLER. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `definition` **!** ≤220 (si variante = notion | notation) ; `sertA.etiquette` **!** ≤30 (si variante = notion | notation) ; `sertA.points` **!** [2–3] (si variante = notion | notation) ; `exemple.etiquette` **!** ≤30 (si variante = notion) ; `exemple.texte` **!** ≤140 (si variante = notion) ; `notions` **!** [3–5] (si variante = voisines) ; `notions[].picto` **!** ; `notions[].terme` **!** ≤18 ; `notions[].definition` **!** ≤110 ; `image.titre` **!** ≤40 (si variante = notation) ; `image.source` **!** ≤120 (si variante = notation).
- Autres champs déclarés : `kicker` ≤30 ; `sertA.points[]` ≤90 ; `exemple.criteres.etiquette` ≤30 ; `exemple.criteres.points` [0–4] ; `exemple.criteres.points[]` ≤60 ; `image.consigne` ≤120 (si variante = notation) ; `image.chemin` (si variante = notation) ; `aRetenir` ≤110.
- Variantes : `variante` = notion / voisines / notation (défaut : notion).

### SCHEMA_HUB

Phases : COMPRENDRE. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `centre.picto` **!** ; `centre.texte` **!** ≤20 ; `satellites` **!** [4–6] (si variante = hub) ; `satellites[].titre` **!** ≤22 ; `satellites[].texte` **!** ≤50 ; `familles` **!** [4–4] (si variante = quadrants) ; `familles[].picto` **!** ; `familles[].nom` **!** ≤24 ; `question` **!** ≤100 (si variante = quadrants).
- Autres champs déclarés : `kicker` ≤30 ; `familles[].fond` {ardoise / jaune / brume}.
- Variantes : `variante` = hub / quadrants (défaut : hub).

### MATRICE_2X2

Phases : COMPRENDRE, OUTILLER. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `axes.x` **!** ≤20 ; `axes.y` **!** ≤20 ; `quadrants` **!** [4–4] ; `quadrants[].titre` **!** ≤18 ; `quadrants[].texte` **!** ≤60 ; `mode.etiquette` **!** ≤30 ; `mode.etapes` **!** [2–4].
- Autres champs déclarés : `kicker` ≤30 ; `quadrants[].style` {cible / neutre / faible / eviter} ; `mode.etapes[]` ≤70.

### NIVEAUX

Phases : COMPRENDRE, CONSOLIDER. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `niveaux` **!** [3–3] (si variante = pyramide) ; `niveaux[].nom` **!** ≤20 ; `niveaux[].question` **!** ≤70 ; `axe` **!** [2–2] (si variante = pyramide) ; `marches` **!** [3–4] (si variante = escalier) ; `marches[].nom` **!** ≤18 ; `marches[].picto` **!** ; `message` **!** ≤130 (si variante = escalier) ; `question` **!** ≤100 (si variante = escalier).
- Autres champs déclarés : `kicker` ≤30 ; `axe[]` ≤16.
- Variantes : `variante` = pyramide / escalier (défaut : pyramide).

### ARCHITECTURE_FLUX

Phases : COMPRENDRE. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `colonnes` **!** [3–5] ; `colonnes[].poids` **!**.
- Autres champs déclarés : `kicker` ≤30 ; `colonnes[].type` {carte / socle} ; `colonnes[].etiquette` ≤26 ; `colonnes[].titre` ≤24 ; `colonnes[].lignes` [1–4] ; `colonnes[].lignes[]` ≤40 ; `colonnes[].blocs` [1–3] ; `colonnes[].blocs[].titre` ≤30 ; `colonnes[].blocs[].texte` ≤40 ; `bandeau` ≤50.

### METHODE

Phases : OUTILLER. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `gestes` **!** [3–5] ; `gestes[].verbe` **!** ≤35 ; `gestes[].question` **!** ≤80.
- Autres champs déclarés : `kicker` ≤30 ; `chapeau` ≤100 ; `gestes[].origine` ≤30 ; `source` ≤140.

### FICHE_OUTIL

Phases : OUTILLER. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤40 ; `champs` **!** [3–5] ; `champs[].nom` **!** ≤25 ; `champs[].consigne` **!** ≤80.
- Autres champs déclarés : `kicker` ≤30 ; `pied` ≤90.

### GRILLE_DEMO

Phases : OUTILLER. Plafond : 130 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `colonnes` **!** [4–4] ; `lignes` **!** [2–6] ; `lignes[].famille` **!** ≤24 ; `regles` **!** [2–2] ; `regles[].titre` **!** ≤30 ; `regles[].texte` **!** ≤120.
- Autres champs déclarés : `kicker` ≤40 ; `colonnes[]` ≤30 ; `lignes[].sous` ≤40 ; `lignes[].cellules` [3–3] ; `lignes[].cellules[]` ≤60 ; `lignes[].aVous`.

### FEUILLE_DE_ROUTE

Phases : OUTILLER, AGIR. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤75 ; `phases` **!** [3–4] ; `phases[].etiquette` **!** ≤16 ; `phases[].nom` **!** ≤15 ; `phases[].texte` **!** ≤60 ; `pieges.etiquette` **!** ≤30 ; `pieges.items` **!** [3–5] ; `pieges.items[].terme` **!** ≤30.
- Autres champs déclarés : `kicker` ≤30 ; `phases[].cle` ; `pieges.items[].suite` ≤60.

### CONSIGNE_ATELIER

Phases : AGIR. Plafond : 130 mots.

- Champs requis (selon conditions) : `titre` **!** ≤50 ; `modalites` **!** [2–4] ; `modalites[].texte` **!** ≤24 ; `contexte` **!** ≤120 ; `etapes` **!** [3–5] ; `livrable` **!** ≤100 ; `criteres` **!** [2–3] ; `nonAcceptes` **!** [1–3].
- Autres champs déclarés : `kicker` ≤30 ; `modalites[].style` {navy / jaune / contour} ; `etapes[]` ≤90 ; `criteres[]` ≤90 ; `nonAcceptes[]` ≤70.

### EVALUATION_CAS

Phases : AGIR. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤50 ; `scenario.etiquette` **!** ≤45 ; `scenario.texte` **!** ≤160 ; `defis.etiquette` **!** ≤45 ; `defis.points` **!** [2–3] ; `visuel.avant` **!** ; `visuel.apres` **!** ; `activite.etiquette` **!** ≤45 ; `activite.livrable` **!** ≤40 ; `activite.duree` **!** ≤12.
- Autres champs déclarés : `kicker` ≤30 ; `chapeau` ≤100 ; `defis.points[]` ≤60 ; `visuel.legende` ≤50.

### QUIZ

Phases : VOIR, AGIR, CONSOLIDER. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤90 ; `options` **!** [3–4] ; `options[].lettre` **!** ≤1 ; `options[].texte` **!** ≤60 ; `modalite` **!** ≤110 ; `notes.reponse` **!** ≤260.
- Autres champs déclarés : `kicker` ≤30.

### CE_QUI_A_CHANGE

Phases : CONSOLIDER. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤30 ; `etapes` **!** [3–3] ; `etapes[].titre` **!** ≤25 ; `etapes[].texte` **!** ≤40 ; `consigne` **!** ≤60 ; `question` **!** ≤80.

### A_RETENIR

Phases : CONSOLIDER. Plafond : 90 mots.

- Champs requis (selon conditions) : `contraste` **!** [2–2] ; `phrase` **!** ≤130 ; `regles` **!** [3–3].
- Autres champs déclarés : `kicker` ≤30 ; `contraste[]` ≤12 ; `regles[]` ≤50 ; `prochaineEtape` ≤120.

### ENGAGEMENT

Phases : CONSOLIDER. Plafond : 90 mots.

- Champs requis (selon conditions) : `titre` **!** ≤60 ; `champs` **!** [3–5] ; `champs[].etiquette` **!** ≤30.
- Autres champs déclarés : `kicker` ≤30 ; `chapeau` ≤100 ; `champs[].aide` ≤70.

## Cycle A — Complétude Module 2

**Lecture du suivi :** les bilans ci-dessous sont chronologiques. L’état courant
figure dans « Validation réelle n8n par le formateur », à la fin de cette section ;
les mentions antérieures de décision non appliquée décrivent l’étape précédente.

**Date : 12 octobre 2026.** Périmètre : Act-On Data, AOD-M02 uniquement.
L’audit initial ci-dessus est conservé. Cette section constate les enrichissements
du Cycle A ; elle ne valide ni le cas fil rouge, ni les accès, ni les portes P3/P4.
Point de départ Git : `1cea848e3295c0c8624594e19f95af218e6c51e7`.

### Analyse avant modification

Relecture préalable effectuée : AGENTS.md, cahier des charges, architecture cible,
audit initial, formation, plan de recherche, cinq contenus existants, patrimoine
Knowledge et modèles, schéma formation, chargeurs content/knowledge/research.
La matrice a été reconstituée et présentée avant toute écriture.

Tous les moments ont pour statut éditorial JSON `proposition_a_valider` ; il est
inchangé. Les états ci-dessous portent sur la complétude du **moment entier**.
Durées indiquées : total / pratique.

| Moment et titre | Fonctions ; minutes | Avant ; Markdown existant | Knowledge disponible / manquante | Obstacle précis à READY | Candidats déjà identifiés |
| --- | --- | --- | --- | --- | --- |
| AOD-M02-MP01 — Où une demande RH circule-t-elle réellement ? | VOIR + COMPRENDRE ; 20 / 0 | BLOCKED_RESEARCH ; aucun | Cas RH/MCP disponibles indirectement ; documentation n8n, version et essai absents. | Démonstration non préparée/testée ; accès, cas et repli non confirmés (D02/D05). | VISUEL_QUESTION puis ARCHITECTURE_FLUX en COMPRENDRE. |
| AOD-M02-MP02 — Situer ressources, connexions et MCP | COMPRENDRE ; 15 / 0 | BLOCKED_RESEARCH ; content/AOD-M02-MP02.md | CON-AGENT-IA, CON-MCP, CAS-RH-MCP-FICTIF ; critères et coûts multi-agents manquants. | Comparaison absente ; les 15 min sont déjà réparties entre les apports MCP. | DEFINITION, CARTES, ARCHITECTURE_FLUX, OPPOSITION_LIGNES ; COMPARAISON_AB après recherche. |
| AOD-M02-MP03 — Préparer la carte logique | OUTILLER ; 10 / 0 | PARTIAL ; content/AOD-M02-MP03.md | CON-MCP, MET-CONNEXION-MCP, CAS-RH-MCP-FICTIF ; MET-GRILLE-CONCEPTION-AGENT réutilisable. Aucune recherche nécessaire. | Canvas global, exemple rempli et gabarit global manquants ; seule la grille MCP est complète. | CARTES ; deux FICHE_OUTIL de trois questions ; GRILLE_DEMO seulement si structure pertinente. |
| AOD-M02-MP04 — Cartographier le workflow RH | AGIR ; 60 / 60 | BLOCKED_DECISION ; aucun | Cas illustratifs et grilles disponibles ; dossier de TP non choisi/non fourni. | AOD-D02/H04 : choix du cas et responsable ; modalités selon D05. Consignes et correction contextualisées à préparer ensuite. | CONSIGNE_ATELIER, VISUEL_QUESTION/commentee. |
| AOD-M02-MP05 — Éprouver et expliquer la carte | AGIR ; 30 / 30 | PARTIAL ; aucun | CAS-RH-MCP-FICTIF et MET-CONNEXION-MCP réutilisables ; aucune recherche nécessaire. | Protocole, échec, livrable et correction non rédigés ; dépendance au cas MP04 déjà signalée. | CONSIGNE_ATELIER, VISUEL_QUESTION/commentee. |
| AOD-M02-MP06 — Fixer les points de lecture du workflow | CONSOLIDER ; 5 / 0 | PARTIAL ; aucun | Trois repères JSON et cas RH/MCP suffisants ; aucune Knowledge manquante. | Synthèse exacte, illustration et déroulé à formuler. | A_RETENIR si contraste fondé ; PROCESSUS seulement pour une séquence réelle. |

**Avant : READY 0 ; PARTIAL 3 ; BLOCKED_RESEARCH 2 ; BLOCKED_DECISION 1.**

### Recherche réellement effectuée et capitalisation préalable

Recherche interne par lecture des notes et recherche textuelle `n8n`,
`multi-agents`, `orchestration`, `critères de choix`. Le rapprochement lexical
sert seulement à trouver les notes ; l’examen du contenu décide de la couverture.

**Question n8n — R-39188e825a6c (MP01).** Aucun fond n8n dans Knowledge ; le cas
MCP déclare explicitement ne pas couvrir ce besoin. Lecture ciblée de trois pages
officielles : [Manual Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.manualworkflowtrigger.md),
[Edit Fields](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.set),
[If](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if.md).
Capitalisation avant rédaction de MP01 :

- [SRC-N8N-FLUX-FICTIF](../knowledge/sources/n8n-flux-fictif.md) : capacités documentées, dates et limites.
- [OUT-N8N-DEMO-FICTIVE](../knowledge/tools/n8n-demonstration-fictive.md) : candidat documentaire dérivé de RH-042 ; preuve d’exécution absente.

Le candidat montre des valeurs fictives et une sortie à examiner. Il ne calcule
pas les événements absents du cas, ne simule pas une procédure RH et ne démontre
ni MCP, ni agent, ni contrôle d’accès métier. **Aucune instance n8n installée,
configurée ou exécutée.** Les pages ne confirment pas les accès ou la version
de session. Les deux matches sont `partial` ; la revue documente pourquoi le
statut reste `external_research_needed`. Un accès autorisé, un essai daté et le
choix du scénario sont encore nécessaires ; davantage de recherche Web ne les
remplacerait pas. Le repli statique reste une décision, pas une solution appliquée.

**Question multi-agents — R-70cf05c4fca4 (MP02).** Le concept agent et la grille
de conception excluaient explicitement les critères multi-agents de leur portée.
Les fiches sources contenaient seulement des repères généraux. Lecture ciblée
des pages déjà identifiées :
[Anthropic, Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
et [Google Cloud, Choose a design pattern](https://docs.cloud.google.com/architecture/choose-design-pattern-agentic-ai-system).
Les passages utilisés et dates sont ajoutés aux deux fiches sources existantes,
en conservant leur provenance initiale. La date de publication Anthropic
19 décembre 2024 est désormais constatée ; la page avertit que l’outillage a
évolué. Le Cycle A retient des critères conceptuels, sans enseigner cet outillage.

Capitalisation avant utilisation :
[MET-CHOIX-ORCHESTRATION](../knowledge/methods/comparer-workflow-multi-agents.md).
La méthode applique la comparaison au cas illustratif RH-042 déjà utilisé en
MP02, avec rôles, échanges, désaccord, coût/délai à vérifier et même résultat
attendu. Elle n’affirme aucun gain mesuré ni besoin démontré de multi-agents.
La question passe à `covered` après examen sémantique Codex, déclaré comme tel
et soumis à validation utilisateur. Seule la méthode est retenue comme couverture
suffisante ; les sources contributives restent `partial`.

**Seulement ces deux questions ont changé.** Question MCP déjà couverte et
questions hors Module 2 inchangées. Les formulations, origines et critères de
preuve sont conservés. Le plan complet comporte maintenant 3 questions couvertes
et 5 ouvertes ; pour M02 : 2 couvertes, 1 ouverte. Aucune API payante configurée.

### Contenus, outils et activité préparés

`formation.json` reçoit uniquement des références courtes aux contenus et à la
Knowledge de MP01/MP02/MP03/MP05/MP06. Titres, intentions, fonctions, minutes,
pratique, architecture et décisions restent identiques. **MP04 n’est pas modifié**,
ne reçoit ni Markdown ni référence nouvelle. Aucune décision n’est appliquée.

| Fichier de contenu | Travail réalisé | Portée et limites |
| --- | --- | --- |
| [MP01 créé](../examples/IA017/act_on_data/content/AOD-M02-MP01.md) | Préparation VOIR/COMPRENDRE : question, candidat, commentaire et 20 min détaillées. | Document de préparation explicitement bloqué ; pas de fausse capture ou démonstration déclarée disponible. |
| [MP02 enrichi](../examples/IA017/act_on_data/content/AOD-M02-MP02.md) | Comparaison simple/multi-agents, question/réponse et justification appliquée à RH-042. | Répartition 2+3+5+4+1 = 15 min. Les détails MCP restent dans les notes/ressource, sans suppression. Minutage à éprouver en animation. |
| [MP03 enrichi](../examples/IA017/act_on_data/content/AOD-M02-MP03.md) | Canvas global, six rubriques de la grille existante adaptées, usage, exemple rempli et gabarit vierge ; grille MCP conservée intégralement. | 2+3+4+1 = 10 min de présentation. Les deux supports complets sont disponibles ; aucun logiciel imposé. La source de cet enrichissement PARTIAL est exclusivement le patrimoine antérieur au Cycle A. |
| [MP05 créé](../examples/IA017/act_on_data/content/AOD-M02-MP05.md) | Revue en binômes/trinôme, ressources, mission, 4+8+6+8+4 = 30 min de pratique, scénario « validation absente », carte révisée, quatre critères C02 et principe de correction. | Fondé sur H7/H6 déjà capitalisés. Exemple RH-042 illustratif ; l’action et le dossier d’atelier restent à contextualiser après choix de MP04. |
| [MP06 créé](../examples/IA017/act_on_data/content/AOD-M02-MP06.md) | Phrase, trois règles, illustration existante, contraste lire/corriger et déroulé 1+3+1 = 5 min. | Aucun résultat de participant supposé. L’exemple existant suffit à produire la consolidation indépendamment du choix ultérieur du TP. |

Trois fiches Knowledge créées (une source, un outil candidat, une méthode) ; deux
fiches sources complétées. Aucun autre fond Knowledge modifié. Les enrichissements
PARTIAL ne dépendent pas des nouveaux apports de recherche du Cycle A : le canvas
réutilise la grille préexistante ; sa provenance partagée bénéficie seulement de
la relecture datée d’une source, sans nouvel enseignement importé.

### Nouvelle matrice de complétude

READY signifie contenu produisible dans le périmètre pédagogique du moment,
avec provenance résolue ; cela ne vaut ni approbation P3/P4 ni autorisation de
déployer un outil. Une inconnue explicitement utilisée dans un cas de discussion
n’est pas une preuve manquante nécessaire à cette discussion. En revanche, une
démonstration annoncée ou un dossier d’atelier encore à choisir reste bloquant.

| Moment | Après | Justification et reste à faire |
| --- | --- | --- |
| AOD-M02-MP01 | **BLOCKED_RESEARCH** | Briques et scénario candidat documentés, mais version/accès/scénario validé/essai absents. D02/D05 restent aussi ouverts. La preuve exigée par le plan n’est pas satisfaite. |
| AOD-M02-MP02 | **READY** | Intention, distinctions MCP, cas disponible, comparaison et réponse attendue rédigés. Les deux recherches propres au moment sont couvertes ; aucune décision d’architecture client requise pour expliquer la comparaison. Provenance résolue. |
| AOD-M02-MP03 | **READY** | Outil global et grille MCP identifiés ; usage, exemple rempli, deux gabarits et annotations disponibles. Toutes les rubriques utiles à C02 figurent dans le canvas. Pas de recherche ni choix de logiciel indispensable. Provenance résolue. |
| AOD-M02-MP04 | **BLOCKED_DECISION** | Inchangé. D02/H04 : cas, responsable, dossier et données à confirmer ; puis consigne et correction contextualisées à préparer. Carte d’arbitrage ci-dessous, non appliquée. |
| AOD-M02-MP05 | **BLOCKED_DECISION** (hérité de MP04) | Le manque rédactionnel du protocole est résolu. Situation, mission, 30 min, ressources, consigne, livrable, quatre critères et correction sont préparés. Mais l’activité complète dépend du dossier et de la carte MP04 : aucun READY conditionnel accordé. |
| AOD-M02-MP06 | **READY** | Phrase, trois repères, exemple et commentaire exacts ; aucune nouvelle recherche ou décision nécessaire au contenu de consolidation. Retour aux cartes réelles facultatif, jamais supposé. Provenance résolue. |

**Après : READY 3 ; PARTIAL 0 ; BLOCKED_RESEARCH 1 ; BLOCKED_DECISION 2.**
Le nombre de décisions racines n’a pas augmenté : **une même décision de cas
bloque MP04 et MP05**. L’audit initial comptait MP05 en PARTIAL et signalait sa
dépendance sans la compter comme décision. Sa rédaction étant maintenant faite,
la dépendance devient son obstacle principal. Compter seulement MP04 et afficher
MP05 READY masquerait cette condition du contrat de complétude.

Le module garde **140 minutes, dont 90 de pratique**. Les timings internes de
MP02/MP03 sont des propositions éditoriales pour couvrir leur périmètre initial,
pas des durées modifiées ou des validations d’animation obtenues.

### Productibilité future, sans adaptation au moteur

- **MP01 :** VISUEL_QUESTION puis ARCHITECTURE_FLUX restent des candidats ; visuel
  d’exécution absent. Une représentation statique ne pourra pas simuler une preuve.
- **MP02 :** DEFINITION/CARTES pour les termes, OPPOSITION_LIGNES pour les
  frontières, COMPARAISON_AB désormais documentée. Le retour de consultation et
  les contrôles conditionnels doivent rester visibles : un flux linéaire natif
  ne suffit pas à les représenter automatiquement.
- **MP03 :** le canvas global reste un support entier consultable. Les **six
  questions MCP sont toutes conservées** ; deux FICHE_OUTIL de trois champs ou
  plusieurs CARTES sont envisageables. Aucune réduction à cinq questions et
  aucune grille à quatre colonnes inventée pour GRILLE_DEMO.
- **MP04/MP05 :** CONSIGNE_ATELIER et visuel commenté restent candidats. La
  consigne MP05 possède cinq étapes ; **les quatre critères C02 restent intacts**.
  Le type limité à deux/trois critères impose une projection ultérieure en
  plusieurs supports, pas une suppression. Le principe de correction est rédigé,
  mais une carte corrigée du TP n’est pas encore disponible.
- **MP06 :** A_RETENIR devient un candidat fondé : « Lire / Corriger » reprend la
  distinction déjà enseignée ; la phrase et les trois règles sont écrites pour
  la pédagogie. Leur projection graphique reste à vérifier par le futur adaptateur.

Aucune spec, aucun PPTX, aucun adaptateur et aucune modification/exécution de
la machine VCOAC. Les candidats ne sont pas des choix de mise en page définitifs.

### Carte d’arbitrage — MP04, décision non appliquée

**Décision à prendre :** quel cas RH fictif retenir pour le TP, et qui en fournit
et valide le dossier ? Nécessaire pour contextualiser les 60 min de cartographie
et la revue de 30 min, sans inventer une procédure métier (AOD-D02/H04).

| | Option A — adapter RH-042 déjà capitalisé | Option B — cas fictif fourni par le formateur/client |
| --- | --- | --- |
| Conséquence pédagogique | Continuité avec MP02/MP03 ; transformer l’illustration en dossier de TP explicite. | Contexte potentiellement plus pertinent ; préparer ressources, attendus et correction propres. |
| Conséquence durée | Conserver 60 + 30 min ; préparation du dossier en amont à attribuer. | Viser les mêmes 60 + 30 min si le cas est borné ; sinon nouvel arbitrage, aucune extension automatique. |
| Avantage | Repères déjà disponibles, moins de changement de contexte. | Meilleur ajustement au besoin choisi par le formateur. |
| Risque | L’exemple actuel n’est pas un jeu de données complet ; ne pas inventer les événements ni la règle permettant 8 → 9. | Délai de fourniture et périmètre inconnus ; la contribution des Data Scientists n’est pas acquise. |

**Recommandation Codex : Option A**, sous validation explicite du formateur.
Elle réutilise les repères déjà enseignés et préserve la continuité du module.
Désigner un responsable pour préparer puis valider le dossier et les attendus.
Cette recommandation ne choisit pas le cas et ne lève pas D02 ni le besoin de
preuve n8n/D05.

### Contrôles et résultat du Cycle A

- **190 tests réussis, 0 échec, 0 ignoré**, via `node --test --test-reporter=spec`.
  Les 187 tests existants sont conservés ; six fichiers de tests reçoivent
  uniquement les attentes actualisées de contenu, de couverture et de dates.
- Trois tests nécessaires ajoutés dans `core/cycle-a.test.mjs` : refuser la
  promotion de la documentation n8n partielle ; refuser une source contributive
  seule comme couverture multi-agents ; isoler une source n8n manquante à MP01
  et vérifier l’absence d’enrichissement de MP04.
- Première exécution bloquée notamment par `EPERM` sur `realpath(knowledge)`
  dans la sandbox. Cause confirmée par le chargeur ; suite complète réussie
  hors sandbox. Une attente ancienne du filtre de recherche a également été
  actualisée pour la nouvelle couverture multi-agents. Aucun code moteur modifié.
- Les chargeurs et tests vérifient formation, plan et provenance des huit
  contenus du scénario, dont les cinq contenus M02. L’existence d’un Markdown
  ne fait pas passer automatiquement un moment READY.
- Comparaison finale à HEAD : audit initial intégralement préservé ; MP04
  identique ; formation identique hors références des cinq moments enrichis ;
  seules les deux questions indiquées modifiées. `git diff --check` réussi,
  index vide. Le ZIP reste non suivi, non modifié (SHA-256 identique à celui
  de l’audit initial : `EBB56F01DADE9A290B8702BDDF82FEBD7748CCF2F9E8469C5C4F1A86153C095B`).

**Production du module entier encore empêchée** par la preuve de démonstration
MP01, le choix et la préparation du dossier MP04, puis la contextualisation de
MP05. Les validations globales déjà ouvertes dans le JSON restent inchangées et
distinctes de ce travail de contenu. Les choix de visuels, projections et contrôles
graphiques relèveront ensuite de P4 ; aucun rendu n’est prétendu vérifié ici.

**Arrêt du Cycle A : aucun arbitrage appliqué, aucun commit.**

### Suivi après validation de l’Option A — 12 octobre 2026

**Décision A validée par le formateur : adapter le cas fictif RH-042.**
Hector Studio prépare le dossier pédagogique ; le formateur valide le dossier
avant utilisation en session. Le choix et la responsabilité sont acquis ; la
validation de la version préparée n’est pas encore obtenue. Ce suivi remplace
le bilan précédent pour les statuts courants, sans effacer l’historique.

**Dossier créé :** [CAS FICTIF — RH-042](../knowledge/cases/rh-042-dossier-pedagogique.md),
identifiant `CAS-RH042-ATELIER`. Il fournit la demande du manager, trois pièces
D1/D2/D3, les ressources représentées, les permissions, la frontière de correction
et le scénario de revue. Les valeurs 8/9 et RH-099 viennent du cas existant.
D2 reste volontairement insuffisant pour certifier 9 : l’exercice consiste à
concevoir un chemin de vérification, pas à inventer une règle de congés. La
consigne fictive D3 explicite le traitement attendu sans se prétendre règle client.
Aucune recherche externe nécessaire ni réalisée.

**MP04 complété :** [contenu](../examples/IA017/act_on_data/content/AOD-M02-MP04.md),
situation, mission, ressources accessibles, cinq étapes (10+15+15+10+10 = 60 min),
carte annotée attendue, quatre critères C02, principe de correction et carte/brouillon
de référence pour le formateur. Travail sur papier possible ; aucune dépendance
à une démonstration n8n ni à un outil connecté.

**MP05 vérifié et adapté :** [contenu](../examples/IA017/act_on_data/content/AOD-M02-MP05.md).
Le seul blocage restant était bien le choix et la préparation du dossier commun.
Les pièces D1–D3 et la référence MP04 sont disponibles ; le scénario porte maintenant
explicitement sur l’absence de réponse du RH et la correction RH-042 de 8 à 9.
La carte des participants sera produite en MP04 selon la consigne préparée :
c’est une dépendance normale de séance, plus un livrable à concevoir en amont.
Les 30 min (4+8+6+8+4), quatre critères et principe de correction sont conservés.
Aucun autre blocage de contenu identifié.

#### Statuts courants des six moments

| Moment | Statut | Justification |
| --- | --- | --- |
| AOD-M02-MP01 | **BLOCKED_OPERATIONAL** | Version n8n, accès autorisés, exécution réelle et comportement à vérifier ; aucune preuve de fonctionnement. |
| AOD-M02-MP02 | **READY** | Distinctions et comparaison documentées, cas illustratif disponible ; contenu inchangé. |
| AOD-M02-MP03 | **READY** | Canvas, exemple et gabarits disponibles ; contenu inchangé. |
| AOD-M02-MP04 | **READY** | Cas choisi, dossier, consigne, ressources et référence de correction complets ; 60 min conservées. |
| AOD-M02-MP05 | **READY** | Revue contextualisée avec pièces, action, échec et correction précis ; 30 min conservées. |
| AOD-M02-MP06 | **READY** | Synthèse et illustration disponibles ; contenu inchangé. |

**Bilan courant : READY 5 ; PARTIAL 0 ; BLOCKED_RESEARCH 0 ;
BLOCKED_DECISION 0 ; BLOCKED_OPERATIONAL 1.** Module inchangé : 140 min dont 90
de pratique. READY évalue la complétude pour produire le contenu ; la validation
du dossier avant usage en session, expressément confiée au formateur, reste à obtenir.
Elle n’est pas confondue avec la décision de cas désormais validée.

**MP01 n’est pas modifié et ne devient pas READY.** Son ancien libellé documentaire
BLOCKED_RESEARCH est précisé ici en BLOCKED_OPERATIONAL : la lacune restante est
une preuve d’usage, pas une connaissance supplémentaire à chercher sur le Web.
Le plan de recherche reste inchangé et ouvert (`external_research_needed`, parmi
les trois états que son schéma accepte) ; cet état ne constitue pas une demande
de recherche Web ni une couverture acquise. Le statut courant de complétude est
celui de la matrice ci-dessus. Aucun changement du schéma ou du moteur.

#### Checklist courte — prochaine action : test réel n8n

- [ ] Noter version exacte, environnement et date du test.
- [ ] Faire confirmer les accès autorisés et le responsable de l’environnement.
- [ ] Exécuter réellement le candidat sur valeurs fictives : 8/9 avec écart,
  puis 8/8 sans écart ; observer entrées, branche suivie et sortie attendue.
- [ ] Vérifier l’absence de correction métier/envoi et conserver une trace datée
  du comportement observé, des écarts et du verdict avant de réévaluer MP01.

**Checklist préparée, aucun point déclaré réalisé.** La validation du cas de
cartographie n’atteste ni une instance disponible ni une démonstration n8n réussie.

#### Contrôles après préparation du dossier

Le chargeur contrôle la provenance des neuf contenus du scénario. Les contrôles
du dossier vérifient sa nature fictive, ses références et la condition de validation
avant session ; retirer le dossier doit invalider MP04/MP05 sans toucher les autres
moments. La matrice distingue explicitement le blocage opérationnel de MP01 et
les durées des ateliers sont conservées.

**Suite complète : 193 tests réussis, 0 échec, 0 ignoré**, via
`node --test --test-reporter=spec`, hors sandbox à cause du blocage `realpath`
déjà confirmé. Trois tests ciblés ajoutés pour le dossier et ses liens, l’effet
d’une référence de cas absente et la cohérence matrice/durées. Les attentes
existantes de comptage sont actualisées : neuf contenus, 26 fiches Knowledge.

Seul blocage de complétude restant : **test réel n8n pour MP01**. Condition de
session restante : **validation du dossier RH-042 par le formateur**. Aucun
PowerPoint, adaptateur, spec finale, modification machine ou commit.

### Validation réelle n8n par le formateur — 12 octobre 2026

**État courant : MP01 READY ; Module 2 : 6 READY / 6.** Ce bilan remplace
les bilans précédents, conservés comme historique du Cycle A.

Le formateur confirme l’exécution réelle avec succès sur **n8n Cloud**, le
**12 octobre 2026**. Trace enregistrée depuis son retour explicite transmis
par l’utilisateur ; aucune exécution indépendante de Codex.

| Test | elements_recus | elements_attendus | Branche exécutée | Résultat | Verdict |
| --- | --- | --- | --- | --- | --- |
| A | 8 | 9 | FALSE | Dossier incomplet | PASS |
| B | 8 | 8 | TRUE | Dossier complet | PASS |

Manual Trigger, Edit Fields, If et deux branches déterministes ; condition
« elements_recus = elements_attendus ». Aucune API externe, aucune donnée RH
réelle et aucun agent IA. Ce scénario remplace le candidat de comparaison des
compteurs : les nombres sont des éléments fictifs, pas des jours de congés.
Version exacte, captures et export non transmis ; ils ne sont pas inventés.
La confirmation du formateur lève le dernier blocage opérationnel pédagogique.
La fiche outil et MP01 sont actualisés ; la question n8n est couverte par cette
validation d’usage, pas par la documentation seule. Le README est aligné sur le
scénario réellement testé pour éviter une inversion des branches lors d’un nouvel essai.

| Moment | Statut |
| --- | --- |
| AOD-M02-MP01 | **READY** |
| AOD-M02-MP02 | **READY** |
| AOD-M02-MP03 | **READY** |
| AOD-M02-MP04 | **READY** |
| AOD-M02-MP05 | **READY** |
| AOD-M02-MP06 | **READY** |

**Bilan : READY 6 ; PARTIAL 0 ; BLOCKED_RESEARCH 0 ; BLOCKED_DECISION 0 ;
BLOCKED_OPERATIONAL 0.** Durées conservées : 140 min, dont 90 de pratique.

Avant l’adaptateur : valider le profil de mapping et les découpages éditoriaux
à la porte P4 ; préparer les fragments/visuels requis sans perte pédagogique.
La validation du dossier RH-042 avant utilisation en session reste confiée au
formateur. READY ne constitue pas une validation graphique ni un test du moteur.
Aucun adaptateur, spec ou PowerPoint créé ; machine VCOAC inchangée.

Contrôle après mise à jour : **193 tests réussis, 0 échec, 0 ignoré**, via
`node --test --test-reporter=spec`. Les attentes de couverture sont actualisées
et les tests vérifient les deux résultats déclarés, la trace n8n Cloud et les
six statuts READY. Aucun code de production modifié ; ZIP VCOAC exclu du commit.

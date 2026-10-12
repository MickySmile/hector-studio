# Adaptateur VCOAC — Act-On Data

Deux projections de `IA017-ACT-ON-DATA` : le pilote Module 2 validé et la
formation complète. Elles produisent une spec JSON et ses preuves de traçabilité.
**Aucun rendu PowerPoint dans ces lanceurs.** Le pilote reste reproductible
à l'identique. Les sections ci-dessous décrivent d'abord ce pilote ; l'extension
complète est documentée en fin de fichier.

## Préparer la dépendance locale

La machine externe auditée est fournie séparément sous
`references/machine_vcoac/machine_vcoac.zip`. Depuis la racine du dépôt, avec PowerShell,
si le dossier local n’existe pas encore :

```powershell
Expand-Archive -LiteralPath references/machine_vcoac/machine_vcoac.zip -DestinationPath references/machine_vcoac/local
```

Le répertoire obtenu est `references/machine_vcoac/local/machine_vcoac/`.
Le ZIP et l’extraction sont ignorés par Git. Ne pas les modifier ni les ajouter.
Aucune installation npm n’est nécessaire au Cycle B. Aucun import de PptxGenJS,
React, Sharp ou d’une police par l’adaptateur.

## Générer et vérifier

Node.js avec les modules natifs déjà utilisés par Hector, depuis la racine :

```text
node adapters/vcoac/generate.mjs
node --test --test-reporter=spec
```

La suite complète, y compris les tests d’intégration de l’adaptateur, nécessite
la machine locale auditée. Son absence produit une erreur explicite, jamais un
test de contrat simulé ni un succès par omission.

Sous la sandbox Windows, les chargeurs existants peuvent rencontrer `EPERM`
sur `realpath` : relancer ces mêmes commandes selon la procédure hors sandbox
autorisée. Il ne s’agit ni d’un téléchargement ni d’une installation.

Quatre artefacts déterministes dans `outputs/vcoac/` :

- `IA017-act-on-data-module2.json` : spec au format de la machine ; jamais source de vérité.
- `IA017-act-on-data-module2-intermediate.json` : IDs, moments, champs, sections,
  empreintes, Knowledge, notes et durées comptées une seule fois par moment.
- `IA017-act-on-data-module2-validation.json` : résultat du contrôleur réel,
  contrôles complémentaires et limites de validation.
- `IA017-act-on-data-module2-mapping.md` : choix éditoriaux à examiner avec le formateur.

## Séparation des responsabilités

1. `formation.json`, contenus Markdown, plan de recherche et Knowledge : fond Hector.
2. `projection.mjs` : reformulations d’écran et découpage éditorial explicites,
   chacun relié à des sections sources. Aucune synthèse libre à l’exécution.
3. `generate.mjs` : charge seulement les six contenus M02, résout la provenance
   avec les chargeurs existants, vérifie les recherches M02 et la readiness,
   conserve toutes les sections sources dans les notes, puis produit la spec.
4. `machine.mjs` : frontière avec la dépendance externe, validation sans rendu.

`sources.lock.json` fige les empreintes normalisées LF du fond lu et de la
projection relue par Codex pour cette proposition P4. **Ce verrou ne vaut pas
approbation du formateur.** Une source ou une projection modifiée est refusée :
relire les conséquences pédagogiques et revoir explicitement le mapping avant
d’actualiser le verrou. Ne pas actualiser les empreintes pour contourner une erreur.
Les artefacts ne sont jamais réimportés comme contenu pédagogique.

Les six questions MCP, les six rubriques du canvas et les quatre critères C02
sont conservés. Les corrections restent dans les notes formateur. Les supports
participant sont les documents Hector reliés dans le mapping ; pas de lecture
exhaustive des notes pendant les 10 minutes de MP03.

## Validation exacte de la machine

L’audit renouvelé confirme que le CLI `build_template.js` contrôle puis compose
et écrit un PPTX, y compris avec `--strict`. Il n’existe pas de commande dédiée
à la validation seule. Ce CLI **n’est pas lancé** au Cycle B.

Le pont lit les cinq fichiers machine audités et vérifie leurs SHA-256. Il
exécute dans un contexte JavaScript isolé les fonctions originales du bloc
« Lecture du contrat », dont `controlerContrat`, et la fonction originale `fr`.
Les fonctions sont extraites en mémoire depuis les fichiers locaux inchangés ;
leur code n’est pas recopié dans Hector. Aucune fonction de composition ou
d’écriture n’est chargée. Le catalogue `types_vcoac.json` reste l’unique contrat.

Les contrôles complémentaires Hector refusent notamment les types JSON erronés,
les clés inconnues et les assets hors profil. Le profil V1 utilise des formes et
du texte natifs, sans image ni pictogramme. Le nombre de mots est borné par un
majorant conservateur (textes déclarés + 20 mots pour libellés/numéros natifs) ;
le compteur exact du rendu n’est pas prétendu exécuté.

**Non vérifié au Cycle B :** métriques des polices, géométrie, chevauchements,
débordements et rendu réel des notes. La conformité au contrat ne vaut pas
validation graphique. Le prochain cycle autorisé devra exécuter le rendu puis
l’inspecter. Le contrôle automatique de provenance vérifie les liens, les
empreintes et la conservation des textes ; la fidélité sémantique des
reformulations reste une revue humaine P4.

Les exemples de `template_spec.json` sont relus comme illustrations, pas comme
preuves de conformité : certaines formes historiques (par exemple `nonAcceptes`
en chaîne) sont plus permissives que le contrat. V1 utilise un tableau de textes.

## Pilote vertical validé — Cycle C

Le formateur valide la version révisée du Module 2 : **17 slides**, activités
MP04 et MP05 fusionnées, rappel n8n intégré, notes et provenance conservées.
Il confirme pouvoir animer le module avec ce support, avec la démonstration
n8n réalisée en parallèle. Le rendu réel passe la machine locale en mode
`--strict` avec **0 alerte** ; les **204 tests** réussissent.

Décisions éditoriales validées pour cette projection :

- Une activité correspond à une slide de consigne lorsque la lisibilité le
  permet ; ne pas forcer une fusion qui surcharge la slide.
- Les critères peuvent être synthétisés à l'écran. Leurs formulations complètes
  et leur sens restent conservés dans les notes formateur ou le corrigé.
- Ne jamais supprimer du fond pour satisfaire un layout : ajuster la projection
  et conserver les sections pédagogiques intégrales avec leur provenance.
- Un rappel schématique peut accompagner une démonstration réalisée en parallèle,
  sans reproduire toute l'interface ni ajouter de connaissance ou d'asset.

MP04 conserve ses cinq étapes et ses **60 minutes** ; MP05 conserve ses cinq
étapes et ses **30 minutes**. Les quatre critères C02 et les corrigés sont dans
les notes. MP03 conserve six slides pour dix minutes : présenter la logique et
les supports, sans lecture exhaustive des notes ni remplissage pendant OUTILLER.

Le commit du pilote conserve uniquement les sources nécessaires à sa reproduction.
Les PPTX, specs, rapports et prévisualisations sont des artefacts générables dans
`outputs/vcoac/`, ignorés par Git. Le ZIP et l'extraction de la machine restent
des dépendances locales externes. La validation de ce rendu ne remplace pas les
contrôles stricts et visuels d'un futur rendu modifié.

## Extension à la formation complète — spec et mapping uniquement

Référence pédagogique : `036dd3b69202775b66cb2adfe40629cdd5a890f3`.
Les 18 moments READY sont projetés dans l'ordre de la formation. Une ouverture
et une clôture communes viennent de `conduite-session.md`. Les transitions
réutilisent les consolidations et reprises existantes. L'enveloppe reste
420 min dont 250 de pratique ; les durées ne sont jamais comptées par slide.

```text
node adapters/vcoac/generate-full.mjs
node --test --test-reporter=spec
```

Le premier lanceur écrit uniquement les quatre artefacts préfixés
`outputs/vcoac/IA017-act-on-data-full` : spec `.json`, `-mapping.md`,
`-validation.json` et `-intermediate.json`. Il ne touche pas aux sorties du pilote.
Le mapping contient les champs écran, sections sources, références Knowledge,
notes exactes, transitions, choix éditoriaux et zones de vigilance. Le manifeste
intermédiaire rend ces informations inspectables par programme.

- `full-projection.mjs` porte les reformulations M1/M3/M4 et le cadre commun.
  Il importe la projection M2 sans la modifier.
- `project.mjs` partage le contrôle des IDs, de l'ordre, des fonctions et des
  sections, puis la conservation intégrale des sources dans les notes.
- `generate-full.mjs` vérifie formation, readiness, recherche et provenance,
  réexécute le pilote et compare ses 17 slides ainsi que ses quatre artefacts
  aux empreintes figées avant l'extension, puis appelle le contrôleur réel.
- `full-sources.lock.json` verrouille uniquement le fond nécessaire et les
  décisions de projection relues. Aucun recalcul automatique des verrous.
- `full.test.mjs` couvre l'ensemble, les régressions du pilote, les refus
  d'entrées altérées, les liens, les fixtures interdites et le déterminisme.

**Notes : option B explicitement choisie par l'utilisateur le 12 octobre 2026.**
Les sections sources et corrigés restent intégraux, comme dans le pilote.
Les utiliser comme réserve d'animation, sans les lire intégralement en séance.
Les rubriques facultatives de notes restent limitées à transition, relance,
réponse et vigilance, appuyées sur le contenu disponible.

La seule recherche ouverte autorisée par le verrou porte sur les règles client
avant transfert réel ; elle n'est jamais déclarée couverte. Le cas fictif reste
animable. Les arbitrages d'attestation et d'usage réel gardent leur portée
documentée dans la conduite de session.

La validation porte sur le contrat, types, champs, longueurs, notes, provenance,
ordre, couverture et absence d'assets. Les écrans nouveaux utilisent les mêmes
types natifs que le pilote, plus PROGRAMME, BILAN et OPPOSITION_LIGNES, relus dans
le catalogue et les composeurs locaux. Aucune image externe requise ni recherchée.
Le rendu graphique reste à examiner dans une étape ultérieure autorisée.
**Ne pas lancer `build_template.js` pour le deck complet à cette étape.**

# Adaptateur VCOAC — pilote Act-On Data / Module 2

V1 limitée à `IA017-ACT-ON-DATA / AOD-M02`. Produit une proposition P4,
une spec JSON et ses preuves de traçabilité. **Aucun rendu PowerPoint.**

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

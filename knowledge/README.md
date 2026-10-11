# Patrimoine Knowledge de Hector Studio

Ce coffre conserve les connaissances réutilisables indépendamment des formations
et des moteurs de production. **Markdown = contenu humain riche ; frontmatter
YAML = métadonnées structurées.** Il peut être ouvert directement dans Obsidian.
La V1 ne contient aucune connaissance métier IA017 ; seuls les modèles sont fournis.
Les exemples synthétiques restent dans `tests/fixtures/knowledge/`.

## Types et identifiants

| Dossier | Type | Préfixe conseillé | Contenu |
| --- | --- | --- | --- |
| `concepts/` | `concept` | `CON-` | Définition, distinctions, exemples, limites |
| `sources/` | `source` | `SRC-` | Provenance, document ou URL, éléments soutenus |
| `cases/` | `case` | `CAS-` | Cas explicitement réel, reconstruit ou fictif |
| `methods/` | `method` | `MET-` | Démarche transférable, étapes, exemple |
| `tools/` | `tool` | `OUT-` | Outil, version, accès, usage et limites |
| `_templates/` | — | — | Modèles vierges, jamais indexés |

Copier le modèle adapté, attribuer un ID globalement unique et stable et nommer le
fichier d’après cet ID. Ne pas réutiliser un ID supprimé. Le titre peut évoluer.
Les champs `id`, `type` et `title` sont requis pour indexer une fiche.
`statut: brouillon` n’est pas une validation de la connaissance.

## Relations et usages

Utiliser des liens Obsidian cités dans les propriétés :
`sources: ["[[sources/SRC-…]]"]`, `lie_a: ["[[concepts/CON-…]]"]` ou
`illustre: ["[[concepts/CON-…]]"]`. `soutient` peut pointer vers une note qui
contient l’affirmation ; aucun dossier de claims n’est requis.
Les identifiants montrés ici sont des gabarits, pas des fiches existantes.
Les relations inverses sont consultables dans Obsidian ; le moteur V1 cherche
des candidats lexicaux, sans construire ni valider un graphe de relations.

`used_by` est une liste plate d’identifiants de formation, à renseigner lors d’une
capitalisation réelle. Dans un plan, `used_by` référence précisément les couples
module/moment et les formulations VCOAC originales. Une revue humaine peut
référencer la fiche dans `review.knowledge_ids`. Ces références de plan font
autorité pour la réutilisation ; les listes des fiches ne sont pas synchronisées
automatiquement et ne doivent pas être prises pour un index exhaustif.

## Fraîcheur et confiance

- `verified_at` : date de vérification réelle du contenu, pas sa date de création.
- `review_after` : dernière date de validité retenue, au format `YYYY-MM-DD`.
- `published_at` et `accessed_at` : dates documentaires d’une source, distinctes
  de la vérification du contenu.
- `confidence` : `faible`, `moyenne`, `forte` ou `null` ; appréciation déclarée,
  à justifier dans le corps de la fiche. Ce n’est jamais le score lexical.

Le moteur confronte la date de vérification à la fraîcheur du besoin :
`max_age_days` (borne inclusive), `verification_usage` (vérification le jour
d’utilisation) et l’échéance de la fiche. Une échéance dépassée ou un âge trop
grand donne `stale`. Une date manquante, future ou une politique non définie donne
`unknown`, jamais une assurance de fraîcheur. Le jour de contrôle est explicite
et injectable dans les tests ; par défaut, le moteur utilise la date UTC.

Un candidat pertinent et frais peut être réutilisé **après revue humaine** ;
pertinent mais ancien, il doit être actualisé ; absent, il laisse un besoin de
recherche externe. Une correspondance lexicale ne change jamais le statut du plan.

## Format YAML pris en charge en V1

Pour rester hors réseau et sans nouvelle dépendance, le lecteur accepte un profil
YAML plat : textes simples ou cités, nombres, booléens, `null`, listes de textes
en lignes `  - "texte"` ou en syntaxe JSON `[]` / `["texte"]`. Les cinq modèles
respectent ce profil, qui est du YAML compatible Obsidian. Les commentaires sur
une ligne séparée sont possibles. Citer les textes contenant `: ` ou ` #`.

Les objets imbriqués, blocs multilignes YAML, ancres, tags YAML et listes inline
non JSON ne sont pas pris en charge : les erreurs sont signalées, pas ignorées.
Placer le texte riche dans le corps Markdown. Si l’édition Obsidian nécessite
plus de syntaxes, adopter le parseur `yaml` envisagé dans l’architecture après
arbitrage. Les répertoires réservés, README et modèles ne sont pas recherchés.

## Plan de recherche et commandes locales

Depuis la racine du dépôt :

```powershell
node core/research.mjs extract examples/IA017/program_only/formation.json
node core/research.mjs check examples/IA017/program_only/formation.json
node core/research.mjs check examples/IA017/act_on_data/formation.json
node --test
node app/server.mjs
```

`extract` imprime une proposition JSON sans écrire ni remplacer un plan existant.
`check` recharge le plan voisin, contrôle sa traçabilité et cherche dans Knowledge.
Le cockpit lit ces mêmes fichiers sur `http://127.0.0.1:3000`, onglet Recherche.
Un plan manquant/invalide ou une fiche illisible donne un état d’erreur explicite,
sans masquer les autres vues de la formation. Aucun bouton ne lance de recherche.

Les questions des plans proviennent exclusivement des `questions_recherche`
VCOAC. L’objectif pédagogique reprend l’intention du moment. Importance, types de
sources, fraîcheur et preuve sont des propositions éditoriales explicites, à
valider (`cadrage_status`), pas des faits tirés d’une recherche. Les seuils de
90/180 jours des plans IA017 sont des propositions de travail, pas une politique
universelle. Certaines questions nécessitent une confirmation client, et non du Web.

La déduplication normalise accents, casse, ponctuation et espaces. Une fusion
sémantique supplémentaire exige un groupe explicite et une justification
(`buildResearchPlan(..., { groups })`). Chaque occurrence conserve son module,
son moment, son index à partir de zéro et son texte original. Les 8 questions de
chaque scénario IA017 restent distinctes ; aucune fusion forcée. Pas de fusion
entre scénarios : la future fiche Knowledge pourra être partagée.

Les IDs générés dérivent du scénario et de la formulation normalisée ; ils restent
stables si l’ordre change. Une reformulation substantielle appelle une migration
explicite et une nouvelle revue, pas un remplacement aveugle du plan.

Les états `covered` et `refresh_needed` exigent une `review` : responsable, date,
justification sémantique et IDs de fiches existantes. `covered` exige des fiches
fraîches ; `refresh_needed` au moins une fiche périmée retenue après examen.
Un ancien `covered` devenu périmé invalide le plan jusqu’à réexamen humain ;
le système ne renouvelle pas silencieusement la couverture. Les matches lexicaux
sont recalculés à la lecture sans sauvegarde ni promotion automatique.

La V1 prépare les critères de la future recherche externe. Elle n’intègre aucun
connecteur, API externe, embeddings, base vectorielle ni génération de supports.

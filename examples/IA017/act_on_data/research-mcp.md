# Cycle externe MCP / connectivité — 12 octobre 2026

## Périmètre et état initial

Question unique : `IA017-ACT-ON-DATA-R-db7e80146e37`, rattachée à **AOD-M02-MP02** : « Quel rôle et quelles limites de la version actuelle de MCP sont utiles à la lecture de cette carte RH ? »

La formulation utilisateur précise l’angle manager : apport, standardisation, limites et contrôles. Elle ne remplace pas la formulation VCOAC dans le plan. État initial : `external_research_needed`, aucun match enregistré, aucune revue. Référence Git initiale : `ad6204ffdc2d5b4525e7540c5b6f64532c83c39e`.

Lecture préalable : AGENTS, cahier des charges, architecture, README Knowledge, formation et plan Act-On Data, 14 fiches existantes, modèles Knowledge, core/knowledge.mjs et core/research.mjs. Dépôt propre au départ.

## Recherche interne avant le Web

Exécution réelle de `searchKnowledge`, date de contrôle 2026-10-12 :

| Requête initiale | Résultat et examen |
| --- | --- |
| MCP | Seulement CON-AGENT-IA, raison `content : mcp` ; mention explicite d’un sujet restant à documenter. Aucun rôle technique établi. |
| Model Context Protocol | Aucun résultat. |
| agent outil permissions contrôle humain | Premiers résultats : MET-GRILLE-CONCEPTION-AGENT, CON-AGENT-IA, MET-GRILLE-RISQUE-IA, CON-RISQUES-IA-RH. Matches dans titres, tags, aliases et contenu. |

Réutilisation retenue : définition agent/outil et boucle ; rubriques Contexte, Actions et Contrôle ; grille de risque pour droits, données et traces ; cas RH existant comme continuité fictive. Les sources Anthropic, Google et NIST du premier cycle sont du matériau fourni capitalisé, pas une vérification actuelle de MCP. Les apports CNIL/ANSSI déjà présents éclairent les contrôles généraux ; aucune nouvelle recherche juridique.

Lacunes justifiant le Web : spécification actuelle, client/serveur, primitives, échanges, transports, autorisation et limites, différence API/connecteur/plugin, support réel documenté chez des fournisseurs. Le score MCP initial ne couvre aucune de ces lacunes.

## Sources consultées et décision

Toutes les nouvelles sources retenues ont été consultées le **2026-10-12**. Leurs fiches donnent URLs précises, sections, dates/version et niveau de preuve ; les dates inconnues restent nulles.

| Fiche source retenue | Justification |
| --- | --- |
| [MCP — spécification](../../../../knowledge/sources/mcp-specification-2026-07-28.md) | Révision 2026-07-28 ; annonce des mainteneurs et pages normatives concordantes sur les échanges actuels. |
| [MCP — autorisation et sécurité](../../../../knowledge/sources/mcp-autorisation-securite.md) | Exigences du profil d’autorisation séparées des analyses et bonnes pratiques. |
| [Anthropic — API Messages](../../../../knowledge/sources/anthropic-mcp-connector.md) | Exemple de support produit partiel ; page non datée, bêtas identifiées. |
| [Microsoft — Copilot Studio](../../../../knowledge/sources/microsoft-copilot-studio-mcp.md) | Distinction protocole/produit, nuance sur ressources ; pages d’août 2026. |
| [Google Cloud](../../../../knowledge/sources/google-cloud-mcp.md) | Support de version explicitement annoncé et contrôles de plateforme ; page du 9 octobre 2026. |

**Pistes écartées comme fondement** : VerifyMCP, Reddit et Wikipédia apparus dans les résultats n’ont pas été retenus ; sources primaires suffisantes. L’annonce de SDK bêta du 29 juin 2026 n’est pas utilisée pour établir l’état courant : l’annonce finale du 28 juillet est disponible. Les références Google à des outils individuels, aux commandes gcloud et au guide de stabilité ne sont pas nécessaires à cette explication. La page Microsoft sur les agents vocaux emploie un vocabulaire d’orchestration et de sécurité propre au produit : elle ne fonde aucune propriété normative de MCP. La preview GitHub Copilot est un périmètre distinct, non généralisé au standard harness. Ces pistes ont été vues dans les résultats, sans prétendre à une revue exhaustive de chacune.

**Limites d’accès et incohérences** : Versioning web a échoué, remplacé par son fichier officiel GitHub ; Prompts a été accessible au second essai ; l’URL de sécurité initialement supposée a été remplacée par le lien officiel. La phrase de la page d’introduction sur l’initialisation des extensions est incohérente avec les pages détaillées de 2026-07-28 : la fiche source consigne l’arbitrage documentaire. Aucun fait n’est fondé sur une page inaccessible.

## Capitalisation et examen de couverture

Huit fiches créées : **CON-MCP**, **MET-CONNEXION-MCP**, **CAS-RH-MCP-FICTIF**, et les cinq sources ci-dessus. Pas de fiche supplémentaire pour API, plugin ou outil : le tableau du concept suffit au besoin.

Les faits de spécification portent les repères P1–P11, les documentations fournisseurs F1–F3, les bonnes pratiques S1, les synthèses et propositions Hector H1–H7. Une recommandation d’interface ne devient pas une garantie de contrôle. Le cas distingue lecture, analyse et écriture validée, sans décrire l’architecture réelle du client.

**Décision assistée : `covered`**, soumise à validation utilisateur. Le concept répond au besoin pédagogique complet ; grille et cas permettent son application à la carte RH. La revue conserve responsable, date, justification et références. Aucune promotion par recherche lexicale. Le statut ne valide ni déploiement, ni droits client, ni qualité empirique de l’explication.

Chaîne visible dans l’onglet Recherche existant : **Recherche externe nécessaire → Knowledge créée → sources → statut final : covered**. Les huit références examinées apparaissent avant les candidats lexicaux ; les sources restent des contributions partielles et le concept porte la réponse complète. Aucune refonte ni nouveau mécanisme de couverture.

Les sept autres questions sont conservées à l’identique, ainsi que formation.json, VCOAC, les trois contenus enrichis et le plan Programme seul. Le patrimoine partagé peut produire de nouveaux candidats lexicaux dans les autres questions à la lecture, sans changer leurs statuts ni leurs revues enregistrées.

## Recherche de réutilisation après capitalisation

Exécutée avec le moteur existant, sans modifier son classement. Résultats complets et raisons exactes dans [research-mcp-reuse.json](research-mcp-reuse.json). Les trois premiers résultats sont résumés ci-dessous (deux seulement pour le nom développé).

| Requête | Fiches retrouvées en tête | Principaux champs du match |
| --- | --- | --- |
| MCP | CAS-RH-MCP-FICTIF, CON-MCP, MET-CONNEXION-MCP | MCP dans titre, tags, aliases et contenu ; égalité départagée par ID. |
| Model Context Protocol | CON-MCP, SRC-GOOGLE-MCP | Nom complet dans titre/aliases du concept ; le second résultat ne partage que « model » et n’est pas une réponse suffisante. |
| connecter un agent à des outils | CON-MCP, MET-CONNEXION-MCP, CON-AGENT-IA | Connecter/agent/outils dans titres, tags, aliases et contenu selon la fiche. |
| MCP vs API | MET-CONNEXION-MCP, CON-MCP, SRC-ANTHROPIC-MCP | Alias de comparaison ; API et MCP dans titres/tags/contenu. |
| serveur MCP | CAS-RH-MCP-FICTIF, CON-MCP, MET-CONNEXION-MCP | Serveur dans aliases/contenu, MCP dans les métadonnées. |
| permissions MCP | MET-CONNEXION-MCP, CON-MCP, CAS-RH-MCP-FICTIF | Permissions dans tags/aliases ; MCP dans titres et contenu. |
| sécurité MCP | MET-CONNEXION-MCP, CON-MCP, SRC-MCP-SECURITE | Sécurité normalisée sans accent ; titre/tags/aliases/contenu. |
| agent accès données | CON-MCP, CAS-RH-MCP-FICTIF, CON-RISQUES-IA-RH | Agent/accès/données dans métadonnées et contenu ; réutilisation du patrimoine de risques. |

Le moteur lexical n’interprète ni la négation ni la pertinence métier. Retrouver une source sur un mot isolé ne suffit pas à couvrir une question.

## Fraîcheur et limites

Revue éditoriale proposée au plus tard le **2026-11-12**, et avant toute démonstration/configuration. Les fournisseurs documentent des périmètres différents ; aucune matrice exhaustive du marché ni test MCP de bout en bout. Le support précis de 2026-07-28 chez Anthropic et Microsoft reste à vérifier si une implémentation les utilise. Pas d’hypothèse sur accès, licences ou règles d’Act-On Data.

Les huit requêtes démontrent la retrouvabilité, pas l’efficacité pédagogique. Aucun connecteur MCP, Perplexity payant, PowerPoint, Notion ou commit créé. Validation de l’utilisateur requise avant commit.

## Vérification finale — 2026-10-12

- Suite complète `node --test` : **184 tests réussis, 0 échec, 0 ignoré**. La première exécution sandboxée ne pouvait pas lire certaines sources externes au workspace ; la relance hors sandbox autorisée a réussi.
- Navigateur : `http://127.0.0.1:3017/`, Act-On Data → Recherche → module « Concevoir un workflow RH explicable », statut « Couverte » : une question affichée sur huit, MCP, avec les fiches utilisées, les sources et la revue. Le cockpit compte 22 fiches, 2 questions couvertes et 6 nécessitant une recherche externe.
- Comparaison structurée avec HEAD : seuls le statut, les huit correspondances examinées et la revue de la question MCP ont changé dans le plan. Les sept autres questions sont identiques.
- Aucun changement de formation.json, des contenus VCOAC, du plan Programme seul ou du code applicatif. Les changements techniques se limitent aux tests. `git diff --check` ne signale aucune erreur ; Git annonce seulement sa conversion habituelle LF vers CRLF.
- Aucun commit ni push. Validation utilisateur attendue.

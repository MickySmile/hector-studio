---
id: "CON-MCP"
type: "concept"
title: "MCP — Model Context Protocol : connecter un agent aux données et outils"
statut: "synthese_pedagogique_a_valider"
tags: ["MCP", "agent", "outils", "données", "permissions", "sécurité", "connectivité"]
aliases: ["Model Context Protocol", "MCP vs API", "serveur MCP", "client MCP", "connecter un agent à des outils", "agent accès données"]
verified_at: "2026-10-12"
review_after: "2026-11-12"
confidence: "moyenne"
sources: ["[[sources/mcp-specification-2026-07-28]]", "[[sources/mcp-autorisation-securite]]", "[[sources/anthropic-mcp-connector]]", "[[sources/microsoft-copilot-studio-mcp]]", "[[sources/google-cloud-mcp]]"]
lie_a: ["[[concepts/agent-ia]]", "[[concepts/risques-ia-donnees-rh]]", "[[methods/grille-connexion-mcp]]", "[[cases/rh-connexion-mcp-fictif]]"]
used_by: ["IA017-ACT-ON-DATA"]
---

# MCP — connecter un agent aux données et outils

## Définition opérationnelle et problème traité

**H1 — Synthèse pédagogique Hector Studio.** Un agent peut avoir besoin d’une information qui n’est pas dans la conversation, ou d’une action dans un logiciel métier. MCP fournit une manière commune de présenter et d’appeler certaines capacités externes depuis une application IA. Il réduit le travail d’adaptation entre applications compatibles ; il ne rend pas une connexion automatiquement utile ou autorisée. L’[[concepts/agent-ia|agent]] choisit des actions dans un périmètre ; MCP organise une partie de leurs échanges.

**P1 — Fait de spécification**, version **2026-07-28**, vérifiée le **2026-10-12** : MCP est un protocole ouvert d’intégration de données et d’outils aux applications LLM. Il peut aussi servir un assistant ou un workflow. [Spécification, Overview](https://modelcontextprotocol.io/specification/2026-07-28).

## API, connecteur, plugin et MCP

**H2 — Vocabulaire pédagogique**, éclairé par P1/P2 et les documentations fournisseurs F1–F3 ; ce tableau n’est pas une taxonomie normative MCP.

| Terme | Rôle à retenir | Exemple fictif RH |
| --- | --- | --- |
| API | Interface par laquelle un logiciel offre des opérations à un autre logiciel, selon son contrat. | Le SIRH propose une opération de consultation d’un compteur. |
| Connecteur / intégration | Adaptation concrète entre systèmes : traduction des données, appels, configuration et gestion des erreurs. | Une intégration traduit une demande en appel à l’API du SIRH. |
| Plugin | Terme propre à un produit pour une extension ; son contenu et ses droits dépendent de ce produit. Il peut embarquer une intégration, sans nécessairement utiliser MCP. | Une extension RH dans une application. Demander ce qu’elle installe et expose. |
| MCP | Contrat commun d’échange entre client et serveur pour les capacités prévues. | Un serveur présente l’outil `consulter_compteur` à une application compatible. |

MCP peut envelopper une API existante ; il ne remplace ni son contrat métier ni ses contrôles. Une API directe peut suffire pour un besoin unique. Un « outil MCP » est une fonction exposée, pas nécessairement un logiciel complet ni une opération d’écriture.

## Client, serveur, application : qui fait quoi ?

**P2 — Fait de spécification**, version 2026-07-28, vérifié le 2026-10-12. L’application **hôte** coordonne l’IA, le contexte et les décisions de contrôle. Elle crée des **clients MCP**, chacun communiquant avec un serveur. Le **serveur MCP**, local ou distant, expose des capacités. Il peut ensuite appeler un système métier. L’hôte porte notamment les politiques et le consentement ; le nom déclaré d’un client ne vaut pas identité authentifiée. [Architecture](https://modelcontextprotocol.io/specification/2026-07-28/architecture).

Lecture simplifiée du cas : **manager → application avec agent et client MCP ↔ serveur MCP → API RH → données**. Le modèle contribue au choix ; le client transporte la demande ; le serveur traite l’opération exposée ; le système métier applique aussi ses droits. Ce dessin est une synthèse Hector, pas l’architecture réelle d’Act-On Data.

## Ce que le protocole standardise aujourd’hui

Chaque ligne P3–P7 décrit la version **2026-07-28**, vérifiée le **2026-10-12**. Les capacités optionnelles exigent un support effectif des deux côtés.

| Repère | Échange ou capacité | Sens pour le manager | Source précise |
| --- | --- | --- | --- |
| P3 | Messages JSON-RPC 2.0 : requête, résultat/erreur et notification | Une demande et sa réponse suivent un format commun. Les requêtes portent leur version et capacités ; l’état métier peut rester dans l’application. | [Base](https://modelcontextprotocol.io/specification/2026-07-28/basic) |
| P4 | Découverte et description des outils, paramètres et résultats ; appel d’outil | L’application découvre ce que le serveur expose et comment le demander. Cela ne prouve pas que la fonction est fiable. | [Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) |
| P5 | Ressources identifiées par URI ; modèles de prompts | Une ressource fournit du contexte ; un prompt prépare des messages réutilisables. L’application décide comment les proposer. | [Resources](https://modelcontextprotocol.io/specification/2026-07-28/server/resources), [Prompts](https://modelcontextprotocol.io/specification/2026-07-28/server/prompts) |
| P6 | Elicitation, si prise en charge | Le serveur peut demander un complément à l’utilisateur via le client. La demande revient dans un résultat intermédiaire, puis le client réessaie avec la réponse ; aucune validation métier n’est garantie par ce seul mécanisme. | [Elicitation](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation) |
| P7 | Transports standard stdio et Streamable HTTP | Processus local ou échanges HTTP ; Streamable HTTP peut utiliser SSE pour ses réponses. L’ancien transport HTTP+SSE déprécié est distinct. | [Transports](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports), [registre des dépréciations](https://modelcontextprotocol.io/specification/2026-07-28/deprecated) |

**P8 — Évolution à ne pas confondre avec 2025.** La révision 2026-07-28 supprime l’initialisation et les sessions au niveau du protocole ; `server/discover` permet la découverte préalable, facultative pour le client. Les demandes de complément passent par des allers-retours explicites. Tasks quitte le cœur pour une extension optionnelle. MCP Apps et Skills over MCP sont également présentés comme extensions, pas comme capacités universelles. Roots, Sampling et Logging sont **dépréciés, encore présents**, et non recommandés pour une nouvelle implémentation. Sources : [changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog), [registre](https://modelcontextprotocol.io/specification/2026-07-28/deprecated), [présentation des extensions](https://modelcontextprotocol.io/specification/2026-07-28). Vérifié le 2026-10-12 ; ne pas enseigner une ancienne description comme actuelle.

## Connexion, identité, permissions et contrôle humain

**P9 — Fait de spécification**, version 2026-07-28, vérifié le 2026-10-12. Le cadre d’autorisation est optionnel pour une implémentation MCP ; son profil HTTP s’appuie sur OAuth 2.1, encore référencé comme draft IETF. Il décrit rôles, découverte et usage des jetons. Il n’est pas le profil conseillé pour stdio, qui récupère ses identifiants dans l’environnement. [Authorization, Scope et Requirements](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization).

**P10 — Exigences normatives du profil d’autorisation**, même version/date : validation des jetons destinés au serveur, protection des secrets et PKCE côté client ; le passage tel quel du jeton reçu à une API en aval est interdit. Un jeton distinct sert à l’API aval. Ces exigences doivent être implémentées : le sigle MCP ne démontre pas leur respect. [Security Considerations](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations).

**H3 — Distinction pédagogique.** Se connecter signifie pouvoir échanger. S’authentifier établit une identité ; être autorisé détermine les données et opérations permises. Une validation humaine approuve une action précise et ses conséquences. Les rôles RH, droits sur chaque dossier, décisions de validation et responsabilités restent à définir et à faire appliquer par les systèmes concernés.

**P11 — Limite explicite de la spécification.** Elle expose des principes de consentement et de contrôle, mais dit ne pas pouvoir les imposer au niveau du protocole. La page Tools recommande une possibilité de refus humain, sans imposer une interface unique. **MCP, seul, n’est donc pas une couche de sécurité suffisante.** Sources : [Security and Trust & Safety](https://modelcontextprotocol.io/specification/2026-07-28), [Tools, User Interaction Model](https://modelcontextprotocol.io/specification/2026-07-28/server/tools), version 2026-07-28, vérifiées le 2026-10-12.

## Limites et contrôles à discuter

**S1 — Bonnes pratiques de sécurité**, documentation MCP rattachée à 2026-07-28, consultée le 2026-10-12 : examiner serveur et provenance, permissions minimales, détournement d’autorisation, destinations réseau et exécution locale. L’authentification ne neutralise pas un serveur malveillant. [Security Best Practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices).

**H4 — Synthèse Hector**, en réutilisant [[methods/grille-risque-usage-ia]] : contrôler les données envoyées, les sorties, les actions et les traces. MCP ne garantit ni exactitude de l’analyse, ni absence d’injection d’instructions, ni confidentialité de bout en bout, ni conformité, ni réversibilité d’une écriture. Les descriptions d’outils sont des déclarations, pas des preuves. Un écran d’approbation ou un prompt « ne modifie rien » ne remplace pas un refus effectif côté service. Tester avec données fictives l’accès interdit, l’écriture sans validation et la révocation.

## Trois usages fournisseurs documentés en 2026

**F1–F3 — Documentation fournisseur, pas propriétés normatives de MCP.** Vérification commune : **2026-10-12**. Aucun test de compte, licence ou déploiement client.

| Périmètre exact | Ce que la documentation permet d’affirmer | Date/version et provenance |
| --- | --- | --- |
| F1 — Connecteur MCP de l’API Messages Anthropic | Appels d’outils distants ; ce connecteur ne couvre pas toutes les primitives. Les helpers côté client ont un périmètre distinct. | Page non datée ; bêta `mcp-client-2025-11-20`, option de gel des outils `mcp-client-2026-09-15`. [[sources/anthropic-mcp-connector]] |
| F2 — Copilot Studio, standard harness | Outils et ressources ; pour l’usage d’une ressource, la page détaillée exige son exposition en sortie d’un outil. Sélection des outils et politiques Power Platform participent au contrôle. | Pages mises à jour les 2026-08-26 et 2026-08-19. [[sources/microsoft-copilot-studio-mcp]] |
| F3 — Serveurs distants Google Cloud | Support déclaré de 2026-07-28, avec contrôles IAM et protection Model Armor selon services/configuration. | Vue d’ensemble mise à jour le 2026-10-09. [[sources/google-cloud-mcp]] |

**H5 — Conclusion d’interopérabilité.** Un protocole partagé peut faciliter la réutilisation d’une intégration. Il faut encore vérifier version commune, capacités, transport, identité et politique d’accès. Les offres ci-dessus ne prouvent pas une compatibilité universelle ; le support de la dernière révision n’est pas établi ici pour Anthropic ou Microsoft.

## Exemple et fraîcheur

Le [[cases/rh-connexion-mcp-fictif|cas RH fictif]] distingue lecture, analyse et écriture soumise à validation ; la [[methods/grille-connexion-mcp|grille courte]] aide à décider si la connexion est justifiée.

Confiance forte dans les passages officiels identifiés, moyenne dans la synthèse pédagogique non testée auprès du public. Revue proposée **au plus tard le 2026-11-12**, et avant toute démonstration technique ou changement de produit. Cette échéance éditoriale n’est pas une durée de validité officielle. Une documentation sans date ne reçoit pas de date de publication inventée.

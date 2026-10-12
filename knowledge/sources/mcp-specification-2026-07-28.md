---
id: "SRC-MCP-SPEC-2026-07-28"
type: "source"
title: "MCP — spécification 2026-07-28"
organisation: "Model Context Protocol"
url: "https://modelcontextprotocol.io/specification/2026-07-28"
type_source: "spécification officielle"
statut: "consultee_recherche_externe"
tags: ["MCP","connectivité"]
aliases: []
published_at: null
page_date: "2026-07-28"
page_date_kind: "version du protocole ; date de révision de chaque page non indiquée"
accessed_at: "2026-10-12"
verified_at: "2026-10-12"
review_after: "2026-11-12"
confidence: "forte"
sources: []
lie_a: []
soutient: ["[[concepts/mcp]]"]
used_by: ["IA017-ACT-ON-DATA"]
---

# MCP — spécification 2026-07-28

Version publiée le 28 juillet 2026, confirmée par l’[annonce des mainteneurs](https://blog.modelcontextprotocol.io/posts/2026-07-28/). Vérification Web : **2026-10-12**. Les pages de travail `draft` ne servent pas de référence normative.

| Pages officielles consultées | Apport conservé dans le concept |
| --- | --- |
| [Specification](https://modelcontextprotocol.io/specification/2026-07-28) | P1 et P11 : portée, consentement et limite d’application des principes. |
| [Architecture](https://modelcontextprotocol.io/specification/2026-07-28/architecture) | P2 : hôte, client, serveur et responsabilités. |
| [Base](https://modelcontextprotocol.io/specification/2026-07-28/basic) | P3 : messages et état explicite. |
| [Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) | P4/P11 : découverte, appel et recommandation de contrôle humain. |
| [Resources](https://modelcontextprotocol.io/specification/2026-07-28/server/resources), [Prompts](https://modelcontextprotocol.io/specification/2026-07-28/server/prompts) | P5 : contexte et modèles de messages. |
| [Elicitation](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation) | P6 : compléments demandés via le client. |
| [Transports](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports) | P7 : stdio, Streamable HTTP et distinction de l’ancien transport. |
| [Changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog), [Deprecated Features](https://modelcontextprotocol.io/specification/2026-07-28/deprecated) | P8 : changements et dépréciations. |
| [Versioning, fichier officiel](https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/docs/specification/2026-07-28/basic/versioning.mdx) | Compatibilité : versions et extensions explicitement déclarées. |

Confiance forte dans la provenance. La page web Versioning a échoué ; son fichier dans le dépôt officiel a été lu. Prompts a fonctionné au second accès.

**Incohérence rédactionnelle observée** : l’introduction des extensions de la page Specification évoque encore une négociation à l’initialisation. Changelog, Base et Versioning décrivent explicitement le fonctionnement par requête de cette révision : ils fondent la synthèse. Ne pas reprendre cette phrase isolée comme règle actuelle.

La présence d’une capacité dans le protocole ne prouve pas son implémentation dans un produit. Les détails techniques non utiles au manager restent dans les références.

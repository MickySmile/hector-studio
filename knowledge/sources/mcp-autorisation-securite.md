---
id: "SRC-MCP-SECURITE"
type: "source"
title: "MCP — autorisation et sécurité : exigences et bonnes pratiques"
organisation: "Model Context Protocol"
url: "https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization"
type_source: "spécification et bonnes pratiques officielles à distinguer"
statut: "consultee_recherche_externe"
tags: ["MCP","connectivité"]
aliases: []
published_at: null
page_date: "2026-07-28"
page_date_kind: "version documentaire ; tutoriel sans date de mise à jour distincte"
accessed_at: "2026-10-12"
verified_at: "2026-10-12"
review_after: "2026-11-12"
confidence: "forte"
sources: []
lie_a: []
soutient: ["[[concepts/mcp]]"]
used_by: ["IA017-ACT-ON-DATA"]
---

# MCP — autorisation et sécurité : exigences et bonnes pratiques

Consultation et vérification : **2026-10-12**. Périmètre documentaire : **2026-07-28**.

| Document lu | Nature | Repères utilisés |
| --- | --- | --- |
| [Authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) | Profil normatif, applicable lorsqu’il est implémenté | P9 : périmètre HTTP, caractère optionnel, OAuth 2.1 draft, séparation avec stdio. |
| [Authorization Security Considerations](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations) | Exigences normatives de ce profil | P10 : jetons destinés au serveur, PKCE, protection des secrets, jeton distinct vers l’API aval. |
| [Security Best Practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) | Analyse de risques et mesures d’implémentation ; contient aussi des renvois normatifs | S1 : confused deputy, token passthrough, SSRF, détournement d’identifiants d’état, compromission locale et permissions excessives. |

La première URL essayée `basic/authorization/security` n’existait pas ; le lien de la page Authorization conduit au document Security Considerations retenu. L’ancienne URL de bonnes pratiques redirige vers le tutoriel ci-dessus.

Confiance forte dans la provenance et la distinction MUST/SHOULD/OPTIONAL. Les risques identifiés ne sont pas une mesure de fréquence d’incidents. La grille et les contrôles du cas fictif sont des propositions Hector, pas des exigences supplémentaires attribuées à MCP. L’[[sources/anssi-securite-ia-generative|apport ANSSI déjà capitalisé]] reste réutilisable sans nouvelle revue juridique dans ce cycle.

Revoir avant une intégration et au plus tard le 2026-11-12 ; aucune configuration de sécurité n’a été auditée.

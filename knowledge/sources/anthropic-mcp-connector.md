---
id: "SRC-ANTHROPIC-MCP"
type: "source"
title: "Anthropic — connecteur MCP de l’API Messages"
organisation: "Anthropic"
url: "https://platform.claude.com/docs/en/agents-and-tools/mcp-connector"
type_source: "documentation fournisseur"
statut: "consultee_recherche_externe"
tags: ["MCP","connectivité"]
aliases: []
published_at: null
page_date: null
page_date_kind: "page non datée ; identifiants de bêta distincts d’une version du protocole"
accessed_at: "2026-10-12"
verified_at: "2026-10-12"
review_after: "2026-11-12"
confidence: "forte"
sources: []
lie_a: []
soutient: ["[[concepts/mcp]]"]
used_by: ["IA017-ACT-ON-DATA"]
---

# Anthropic — connecteur MCP de l’API Messages

[Page consultée](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector), sections Key features, Limitations, Client-side MCP helpers, Pin an MCP server’s tool list. Vérifiée le **2026-10-12**.

**F1 — Périmètre produit** : le connecteur distant de l’API Messages prend en charge les appels d’outils, via HTTP public, avec Streamable HTTP ou ancien SSE ; stdio local n’est pas directement accepté. Des helpers distincts servent les clients gérés par le développeur, notamment pour ressources et prompts.

La page indique une bêta `mcp-client-2025-11-20` et une option `mcp-client-2026-09-15` pour figer la liste d’outils. Ce sont des identifiants fournisseur, pas une preuve de support de la version MCP 2026-07-28. Date de publication/mise à jour non affichée.

Confiance forte dans ce que documente l’éditeur, sans test d’exécution. Ne pas généraliser ces limites à tous les produits Claude. Relire la page avant usage et au plus tard le 2026-11-12.

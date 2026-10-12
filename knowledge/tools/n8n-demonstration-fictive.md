---
id: "OUT-N8N-DEMO-FICTIVE"
type: "tool"
title: "n8n — démonstration fictive validée par le formateur"
statut: "test_reel_valide_formateur"
tags: ["n8n", "workflow", "RH", "démonstration", "accès"]
aliases: ["flux RH fictif n8n"]
version: null
verified_at: "2026-10-12"
review_after: "2026-11-12"
confidence: "moyenne"
sources: ["[[sources/n8n-flux-fictif]]", "[[cases/rh-connexion-mcp-fictif]]"]
lie_a: []
used_by: ["IA017-ACT-ON-DATA"]
---

# n8n — démonstration fictive validée

## Validation réelle — 12 octobre 2026

Le formateur confirme avoir exécuté réellement la démonstration avec succès sur
**n8n Cloud**. Trace : retour explicite du formateur transmis dans cette conversation
le 12 octobre 2026 ; Codex enregistre ce retour, sans exécution indépendante.
Aucune donnée RH réelle, API externe ou agent IA utilisé.
Version exacte de n8n non communiquée ; aucune capture ni export fourni à Hector.
Ces limites de traçabilité ne remettent pas en cause la validation pédagogique
expressément donnée par le formateur ; recontrôler avant usage si l’environnement change.

## Scénario effectivement testé

Manual Trigger → Edit Fields (données fictives) → If → deux Edit Fields de sortie.
Condition déterministe : **elements_recus = elements_attendus**.

| Test | elements_recus | elements_attendus | Branche | Résultat | Verdict |
| --- | --- | --- | --- | --- | --- |
| A | 8 | 9 | FALSE | Dossier incomplet | PASS |
| B | 8 | 8 | TRUE | Dossier complet | PASS |

Ce test remplace le candidat initial portant sur des compteurs 8/9 : les valeurs
représentent ici des nombres d’éléments fictifs, pas des jours de congés.
« Dossier complet » signifie uniquement égalité des deux nombres de test ;
aucune validité métier des pièces ni approbation humaine n’est démontrée.
Le scénario montre déclencheur, données, comparaison, décision et branchement.
Aucune correction RH, connexion SIRH ou validation métier n’est implémentée.
La distinction workflow / agent s’appuie sur cette règle fixée à l’avance.

## Portée et provenance

Capacités N1–N3 : SRC-N8N-FLUX-FICTIF. Le cas RH/MCP reste une illustration
pour discuter responsabilités et frontière lecture/écriture, pas le jeu testé.
La preuve d’usage est le retour du formateur ci-dessus, distinct des sources Web.
MP01 est READY pour la complétude pédagogique ; durée 20 min, sans pratique.

---
id: "CON-AGENT-IA"
type: "concept"
title: "Agent IA — définition opérationnelle"
statut: "synthese_pedagogique_non_normative"
tags: ["agent", "IA", "workflow", "autonomie", "contrôle humain"]
aliases: ["définition agent IA", "workflow vs agent", "boucle agentique", "assistant conversationnel"]
verified_at: "2026-10-12"
review_after: null
confidence: "moyenne"
sources: ["[[sources/google-cloud-agentic-design-patterns]]", "[[sources/nist-ai-agent-standards-initiative]]", "[[sources/anthropic-trustworthy-agents]]", "[[sources/anthropic-building-effective-agents]]"]
lie_a: ["[[methods/grille-conception-agent]]"]
used_by: ["IA017-PROGRAM-ONLY", "IA017-ACT-ON-DATA"]
---

# Agent IA — définition opérationnelle

## Définition et statut

Un agent IA est un système logiciel qui poursuit un objectif en choisissant et en
exécutant des actions, puis en utilisant leurs résultats pour décider de la suite,
avec un degré d’autonomie défini et des possibilités de contrôle humain.

Cette formulation est une **synthèse opérationnelle pour la formation**, non une
définition normative universelle ni une citation d’un des organismes référencés.
Pour les agents fondés sur les modèles de langage, le modèle contribue à choisir
les étapes et les outils à utiliser. Le critère pédagogique distinctif proposé
est la capacité à **adapter la suite des actions pendant l’exécution**.

## Distinguer assistant, workflow et agent

| Système | Qui détermine la suite ? |
| --- | --- |
| Assistant conversationnel simple | L’utilisateur, au fil des demandes. |
| Workflow prédéfini avec IA | Le programme, selon des étapes et branchements prévus. |
| Agent IA | Le modèle choisit certaines actions selon l’objectif, le contexte et les résultats observés. |

Un système peut combiner workflow prédéfini et étapes agentiques. Cette distinction
sert à expliquer les rôles aux débutants ; elle n’impose pas de choisir un agent.

## Exemple pédagogique fictif

Résumer un document ne suffit pas à caractériser un agent. Pour préparer une
réponse à une réclamation, consulter une commande, constater une information
manquante, choisir une autre source, décider de poursuivre puis demander une
validation humaine illustre une boucle agentique.

Sur ce même besoin, un assistant simple répond au fil des demandes de l’utilisateur ;
un workflow suit les étapes et branchements prévus ; l’agent choisit certaines
actions à partir des résultats. Exemple explicatif, sans performance mesurée.

## Relations utiles

- **Workflow** : peut organiser des étapes fixes et des étapes agentiques.
- **Outil** : moyen d’action disponible, associé à des permissions.
- **Autonomie** : latitude de décision à borner par l’objectif et les limites.
- **Contrôle humain** : validation et reprise en main prévues dans la conception.
- **MCP** : thème connexe à documenter séparément ; aucun rôle technique détaillé
  ni aucune version n’est établi par cette fiche.

La [[methods/grille-conception-agent]] traduit ces repères en six rubriques.
Les thèmes ci-dessus n’ont pas encore de fiches dédiées ; aucun lien fictif n’est créé.

## Sources, limites et vérification

Google Cloud soutient les repères modèle/outils/choix des étapes ; NIST apporte
les axes d’action pour le compte d’utilisateurs et de gouvernance ; Anthropic
éclaire la boucle adaptative et la distinction workflow/agent. Voir les quatre
fiches sources liées dans les propriétés pour la provenance exacte.

Dernière vérification du matériau fourni : **12 octobre 2026**, indiquée par
l’utilisateur ; capitalisation sans nouvelle consultation Web. Confiance
**moyenne** : synthèse pédagogique étayée dans ce périmètre, sans portée normative.
La date d’une page ne prouve pas la révision de chaque formulation.
Réexaminer ces repères si le sens des termes ou le contexte pédagogique évolue.

La fiche ne documente pas les limites détaillées des LLM, les critères de choix
multi-agents, les capacités d’une plateforme, ni l’application à un cas RH borné.

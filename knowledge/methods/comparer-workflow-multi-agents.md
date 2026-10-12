---
id: "MET-CHOIX-ORCHESTRATION"
type: "method"
title: "Comparer un workflow simple et une orchestration multi-agents"
statut: "proposition_pedagogique_hector_studio"
tags: ["workflow", "multi-agents", "orchestration", "coûts", "critères"]
aliases: ["choix architecture simple multi-agents"]
verified_at: "2026-10-12"
review_after: "2027-04-10"
confidence: "moyenne"
sources: ["[[sources/anthropic-building-effective-agents]]", "[[sources/google-cloud-agentic-design-patterns]]"]
lie_a: ["[[concepts/agent-ia]]"]
used_by: ["IA017-ACT-ON-DATA"]
---

# Comparer un workflow simple et une orchestration multi-agents

## Fondements documentés

Anthropic recommande de justifier la complexité par un résultat et distingue
sous-tâches prévues et délégation dynamique. Google relie la spécialisation aux
responsabilités distinctes, avec des exigences supplémentaires de coordination,
d’accès et d’évaluation. Voir les compléments Cycle A des deux fiches sources,
consultées le 12 octobre 2026. Ce ne sont ni une norme ni des performances garanties.

## Méthode Hector — proposition réutilisable

Comparer deux dessins pour **le même résultat attendu**, en quatre questions :

| Question | Workflow simple | Variante multi-agents à justifier |
| --- | --- | --- |
| Qui choisit la suite ? | Étapes et branches connues, éventuellement avec une tâche IA bornée. | Identifier qui délègue, selon quelle information ; plusieurs agents n’impliquent pas forcément un pilotage dynamique. |
| Quel problème exige plusieurs rôles ? | Localiser une limite réellement constatée ; à défaut, elle reste hypothétique. | Nommer la responsabilité propre de chacun et son résultat intermédiaire. |
| Quel prix paie-t-on ? | Décrire appels, délai et reprise sur erreur du trajet de référence. | Ajouter les échanges, la synthèse des désaccords, les droits et la maintenance ; vérifier coût et délai par comparaison. |
| Qui tranche et comment conclure ? | Un responsable examine la sortie et les inconnues. | Même résultat et mêmes critères de comparaison ; règles d’arrêt, responsable des désaccords et preuve d’un bénéfice. |

Support vierge : besoin commun … ; trajet simple … ; difficulté observée … ;
rôles supplémentaires … ; coût/délai à mesurer … ; désaccord traité par … ;
preuve attendue … ; décision argumentée … . Une difficulté supposée est nommée
comme telle. Aucun score ni seuil universel ne choisit l’architecture.

## Exemple d’application et limites

Application pédagogique au [[cases/rh-connexion-mcp-fictif|cas RH-042 existant]] :
consulter le compteur et la procédure, signaler un écart, préparer un brouillon
puis le faire examiner est un trajet descriptible à l’avance. Le cas ne rapporte
aucun échec d’une solution simple. Une variante séparerait l’examen des événements
et celui de la procédure, puis rapprocherait leurs conclusions. C’est une
**hypothèse de conception**, pas un système observé ni une nouvelle donnée RH.
Un désaccord sur 8/9 jours appelle toujours la revue RH ; multiplier les agents
ne tranche pas la règle métier. Dans ce périmètre, aucun besoin de multi-agents
n’est démontré. Une comparaison sur résultats serait nécessaire pour le retenir.

Confiance moyenne : méthode et application fictive non testées en formation.
Revue proposée à 180 jours, ou lors d’un changement de besoin ; aucune capacité
d’outil ou autorisation client n’est couverte.

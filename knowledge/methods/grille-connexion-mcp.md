---
id: "MET-CONNEXION-MCP"
type: "method"
title: "Faut-il connecter cet agent via MCP ?"
statut: "proposition_pedagogique_hector_studio"
tags: ["MCP", "agent", "outils", "API", "permissions", "sécurité", "données"]
aliases: ["connecter un agent à des outils", "MCP vs API", "permissions MCP", "sécurité MCP"]
verified_at: "2026-10-12"
review_after: "2026-11-12"
confidence: "moyenne"
sources: ["[[concepts/mcp]]", "[[methods/grille-risque-usage-ia]]"]
lie_a: ["[[methods/grille-conception-agent]]", "[[cases/rh-connexion-mcp-fictif]]"]
used_by: ["IA017-ACT-ON-DATA"]
---

# Faut-il connecter cet agent via MCP ?

**H6 — Méthode proposée par Hector Studio**, examinée le 2026-10-12. Elle prolonge les rubriques Contexte, Actions et Contrôle de la grille existante. Ce n’est ni une norme MCP, ni une certification de sécurité.

## Mode d’emploi et support vierge

Décrire une seule opération utile, puis répondre aux six questions avec le responsable technique et métier. Noter « inconnu » lorsqu’une preuve manque.

| Question de manager | Réponse / preuve à obtenir |
| --- | --- |
| Quel résultat exige un accès externe ? | Donnée indispensable ou action précise ; expliquer pourquoi le contexte déjà disponible ne suffit pas. |
| Pourquoi MCP pour ce besoin ? | Réutilisation attendue entre applications ; comparer avec API directe ou intégration déjà approuvée. |
| Les deux côtés savent-ils échanger ? | Hôte/client, serveur, version, capacités et transport effectivement compatibles ; source datée ou essai. |
| Qui peut lire et qui peut agir ? | Identité utilisée, périmètre de dossiers et champs, lecture/écriture séparées, application des droits jusqu’au système métier. |
| Quelle décision exige un humain ? | Action exacte, personne habilitée, preuve de validation, impossibilité d’exécuter si refus ou absence de réponse. |
| Comment vérifier et arrêter ? | Provenance du serveur, trajet des données, test d’accès refusé, traces minimales protégées et révocation testée. |

Décision argumentée : **essai fictif borné**, **intégration existante préférable**, ou **connexion différée faute de preuves**. Aucun score ne prend la décision à la place du manager.

## Exemple rempli

Dans le [[cases/rh-connexion-mcp-fictif|cas fictif]], le résultat est une analyse d’un compteur d’absence, non sa modification. Une même consultation pourrait être réutilisée par deux applications : MCP devient une option à comparer. Autoriser seulement la lecture des champs utiles du dossier permis ; conserver la correction dans un circuit distinct avec RH habilité. Tant que compatibilité et refus d’écriture ne sont pas démontrés, rester au dessin et aux données fictives.

## Erreurs fréquentes

Confondre outil visible et accès permis ; traiter « lecture seule » comme garantie sur les sorties ; déduire une sécurité automatique d’OAuth ; oublier les nouvelles capacités ajoutées au serveur ; approuver une action sans voir dossier et valeurs concernés. Se reporter aux claims P9–P11 et S1 de [[concepts/mcp]] pour leur fondement exact et leur portée.

Revoir la grille avec le concept au plus tard le 2026-11-12. Elle ne confirme aucun accès ou règle interne d’Act-On Data.

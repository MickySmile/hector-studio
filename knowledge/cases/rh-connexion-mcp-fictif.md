---
id: "CAS-RH-MCP-FICTIF"
type: "case"
title: "CAS FICTIF — consulter une source RH via MCP sans écrire sans validation"
case_nature: "fictif"
statut: "proposition_pedagogique_hector_studio"
tags: ["MCP", "RH", "agent", "accès", "données", "permissions", "contrôle humain"]
aliases: ["serveur MCP", "agent accès données", "connexion outil autorisation validation"]
verified_at: "2026-10-12"
review_after: "2026-11-12"
confidence: "moyenne"
sources: ["[[concepts/mcp]]", "[[methods/grille-connexion-mcp]]"]
lie_a: ["[[cases/rh-reponse-salarie-fictif]]"]
illustre: ["[[concepts/mcp]]"]
used_by: ["IA017-ACT-ON-DATA"]
---

# CAS FICTIF — lecture RH, analyse et validation

**H7 — Exemple inventé par Hector Studio**, examiné le 2026-10-12. Il prolonge le cas de réponse RH existant. Aucun système, salarié, droit, contrôle ou résultat réel d’Act-On Data n’est décrit. Les noms d’opérations ci-dessous sont inventés, pas des méthodes standard MCP.

Un manager demande : « Consulte le compteur d’absence fictif du dossier RH-042 et la procédure, explique l’écart éventuel et prépare une proposition. Ne corrige pas le compteur. » Le jeu fictif indique 8 jours, tandis que les événements de test suggèrent 9 jours. Cette différence demande vérification ; elle ne prouve pas une erreur métier.

| Étape sur la carte | Ce qui se passe dans l’exemple | Ce qui doit être contrôlé |
| --- | --- | --- |
| Connexion | Le client de l’application dialogue avec un serveur MCP RH. | Serveur approuvé et compatibilité vérifiée ; connexion ne vaut pas autorisation. |
| Outil | `consulter_compteur` demande deux champs du dossier autorisé ; la procédure peut être une ressource ou le résultat d’un outil selon le produit. | Le service vérifie l’identité et les droits pour RH-042, et refuse RH-099 hors périmètre. |
| Analyse | L’application donne les éléments utiles au modèle ; l’agent prépare une explication sourcée et un brouillon. | Vérifier données, calcul, destinataires et absence de pièce médicale inutile. MCP ne réalise pas cette validation. |
| Proposition de correction | L’agent signale « 8 → 9, à vérifier » ; il ne dispose pas d’un droit d’écriture général. | Un RH habilité compare aux pièces et peut refuser. Une absence de réponse ne vaut pas accord. |
| Écriture éventuelle | Dans une variante à concevoir, un service séparé reçoit une validation liée au dossier, à l’ancienne valeur et à la nouvelle. | Il recontrôle droits et validation avant mutation ; une valeur changée depuis la revue impose une nouvelle décision. |

**Décisions de conception proposées**, pas fonctions garanties par MCP : séparer le circuit d’écriture, appliquer les droits côté service, lier la validation à l’action exacte et conserver une trace minimale. Une simple annotation d’outil ou instruction au modèle ne fournit pas ces contrôles.

## Question au manager et réponse attendue

« Le serveur est joignable et l’outil visible : peut-on consulter tous les dossiers ou corriger le compteur ? » **Non.** La connexion règle l’échange ; les droits bornent l’accès ; une validation humaine porte sur l’action ; le service doit faire respecter ces décisions.

Preuves à demander pour un futur essai fictif : lecture permise de RH-042, refus de RH-099, refus de toute écriture sans validation, refus après révocation. Aucun de ces essais MCP n’a été exécuté dans ce cycle documentaire. Le besoin n8n et la fourniture du vrai cas de formation restent distincts.

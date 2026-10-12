---
id: "OUT-N8N-DEMO-FICTIVE"
type: "tool"
title: "n8n — candidat de démonstration RH sur valeurs fictives"
statut: "candidat_documente_non_teste"
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

# n8n — candidat de démonstration fictive

## Capacité connue, disponibilité inconnue

Les repères N1–N3 de la source officielle permettent de **proposer** un trajet
visible : départ manuel → valeurs fictives → comparaison → sortie à examiner.
La lecture du 12 octobre 2026 vérifie cette proposition documentaire, pas un essai.
Version de session : inconnue. Environnement et accès autorisés : non confirmés.

## Candidat pédagogique dérivé du cas existant

Reprendre RH-042, compteur 8 et valeur suggérée 9, sans créer une procédure ni
des événements détaillés absents du cas. La valeur 9 est une donnée d’exemple,
**pas le résultat d’un calcul démontré**. La procédure RH n’est pas simulée.

1. Départ manuel par le formateur.
2. Champs fictifs : dossier RH-042 ; compteur 8 ; valeur suggérée 9.
3. Comparaison des deux valeurs.
4. Sortie textuelle à examiner : « Écart à vérifier — aucune correction ».

Le scénario ne requiert dans sa conception ni appel LLM, ni MCP, ni SIRH, ni
envoi de message, ni opération d’écriture métier. Cela ne prouve pas que
l’instance n8n est locale, hors réseau, disponible ou autorisée. Le responsable
de l’environnement doit le confirmer. La lecture du résultat par un RH est un
repère de conception, pas un circuit d’approbation implémenté.

## Preuves encore nécessaires avant démonstration

Identifier la version et l’environnement approuvés, leur responsable et les
droits de présentation. Après choix du scénario par le formateur, y préparer et
tester le flux. Conserver une trace datée montrant les entrées, le chemin suivi,
la sortie et l’absence d’action métier. Vérifier un second passage sans écart
sur des valeurs de test explicitement choisies lors de cette préparation.

État présent : **aucun test exécuté, aucune capture, aucun accès confirmé**.
La documentation seule ne couvre donc pas la question du plan de recherche.
Une représentation statique de repli reste à approuver ; elle ne doit jamais
être présentée comme une exécution n8n. Cette proposition ne sélectionne pas le
cas fil rouge de l’atelier. Aucun gabarit logiciel n’est livré à ce stade.

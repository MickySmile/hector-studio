---
id: "MET-GRILLE-RISQUE-IA"
type: "method"
title: "Grille de risque d’un usage IA — données, permissions et supervision"
statut: "proposition_pedagogique_hector_studio"
tags: ["risques", "IA", "RH", "permissions", "supervision", "contrôles"]
aliases: ["grille risque usage IA", "supervision agent", "agent IA permissions"]
verified_at: "2026-10-12"
review_after: null
confidence: "moyenne"
sources: ["[[sources/anssi-securite-ia-generative]]", "[[sources/cnil-usage-ia-generative]]", "[[sources/rgpd-reperes-donnees-rh]]"]
lie_a: ["[[concepts/risques-ia-donnees-rh]]", "[[concepts/shadow-ai]]", "[[cases/rh-reponse-salarie-fictif]]"]
used_by: ["IA017-ACT-ON-DATA"]
---

# Grille de risque d’un usage IA

**H4 — Proposition méthodologique Hector Studio, pas une norme officielle.** Cette organisation et les contrôles concrets proposés ci-dessous sont une synthèse pédagogique, non une checklist de conformité validée. Confiance moyenne ; examinée le 12 octobre 2026. Fondements et portée juridique : claims G1–G6, C1–C2, A1–A3, J1–J3 des concepts liés.

## Mode d’emploi

1. Écrire le résultat attendu et ce que le système ne doit pas décider.
2. Dessiner le trajet : saisie/pièce jointe → récupération documentaire → modèle → outil → journal → destinataire.
3. Qualifier chaque donnée, inférence possible, acteur et droit effectif.
4. Remplir une ligne par événement redouté ; ne pas imposer six catégories.
5. Nommer le responsable du contrôle et la preuve à obtenir. Une case inconnue reste inconnue.
6. Décider : essai fictif borné, révision du périmètre, ou suspension en attendant une confirmation. La grille ne donne pas automatiquement cette décision.

## Support vierge

| Risque | Donnée / ressource | Exposition possible | Conséquence | Contrôle préventif | Détection | Validation humaine éventuelle | Preuve / traçabilité |
| --- | --- | --- | --- | --- | --- | --- | --- |
| À décrire | À qualifier | Trajet et destinataire | Pour les personnes et l’organisation | Responsable + mesure | Signal + qui réagit | Qui peut refuser / arrêter ? | Document, test ou journal minimal |

Ajouter pour chaque ligne : claim d’appui, nature du contrôle, propriétaire, état confirmé/à instruire et date de réexamen.

## Bibliothèque de propositions à adapter

Toutes les lignes suivantes sont des **recommandations pédagogiques Hector**, fondées sur les claims indiqués, pas des prescriptions textuelles attribuées aux institutions.

| Événement redouté | Proposition organisationnelle / technique | Détection et supervision | Fondement |
| --- | --- | --- | --- |
| Tableau RH collé dans un outil non approuvé | Catalogue d’usages autorisés ; canal de demande d’outil ; jeu fictif pour les essais ; éviter comptes personnels | Canal de signalement sans masquer les incidents ; revue des usages avec responsables | C1, G3, Shadow AI |
| RAG récupérant un dossier hors périmètre | Limiter le corpus et appliquer les droits de l’utilisateur à la récupération ; tester avec deux profils d’accès | Test négatif d’accès croisé et référence du document effectivement récupéré | G5, A2 |
| Connecteur disposant de droits excessifs | Compte de service dédié, moindre privilège, secrets hors prompts ; retirer les outils inutiles | Revue des droits et alerte sur appel inattendu ; pouvoir révoquer le compte | A1–A2 |
| Instruction malveillante dans un document | Traiter le document comme donnée non fiable ; autorisation contrôlée hors du texte du modèle | Test d’injection sur données fictives ; blocage si l’action sort du périmètre | A1 |
| Réponse erronée propagée automatiquement | Sortie en brouillon ; contrôles de cohérence ; source de référence jointe à la revue | RH habilité compare la sortie aux pièces autorisées ; arrête si contradiction | C2, G4 |
| Journal ou sortie révélant trop d’informations | Champs utiles limités, droits séparés, durée motivée ; éviter duplication du dossier complet | Test de purge et de consultation des traces ; vérifier le destinataire final | G3, G5, A3 |
| Acteurs, conservation ou transferts inconnus | Fiche de traitement et questions contractuelles à instruire avant données réelles | Validation documentaire par responsables compétents | G3, G5–G6 |

## Conditions d’arrêt proposées

Arrêter l’essai si une donnée réelle non prévue apparaît, si une action non autorisée est demandée, si la source justificative manque ou si le contrôle humain est indisponible. Conserver une trace minimale de l’arrêt et demander une décision ; ne pas copier tout le dossier dans un ticket d’incident.

La preuve d’un contrôle est son résultat vérifiable : test d’accès refusé, habilitation approuvée, contrat examiné, brouillon corrigé, révocation testée. Une capture d’écran d’une case « sécurité activée » ne démontre pas le comportement de bout en bout.

## Exemple rempli

Voir [[cases/rh-reponse-salarie-fictif]] : **CAS FICTIF**, limité à l’illustration de la grille. Aucun TP complet ni déploiement n’est fourni. Le cas n’attribue aucune règle interne à une organisation réelle.

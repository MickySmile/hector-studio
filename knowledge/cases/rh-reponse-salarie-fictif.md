---
id: "CAS-RH-REPONSE-FICTIF"
type: "case"
title: "CAS FICTIF — préparer une réponse RH sans exposer un dossier salarié"
case_nature: "fictif"
statut: "proposition_pedagogique_hector_studio"
tags: ["RH", "données", "risques", "confidentialité", "shadow AI"]
aliases: ["cas RH Act-On Data", "réponse salarié"]
verified_at: "2026-10-12"
review_after: null
confidence: "moyenne"
sources: ["[[concepts/risques-ia-donnees-rh]]", "[[methods/grille-risque-usage-ia]]"]
lie_a: ["[[concepts/shadow-ai]]"]
illustre: ["[[concepts/risques-ia-donnees-rh]]"]
used_by: ["IA017-ACT-ON-DATA"]
---

# CAS FICTIF — préparer une réponse RH

**H5 — Synthèse pédagogique Hector Studio.** Exemple inventé pour le besoin Act-On Data, réutilisable ailleurs. Aucun salarié, incident, outil autorisé ou politique client réel. Confiance moyenne dans l’utilité pédagogique ; aucun résultat empirique. Examiné le 12 octobre 2026.

Un gestionnaire doit préparer une réponse à une question sur une procédure d’absence. Un dossier fictif contient nom, compteur de jours et justificatif médical. Une documentation interne décrit la procédure. Le livrable attendu est un brouillon validé par un RH habilité, sans décision sur les droits du salarié et sans écriture dans la paie.

Variante Shadow AI : pour aller vite, le gestionnaire copie l’ensemble du dossier dans un compte personnel non autorisé. Variante encadrée proposée : retirer le justificatif inutile, limiter le corpus documentaire, produire un brouillon et empêcher l’envoi autonome. Cela décrit une proposition de contrôle, pas un outil testé.

## Grille remplie — décisions proposées

| Risque | Donnée / ressource | Exposition possible | Conséquence | Contrôle préventif | Détection | Validation humaine éventuelle | Preuve / traçabilité |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Partage Shadow AI | Nom, compteur, justificatif | Prompt et pièce jointe vers compte personnel | Divulgation et perte de maîtrise | Essai uniquement fictif ; chemin autorisé ; document médical exclu | Revue de la pièce avant saisie ; signalement d’écart | Responsable d’usage autorise le périmètre | Décision d’usage et liste de champs acceptés ; C1/G2/G3 |
| Accès transversal | Base de dossiers RH | RAG récupérant un autre salarié | Lecture non habilitée | Corpus de procédures séparé des dossiers ; droits par utilisateur | Test négatif avec deux profils fictifs | RSSI/DSI examine l’habilitation | Résultat d’accès refusé ; G5/A2 |
| Action détournée | Mail entrant et connecteur | Instruction invitant à envoyer le dossier à un tiers | Fuite via outil ou modification RH | Lecture limitée, aucun outil de paie, aucun envoi sans autorisation | Rejet d’un appel hors liste ; arrêt de session | RH confirme contenu et destinataire exacts | Trace d’action refusée et validation ; A1/A2 |
| Erreur propagée | Procédure ou compteur | Sortie plausible intégrée dans plusieurs étapes | Réponse erronée au salarié | Brouillon avec références ; aucune décision automatisée | Comparaison avec document de référence | RH corrige ou refuse ; escalade si règle incertaine | Version corrigée et motif minimal ; C2/G4 |
| Journal trop détaillé | Prompt, sortie, identité | Consultation ou conservation excessive des logs | Nouvelle exposition du dossier | Identifiant d’exécution et événements nécessaires ; accès restreint | Contrôle d’accès aux logs et test de purge | Responsable fixe les durées selon finalités et règles applicables | Paramétrage motivé, résultat de purge ; G3/A3 |

## Limite volontaire

Le justificatif médical illustre une catégorie particulière ; le compteur de jours n’est pas automatiquement une donnée de santé. Une inférence à partir des absences doit être examinée. Si le projet devient sélection de candidats, évaluation de performance ou décision d’emploi, reprendre la qualification J1–J3 avant de réutiliser cette grille.

Le cas illustre des risques et contrôles ; il ne fournit ni données complètes, ni consignes/correction de TP, ni confirmation des contrats, droits et responsabilités du client.

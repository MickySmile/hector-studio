---
moment_id: "AOD-M02-MP01"
module_id: "AOD-M02"
knowledge_refs: ["OUT-N8N-DEMO-FICTIVE", "CAS-RH-MCP-FICTIF"]
source_refs: ["SRC-N8N-FLUX-FICTIF", "SRC-MCP-SPEC-2026-07-28", "SRC-MCP-SECURITE", "SRC-ANTHROPIC-MCP", "SRC-MICROSOFT-MCP", "SRC-GOOGLE-MCP", "SRC-ANSSI-SECURITE-IAG", "SRC-CNIL-USAGE-IAG", "SRC-RGPD-REPERES-RH"]
last_generated_from_knowledge: "2026-10-12"
---

# Où une demande RH circule-t-elle réellement ?

VOIR + COMPRENDRE — **20 minutes, 0 minute de pratique**. **READY** :
démonstration réellement exécutée sur n8n Cloud et validée par le formateur
le **12 octobre 2026**. La trace des deux tests PASS figure dans OUT-N8N-DEMO-FICTIVE.

## Intention et message essentiel

Décomposer un workflow visible avant de le cartographier. Suivre une demande
permet de distinguer valeurs reçues, traitement, sortie et décision humaine.
Un branchement déterministe ne donne pas l’autorisation d’une action métier.

## VOIR — démonstration validée

CAS FICTIF : compter les éléments reçus et attendus d’un dossier.
Manual Trigger → Edit Fields → If → deux branches déterministes.
Condition : **elements_recus = elements_attendus**.

- Test A : 8 reçus / 9 attendus → FALSE → « Dossier incomplet » — PASS.
- Test B : 8 reçus / 8 attendus → TRUE → « Dossier complet » — PASS.

Aucune API externe, donnée RH réelle ou agent IA. « Complet » signifie ici
égalité des nombres fictifs ; cela ne prouve ni qualité des pièces ni validation RH.
La question d’observation reste : « Où passe la demande, et qui pourrait autoriser une correction ? »

## COMPRENDRE — commentaire

Le formateur déclenche, montre les deux nombres, la comparaison et la branche.
Réponse : la règle prédéfinie oriente le workflow ; un agent IA n’est pas démontré.
Le RH habilité garde la décision métier. Relier ensuite cette limite au cas RH-042
illustratif et à sa séparation lecture/correction, sans confondre les éléments
reçus/attendus du test avec les compteurs de congés de l’atelier.

## Déroulé — durée inchangée

- 3 minutes : situation fictive, question d’observation et limites.
- 7 minutes : observation du trajet, des entrées et des deux sorties.
- 7 minutes : commentaire rôles/flux/validation et distinction workflow/agent.
- 3 minutes : reprise de la question et transition vers ressources et connexions.

## Validation et provenance

Validation réelle du formateur : 12 octobre 2026, n8n Cloud, tests A et B PASS.
Version exacte, captures et export non transmis ; aucun résultat supplémentaire
n’est supposé. La validation lève le blocage opérationnel de MP01.
OUT-N8N-DEMO-FICTIVE conserve la trace ; SRC-N8N-FLUX-FICTIF documente les briques.
CAS-RH-MCP-FICTIF étaye seulement le commentaire des responsabilités métier.

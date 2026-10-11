---
id: "CON-RISQUES-IA-RH"
type: "concept"
title: "Risques IA et données RH — expositions et contrôles"
statut: "synthese_pedagogique_a_valider"
tags: ["risques", "IA", "données", "RH", "confidentialité", "permissions", "supervision"]
aliases: ["risques IA données RH", "confidentialité données RH IA", "agent IA permissions", "supervision agent", "utilisation ChatGPT données salariés"]
verified_at: "2026-10-12"
review_after: null
confidence: "moyenne"
sources: ["[[sources/rgpd-reperes-donnees-rh]]", "[[sources/cnil-usage-ia-generative]]", "[[sources/anssi-securite-ia-generative]]", "[[sources/ue-ai-act-usages-rh]]"]
lie_a: ["[[concepts/shadow-ai]]", "[[concepts/agent-ia]]", "[[methods/grille-risque-usage-ia]]"]
used_by: ["IA017-ACT-ON-DATA"]
---

# Risques IA et données RH — expositions et contrôles

## Résultat pédagogique

Expliquer pourquoi une donnée ou une action devient exposée, proposer un contrôle et dire qui doit en confirmer la pertinence. L’analyse porte sur le trajet complet, jusqu’aux journaux et sorties. Elle ne conclut pas à la conformité du client.

## Qualifier les données avant de parler de sensibilité

**G1 — Obligation juridique, RGPD art. 4, confiance forte.** Les informations relatives à une personne identifiée ou identifiable sont des données personnelles. Une pseudonymisation ne garantit pas l’anonymat. [Texte et provenance](../sources/rgpd-reperes-donnees-rh.md).

**G2 — Obligation juridique, art. 9, confiance forte.** Certaines catégories bénéficient d’un régime spécifique, notamment santé, appartenance syndicale, opinions politiques et biométrie d’identification unique : interdiction de principe avec exceptions encadrées. Toutes les données RH ne relèvent pas de cet article.

**H1 — Synthèse Hector, confiance moyenne.** Distinguer, par exemple : salaire nominatif (personnel), diagnostic médical (catégorie particulière), planning permettant d’inférer un état de santé (qualification à examiner), budget de réorganisation sans personne identifiable (confidentiel, pas nécessairement personnel). Ces exemples de classement sont pédagogiques ; le contenu, le contexte et les possibilités d’inférence comptent. Ne pas inférer ni enregistrer une caractéristique sensible inutile au besoin.

## Qualifier l’usage

**H2 — Synthèse Hector, confiance moyenne**, prolongeant [[concepts/agent-ia]] et C2/A1–A3 :

| Usage | Frontière à examiner |
| --- | --- |
| Conversation LLM | Prompt, pièces jointes, historique et destinataires de la réponse |
| RAG / connexion documentaire | Documents récupérés, index, droits de lecture et extraits transmis |
| Workflow automatisé | Propagation répétée d’une sortie erronée entre étapes fixes |
| Agent avec outils | Actions choisies, permissions effectives et possibilité de les arrêter |
| Recrutement / gestion des travailleurs | Finalité décisionnelle et qualification réglementaire, indépendamment de l’étiquette « agent » |

## Registre des claims conservés

Chaque identifiant renvoie à une assertion bornée. Vérification : **12 octobre 2026**. Les fiches sources donnent organisation, URL, dates disponibles et limites d’accès. Aucune date de publication absente n’est reconstituée.

| ID | Assertion et portée | Nature | Source précise | Confiance |
| --- | --- | --- | --- | --- |
| G3 | Finalité déterminée, base légale appropriée, minimisation, exactitude, conservation limitée et responsabilité s’appliquent au traitement personnel. Le consentement n’est pas une solution universelle. | Obligation juridique | [[sources/rgpd-reperes-donnees-rh]], art. 5–6 | Forte |
| G4 | Prévoir information et exercice des droits. L’art. 22 vise les décisions exclusivement automatisées à effets juridiques ou similaires significatifs, avec exceptions et garanties ; il ne rend pas toute sortie IA soumise au même régime. | Obligation juridique | Même source, art. 12–22 | Forte |
| G5 | Qualifier les acteurs et la sous-traitance ; prévoir protection dès la conception et sécurité adaptée au risque. L’AIPD est requise si le traitement est susceptible d’engendrer un risque élevé, pas automatiquement pour toute IA. | Obligation juridique | Même source, art. 25, 28, 32, 35 | Forte |
| G6 | Si transfert vers un pays tiers, déterminer le mécanisme et les conditions applicables ; le choix d’un fournisseur ne suffit pas. | Obligation juridique | Même source, chapitre V | Forte |
| C2 | Résultats plausibles mais inexacts et biais possibles ; examiner mode de déploiement, contrat, réutilisation des données et contrôle critique des sorties. | Recommandation institutionnelle | [[sources/cnil-usage-ia-generative]], §§2, 5–9 | Forte |
| A1 | Des entrées non maîtrisées peuvent détourner les interactions avec le SI ; restreindre et contrôler les actions. | Recommandation institutionnelle de sécurité | [[sources/anssi-securite-ia-generative]], R26–R27 | Forte |
| A2 | Maîtriser les secrets, autorisations, flux et cloisonnements ; filtrer entrées/sorties. | Bonne pratique de sécurité recommandée par l’ANSSI | Même source, R5, R25–R28 | Forte |
| A3 | Tracer traitements et appels avec granularité utile, protéger les journaux et leur conservation. | Bonne pratique de sécurité recommandée par l’ANSSI | Même source, R29 | Forte |
| J1 | Recrutement/sélection, certaines décisions d’emploi, allocation fondée sur des caractéristiques individuelles, suivi/évaluation sont visés par l’annexe III. Examiner art. 6(3) et ses conditions ; le profilage visé exclut cette dérogation. Un simple assistant rédactionnel RH n’est pas automatiquement classé à haut risque. | Cadre juridique, application conditionnelle | [[sources/ue-ai-act-usages-rh]], annexe III §4 et art. 6 | Moyenne |
| J2 | Pour les déployeurs de systèmes à haut risque concernés : supervision compétente, suivi du fonctionnement, journaux et information des travailleurs figurent à l’art. 26. Applicabilité et transitions à vérifier avant d’en faire une obligation actuelle du cas. | Obligation juridique conditionnelle | Même source, art. 26 | Moyenne |
| J3 | La Commission annonce une application des règles de l’annexe III au 2 décembre 2027 après l’Omnibus. Ce calendrier ne suspend pas le RGPD. Le texte modificatif faisant foi n’a pas été accessible pendant ce cycle. | Information institutionnelle sur une règle juridique ; réserve de vérification | Même source, annonce du 27 juillet 2026 | Moyenne |

## Passer du risque à la décision

La [[methods/grille-risque-usage-ia]] propose des contrôles organisationnels, techniques et humains, reliés à ces claims. Le [[concepts/shadow-ai]] traverse ces risques : il rend les acteurs, contrats et permissions plus difficiles à maîtriser.

Une validation humaine doit pouvoir modifier ou arrêter le résultat ; un clic automatique d’approbation ne suffit pas à démontrer un contrôle effectif (**H3 — recommandation pédagogique Hector**, confiance moyenne, en application de C2/J2).

Avant un usage réel, faire instruire les finalités et acteurs par le responsable du traitement avec le DPO/juriste, les accès par le RSSI/DSI et les conséquences métier par les RH. Ces rôles sont proposés, aucun interlocuteur client n’est réputé désigné. Ne pas déduire une garantie de confidentialité de la seule marque « ChatGPT », « Copilot » ou d’un hébergement local.

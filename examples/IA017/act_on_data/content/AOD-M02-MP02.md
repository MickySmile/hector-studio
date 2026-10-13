---
moment_id: "AOD-M02-MP02"
module_id: "AOD-M02"
knowledge_refs: ["CON-AGENT-IA", "CON-MCP", "CAS-RH-MCP-FICTIF", "MET-CHOIX-ORCHESTRATION"]
source_refs: ["SRC-GOOGLE-AGENTIC-DESIGN", "SRC-NIST-AGENT-STANDARDS", "SRC-ANTHROPIC-TRUSTWORTHY", "SRC-ANTHROPIC-EFFECTIVE", "SRC-MCP-SPEC-2026-07-28", "SRC-MCP-SECURITE", "SRC-ANTHROPIC-MCP", "SRC-MICROSOFT-MCP", "SRC-GOOGLE-MCP", "SRC-ANSSI-SECURITE-IAG", "SRC-CNIL-USAGE-IAG", "SRC-RGPD-REPERES-RH"]
last_generated_from_knowledge: "2026-10-12"
---

# Situer ressources, connexions et MCP

COMPRENDRE — 15 minutes d’explication illustrée, 0 minute de pratique planifiée. Proposition pédagogique issue de la Knowledge validée ; aucun logiciel à installer.

## Intention pédagogique

Le manager doit pouvoir expliquer pourquoi une connexion est utile, situer client et serveur MCP sur une carte, distinguer échange possible, accès permis et action validée, puis demander une justification avant de multiplier les agents.

Message essentiel : une connexion et une orchestration répondent à deux questions différentes — accéder à une ressource et répartir le travail. Chacune doit servir le besoin décrit.

## COMPRENDRE — partir du besoin d’accès

Un agent peut choisir certaines actions selon l’objectif et les résultats qu’il observe. S’il doit expliquer un compteur RH absent de la conversation, il lui faut une information externe. Un outil de consultation permet de demander cette information. Si l’extrait utile est déjà fourni et suffit au besoin, une connexion supplémentaire n’est pas nécessaire. MCP peut aussi être utilisé par un assistant ou un workflow : sa présence ne prouve pas qu’un système est agentique.

Trois termes à distinguer, avec le même exemple fictif :

- API : le logiciel RH offre une opération de consultation selon ses propres règles. C’est une interface entre logiciels.
- Connecteur ou intégration : l’adaptation concrète qui relie les systèmes, traduit les demandes et traite leurs réponses.
- MCP : un contrat commun entre client et serveur pour décrire et échanger des capacités. Un serveur MCP peut s’appuyer sur l’API RH existante. Il ne remplace pas ses règles métier.

Le bénéfice possible : réutiliser une même interface depuis plusieurs applications compatibles. Il faut encore vérifier leur version et les capacités réellement prises en charge. Une intégration déjà approuvée peut suffire.

## Représentation — lire le trajet

Agent dans l’application → client MCP ↔ serveur MCP → outil de consultation / donnée RH

Le client MCP est la partie de l’application qui dialogue avec le serveur. Le serveur expose les capacités disponibles et traite les demandes ; il peut appeler le logiciel métier. La réponse revient à l’application, qui fournit au modèle les éléments utiles à l’analyse.

Autour de ce trajet : identité et permissions sur les accès ; gouvernance sur les usages et responsabilités ; contrôle humain sur les décisions à examiner. Ces contrôles doivent être appliqués par les systèmes et les personnes concernés.

## Ce que MCP standardise, ce qui reste à décider

Repères issus de CON-MCP, spécification 2026-07-28 vérifiée dans Knowledge le 12 octobre 2026 : format des échanges, description et appel d’outils, accès à des ressources de contexte, modèles de prompts. Toutes les applications n’exposent pas toutes ces capacités.

Un outil peut seulement lire ; le mot « outil » ne signifie pas nécessairement modifier. Une ressource apporte du contexte. MCP organise leurs échanges, mais ne garantit ni exactitude de l’analyse, ni droits sur tous les dossiers, ni validation humaine effective, ni conformité. Son cadre d’autorisation demande une mise en œuvre ; il ne définit pas le système de permissions de l’entreprise.

Phrase à retenir : être connecté ≠ être autorisé. Être autorisé à lire ≠ être autorisé à écrire. Une validation humaine porte sur une action précise, pas sur une connexion en général.

## Exemple — CAS FICTIF RH-042

Reprise de CAS-RH-MCP-FICTIF : un compteur indique 8 jours ; des événements fictifs suggèrent 9 jours. L’agent consulte le dossier permis et la procédure, puis prépare « 8 → 9, à vérifier ». L’écart ne prouve pas une erreur métier.

- Lecture : le service autorise les champs utiles de RH-042 et refuse RH-099, hors périmètre. Il s’agit du comportement à exiger dans le cas, pas d’un test réalisé.
- Analyse : l’agent prépare une explication avec ses éléments de référence ; il ne corrige pas le compteur.
- Modification : dans une variante à concevoir, un circuit distinct exigerait qu’un RH habilité vérifie le dossier, l’ancienne valeur et la nouvelle. Refus ou absence de réponse empêchent l’écriture.

Question expliquée par le formateur : « Le serveur répond et l’outil apparaît : peut-on corriger ? » Réponse : non, il faut les droits d’écriture appropriés et la validation prévue, effectivement contrôlés côté service. Une consigne au modèle ne suffit pas.

## Outil de lecture et déroulé formateur

Utiliser le trajet ci-dessus comme repère sur la carte : repérer la connexion, puis les permissions, puis le point de validation. La grille MET-CONNEXION-MCP, accessible par le cas, sera présentée dans le moment OUTILLER suivant.

- 2 minutes : besoin d’accès et distinction API / connecteur / MCP.
- 3 minutes : trajet client / serveur et capacités standardisées.
- 5 minutes : cas RH-042, lecture, analyse et correction conditionnelle.
- 4 minutes : comparaison ci-dessous, sur le même résultat attendu.
- 1 minute : trois frontières et transition vers le canvas.

Répartition éditoriale Cycle A dans les **15 minutes existantes** : les explications
MCP détaillées restent disponibles comme notes et ressource. À l’oral, suivre les
repères ci-dessus ; ne pas lire l’intégralité du document. Aucun contenu n’est
supprimé et aucune activité n’est ajoutée. Ce minutage proposé n’est pas un essai
d’animation mesuré ; sa validation P3 reste distincte de la complétude.

## COMPRENDRE — faut-il plusieurs agents pour RH-042 ?

Application de MET-CHOIX-ORCHESTRATION ; **comparaison pédagogique fictive**.
Le résultat commun reste une explication de l’écart et un brouillon pour revue RH.
Le CAS FICTIF RH-042 est le fil rouge validé et le dossier retenu pour le TP MP04.

| Point de lecture | Trajet simple | Variante multi-agents, hypothèse à justifier |
| --- | --- | --- |
| Travail | Consulter les éléments permis, rapprocher les valeurs, préparer le brouillon, le faire examiner. | Séparer l’examen des événements et celui de la procédure, puis rapprocher les conclusions. |
| Justification | Le chemin est descriptible à l’avance ; aucune difficulté mesurée n’est fournie par le cas. | Expliquer quelle difficulté concrète chaque rôle supplémentaire résout. Deux noms d’agents ne sont pas une justification. |
| Coût de conception | Un trajet à expliquer et à vérifier. | Préciser les échanges, le traitement d’un désaccord et les droits de chaque rôle ; mesurer ensuite coût et délai comparatifs. |
| Responsabilité | Le RH habilité peut refuser le brouillon. | Il conserve cette décision : un accord entre agents ne valide pas un compteur. |

Question présentée puis expliquée : « L’un dit 8, l’autre 9 : avons-nous résolu
le problème ? » Réponse attendue : non, les pièces et la règle doivent être
examinées ; le nombre d’agents ne prouve pas la valeur correcte.

Conclusion bornée : **le cas ne démontre pas le besoin de multi-agents**. Les
critères de comparaison sont disponibles ; aucun gain chiffré, produit choisi
ou architecture client n’est affirmé. Workflow et multi-agents ne sont pas
exclusifs : un workflow peut orchestrer plusieurs agents selon des étapes fixes.
Le formateur montre une comparaison de choix, sans ajouter un cours de patterns.

## Knowledge utilisée et provenance

- CON-AGENT-IA → ses quatre fiches Source : rappel opérationnel de l’agent et du choix des actions.
- CON-MCP, P1–P5/P9–P11 → SRC-MCP-SPEC-2026-07-28 et SRC-MCP-SECURITE : rôles, capacités et limites du protocole. H1–H5 portent la synthèse pédagogique et le vocabulaire.
- CAS-RH-MCP-FICTIF, H7 → CON-MCP et MET-CONNEXION-MCP → leurs sources : illustration des accès et du contrôle. Les contrôles du cas sont des choix de conception proposés, pas des fonctions garanties par MCP.
- MET-CHOIX-ORCHESTRATION → compléments Cycle A de SRC-ANTHROPIC-EFFECTIVE et SRC-GOOGLE-AGENTIC-DESIGN : critères et compromis ; application RH explicitement pédagogique. La recherche dédiée est consignée dans la section Cycle A du document d’audit.

Les sources fournisseurs restent accessibles dans la provenance du concept ; aucune capacité de produit n’est enseignée ici. Le cas ne décrit pas l’architecture réelle d’Act-On Data. La comparaison multi-agents est maintenant documentée ; aucune décision d’architecture réelle n’est nécessaire pour expliquer ses critères. Les deux sources d’architecture ont été consultées le 12 octobre 2026. La rédaction ne renouvelle pas les autres sources ; réexamen du patrimoine MCP avant démonstration technique et au plus tard le 12 novembre 2026.

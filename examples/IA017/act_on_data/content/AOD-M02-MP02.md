---
moment_id: "AOD-M02-MP02"
module_id: "AOD-M02"
knowledge_refs: ["CON-AGENT-IA", "CON-MCP", "CAS-RH-MCP-FICTIF"]
source_refs: ["SRC-GOOGLE-AGENTIC-DESIGN", "SRC-NIST-AGENT-STANDARDS", "SRC-ANTHROPIC-TRUSTWORTHY", "SRC-ANTHROPIC-EFFECTIVE", "SRC-MCP-SPEC-2026-07-28", "SRC-MCP-SECURITE", "SRC-ANTHROPIC-MCP", "SRC-MICROSOFT-MCP", "SRC-GOOGLE-MCP", "SRC-ANSSI-SECURITE-IAG", "SRC-CNIL-USAGE-IAG", "SRC-RGPD-REPERES-RH"]
last_generated_from_knowledge: "2026-10-12"
---

# Situer ressources, connexions et MCP

COMPRENDRE — 15 minutes d’explication illustrée, 0 minute de pratique planifiée. Proposition pédagogique issue de la Knowledge validée ; aucun logiciel à installer.

## Intention pédagogique

Le manager doit pouvoir expliquer pourquoi une connexion est utile, situer client et serveur MCP sur une carte et distinguer échange possible, accès permis et action validée.

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

- 3 minutes : besoin d’accès et distinction API / connecteur / MCP.
- 4 minutes : trajet client / serveur et capacités standardisées.
- 6 minutes : cas RH-042, lecture, analyse et correction conditionnelle.
- 2 minutes : reformulation par le formateur des trois frontières et transition vers la grille.

## Knowledge utilisée et provenance

- CON-AGENT-IA → ses quatre fiches Source : rappel opérationnel de l’agent et du choix des actions.
- CON-MCP, P1–P5/P9–P11 → SRC-MCP-SPEC-2026-07-28 et SRC-MCP-SECURITE : rôles, capacités et limites du protocole. H1–H5 portent la synthèse pédagogique et le vocabulaire.
- CAS-RH-MCP-FICTIF, H7 → CON-MCP et MET-CONNEXION-MCP → leurs sources : illustration des accès et du contrôle. Les contrôles du cas sont des choix de conception proposés, pas des fonctions garanties par MCP.

Les sources fournisseurs restent accessibles dans la provenance du concept ; aucune capacité de produit n’est enseignée ici. Le cas ne décrit pas l’architecture réelle d’Act-On Data. La comparaison multi-agents annoncée dans le contenu prévu reste à instruire séparément et n’est pas développée dans cet enrichissement MCP. La date de rédaction ne renouvelle pas la vérification des sources ; réexamen du patrimoine avant démonstration technique et au plus tard le 12 novembre 2026.

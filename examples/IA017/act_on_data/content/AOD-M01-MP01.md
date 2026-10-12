---
moment_id: "AOD-M01-MP01"
module_id: "AOD-M01"
knowledge_refs: ["CON-AGENT-IA","CAS-RH-REPONSE-FICTIF","CON-RISQUES-IA-RH"]
source_refs: ["SRC-GOOGLE-AGENTIC-DESIGN","SRC-NIST-AGENT-STANDARDS","SRC-ANTHROPIC-TRUSTWORTHY","SRC-ANTHROPIC-EFFECTIVE","SRC-RGPD-REPERES-RH","SRC-CNIL-USAGE-IAG","SRC-ANSSI-SECURITE-IAG","SRC-UE-AIACT-RH"]
last_generated_from_knowledge: "2026-10-12"
---

# Un chat RH doit-il devenir un agent ?

Proposition pédagogique pour VOIR + COMPRENDRE : 20 minutes d’apport, sans pratique ajoutée au déroulé. Les variantes ci-dessous adaptent le cas fictif capitalisé ; elles ne décrivent pas une plateforme ni un dispositif réel du client.

## Intention pédagogique

Comprendre ce qui change entre demander une réponse, suivre des étapes prévues et confier au système le choix de certaines actions. Le manager doit pouvoir situer qui détermine la suite et quelle autonomie il souhaite réellement déléguer.

## Message essentiel

- Le même résultat RH peut être préparé par un assistant, un workflow ou un agent : le livrable seul ne permet pas de les distinguer.
- Le repère décisif est qui choisit la suite pendant l’exécution : l’utilisateur, le programme ou le modèle dans un périmètre défini.
- Une permission d’action et une validation humaine sont des choix de conception à expliciter ; le mot « agent » ne les garantit pas.

Appuis : CON-AGENT-IA, sections « Distinguer assistant, workflow et agent » et « Relations utiles » ; CON-RISQUES-IA-RH, H2/A1–A2/H3.

## VOIR — un résultat, trois façons de le préparer

CAS FICTIF adapté de CAS-RH-REPONSE-FICTIF (H5). Un gestionnaire prépare un brouillon de réponse sur une procédure d’absence. Le dossier fictif comporte nom, compteur de jours et justificatif médical ; le justificatif inutile est écarté. La cible reste un brouillon relu par un RH habilité, sans décision sur les droits du salarié ni écriture dans la paie.

Le formateur présente trois variantes du même besoin :

- Assistant conversationnel : le gestionnaire choisit l’extrait de procédure autorisé, le fournit au chat et demande un brouillon. S’il manque une information, il choisit lui-même quoi ajouter et relance la demande.
- Workflow prédéfini avec IA : les étapes prévues récupèrent une procédure autorisée, préparent le brouillon et le transmettent à la revue RH. Un manque suit une branche définie à l’avance, par exemple une demande de complément.
- Agent IA : dans un corpus autorisé, le modèle choisit une consultation, examine le résultat, puis choisit une autre source autorisée si l’information manque. Il poursuit selon ce qu’il observe, dans les limites fixées, et remet le brouillon à la revue RH.

Question cognitive à faire entendre : « Nous voulons le même brouillon. Dans quelle variante avons-nous délégué le choix de la prochaine action ? » Ce contraste est présenté et expliqué ; la décision argumentée des participants vient dans MP02.

## COMPRENDRE — reconnaître la latitude de décision

La définition opérationnelle de CON-AGENT-IA décrit un système qui poursuit un objectif, choisit et exécute des actions, puis utilise leurs résultats pour décider de la suite. C’est une synthèse pédagogique, sans définition normative universelle.

Le chat laisse ici la conduite à l’utilisateur. Le workflow organise des étapes et branchements prévus : un branchement conditionnel ne suffit pas à en faire un agent. La variante agentique confie au modèle certains choix pendant l’exécution. Un dispositif peut mêler workflow et étapes agentiques ; sa qualification dépend de son fonctionnement, pas de son nom commercial.

Passer de la réponse à l’action demande de préciser ce que le système peut lire et faire. Dans notre exemple, le choix d’une autre procédure autorisée ne donne aucun droit d’envoyer la réponse ou de modifier la paie. CON-RISQUES-IA-RH (H2/A1–A2) distingue ces frontières ; H3 rappelle qu’une revue utile permet de corriger, refuser ou arrêter. Ces contrôles sont des propositions pédagogiques, sans conformité présumée.

Piège à éviter : attribuer davantage d’autonomie parce que cela paraît plus moderne. Pour un brouillon préparé à partir d’un extrait déjà choisi, le besoin décrit ne démontre pas l’utilité d’une boucle agentique. Pour une consultation adaptative, cette boucle devient une option à argumenter ; aucun gain ni niveau de fiabilité n’est établi par le cas.

## Knowledge utilisée et provenance

- CON-AGENT-IA → ses quatre fiches Source Google Cloud, NIST et Anthropic : définition opérationnelle, choix des étapes, autonomie et contrôle humain.
- CAS-RH-REPONSE-FICTIF, H5 → CON-RISQUES-IA-RH et MET-GRILLE-RISQUE-IA → leurs fiches Source : situation et frontières du brouillon RH. Les trois variantes sont une adaptation pédagogique de ce cas, sans observation réelle.
- CON-RISQUES-IA-RH, H2/A1–A2/H3 → SRC-ANSSI-SECURITE-IAG pour les permissions ; SRC-CNIL-USAGE-IAG pour l’examen critique des sorties. H2/H3 sont des synthèses pédagogiques ; les autres sources de la fiche restent résolues, sans ajout d’enseignement réglementaire.

Suffisance : le patrimoine permet ce contraste conceptuel et son application fictive. Il ne confirme pas les capacités d’un outil actuel, les droits client ou une conformité RH. La revue de finalisation couvre la question conceptuelle à partir de Knowledge ; aucune nouvelle recherche sur les agents n'est nécessaire. La date de rédaction depuis Knowledge ne constitue pas une nouvelle consultation des sources.

## Déroulé formateur — 20 minutes, 0 minute de pratique

- 3 min : rappel LLM : produire une formulation plausible ne garantit ni vérité, ni accès à une procédure à jour, ni autorisation d'action. Dans les trois variantes, la sortie reste un brouillon ; appui CON-AGENT-IA et CON-RISQUES-IA-RH, C2.
- 7 min : présenter les trois variantes dans le même univers RH fictif. Montrer qui fournit les pièces et qui choisit l'étape suivante.
- 5 min : expliciter les frontières lecture, brouillon, revue et action. Le justificatif médical n'est pas utile à la tâche proposée et n'entre pas dans le support participant.
- 3 min : commenter deux erreurs : « tout workflow avec IA est un agent » et « agent signifie envoi automatique ». La première confond présence d'IA et choix de la suite ; la seconde confond architecture et permission.
- 2 min : donner la demande et le support de MP02. L'univers se prolongera en M02 par le dossier RH-042 ; aucune organisation réelle n'est décrite.

## Consolidation et matériel

Projeter les trois variantes et la demande suffit. Le formateur apporte l'explication ; aucun accès LLM n'est requis. Le repère à retenir est : « Qui choisit la suite, avec quels droits, et qui peut arrêter ? » La production argumentée est réservée aux 20 minutes de MP02.

---
moment_id: "AOD-M03-MP02"
module_id: "AOD-M03"
knowledge_refs: ["CON-SHADOW-AI", "CON-RISQUES-IA-RH", "MET-GRILLE-RISQUE-IA", "CAS-RH-REPONSE-FICTIF", "CON-AGENT-IA"]
source_refs: ["SRC-CNIL-USAGE-IAG", "SRC-ANSSI-SECURITE-IAG", "SRC-RGPD-REPERES-RH", "SRC-UE-AIACT-RH", "SRC-GOOGLE-AGENTIC-DESIGN", "SRC-NIST-AGENT-STANDARDS", "SRC-ANTHROPIC-TRUSTWORTHY", "SRC-ANTHROPIC-EFFECTIVE"]
last_generated_from_knowledge: "2026-10-12"
---

# Relier chaque risque à un contrôle à instruire

Proposition pédagogique issue du patrimoine existant, à tester avec le formateur. La date ci-dessus constate la rédaction depuis Knowledge, sans nouvelle vérification externe. Le pilote approfondit la question Shadow AI couverte ; les exigences applicables au cas réel et les règles internes restent à instruire.

## Intention pédagogique

À partir d’un usage RH, le manager doit pouvoir expliquer quelle donnée ou action est exposée, relier un risque à un contrôle concret et nommer la confirmation nécessaire avant de poursuivre. Il distingue une preuve de contrôle d’une simple promesse de sécurité.

## Messages essentiels

- Qualifier ce qui circule : personnel, catégorie particulière, confidentiel ou inférence à examiner ne sont pas des synonymes. Appui : CON-RISQUES-IA-RH, G1–G2/H1.
- Le Shadow AI est une rupture du cadre d’usage autorisé, y compris avec un outil déjà autorisé utilisé hors périmètre. Appui : CON-SHADOW-AI, S1/C1.
- Lire davantage, propager une sortie et agir avec des permissions créent des expositions différentes. Appui : CON-RISQUES-IA-RH, H2/A1–A3 ; CON-AGENT-IA.
- Un contrôle utile précise une mesure, un responsable et une preuve ; la personne qui supervise doit pouvoir refuser ou arrêter. Appui : MET-GRILLE-RISQUE-IA, H4 ; CON-RISQUES-IA-RH, H3.

## COMPRENDRE

Partir de trois questions : qu’est-ce qui entre, qui peut y accéder, que peut faire le système ? Le risque ne se limite pas au prompt : pièces jointes, documents récupérés, sorties et journaux peuvent aussi exposer des informations. Appui : CON-RISQUES-IA-RH, H2/A2–A3.

- Donnée personnelle RH : nom, salaire nominatif ou compteur rattaché à une personne identifiable. Retirer le nom ne garantit pas l’anonymat. Repère juridique capitalisé : G1, article 4 du RGPD.
- Catégorie particulière du RGPD : un diagnostic médical relève de la santé ; toutes les données RH ne relèvent pas de l’article 9. Le régime comporte une interdiction de principe et des exceptions encadrées. Repère juridique capitalisé : G2.
- Information interne/confidentielle : un budget de réorganisation sans personne identifiable peut être confidentiel sans être personnel. Synthèse pédagogique : H1.
- Inférence potentiellement sensible : un planning d’absences peut permettre de supposer un état de santé. Le compteur n’est pas automatiquement une donnée de santé ; la qualification dépend du contexte. Synthèse pédagogique : H1 et limite du CAS-RH-REPONSE-FICTIF.
- Shadow AI : copier le dossier dans un compte personnel non autorisé fait perdre la maîtrise du cadre d’usage. Ce terme est opérationnel, sans catégorie juridique autonome. Synthèse pédagogique : CON-SHADOW-AI, S1.
- Agent disposant de permissions : le système peut choisir des actions puis utiliser leurs résultats pour poursuivre. Le périmètre des droits effectifs compte autant que la consigne. Définition opérationnelle : CON-AGENT-IA ; contrôles recommandés : CON-RISQUES-IA-RH, A1–A2.

Relier ensuite trois familles de contrôles : organisationnel (périmètre d’usage confirmé), technique (corpus et permissions limités), humain (RH habilité qui compare le brouillon aux documents et peut le refuser). Ce sont ici des propositions pédagogiques adaptées de MET-GRILLE-RISQUE-IA, pas trois obligations juridiques universelles. Les principes juridiques cités dans Knowledge gardent leur propre portée ; remplir une grille ne démontre aucune conformité.

## Exemple — CAS FICTIF RH

Adaptation de CAS-RH-REPONSE-FICTIF, H5 : un gestionnaire prépare une réponse sur une procédure d’absence. Le dossier fictif contient un nom, un compteur de jours et un justificatif médical ; une documentation interne décrit la procédure. Le résultat attendu est un brouillon relu par un RH habilité, sans décision sur les droits du salarié ni écriture dans la paie.

Pour gagner du temps, il envisage de copier tout le dossier dans un compte personnel non autorisé. La variante encadrée proposée retire le justificatif inutile, limite le corpus aux procédures et empêche l’envoi autonome. Cela illustre une réduction d’exposition à tester, pas un outil testé ni une politique réelle d’Act-On Data.

## Mise en perspective — du chat à l’action

À périmètre de contrôle inchangé, chaque capacité ajoutée peut élargir l’exposition ; cette progression n’est ni un score de risque ni une fatalité. Synthèse pédagogique à partir de CON-RISQUES-IA-RH, H2/C2/A1–A3, et CON-AGENT-IA.

- Chat : le dossier copié expose déjà les données via le prompt, les pièces jointes et l’historique. Vérifier ce qui est transmis.
- Accès documentaire : la récupération peut lire un autre dossier si les droits ou le corpus sont trop larges. Tester le refus d’accès avec deux profils fictifs.
- Workflow : une réponse erronée peut se propager à plusieurs étapes prédéfinies. Prévoir une sortie en brouillon et une comparaison avec la procédure de référence.
- Agent capable d’agir : les outils peuvent envoyer un message ou modifier une ressource selon les permissions. Limiter les droits, vérifier le destinataire et prévoir arrêt/révocation ; une instruction dans un document ne doit pas autoriser une action.

## OUTILLER — grille de risque existante

Quand l’utiliser : avant un essai ou lorsque changent données, corpus, destinataires ou permissions. Réutiliser MET-GRILLE-RISQUE-IA (H4), proposition méthodologique Hector Studio ; aucune nouvelle grille ni checklist de conformité.

Comment l’utiliser : borner le résultat attendu et les décisions interdites ; suivre le trajet saisie → documents → modèle → outil → journal → destinataire ; qualifier données et droits ; remplir une ligne par événement redouté ; nommer propriétaire et preuve ; choisir un essai fictif borné, une révision ou une suspension. Une inconnue reste « à instruire ».

Mini-exemple rempli, repris de la ligne « Partage Shadow AI » du cas existant :

- Risque : partage Shadow AI.
- Donnée / ressource : nom, compteur de jours, justificatif médical fictifs.
- Exposition possible : prompt et pièce jointe vers le compte personnel.
- Conséquence : divulgation et perte de maîtrise.
- Contrôle préventif : essai fictif uniquement ; chemin autorisé à confirmer ; justificatif exclu.
- Détection : revue de la pièce avant saisie et signalement d’un écart.
- Validation humaine éventuelle : responsable d’usage confirme le périmètre et peut suspendre l’essai.
- Preuve / traçabilité : décision d’usage et liste de champs acceptés ; appuis C1/G2/G3.

Nature : proposition organisationnelle avec contrôle humain. Propriétaire proposé : responsable d’usage, à désigner par le client. État : à instruire. Réexamen : avant tout essai sur données réelles. Ces précisions réutilisent les compléments demandés par la méthode.

## AGIR — esquisse à arbitrer

Situation : même CAS FICTIF RH ; on propose maintenant de connecter le corpus documentaire et de permettre l’envoi du brouillon.

Mission : en binôme de managers, choisir une exposition supplémentaire et compléter une ligne de la grille existante ; décider si l’essai fictif peut continuer ou quelle confirmation manque.

Production attendue : une ligne argumentée et une phrase de décision mentionnant le responsable à solliciter.

Durée proposée : 5 minutes (3 minutes de préparation, 2 minutes de confrontation). Cette esquisse n’est pas encore intégrée au déroulé : MP02 conserve ses 20 minutes et 0 minute de pratique planifiées. Son activation nécessitera un arbitrage de temps et de pratique ; aucun autre moment n’est modifié.

Critères légers de réussite :

- La donnée et le trajet d’exposition sont nommés sans assimiler toute donnée RH à la santé.
- Le contrôle proposé répond au risque choisi.
- Un responsable et une preuve observable sont identifiés.
- La décision distingue confirmé et à instruire, avec possibilité d’arrêt.

Proposition pédagogique dérivée de MET-GRILLE-RISQUE-IA et CAS-RH-REPONSE-FICTIF. Pas de corrigé complet à ce stade.

## CONSOLIDER

- Qualifier la donnée avant de qualifier le risque.
- Suivre aussi les accès, actions, sorties et journaux.
- Relier chaque contrôle à un responsable et une preuve.
- Une inconnue appelle une confirmation, pas une conformité présumée.

## Knowledge utilisée et provenance

Les identifiants de claims ci-dessus sont ceux des fiches capitalisées. Les sources indiquées ici désignent des fiches locales, consultables dans le cockpit avec leur provenance et leurs réserves.

- CON-SHADOW-AI, S1/C1 → SRC-CNIL-USAGE-IAG ; la fiche référence aussi SRC-ANSSI-SECURITE-IAG pour son contexte de sécurité.
- CON-RISQUES-IA-RH, G1–G2 → SRC-RGPD-REPERES-RH (articles 4 et 9) ; C2 → SRC-CNIL-USAGE-IAG ; A1–A3 → SRC-ANSSI-SECURITE-IAG (R26–R29 et repères détaillés dans la fiche).
- CON-RISQUES-IA-RH, H1–H3 : synthèses pédagogiques, sans prescription textuelle équivalente. SRC-UE-AIACT-RH reste une source de cette fiche, mais aucun calendrier ni conclusion de classement AI Act n’est enseigné ici ; ses réserves restent applicables.
- MET-GRILLE-RISQUE-IA, H4 → fiches ANSSI, CNIL et RGPD ci-dessus ; la méthode et les contrôles concrets restent des propositions Hector.
- CAS-RH-REPONSE-FICTIF, H5 → CON-RISQUES-IA-RH et MET-GRILLE-RISQUE-IA → leurs fiches Source. Les sources étayent les risques ; elles ne prouvent pas que l’incident fictif a eu lieu.
- CON-AGENT-IA → SRC-GOOGLE-AGENTIC-DESIGN, SRC-NIST-AGENT-STANDARDS, SRC-ANTHROPIC-TRUSTWORTHY et SRC-ANTHROPIC-EFFECTIVE. Définition et comparaison opérationnelles issues du matériau capitalisé, sans nouvelle consultation.

Les règles client, contrats, droits effectifs et interlocuteurs ne sont pas connus. Les deux questions correspondantes du plan de recherche restent ouvertes. Le gain pédagogique proposé est de passer de thèmes généraux à une décision argumentée ; son efficacité réelle reste à observer lors du test utilisateur.

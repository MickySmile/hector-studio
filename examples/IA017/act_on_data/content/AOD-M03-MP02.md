---
moment_id: "AOD-M03-MP02"
module_id: "AOD-M03"
knowledge_refs: ["CON-SHADOW-AI","CON-RISQUES-IA-RH","MET-GRILLE-RISQUE-IA","CAS-RH-REPONSE-FICTIF","CON-AGENT-IA","CAS-RH042-ATELIER","MET-REVUE-RH"]
source_refs: ["SRC-CNIL-USAGE-IAG","SRC-ANSSI-SECURITE-IAG","SRC-RGPD-REPERES-RH","SRC-UE-AIACT-RH","SRC-GOOGLE-AGENTIC-DESIGN","SRC-NIST-AGENT-STANDARDS","SRC-ANTHROPIC-TRUSTWORTHY","SRC-ANTHROPIC-EFFECTIVE","SRC-MCP-SPEC-2026-07-28","SRC-MCP-SECURITE","SRC-ANTHROPIC-MCP","SRC-MICROSOFT-MCP","SRC-GOOGLE-MCP","SRC-CNIL-ROLE-DPO"]
last_generated_from_knowledge: "2026-10-12"
---

# Relier chaque risque à un contrôle à instruire

## Intention pédagogique

Expliquer quelle donnée ou action est exposée, puis relier un risque à un contrôle, un rôle et une preuve. 20 minutes d'apport et de démonstration du support, 0 minute de pratique. Les exercices sont entièrement placés en MP03/MP04, sans ajouter l'ancienne esquisse de cinq minutes.

## Messages essentiels

- Personnel, catégorie particulière, confidentiel et inférence à examiner ne sont pas synonymes.
- Le Shadow AI décrit un usage hors cadre, y compris un outil autorisé utilisé hors de son périmètre.
- Les risques concernent aussi récupération documentaire, permissions, sortie et journaux.
- Un contrôle relie une mesure, un responsable proposé et une preuve observable ; une inconnue reste à instruire.

## COMPRENDRE — repères et limites

CON-RISQUES-IA-RH (G1–G2/H1) distingue un compteur rattaché à une personne identifiable, une information de santé et une information interne confidentielle. Enlever le nom ne garantit pas l'anonymat. Un compteur n'est pas automatiquement une donnée de santé. RH-042 est fictif ; ces repères préparent le raisonnement pour un usage réel.

Les repères RGPD déjà capitalisés portent sur qualification, finalité, base légale, minimisation, droits, destinataires et garanties. L'article 28 concerne la sous-traitance ; il ne résume pas la conformité. MET-REVUE-RH rassemble les références à vérifier et les questions à adresser aux responsables compétents. Le DPO informe et conseille ; le responsable du traitement conserve sa responsabilité. RH, DSI/RSSI et juridique apportent les vérifications métier, techniques et juridiques dans leurs domaines.

AI Act : faire qualifier la finalité réelle et la version applicable avec le juridique ; ne pas conclure à partir du seul mot RH. La réserve d'accès direct au texte consolidé reste documentée dans Knowledge. Aucun calendrier ni classement automatique du cas n'est enseigné. La compétence attendue est de formuler la bonne demande, pas de rendre un avis juridique.

## Exemple — CAS FICTIF RH-042

Reprendre D1 (8 affichés), D2 (9 suggérés sans preuve) et D3 (brouillon soumis au RH). Dans l'incident MP01, un compte personnel reçoit les pièces et la réponse non vérifiée est partagée plus largement. Les lecteurs et la conservation sont inconnus ; ne pas inventer un contrat fournisseur. La variante du cas RH général avec justificatif médical reste un exemple de donnée inutile ; aucun justificatif n'est nécessaire à RH-042.

## Mise en perspective — du chat à l'action

Chat : la copie suffit à exposer une donnée. Accès documentaire : un corpus trop large peut donner accès à un autre dossier. Workflow : une erreur peut se propager dans des étapes prévues. Agent : ses outils peuvent agir selon leurs permissions effectives. Ces distinctions reprennent CON-AGENT-IA et CON-RISQUES-IA-RH ; elles ne constituent pas un classement universel des niveaux de risque.

## OUTILLER — grille existante, exemple rempli

Usage : avant l'essai ou lorsque changent données, corpus, destinataires ou droits. Réutiliser MET-GRILLE-RISQUE-IA : risque ; donnée/ressource ; exposition ; conséquence ; prévention ; détection ; validation humaine ; preuve/trace. Ajouter propriétaire proposé et état confirmé/à instruire. Le gabarit vierge complet est dans Knowledge et repris en MP03.

Exemple : risque = propagation de 9 comme valeur certaine ; donnée = D1/D2 ; exposition = brouillon puis espace partagé ; conséquence = décision RH non fondée ; prévention = brouillon sourcé et envoi exclu ; détection = comparaison aux pièces ; validation = RH habilité peut refuser et demander complément ; preuve = état en attente et demande de pièce manquante. Propriétaire proposé : RH habilité ; règle confirmée dans l'exercice D3, capacité du système réel inconnue.

Demande de confirmation réutilisable : usage … ; donnée/destinataire … ; permission … ; question précise … ; rôle sollicité … ; preuve attendue … ; réponse ou inconnue … ; action suspendue … . MET-REVUE-RH fournit l'exemple complet. Ne pas remplacer l'examen du flux par une case « sécurisé » ou « DPO validé ».

## AGIR — passage aux ateliers suivants

Le formateur montre le support, sans faire remplir une nouvelle activité ici. MP03 donnera 45 minutes d'analyse, MP04 20 minutes de défense et de révision. Les règles internes réelles restent une confirmation client : les permissions fictives de D3 permettent déjà de préparer et d'utiliser la grille en formation.

## CONSOLIDER et minutage

- 5 min : distinguer données et expositions à partir de l'incident.
- 4 min : situer les repères juridiques et les rôles à solliciter, sans détail de calendrier.
- 4 min : comparer chat, récupération, workflow et action avec permissions.
- 6 min : montrer la grille et la ligne remplie, puis le gabarit de confirmation.
- 1 min : retenir « donnée, trajet, contrôle, responsable, preuve » et distribuer MP03.

## Provenance Knowledge → sources

CON-SHADOW-AI, CON-RISQUES-IA-RH et MET-GRILLE-RISQUE-IA → sources CNIL, ANSSI, RGPD et UE. CAS-RH-REPONSE-FICTIF apporte les contrastes ; CAS-RH042-ATELIER les pièces de travail. CON-AGENT-IA apporte les distinctions conceptuelles. MET-REVUE-RH → SRC-CNIL-ROLE-DPO et sources existantes : complément documentaire ciblé du 12 octobre 2026. Les sources étayent les repères, pas un incident client ou une conformité acquise. La couverture pédagogique est suffisante ; règles, contrats et interlocuteurs nommés restent à confirmer avant transfert réel.

---
moment_id: "AOD-M02-MP04"
module_id: "AOD-M02"
knowledge_refs: ["CAS-RH042-ATELIER", "MET-CONNEXION-MCP"]
source_refs: ["SRC-MCP-SPEC-2026-07-28", "SRC-MCP-SECURITE", "SRC-ANTHROPIC-MCP", "SRC-MICROSOFT-MCP", "SRC-GOOGLE-MCP", "SRC-ANSSI-SECURITE-IAG", "SRC-CNIL-USAGE-IAG", "SRC-RGPD-REPERES-RH"]
last_generated_from_knowledge: "2026-10-12"
---

# Cartographier le workflow RH

AGIR — **60 minutes de pratique**, durée inchangée. **READY pour la production
du contenu pédagogique** ; dossier validé par le formateur le 13 octobre 2026,
ajustements de l’audit appliqués. Le choix du cas est validé : **CAS FICTIF — RH-042**.

## Situation et intention

Le manager veut comprendre un écart entre le compteur 8 et la suggestion 9,
sans corriger automatiquement. Concevoir une carte qui rende lisibles les rôles,
entrées, sorties, ressources, connexions et validations, y compris lorsque la
preuve permettant de corriger est absente.

## Mission et ressources

En deux binômes et un trinôme pour sept participants, dessiner un workflow
explicable à un collègue. Utiliser le [dossier participant RH-042](../../../../knowledge/cases/rh-042-dossier-pedagogique.md)
(D1, D2, D3 et permissions), le [canvas et la grille MCP de MP03](AOD-M02-MP03.md),
une feuille et des stylos ou un support partagé autorisé. Pas d’exécution technique.
Le formateur distribue le dossier et le gabarit ; la référence ci-dessous est
destinée à la correction, pas à être copiée avant le travail.

## Consigne et durée — 60 minutes

1. **10 min** : lire D1–D3, reformuler le résultat attendu et noter ce que les
   pièces ne permettent pas d’affirmer. Répartir lecture, dessin et explication.
2. **15 min** : remplir le canvas ; placer demande, consultation, analyse,
   brouillon et revue RH. Nommer acteur, instruction, entrée et sortie de chaque étape.
3. **15 min** : tracer les échanges et relier D1/D2/D3 aux étapes utiles. Annoter
   droits de lecture, accès RH-099 interdit et absence d’écriture du lecteur.
   Justifier une connexion directe ou l’option MCP sans la déclarer testée.
4. **10 min** : traiter une pièce manquante, un refus et une absence de réponse.
   Distinguer demande de complément et correction éventuelle dans un circuit séparé.
5. **10 min** : relire avec les quatre critères, réviser, puis préparer une
   explication courte de la carte et d’une incertitude pour la revue MP05.

Tout ce temps porte sur la lecture active, la conception, la discussion et la
révision par les participants. N’ajouter ni tutoriel logiciel ni exposé de correction
aux 60 minutes. Les repères de correction servent au feedback pendant le travail.

## Production attendue

Une carte logique annotée montrant le trajet de RH-042 et ses conditions d’arrêt,
accompagnée d’une phrase : « Notre lecteur peut … ; il ne peut pas … ; la décision
de … appartient à … ; la preuve encore nécessaire est … ».
Un dessin simple suffit ; ne pas multiplier les agents sans raison liée au besoin.

## Quatre critères légers de réussite — C02

- Entrées, sorties et étapes lisibles.
- Rôles et connexions justifiés par le besoin.
- Contrôles et validations localisés.
- Complexité limitée et points restant à vérifier signalés.

## Principe de correction

Vérifier le raisonnement et les échanges, pas la ressemblance graphique avec
la référence. Accepter un workflow simple ou une variante agentique argumentée.
Une proposition ne peut pas conclure « 9 est correct » à partir du dossier.
Demander où elle bloque l’écriture, comment elle obtient les pièces manquantes
et qui peut refuser. Un contrôle dessiné n’est pas une preuve de contrôle réel.

## Production de référence — formateur

| Étape | Acteur et instruction | Entrée → sortie / contrôle |
| --- | --- | --- |
| Demander | Manager : expliquer RH-042 sans corriger. | Demande bornée → application. |
| Consulter | Application demande D1/D2 ; service contrôle les droits. | RH-042 → compteur 8 et suggestion 9 avec références ; RH-099 refusé. D3 guide le traitement. |
| Analyser | Application rapproche les pièces sans inventer les événements. | D1/D2 → écart signalé, justification de 9 non établie. |
| Préparer | Application produit un brouillon, sans envoi autonome. | Analyse → brouillon + références + demande de complément. |
| Examiner | RH habilité vérifie, corrige ou refuse le brouillon. | Pièces insuffisantes ou silence → attente et demande de complément, aucune correction. |

Flèches à expliquer : demande RH-042 ; requête de lecture ; retour D1/D2 ;
brouillon et références vers le RH ; demande de complément si preuve absente.
La variante MCP place client et serveur sur la connexion de consultation,
sans faire de MCP un validateur métier. La compatibilité réelle reste à vérifier.

Brouillon de référence : « D1 affiche 8 jours ; D2 suggère 9, sans détail validé
des événements. Merci de vérifier les pièces et de confirmer la valeur. Aucune
correction effectuée. » Ce brouillon ne décide pas des droits d’un salarié.

Si un circuit d’écriture est dessiné, le représenter séparément du lecteur :
pièces suffisantes + RH habilité + décision sur dossier/ancienne/nouvelle valeur
→ recontrôle par le service d’écriture. Sans accord, après refus ou si la valeur
a changé, ne pas écrire. La version de départ du dossier n’autorise pas ce circuit.

## Provenance et validation d’utilisation

CAS-RH042-ATELIER reprend H7/H6 et fournit les pièces de l’activité ; critères et
intention issus de `formation.json`. La carte de référence est une proposition
pédagogique Hector, pas une architecture client déployée. Hector Studio a préparé
le dossier, validé par le formateur le 13 octobre 2026 avec application des
ajustements détectés. Distribuer D1–D3 et les permissions au moment prévu,
selon le master case-rh042/ACTIVITES_RH042.md ; réserver les corrigés. Aucune dépendance à la démonstration n8n de MP01.

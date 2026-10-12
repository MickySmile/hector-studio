---
moment_id: "AOD-M02-MP03"
module_id: "AOD-M02"
knowledge_refs: ["CON-MCP", "MET-CONNEXION-MCP", "CAS-RH-MCP-FICTIF"]
source_refs: ["SRC-MCP-SPEC-2026-07-28", "SRC-MCP-SECURITE", "SRC-ANTHROPIC-MCP", "SRC-MICROSOFT-MCP", "SRC-GOOGLE-MCP", "SRC-ANSSI-SECURITE-IAG", "SRC-CNIL-USAGE-IAG", "SRC-RGPD-REPERES-RH"]
last_generated_from_knowledge: "2026-10-12"
---

# Préparer la carte logique

OUTILLER — 10 minutes de présentation d’un support et de son exemple rempli, 0 minute de pratique planifiée. La production de la carte reste dans le moment AGIR déjà prévu après celui-ci.

## Intention pédagogique

Donner au manager un support pour annoter une connexion sur sa carte : utilité, compatibilité à vérifier, périmètre des droits, validation et preuves attendues. Il pourra ainsi expliquer ce qui est décidé et ce qui reste inconnu.

## OUTILLER — quand et comment utiliser la grille

Réutiliser MET-CONNEXION-MCP, « Faut-il connecter cet agent via MCP ? », avant de dessiner un accès externe, ou lorsque changent données, outils ou permissions. Ses six questions sont une méthode pédagogique Hector Studio, pas une norme MCP ni une certification.

Mode d’emploi : décrire une opération utile ; répondre aux six questions ci-dessous ; écrire « inconnu » si une preuve manque ; relier chaque réponse à la flèche ou au responsable concerné sur la carte. Une feuille suffit. Le logiciel de cartographie reste optionnel.

## Exemple rempli — même CAS FICTIF, décision de connexion

Le manager souhaite une analyse du compteur RH-042 et une proposition à vérifier. Deux applications pourraient réutiliser la consultation : hypothèse du cas capitalisé, pas besoin client confirmé. Le formateur présente les six réponses de la grille existante.

- Quel résultat exige un accès externe ? Expliquer l’écart entre 8 jours au compteur et 9 suggérés par les événements fictifs. Consulter uniquement le compteur, les éléments utiles et la procédure ; produire un brouillon sourcé, pas une correction.
- Pourquoi MCP pour ce besoin ? Comparer la réutilisation de la consultation par deux applications avec une intégration déjà approuvée. Si cette dernière suffit, MCP n’est pas nécessaire.
- Les deux côtés savent-ils échanger ? Application/client, serveur, version, capacités et transport compatibles : inconnu. Demander au responsable technique une preuve datée ou un essai sur données fictives.
- Qui peut lire et qui peut agir ? Dans la conception proposée, une identité limitée peut lire les champs utiles de RH-042 ; RH-099 et l’écriture sont interdits à cet agent. Le service doit faire respecter les droits. Leur mise en œuvre reste à prouver.
- Quelle décision exige un humain ? Une éventuelle correction « RH-042 : 8 → 9 » passe par un circuit distinct. Un RH habilité vérifie pièces et valeurs et peut refuser. Sans réponse, aucune écriture ; si la valeur change entre-temps, nouvelle décision. Cette validation ne donne pas un droit d’écriture général à l’agent lecteur.
- Comment vérifier et arrêter ? Confirmer le serveur approuvé et le trajet des données ; demander la preuve du refus de RH-099, de toute écriture sans validation et des accès après révocation. Conserver les traces utiles protégées. Ces essais restent à réaliser.

Décision de l’exemple : connexion différée faute de preuves ; poursuivre seulement la conception sur papier et données fictives. La grille ne transforme pas une inconnue en autorisation.

## Reporter les réponses sur la carte

Trajet de lecture proposé : demande du manager → application avec agent/client MCP → serveur MCP → consultation RH-042 → analyse sourcée → brouillon à examiner.

Sur la flèche de consultation, écrire « lecture des champs utiles, identité et droits à confirmer ». À côté du service, noter « refuser RH-099 et toute écriture de cet agent ». À la sortie, placer le RH habilité qui examine le brouillon. Dessiner séparément la variante de correction, avec le contrôle de l’action exacte avant modification ; elle n’est pas un prolongement automatique de la lecture.

Les annotations représentent permissions, gouvernance et contrôle humain. Le protocole fournit une interface standardisée ; il ne fournit pas, à lui seul, ces décisions ni leur application.

## Support vierge — les six questions existantes

Une réponse courte et sa preuve, ou « inconnu + responsable à solliciter », suffisent par rubrique.

- Quel résultat exige un accès externe ? …
- Pourquoi MCP pour ce besoin ? …
- Les deux côtés savent-ils échanger ? …
- Qui peut lire et qui peut agir ? …
- Quelle décision exige un humain ? …
- Comment vérifier et arrêter ? …

Décision argumentée : essai fictif borné / intégration existante préférable / connexion différée faute de preuves. Reporter la justification sur la carte. Aucun score automatique.

## Déroulé formateur et conseils d’utilisation

- 2 minutes : expliquer quand utiliser la grille et comment noter les inconnues.
- 5 minutes : parcourir l’exemple rempli et ses six réponses.
- 3 minutes : montrer les annotations sur la carte et le support vierge disponible pour la suite.

Éviter trois raccourcis : outil visible donc accès autorisé ; « lecture seule » donc sortie forcément sûre ; approbation humaine donc droits devenus illimités. La grille prépare des décisions et des vérifications. Ce moment présente l’outil ; aucune activité supplémentaire ni pratique n’est ajoutée aux 10 minutes prévues.

## Knowledge utilisée et provenance

- MET-CONNEXION-MCP, H6 → CON-MCP et MET-GRILLE-RISQUE-IA : six questions, preuves et options de décision reprises sans nouvelle grille.
- CAS-RH-MCP-FICTIF, H7 → CON-MCP et MET-CONNEXION-MCP : compteur, séparation lecture/écriture et validation liée à l’action. Exemple inventé, sans architecture réelle d’Act-On Data ni essai technique effectué.
- CON-MCP, P9–P11/S1 → SRC-MCP-SECURITE et SRC-MCP-SPEC-2026-07-28 : portée de l’autorisation et limites. La grille de risque renvoie aux fiches ANSSI, CNIL et RGPD ; les contrôles concrets restent des propositions Hector, sans avis de conformité.

Les sources fournisseurs sont résolues via le concept sans choisir de produit. Le patrimoine, vérifié le 12 octobre 2026, suffit à cette préparation sur papier ; les accès réels, compatibilités et responsables restent à confirmer. La rédaction ne constitue aucune nouvelle recherche externe. Réexaminer les capacités avant une démonstration technique et au plus tard le 12 novembre 2026.

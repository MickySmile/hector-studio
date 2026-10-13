# RH-042 — Corrigé formateur

**CAS FICTIF — réservé au formateur.** Audit par production du 13 octobre 2026.
Les exemples ci-dessous développent les corrigés existants ; ils ne constituent
ni des résultats participants observés ni une architecture déployée.

## Le fil rouge en moins de deux minutes

```text
Entrée : préparer un brouillon sur une procédure d'absence
↓
Activité 1 — qualifier la délégation (20 min)
→ six rubriques + décision argumentée
↓
Activité 2 — préciser la limite (5 min)
→ phrase avec permission, interdiction, refus et arrêt
↓
Information : RH-042 ; D1 = 8 jours ; D2 suggère 9 sans preuve ; D3 = revue RH
Apports : n8n = analogie de branchement ; MCP = option de connexion ; canvas
↓
Activité 3 — cartographier (60 min)
→ carte avec flux, droits, références et validation
↓
Activité 4 — éprouver la carte (30 min)
Information au scénario : le RH ne répond pas
→ carte révisée ; attente explicite, ni correction ni envoi
↓
Information : copie personnelle de D1–D3, affirmation de 9, partage élargi
Apport : grille de risque et demande de confirmation
↓
Activité 5 — analyser trois risques (45 min)
→ carte annotée + trois lignes + contrôle prioritaire
↓
Activité 6 — défendre ce contrôle (20 min)
→ décision révisée + demande précise de preuve
↓
Apports : travail complet, chiffres illustratifs et canvas de valeur
↓
Activité 7 — argumenter un prochain pas (70 min)
→ page de décision + phrase individuelle de transfert
↓
Dossier final : qualification → carte → risques/décision → valeur/conditions
```

**Total pratique : 250 min.** Les sept moments porteurs occupent 255 min ; les
5 minutes supplémentaires sont la consolidation de M1-MP03. Tous les modules
occupent 390 min ; ouverture, transitions et clôture portent la journée à 420 min
hors pauses. La [matrice](MATRICE_COHERENCE_RH042.md) recense aussi les onze
moments sans pratique et les correspondances de slides.

## Ce qui est unifié, ce qui reste une variante

Le lien déjà présent dans la [conduite de session](../conduite-session.md) est
la préparation d'un brouillon RH sous contrôle. M1 commence par la variante
« procédure d'absence » ; M2 précise la demande avec les pièces RH-042 ; M3
fait subir un incident au même dossier ; M4 réemploie la carte et ses contrôles.
Ne pas prétendre que M1 disposait déjà de D1–D3.

Le cas MCP [H7](../../../../knowledge/cases/rh-connexion-mcp-fictif.md) fournit
RH-042, les valeurs 8/9, RH-099 et la séparation lecture/écriture ; le
[dossier pédagogique](../../../../knowledge/cases/rh-042-dossier-pedagogique.md)
organise cela en D1–D3. Ce n'est pas un second salarié.

La démonstration n8n est un **sous-cas technique analogue** : elle compte des
éléments reçus/attendus. Aucune sortie n8n n'alimente réellement le dossier de
jours d'absence. Le cas Shadow AI générique avec nom et justificatif médical
est un **contraste** ; l'incident M3 retenu copie uniquement D1–D3.

## Distribution, exemples et correction légère

1. Distribuer seulement le [dossier d'entrée](DOSSIER_PARTICIPANT_RH042.md) et
   l'activité 1 au départ.
2. Dans le [master des activités](ACTIVITES_RH042.md), remettre les sections
   selon les moments indiqués. L'annonce 8/9 vient à la fin de M1-MP03 ; D1–D3
   à la transition M1/M2 ; le silence au scénario de l'activité 4 ; l'incident
   en M3-MP01 ; les chiffres de valeur en M4-MP01.
3. Présenter les exemples prévus en OUTILLER. Ils sont très proches des
   corrigés : vérifier le raisonnement dans les objections et les révisions,
   pas la seule ressemblance à l'exemple. V01 de la matrice documente ce risque.
4. Réserver ces corrections détaillées au feedback et au débrief. Si une pièce
   produite est perdue en M4, le recours aux exemples existants est prévu dans
   M4-MP03 ; ne pas attribuer ce travail au groupe.

Retours : **conserver / préciser / réviser**, sans score. Demander de montrer
sur la production le passage qui justifie la décision. Une correction doit
respecter l'information disponible au moment de la consigne.

### Activité 1 — Qualifier une demande de manager

**Intention pédagogique**

Passer d'un souhait d'IA à une délégation justifiée et bornée. Compétence C01 ;
20 minutes, AOD-M01-MP02.

**Éléments attendus**

Six réponses, une décision, une inconnue ; distinction utilisateur/programme/
modèle ; aucune décision sur les droits du salarié, aucun envoi autonome ni
écriture dans la paie. La procédure absente doit être demandée.

**Exemple de production correcte**

| Rubrique | Proposition recevable |
| --- | --- |
| Objectif | Préparer un brouillon qui cite la procédure effectivement utilisée et montre les manques. |
| Contexte | Demande du gestionnaire et extrait autorisé de procédure ; extrait à demander car absent ; justificatif médical exclu. |
| Actions | Préparer et réviser un texte ; aucun envoi ni écriture dans la paie. |
| Boucle | Assistant : le gestionnaire choisit les pièces et décide de relancer si une information manque. |
| Limites | Suspendre la réponse de fond si la procédure est absente ou contradictoire ; produire une demande de complément. |
| Contrôle | RH habilité compare brouillon et procédure ; peut corriger ou refuser avant diffusion. |

« Nous proposons un assistant pour préparer un brouillon à partir d'une pièce
choisie par le gestionnaire ; avant un usage réel, confirmer procédure et outil
autorisé. »

**Erreurs fréquentes**

Choisir un agent parce qu'il serait plus moderne ; assimiler IA et autonomie ;
remplir « Boucle » avec une autonomie inventée ; écrire une règle d'absence qui
n'est dans aucune pièce ; attribuer les droits d'action à la seule demande du manager.

**Questions de débrief**

- Qui choisira la prochaine action si une information manque ?
- Quel passage du brouillon pourra être vérifié, et par qui ?
- Quelle information manque pour répondre sur le fond ?

**Principe de correction**

L'assistant est un exemple, pas la seule réponse. Un workflow convient si ses
étapes sont prévues ; une variante agentique exige une consultation adaptative
utile et bornée. Évaluer la justification et la limite ; ne pas demander D1–D3.

**Knowledge utilisée**

[CON-AGENT-IA](../../../../knowledge/concepts/agent-ia.md),
[MET-GRILLE-CONCEPTION-AGENT](../../../../knowledge/methods/grille-conception-agent.md),
[CAS-RH-REPONSE-FICTIF](../../../../knowledge/cases/rh-reponse-salarie-fictif.md),
[CON-RISQUES-IA-RH](../../../../knowledge/concepts/risques-ia-donnees-rh.md).
Corrigé source : [M1-MP02](../content/AOD-M01-MP02.md).

**Transition vers l'activité suivante**

Conserver les six réponses ; faire tenir la délégation en une phrase vérifiable.

### Activité 2 — Reformuler la limite d'autonomie

**Intention pédagogique**

Rendre la décision transmissible à un collègue. Compétence C01 ; 5 minutes de
pratique au sein des 10 minutes de AOD-M01-MP03.

**Éléments attendus**

Une phrase précisant résultat, solution, conduite de la suite, permission,
interdiction, refus et conséquence d'un manque. Une limite soulignée.

**Exemple de production correcte**

« Pour préparer un brouillon de réponse sur la procédure d'absence, nous
retenons un assistant ; la prochaine étape est choisie par le gestionnaire ;
le système peut préparer un texte à partir d'un extrait autorisé, mais ne peut
pas l'envoyer ni écrire dans la paie ; le RH habilité peut refuser ; si la
procédure manque, la réponse de fond est suspendue et l'extrait est demandé. »

**Ajustement validé et appliqué :** cette formulation réemploie les éléments
du corrigé de l’activité 1. Le corrigé source M1-MP03 est maintenant aligné :
les valeurs du compteur ne sont annoncées qu’en fin de consolidation.

**Erreurs fréquentes**

« L'IA doit être fiable » sans condition d'arrêt ; « le manager a demandé donc
on peut modifier » ; exigence de citer un nombre qui n'a pas encore été donné.

**Questions de débrief**

- Votre collègue sait-il qui peut refuser et ce que ce refus empêche ?
- Quel événement concret impose une demande de complément ?

**Principe de correction**

Accepter les architectures justifiées en activité 1. Faire préciser une limite
vague ; ne pas noter la connaissance anticipée du dossier. Les cinq minutes
suivantes servent à commenter les formulations, puis à annoncer RH-042.

**Knowledge utilisée**

[CON-AGENT-IA](../../../../knowledge/concepts/agent-ia.md) et
[MET-GRILLE-CONCEPTION-AGENT](../../../../knowledge/methods/grille-conception-agent.md).
Source : [M1-MP03](../content/AOD-M01-MP03.md).

**Transition vers l'activité suivante**

Annoncer l'écart 8/9 puis distribuer D1–D3 à la transition. Présenter n8n comme
analogie, puis les connexions et les gabarits M2. La phrase M1 accompagne la carte.

### Activité 3 — Cartographier le workflow RH

**Intention pédagogique**

Rendre les rôles, informations, droits et validations discutables sur une carte.
Compétence C02, en mobilisant C01 ; 60 minutes, AOD-M02-MP04.

**Éléments attendus**

Entrée/sortie explicites ; acteur et instruction par étape ; flèches nommées ;
D1/D2 comme informations consultées, D3 comme instruction ; lecture RH-042
limitée, RH-099 exclu ; aucune écriture du lecteur ; gestion du manque/refus/silence.
L'option de connexion doit être argumentée, sans preuve technique supposée.

**Exemple de production correcte**

```text
Manager — demande bornée RH-042
  → Application : demander les pièces utiles
  → Service : vérifier les droits puis retourner D1/D2 autorisés
  → Application : rapprocher 8 affichés et 9 suggérés, sans conclure
  → Brouillon + références + demande de complément
  → RH habilité : examiner les pièces, corriger/refuser le brouillon
       └─ pièce insuffisante, refus ou silence : attente, pas d'envoi/correction
D3 guide le traitement ; RH-099 est refusé par le service dans la conception.
```

Les réponses de consultation reviennent à l'application. Une option MCP place
client et serveur sur cette connexion ; elle ne remplace pas le service de
droits ni la revue RH. Une intégration directe justifiée est recevable.

Brouillon de référence : « D1 affiche 8 jours ; D2 suggère 9 sans détail validé
des événements. Merci de vérifier les pièces et de confirmer la valeur.
Aucune correction effectuée. »

Phrase : « Notre lecteur peut consulter les pièces utiles RH-042 ; il ne peut
ni consulter RH-099 ni modifier le compteur ; l'examen du brouillon appartient
au RH habilité ; les événements justifiant D2 restent à obtenir. »

**Appui rempli — questions MCP**

| Question existante | Annotation recevable |
| --- | --- |
| Accès externe utile ? | Dans la carte d'un futur système, consulter compteur et pièces ; pour l'exercice, D1–D3 sont déjà remis et aucune connexion n'est nécessaire. |
| Pourquoi MCP ? | Réutilisation possible par deux applications, seulement hypothétique ; comparer une intégration directe déjà approuvée. |
| Compatibilité ? | Client, serveur, version, capacités et transport inconnus ; preuve à demander au rôle technique. |
| Qui lit / agit ? | Lecteur limité aux champs utiles RH-042 ; RH-099 et écriture interdits ; service chargé d'appliquer les droits. |
| Décision humaine ? | Revue du brouillon par RH ; correction éventuelle hors lecteur, liée aux pièces, dossier et valeurs. |
| Vérifier / arrêter ? | Demander preuve de refus RH-099, écriture sans validation et accès après révocation ; aucune exécution attestée. |

Décision exemple : connexion différée faute de preuves, poursuite de la
conception fictive. Le support MCP n'est pas une seconde activité obligatoire à
noter : ses réponses utiles annotent la carte.

**Erreurs fréquentes**

Déduire « 9 est correct » de D2 ; transformer MCP en validateur ; confondre
instruction et donnée ; lire RH-099 pour obtenir un complément ; ajouter des
agents sans besoin ; chaîner le brouillon directement à l'écriture.

**Questions de débrief**

- Que transporte cette flèche, avec quel droit et quelle référence ?
- Où se voit le retour de consultation et la demande de complément ?
- Qu'est-ce que votre dessin exige mais ne prouve pas encore ?

**Principe de correction**

Appliquer les quatre critères C02, sans imposer une esthétique ou MCP. Si un
circuit d'écriture figure, le séparer du lecteur : pièces suffisantes, RH
habilité, décision sur dossier/ancienne/nouvelle valeur, recontrôle côté service.
Refus, silence ou valeur changée empêchent l'écriture ; les pièces actuelles
ne permettent pas de l'autoriser. Ne pas exiger de dessiner ce circuit optionnel.

**Knowledge utilisée**

[CAS-RH042-ATELIER](../../../../knowledge/cases/rh-042-dossier-pedagogique.md),
[MET-CONNEXION-MCP](../../../../knowledge/methods/grille-connexion-mcp.md),
[CON-MCP](../../../../knowledge/concepts/mcp.md),
[MET-GRILLE-CONCEPTION-AGENT](../../../../knowledge/methods/grille-conception-agent.md).
Appui de comparaison : [MET-CHOIX-ORCHESTRATION](../../../../knowledge/methods/comparer-workflow-multi-agents.md).
Sources : [M2-MP03](../content/AOD-M02-MP03.md), [M2-MP04](../content/AOD-M02-MP04.md).

**Transition vers l'activité suivante**

Faire circuler les cartes pour vérifier que les contrôles conçus sont lisibles
par un autre groupe. Garder le scénario d'épreuve pour son temps dédié.

### Activité 4 — Éprouver et expliquer la carte

**Intention pédagogique**

Tester la lisibilité des responsabilités par une revue et une révision motivée.
Compétence C02 ; 30 minutes, AOD-M02-MP05.

**Éléments attendus**

Une annotation issue de la lecture, la conséquence du silence RH et une carte
révisée ou explicitement confirmée. La question de connexion/permission non
résolue reste adressée à un rôle ; elle ne devient pas une autorisation.

**Exemple de production correcte**

« Nous retirons la flèche brouillon → correction. Le brouillon et D1/D2 restent
en attente ; le RH habilité doit obtenir et vérifier les événements. Son
silence n'autorise ni écriture ni envoi. Il reste à confirmer auprès de la
DSI/RSSI comment le service empêche une écriture hors périmètre. »

Si la carte était déjà correcte : « Nous conservons la séparation ; nous avons
ajouté l'étiquette “en attente RH” sur le brouillon et désigné le rôle à relancer.
Notre lecteur reste sans écriture. » Aucune relance automatique nouvelle n'est
requise : il suffit de localiser la responsabilité de la demande.

**Erreurs fréquentes**

Transformer un délai ou le silence en accord ; écrire « validation » sans acteur
ni conséquence du refus ; traiter un simple « d'accord » comme preuve que D2 est
justifié ; créer une écriture absente de la carte pour avoir un défaut à corriger.

**Questions de débrief**

- Montrez ce qui attend et l'action empêchée pendant le silence.
- Quelle flèche a changé et pourquoi ?
- Une personne peut-elle répondre sans que les pièces suffisent ?

**Principe de correction**

Même critères C02 que l'activité 3, appliqués cette fois à une lecture externe et
à une révision. Aucun défaut artificiel exigé. Une carte correcte ne prouve pas
un contrôle réel. Synthèse magistrale uniquement dans M2-MP06.

**Knowledge utilisée**

[CAS-RH042-ATELIER](../../../../knowledge/cases/rh-042-dossier-pedagogique.md),
[CAS-RH-MCP-FICTIF](../../../../knowledge/cases/rh-connexion-mcp-fictif.md),
[MET-CONNEXION-MCP](../../../../knowledge/methods/grille-connexion-mcp.md).
Corrigé source : [M2-MP05](../content/AOD-M02-MP05.md).

**Transition vers l'activité suivante**

Après M2-MP06 et la transition, superposer l'incident M3 à la carte produite.
Les règles de RH-042 restent les mêmes ; c'est le trajet effectif dans la fiction
qui les contourne. Présenter la grille avant l'analyse de l'activité 5.

### Activité 5 — Analyser le trajet des données fictives

**Intention pédagogique**

Passer d'une carte fonctionnelle à trois décisions de contrôle étayées.
Compétence C03 ; 45 minutes, AOD-M03-MP03.

**Éléments attendus**

Deux flèches d'incident visibles, destinataires inconnus signalés, trois lignes
sur les risques imposés, rôle et preuve par ligne. RH-099 est un test négatif
à proposer ; aucun accès indu n'a été observé dans l'incident décrit.

**Exemple de production correcte**

| Risque | Donnée / ressource | Exposition / conséquence | Prévention | Détection | Validation / propriétaire proposé | Preuve / état |
| --- | --- | --- | --- | --- | --- | --- |
| Partage hors cadre | D1–D3, sortie affirmant 9 | Compte personnel puis espace partagé ; divulgation et diffusion d'une affirmation sans preuve | Chemin autorisé, champs limités ; supprimer sur la carte les deux flèches hors cadre | Revue du trajet et signalement d'écart | Manager d'usage avec RSSI pour cadre et destinataires | Cadre d'usage documenté et liste des destinataires ; compte interdit dans la scène, fonctionnement réel inconnu |
| Consultation hors périmètre | Dossier RH-099, aucune donnée fournie | Accès indu si le lecteur dépasse RH-042 | Droit limité côté service | Test négatif fictif RH-099 attendu « refusé », aucune donnée restituée | DSI/RSSI pour habilitations et preuve technique | Résultat du test à obtenir ; exigence fictive confirmée, test non exécuté |
| Propagation de 9 comme certitude | D1/D2, brouillon | Correction ou réponse non fondée | Brouillon avec références et incertitude, attente si pièces insuffisantes | RH compare le brouillon aux pièces | RH habilité peut refuser et demander complément | Demande de pièce et état en attente ; exigence D3 confirmée, pas de preuve d'exécution réelle |

Compléments de grille possibles : partage → C1/G3, lecture → G5/A2,
propagation → C2/G4 de la bibliothèque existante ; mesures organisationnelles,
techniques et humaines respectivement. Réexamen proposé avant tout essai réel,
date à fixer par le responsable, sans inventer un engagement.

Sur la carte, conserver la trace de l'incident pour l'analyser et marquer les
flèches à retirer de la conception cible. Barrer une flèche ne signifie pas que
les copies d'un incident réel auraient été effacées.

Phrase : « Nous poursuivons la conception fictive avec une lecture bornée, un
brouillon sourcé et une revue ; avant le réel, il manque les preuves de droits,
les destinataires autorisés et le cadre de traitement. »

**Erreurs fréquentes**

Dire « anonymiser » ou « sécuriser » sans mesure ; supposer qu'un fournisseur
entraîne son modèle sur les pièces ; ajouter un justificatif médical à RH-042 ;
confondre un compteur avec une donnée de santé par défaut ; présenter un test
souhaité comme réussi ; écrire « conforme » au seul vu de la grille.

**Questions de débrief**

- Où la donnée part-elle et qui la reçoit réellement dans les informations données ?
- Quelle preuve montrerait que votre contrôle fonctionne ?
- Qu'est-ce qui est établi dans l'exercice et reste inconnu dans un système réel ?

**Principe de correction**

Vérifier l'adéquation risque/contrôle, le rôle et la preuve. Plusieurs mesures
sont recevables. Les sept minutes de contrôle croisé appartiennent aux groupes ;
ne pas les transformer en cours juridique. Ne pas demander un avis de conformité
ou la lecture de nouveaux textes : les repères et limites du patrimoine suffisent.

**Knowledge utilisée**

[MET-GRILLE-RISQUE-IA](../../../../knowledge/methods/grille-risque-usage-ia.md),
[MET-REVUE-RH](../../../../knowledge/methods/revue-rh-avant-usage.md),
[CON-SHADOW-AI](../../../../knowledge/concepts/shadow-ai.md),
[CON-RISQUES-IA-RH](../../../../knowledge/concepts/risques-ia-donnees-rh.md),
[CAS-RH042-ATELIER](../../../../knowledge/cases/rh-042-dossier-pedagogique.md).
Corrigé source : [M3-MP03](../content/AOD-M03-MP03.md).

**Transition vers l'activité suivante**

Choisir une des trois lignes comme condition prioritaire ; l'activité 6 la
met à l'épreuve d'une objection, sans refaire la grille complète.

### Activité 6 — Défendre une décision de contrôle

**Intention pédagogique**

Demander une preuve et suspendre une action précise tout en maintenant une suite
pédagogique possible. Compétence C03 ; 20 minutes, AOD-M03-MP04.

**Éléments attendus**

Une ligne révisée, une demande de confirmation et une condition d'arrêt. Le rôle
sollicité est proposé, sans inventer un interlocuteur nommé ou son accord.

**Exemple de production correcte**

Objection reprise de la source : « Pour gagner du temps, donnons au lecteur le
droit de modifier le compteur. »

Réponse : « Cela change la mission. D2 ne démontre pas 9. Nous gardons un
brouillon et demandons au RH les pièces manquantes. L'écriture reste hors
périmètre ; la conception du contrôle de refus peut continuer. »

Demande au format MET-REVUE-RH :

- Usage : brouillon RH-042 ; aucune correction ni réponse automatique.
- Données : D1/D2 utiles, références et destinataire RH ; conditions de conservation réelles inconnues.
- Outil/droits : lecteur limité à RH-042, sans écriture ; compte et contrat réels inconnus.
- Question : « Quelles pièces permettent de vérifier le signalement D2 ? »
  Rôle proposé : RH habilité ; preuve : événements examinés et justification de valeur.
- État : non fourni ; correction suspendue ; revue à reprogrammer à réception
  des pièces. L'atelier de conception et la préparation du plan de preuve continuent.

Variante recevable : DSI/RSSI sollicité pour démontrer le refus RH-099 ; preuve
technique à obtenir, sans substituer un prompt au contrôle du service.

**Erreurs fréquentes**

« DPO validé » sans question ni preuve ; donner au DPO seul tout pouvoir métier
ou technique ; arrêter toute la formation faute d'un contrat réel ; abandonner
les limites pour faire apparaître un gain ; exécuter un test que l'atelier ne prévoit pas.

**Questions de débrief**

- Quelle action exacte attend et quelle activité peut continuer ?
- La preuve demandée répond-elle à votre objection ?
- Qu'est-ce qui a changé dans votre ligne après confrontation ?

**Principe de correction**

Demander risque, rôle, preuve et conséquence. Le manager n'est pas évalué comme
juriste ou technicien. Le corrigé source évoque la possibilité d'un test fictif
de refus ; la production de cette activité reste sa demande/préparation, pas
une exécution technique à ajouter aux vingt minutes.

**Knowledge utilisée**

[MET-GRILLE-RISQUE-IA](../../../../knowledge/methods/grille-risque-usage-ia.md),
[MET-REVUE-RH](../../../../knowledge/methods/revue-rh-avant-usage.md),
[CAS-RH042-ATELIER](../../../../knowledge/cases/rh-042-dossier-pedagogique.md).
Corrigé source : [M3-MP04](../content/AOD-M03-MP04.md).

**Transition vers l'activité suivante**

Conserver cette décision après M3-MP05. Les apports M4 font apparaître le coût
de la revue et des reprises ; le contrôle devient une condition du canvas.

### Activité 7 — Argumenter un prochain pas

**Intention pédagogique**

Mobiliser carte, risques et valeur dans une décision réalisable ; distinguer
production ponctuelle et capacité durable. Compétence C04 ; 70 minutes,
AOD-M04-MP03.

**Éléments attendus**

Sept rubriques du canvas, une décision révisée après objection, une phrase de
transfert individuelle. Même résultat acceptable pour référence et essai ;
temps complet, qualité, délai et coût distingués ; contrôles conservés. Les
critères C04 demandent aussi de distinguer hypothèse et mesure.

**Exemple de production correcte — angle pilote interne**

| Rubrique | Exemple à discuter |
| --- | --- |
| Besoin / bénéficiaire / résultat acceptable | Brouillon documenté pour le RH, références citées, incertitude visible, aucune correction/envoi autonome. |
| Référence : faits / inconnues | D2 incomplet ; aucune mesure actuelle de temps ou de gain ; droits d'écriture exclus. |
| Hypothèse / mécanisme / mesure | Réduire la préparation sans déplacement équivalent vers revue/reprises ; comparer le temps humain complet. |
| Travail / qualité / délai / coût | Mesurer temps actif de chaque étape, reprises, acceptation et délai de revue séparé ; estimer préparation initiale et entretien ; prix inconnus. |
| Contrôle / preuve | Reprendre la limite M3 : accès borné et brouillon soumis à revue ; preuves de refus d'accès et de prise en compte de l'incertitude à obtenir. |
| Essai / rôle / revue | Proposer deux lots de cinq demandes fictives comparables, mêmes critères, second opérateur pour la répétition ; manager d'usage avec RH proposé ; revue après chaque lot, date à convenir. |
| Poursuite / arrêt / prochain pas | Demander un essai fictif préparé ; poursuivre si travail complet favorable avec qualité conservée ; suspendre si accès hors périmètre ou certitude sans preuve ; réviser si le coût du contrôle absorbe le bénéfice. |

Les lots sont à préparer pour un éventuel essai ultérieur ; aucune mesure sur
dix dossiers n'est demandée pendant cette activité.

Révision illustrative après objection : « Nous mesurions seulement la préparation ;
nous ajoutons revue et reprises et différons toute promesse de volume. »

Phrase de transfert : « Pour une offre de service, nous promettrions un brouillon
documenté soumis à revue, avec exclusions explicites ; volume et délai restent
à mesurer avant engagement. »

**Autres angles recevables, déjà proposés par la consigne**

| Angle | Production correcte possible |
| --- | --- |
| Budget de vérification | Demander d'estimer temps de préparation, observation, revue et entretien ; nommer responsable et limite d'engagement à faire approuver ; aucun tarif ou montant inventé. |
| Service borné | Décrire brouillon documenté, critères d'acceptation, revue RH, exclusions d'envoi/écriture ; différer prix, délai et volume tant que preuves et conditions d'usage manquent. |
| Révision ou report | Motiver le report si relecture devient le goulot ou si contrôle/coût absorbent le bénéfice ; préciser la preuve qui permettrait de reconsidérer. |

**Erreurs fréquentes**

Promettre 58,3 % en ne comptant que 12→5 ; traiter 20→16 comme observation
client ; appeler 120/4 un ROI financier ; ignorer échecs et entretien ; confondre
temps humain et délai ; compter deux fois une heure ; faire d'un lot pédagogique
une preuve statistique ; transférer directement un gain RH aux appels d'offres.

**Questions de débrief**

- Comparez-vous le même livrable acceptable ?
- Si la revue est plus longue, que devient le gain et la capacité ?
- Quelle preuve permet de poursuivre, réviser ou arrêter ?
- Quelle condition empêche de vendre ce service aujourd'hui ?

**Principe de correction**

Les quatre repères de la consigne suffisent : besoin, hypothèse testable,
contrôles, prochain pas avec rôle et preuve. Une référence inconnue correctement
signalée est recevable. Aucun gain, lancement de pilote réel ou déploiement
n'est imposé. Si les chiffres illustratifs sont utilisés : 20−16 = 4 min ;
4/20 = 20 % ; 120/4 = 30 dossiers sous hypothèses, pas un résultat réel.

**Knowledge utilisée**

[MET-VALEUR-WORKFLOW](../../../../knowledge/methods/verifier-valeur-workflow.md),
[MET-REVUE-RH](../../../../knowledge/methods/revue-rh-avant-usage.md),
[CAS-RH042-ATELIER](../../../../knowledge/cases/rh-042-dossier-pedagogique.md),
[MET-CHOIX-ORCHESTRATION](../../../../knowledge/methods/comparer-workflow-multi-agents.md).
Sources : [M4-MP02](../content/AOD-M04-MP02.md), [M4-MP03](../content/AOD-M04-MP03.md).

**Transition vers l'activité suivante**

Il n'y a pas d'activité 8. M4-MP04 rassemble hypothèse, risque et preuve en cinq
minutes ; la clôture rassemble les productions. Ne pas refaire la phrase de
transfert, déjà écrite pendant les dix dernières minutes de l'activité 7.

## Conditions de validation du dossier

Les sept corrections sont présentes. Le dossier a été validé par le formateur
le 13 octobre 2026 ; l'adaptation temporelle de l'activité 2, la distribution
progressive et les formulations des sources sont alignées, comme décrit dans
la [matrice de cohérence](MATRICE_COHERENCE_RH042.md).
Les règles réelles, interlocuteurs nommés, contrats, seuils commerciaux et
libellé éventuel d'attestation restent des décisions hors de cet exercice.
Les sources de formation ont été corrigées uniquement pour les ajustements
autorisés ; durées, activités et logique pédagogique sont conservées.

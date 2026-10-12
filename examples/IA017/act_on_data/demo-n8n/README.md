# Test formateur n8n — CAS FICTIF RH-042

**À exécuter et valider par le formateur. MP01 reste BLOCKED_OPERATIONAL.**
Prévoir **15 à 20 minutes**, une fois l’accès disponible ; MP01 conserve ses 20 minutes de séance.

## 1. Ouvrir n8n

Prérequis : navigateur et accès **existant, autorisé pour créer et tester**. Demander au responsable l’adresse n8n et sa version ; ouvrir cette adresse avec l’accès existant. Sans accès : arrêter et signaler « non exécuté — accès manquant ». Ne rien installer ni créer de compte.

## 2. Créer les cinq blocs

Cliquer sur la création de workflow ; nommer celui-ci **CAS FICTIF — RH-042**. Libellés indicatifs selon la version. Pas de JSON importable : format non établi dans Knowledge.

Avec **+**, créer d’abord **Manual Trigger → Edit Fields**, nommé **Données fictives**. Compléter ensuite pour obtenir :

```text
Manual Trigger → Edit Fields « Données fictives » → If « Écart ? »
                                                   ├─ true  → Edit Fields « A — Écart »
                                                   └─ false → Edit Fields « B — Sans écart »
```

1. Dans **Données fictives**, choisir **Manual Mapping** et ajouter ces champs en valeurs fixes :

   | Nom exact | Type | Valeur initiale |
   | --- | --- | --- |
   | dossier | String / texte | RH-042 |
   | compteur | Number / nombre | 8 |
   | valeur_suggeree | Number / nombre | 9 |

2. Cliquer sur **Execute Workflow** (Exécuter le workflow). Ouvrir la sortie de **Données fictives** : vérifier les trois champs.
3. Ajouter **If** après **Données fictives**, puis une condition **Number** : `compteur` **is not equal to / est différent de** `valeur_suggeree`. Glisser ces champs depuis l’entrée dans les deux valeurs : référencer les champs, sans saisir 8 et 9 en constantes. Si l’entrée est vide, exécuter le bloc précédent.
4. Relier **true** à **A — Écart**, **false** à **B — Sans écart**. Dans chaque bloc, choisir **Manual Mapping**, puis ajouter un champ texte fixe `message` :
   - A : `Écart à vérifier — aucune correction`
   - B : `Pas d’écart entre les valeurs de test — aucune correction`

Aucun service externe, API, clé ou donnée RH réelle. La valeur 9 est fictive, non calculée.

## 3. Tester les deux branches

**A :** garder 8 et 9 ; cliquer sur **Execute Workflow**. Vérifier l’entrée de If : 8/9, puis **true → A**, un élément et son message ; aucun élément vers B.

**B :** remplacer seulement `valeur_suggeree` par **8** dans **Données fictives** ; relancer **tout le workflow**. Vérifier l’entrée : 8/8, puis **false → B**, un élément et son message ; aucun élément vers A. Examiner la dernière exécution, pas les anciens résultats. Remettre ensuite 9 pour la démonstration.

À expliquer : « Déclencheur → données → comparaison → décision conditionnelle → branche. Ce workflow suit une règle prédéfinie ; aucun agent autonome n’est démontré. La décision RH reste humaine ; aucune correction ni aucun envoi. »

## 4. Verdict du formateur

Noter **PASS ou FAIL pour chaque ligne**, après observation réelle :

- Workflow ouvert : ___
- Manual Trigger fonctionne : ___
- Données visibles : ___
- Condition If fonctionne : ___
- Branche A vérifiée : ___
- Branche B vérifiée : ___
- Aucune erreur bloquante : ___
- Démonstration compréhensible pour un manager : ___

**PASS global** : huit PASS, deux chemins conformes et explication claire. Sinon **FAIL**, préciser le problème. Non exécuté ≠ PASS.

Transmettre **date, version, environnement/responsable, accès autorisés, résultats A/B et verdict**, avec deux captures montrant valeurs et branches. Pour permettre le passage de MP01 à READY, confirmer explicitement : **« J’ai exécuté les deux tests avec succès et je valide cette démonstration pour MP01. »**

Fond documentaire : [capacités n8n N1–N3](../../../../knowledge/sources/n8n-flux-fictif.md), [candidat fictif existant](../../../../knowledge/tools/n8n-demonstration-fictive.md) et [checklist de l’audit](../../../../docs/PILOTE_INTEGRATION_VCOAC.md#checklist-courte--prochaine-action--test-réel-n8n). Procédure préparée, non exécutée.

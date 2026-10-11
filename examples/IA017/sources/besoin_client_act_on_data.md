# Analyse des Besoins de Formation : Création d'Agents IA pour Managers

## 1. Contexte Client et Audience

**L'Entreprise : Act-On Data**
*   **Secteur :** Conseil et services spécialisés dans la Data RH (People Analytics, Data Hub RH, contrôle de gestion sociale). Filiale d'Act-On Group.
*   **Localisation :** Tour CB21, La Défense (Courbevoie, Paris) / Siège à Neuilly-sur-Seine.
*   **Profil de l'entreprise :** Forte maturité technologique. L'entreprise emploie des Data Scientists, développe déjà des modèles d'IA (machine learning/deep learning) pour le matching de CV, et utilise des outils d'analytics avancés (Power BI, Qlik Sense). Elle est certifiée ISO 27001, soulignant une exigence forte en matière de sécurité.

**Le Public Cible**
*   **Taille du groupe :** 7 personnes.
*   **Profils :** Managers et managers seniors, incluant Nicolas Eimery (Directeur Data & IA).
*   **Niveau de maturité IA :** 
    *   Très acculturés à la donnée.
    *   Déjà familiers avec les LLM (Large Language Models) via des usages individuels.
    *   Connaissent les notions de *prompt engineering* et ont identifié des cas d'usage.
    *   Certains ont des notions sur des outils no-code (ex: n8n).
    *   **Attention :** Ce ne sont pas des profils techniques (développeurs), le programme doit rester conceptuel et stratégique tout en étant pratique, sans basculer dans le code pur.

**Le Contexte Opérationnel et Technologique**
*   **Environnement logiciel :** Microsoft 365. Volonté d'utiliser Copilot, mais licences en attente. Intérêt pour l'intégration de Claude (Anthropic) dans Excel et PowerPoint.
*   **Problématique actuelle :** Situation de **Shadow AI** avérée. Les managers utilisent des outils d'IA non encadrés alors qu'ils manipulent des données personnelles RH extrêmement sensibles. Absence actuelle de charte IA.

---

## 2. Besoins de Formation et Objectifs

### Problématiques à résoudre
1.  **Montée en compétences stratégique :** Passer d'une utilisation basique des LLM (chat) à une compréhension systémique de l'IA agentique (agents autonomes).
2.  **Maîtrise des risques (Sécurité & Légal) :** Sensibiliser urgemment aux risques de la Shadow AI, notamment face au RGPD (Art. 28) et au futur AI Act, d'autant plus avec des données RH.
3.  **Vision Produit / Business :** Comprendre comment l'IA agentique peut transformer la capacité de production interne (appels d'offres, budgets) et comment elle va impacter l'évolution des offres de services vendues à leurs clients.

### Objectifs Pédagogiques Globaux
À l'issue de la formation, les managers devront être capables de :
*   **Définir** avec un vocabulaire commun les concepts clés de l'IA agentique.
*   **Cartographier** et concevoir l'architecture logique d'un agent ou d'un flux de travail agentique.
*   **Évaluer** les risques liés à la sécurité des données (RGPD/Shadow AI) dans l'usage des LLM.
*   **Distinguer** la production de la capacité de production à l'ère de l'IA.

---

## 3. Progression Pédagogique (Concepts abordés)

La progression doit être lente et évolutive pour un public de managers, en partant des concepts de base jusqu'aux architectures complexes.

### Phase 1 : De l'outil à l'Agent (Fondamentaux)
*   *Rappel rapide :* Les LLM et le Prompting avancé.
*   *Concept clé :* **Qu'est-ce qu'un Agent IA ?** Différence entre un chatbot passif et un agent proactif.
*   *Concept clé :* **Le "Soul" ou Persona de l'Agent.** Comment définir l'identité, les contraintes et le rôle d'une IA (ex: création d'un fichier `soul.md` ou `instructions.md`).

### Phase 2 : Connecter l'Agent à son environnement (Connectivité)
*   *Concept clé :* **Les Skills (Compétences).** Comment donner des actions à un agent.
*   *Concept clé :* **Les Connecteurs et Plugins.** Comment l'agent interagit avec l'environnement Microsoft 365 (Copilot, Excel, PowerPoint).
*   *Concept clé :* **Le MCP (Model Context Protocol).** Introduction simplifiée pour comprendre comment un agent accède à des sources de données locales ou distantes de manière standardisée.

### Phase 3 : L'IA Agentique et l'Orchestration (Collaboration)
*   *Concept clé :* **L'approche Multi-Agents.** Comment plusieurs agents collaborent (logiques de supervision, de validation, de routing).
*   *Concept clé :* **Le No-Code / Low-Code pour les agents.** Démonstration et compréhension du rôle des outils comme **n8n** pour orchestrer ces flux sans coder.
*   *Ouverture technique (Démos) :* Comment l'IA écrit du code pour analyser la donnée (ex: *vibe coding*, démonstration de **Claude Code**).

### Phase 4 : Gouvernance, Sécurité et Risques (Cadre Légal)
*   *Concept clé :* **La fuite de données et la propagation.** Le trajet de la donnée lorsqu'elle quitte l'écosystème sécurisé (ex: envoi vers des modèles américains avec des comptes persos).
*   *Concept clé :* **Le Shadow AI.** Les dangers d'une utilisation non réglementée, spécifiquement avec les données RH sensibles (RGPD, Article 28).
*   *Concept clé :* **L'AI Act et l'ISO 27001.** Comment l'entreprise doit "montrer patte blanche" à ses clients et anticiper la conformité.

### Phase 5 : Stratégie et Productivité (Vision Business)
*   *Concept clé :* **Production vs Capacité de production.** Comment l'IA libère du temps et restructure le travail des managers (cas d'usage : appels d'offres, élaboration de budgets).
*   *Concept clé :* **L'impact sur l'offre Act-On Data.** Réflexion sur l'intégration de ces technologies dans les services vendus aux clients.

---

## 4. Modalités Pratiques et Livrables de la Formation

Pour maintenir l'engagement et concrétiser les apprentissages, la formation s'appuiera sur :

*   **Un TP "Fil Rouge" :** Exercice continu utilisant un set de données fictif (généré potentiellement par leurs Data Scientists). Les participants devront concevoir intellectuellement un workflow agentique résolvant un cas d'usage RH fictif.
*   **Support Visuel (Miro) :** Utilisation d'un tableau blanc interactif avec des trames préétablies pour cartographier les architectures agentiques.
*   **Kits à disposition (Drive) :** Un espace partagé bien organisé contenant :
    *   Des templates (ex: gabarit pour le fichier `soul.md`).
    *   Des infographies récapitulatives (architecture MCP, cartographie d'un agent).
    *   Un glossaire pour asseoir le vocabulaire commun.
*   **Démonstrations "Coups de poing" :** Démo en direct de *Claude Code* et d'un flux *n8n* pour créer l'effet "Waouh" et la prise de conscience, sans exiger que les managers les reproduisent eux-mêmes techniquement.
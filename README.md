# 🌿 HomeSense Lite

> **Le confort, mesuré avec soin.**

HomeSense Lite est une application web interactive qui permet d’évaluer simplement le **confort intérieur d'une pièce** à partir de quatre indicateurs : la température, l’humidité, la luminosité et la consommation électrique.

L’objectif est de transformer des mesures simples en un **diagnostic clair**, accompagné de conseils et d’un indice de confort pour chaque paramètre.

---

## ✨ Présentation

**HomeSense Lite** propose un tableau de confort intérieur permettant à l'utilisateur de :

* renseigner les mesures de sa pièce ;
* analyser son niveau de confort ;
* obtenir un score global sur 4 ;
* consulter les résultats détaillés ;
* visualiser les indices sous forme de graphique ;
* générer un rapport imprimable pouvant être enregistré en PDF ;
* passer d'un thème clair à un thème sombre ;
* tester rapidement l'application avec des valeurs d'exemple.

L'interface a été pensée pour rester **simple, lisible et agréable à utiliser**, aussi bien sur ordinateur que sur mobile.

---

## 🎯 Les 4 indicateurs analysés

HomeSense Lite prend en compte quatre paramètres :

| Indicateur      | Unité | Référence utilisée              |
| --------------- | ----: | ------------------------------- |
| 🌡️ Température |    °C | 18 à 26 °C                      |
| 💧 Humidité     |     % | Seuil de vigilance à 70 %       |
| ☀️ Luminosité   |   lux | Repère de 200 lux               |
| ⚡ Consommation  |     W | Surveillance au-dessus de 500 W |

Chaque mesure est analysée individuellement afin de déterminer si elle se trouve dans une situation favorable ou nécessite une attention particulière.

---

## 📊 Diagnostic

Après avoir renseigné les quatre mesures, l'application génère automatiquement un diagnostic.

Le résultat est présenté sous forme d'un **score de 0 à 4** :

* **4/4** → bonnes conditions générales de confort ;
* **2 ou 3/4** → quelques réglages peuvent améliorer le confort ;
* **0 ou 1/4** → plusieurs paramètres nécessitent une attention.

Chaque indicateur est également accompagné d'un message et d'une recommandation.

> Les résultats sont indicatifs et dépendent des valeurs saisies par l'utilisateur.

---

## 📈 Visualisation des résultats

Après une analyse, HomeSense Lite affiche les indices de confort des quatre paramètres dans un **histogramme**.

Les indices sont calculés sur une échelle de **0 à 100 %** afin de faciliter la comparaison entre les différents indicateurs.

Le graphique est réalisé avec **Chart.js**.

---

## 🌙 Mode clair / mode sombre

L'application possède deux thèmes :

* ☀️ mode clair
* 🌙 mode sombre

Le thème sélectionné est enregistré dans le navigateur afin de pouvoir être conservé lors des changements de page.

---

## 📄 Export du diagnostic

HomeSense Lite permet de générer une version imprimable du diagnostic.

Le bouton :

**« Exporter le diagnostic en PDF »**

utilise la fonction d'impression du navigateur. L'utilisateur peut ensuite sélectionner **« Enregistrer au format PDF »**.

Le rapport comprend notamment :

* la date du diagnostic ;
* les quatre mesures ;
* le résultat ;
* les recommandations ;
* le graphique des indices de confort.

---

## 📱 Responsive Design

L'interface s'adapte aux différentes tailles d'écran grâce aux **media queries CSS**.

Le site possède notamment des adaptations pour :

* ordinateurs ;
* tablettes ;
* smartphones.

Sur petit écran, les différentes sections sont réorganisées afin de conserver une navigation confortable.

---

## 🎨 Interface & identité visuelle

HomeSense Lite utilise une direction artistique inspirée d'un univers :

**naturel · minimaliste · élégant · moderne**

La palette principale repose notamment sur :

* vert profond ;
* blanc cassé ;
* gris doux ;
* vert clair ;
* touches de corail.

L'interface utilise également :

* des cartes et panneaux ;
* des bordures légères ;
* des animations d'apparition ;
* un arrière-plan texturé ;
* des formes arrondies ;
* une typographie serif pour certains titres.

L'objectif est de créer une expérience visuelle associant **technologie et confort domestique**.

---

## ⚙️ Technologies utilisées

### Front-end

* **HTML5**
* **CSS3**
* **JavaScript**

### Bibliothèque

* **Chart.js 4.4.9**

Chart.js est chargé depuis le CDN jsDelivr.

### API / fonctionnalités natives utilisées

Le projet utilise également plusieurs fonctionnalités natives du navigateur :

* `localStorage` pour le thème ;
* `window.print()` pour l'export du rapport ;
* `Canvas` pour le graphique ;
* validation HTML des formulaires ;
* `matchMedia` / préférences de mouvement via CSS ;
* `Intl` / `toLocaleString()` pour la date du rapport.

---

## 📂 Structure du projet

```text
HomeSense-Lite/
│
├── index.html
├── style.css
├── script.js
│
└── README.md
```

### `index.html`

Contient la structure de l'application :

* écran de chargement ;
* barre de navigation ;
* présentation de HomeSense Lite ;
* formulaire de mesures ;
* panneau de diagnostic ;
* graphique ;
* bouton d'export ;
* pied de page.

### `style.css`

Gère :

* l'identité visuelle ;
* les couleurs ;
* les cartes ;
* le responsive design ;
* le mode sombre ;
* les animations ;
* la mise en page du rapport imprimable.

### `script.js`

Gère toute la partie interactive :

* calcul des indices ;
* diagnostic ;
* score ;
* recommandations ;
* graphique ;
* changement de thème ;
* compteur de mesures ;
* exemple automatique ;
* export du rapport.

---

## 🚀 Utilisation

### 1. Télécharger le projet

Clonez le dépôt ou téléchargez les fichiers du projet.

### 2. Ouvrir l'application

Ouvrez simplement :

```text
index.html
```

dans un navigateur moderne.

### 3. Effectuer une analyse

Renseignez :

```text
Température
Humidité
Luminosité
Consommation
```

puis cliquez sur :

**« Analyser ma pièce »**

Vous pouvez également utiliser **« Essayer un exemple »** pour lancer immédiatement une analyse avec des valeurs prédéfinies.

---

## 🧮 Exemple intégré

Le bouton d'exemple utilise les valeurs suivantes :

```text
Température : 22 °C
Humidité : 50 %
Luminosité : 350 lux
Consommation : 320 W
```

Ces valeurs permettent de découvrir rapidement le fonctionnement du diagnostic.

---

## 🔐 Données

HomeSense Lite fonctionne principalement côté navigateur.

Les mesures saisies servent à produire le diagnostic affiché à l'écran.

Le thème choisi peut être enregistré dans le `localStorage`.

Les résultats du diagnostic ne constituent pas une base de données distante et ne sont pas envoyés vers un serveur dans la version actuelle.

---

## ⚠️ Limites

HomeSense Lite est un outil de **visualisation et d'aide à l'interprétation**.

Les scores sont calculés à partir de règles simples définies dans JavaScript. Ils ne constituent donc pas une mesure professionnelle ou une certification du confort d'un logement.

Les résultats doivent être considérés comme **indicatifs**.

---

## 🌱 Objectif du projet

HomeSense Lite a été conçu autour d'une idée simple :

> **Mieux comprendre son intérieur pour mieux y vivre.**

Le projet permet de mettre en pratique plusieurs notions du développement web tout en construisant une application ayant une utilisation concrète.

---

## 👤 Auteur

**Fatimata Sané**

Étudiante en Génie Logiciel

---

## 📄 Licence

Ce projet peut être distribué sous **licence MIT** si cette licence est choisie pour le dépôt.

---

# Design — Branding, header unifié, fix lancement USSD

## Context

Voir proposal.md pour le « pourquoi ». L'app est en Expo SDK 57 / React Native 0.86, gestion de thème via variables CSS (`global.css`) + NativeWind, `expo-router` avec un `Stack` natif global dans `app/_layout.tsx`. Les nouveaux assets de marque sont déjà présents dans `assets/meky/` (README fourni). Le bug dialer vient de `src/lib/ussd.ts` qui encode la formule brute et de `app/code/[id].tsx` qui appelle `launchUssd(code.code)` au lieu de la formule substituée.

## Goals / Non-Goals

- **Goals** : employer les assets `assets/meky/` partout, afficher « Meky » (M majuscule), header natif cohérent et sombre en mode dark, lancer l'USSD avec les valeurs substituées.
- **Non-Goals** : ne pas refondre la gestion de thème globale (elle fonctionne), ne pas remplacer le header natif par un header custom React, ne pas ajouter de permissions d'appel.

## Decisions

### D1. Repointer `app.json` plutôt que recopier les assets
Les assets de marque sont dans `assets/meky/`. Deux options : (a) copier `assets/meky/*.png` vers `assets/` en écrasant les placeholders, (b) repointage direct dans `app.json`. 

Choix : **(a) copier vers `assets/`** — les chemins `app.json` existants (`./assets/icon.png`, etc.) restent stables, `git mv` de l'ancien `Identité visuelle.jpg` conservé, et `assets/meky/` reste la source. Alternative (b) rejetée car le README fourni pointe explicitement vers `./assets/...` et le layout de répertoire reste propre.

### D2. Nom « Meky » dans `app.json`
Le champ `expo.name` (`"meky"`) pilote le nom lancé par Android. Changement : `"name": "Meky"`. Le `slug` reste `meky` (identifiant EAS, non visible). Impact release : un rebuild EAS est nécessaire pour que le nouveau nom + icônes apparaissent dans le launcher.

### D3. Splash config dans `app.json`
Le README fournit : `splash.image: ./assets/splash-icon.png`, `resizeMode: contain`, `backgroundColor: #0C1113`. Ajout de la config splash dans `app.json` **et** de la dépendance `expo-splash-screen` (`npx expo install expo-splash-screen`, SDK 57) pour contrôler proprement l'affichage du splash (image + fond `#0C1113` dès le démarrage, pas de flash blanc).

### D4. Header natif adaptatif via `useColorScheme` + `screenOptions`
Le `Stack` global (`app/_layout.tsx`) reçoit des `screenOptions` calculés avec `useColorScheme()` :
- dark : `headerStyle.backgroundColor` = var `--background` dark (`#09090B` ou `#0C1113` marque), `headerTintColor` clair, `headerTitleStyle` idem.
- light : fond `--background` light (`#FAFAFA`).
- `headerTitle: 'Meky'` global, `headerShadowVisible: false` pour un rendu plat cohérent.

Le titre « Exécuter », « Modifier le code » etc. restent dérivés par page via `Stack.Screen options={{ title }}` dans les écrans (déjà en place pour `code/[id].tsx` et `code/new.tsx` via `CodeForm`). Pour respecter la spec « titre Meky partout », on garde le titre global `Meky` et les sous-titres de page restent informatifs ? → tranché ci-dessous (voir D6).

### D5. Icône app sur l'accueil
Option : `headerLeft` custom sur la route `index` qui rend l'icône (le logo `assets/meky/icon.png` via un `<Image>`) à la place du bouton retour. Le bouton retour natif n'apparaissant pas sur la route racine d'un Stack par défaut, `headerLeft` n'est utile que si on veut l'icône en plus. Sinon, plus simple : laisser le header natif sans `headerLeft` sur `index`, l'icône est déjà l'icône d'app dans le launcher.

→ **Décision** : sur `index`, `headerLeft` affiche le logo (petit Image rond, ~26px) avec `headerTitle: 'Meky'` à côté ; sur les sous-pages, retour natif + titre de page. Cohérent avec la demande et sans custom navigation.

### D6. Titres de page vs titre global
La demande « identique à la page de modification du code » pour l'accueil concerne le header. On garde : accueil = `Meky` + logo ; sous-pages = titre de page (« Nouveau code », « Modifier le code », « Exécuter le code »). C'est l'interprétation la plus utile ; la spec app-header le couvre (« icône sur l'accueil », « retour sur les sous-pages »).

### D7. Fix USSD : lancer la formule substituée
- `app/code/[id].tsx` : `launchUssd(preview)` au lieu de `launchUssd(code.code)`.
- `src/lib/ussd.ts` : `launchUssd` encode le code passé (déjà substitué). On garde `sanitizeUssd` (retrait des caractères non `0-9A-Za-z*#` — attention : la substitution doit replacer `{...}` AVANT sanitize ; `substitute` ne produit pas de `{` dans le cas normal, mais si une valeur contient `{` elle serait retirée par sanitize, ce qui est acceptable) et on **assouplit le check `canOpenURL`** :
  - si `canOpenURL` → `openURL` (comportement actuel), en gérant l'erreur d'ouverture effective avec message clair ;
  - sinon → message d'erreur explicite « aucune application téléphone trouvée » (le `throw` actuel).
  - (option conservée) sur Android, on ne force pas `CALL_PHONE`.

### D8. Message d'erreur dialer
Réutiliser l'`Alert` existante dans `[id].tsx` ; le message devient générique et guide : « Aucun dialer disponible… Vérifiez qu'une application Téléphone est installée. » On s'appuie sur `Linking.canOpenURL` → false.

## Risks / Trade-offs

- [Nom « Meky » + nouveaux assets invisibles sans rebuild EAS] → Mitigation : la tâche de rebuild EAS + release est incluse dans tasks.md ; vérifier dans le launcher après install.
- [Header natif sombre selon `useColorScheme` : au moment du rendu initial le thème peut « flasher »] → Mitigation : les couleurs proviennent des variables CSS déjà appliquées par NativeWind ; le header natif les reflète au premier rendu via `useColorScheme` (cohérent avec la spec « changement de thème à chaud »).
- [Copie des assets : `assets/meky/android-icon-monochrome.png` (432×432) référence un mono ; vérifier qu'il est bien accepté par le build EAS] → Mitigation : garder le même format que les assets précédents ; le README confirme ces dimensions.
- [`sanitizeUssd` retire `{}` résiduels si une valeur en contient] → Mitigation : les valeurs utilisateur restent des numéros/montants (types phone/amount/text) ; comportement documenté.
- [Le spike montre qu'un tap « Appeler » reste requis dans le dialer] → attendu, hors scope.

## Migration Plan

1. Copier `assets/meky/*.png` → `assets/` (icon, splash, favicon, adaptive).
2. Éditer `app.json` : `name: "Meky"`, ajouter `splash`.
3. Modifier `app/_layout.tsx` (header adaptatif) et `app/index.tsx` (logo + titre).
4. Corriger `src/lib/ussd.ts` + `app/code/[id].tsx` (substitution) ; tests unitaires additionnés.
5. `npm run typecheck`, `npm test`.
6. Build EAS preview → installer sur appareil → vérifier nom, icône, splash, header dark, exécution USSD.
7. Publier la release (ou nouvelle build) après validation.

## Open Questions

- (résolue) Sous-pages : titres de page conservés (« Nouveau code », « Modifier le code », « Exécuter le code »), accueil = logo + « Meky ».
- (résolue) `expo-splash-screen` ajouté pour un contrôle propre du splash.
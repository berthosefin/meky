## 1. Assets et branding

- [ ] 1.1 Copier les assets de marque `assets/meky/*.png` vers `assets/` (icon, splash-icon, favicon, android-icon-foreground/background/monochrome) en remplacement des placeholders Expo
- [ ] 1.2 Mettre à jour `app.json` : `name: "Meky"` (M majuscule), conserver `slug: "meky"`
- [ ] 1.3 Ajouter la config `splash` dans `app.json` : `image: ./assets/splash-icon.png`, `resizeMode: contain`, `backgroundColor: #0C1113`
- [ ] 1.4 Installer `expo-splash-screen` (`npx expo install expo-splash-screen`) et la configurer (fond `#0C1113`, image de marque)
- [ ] 1.5 Vérifier le rendu des icônes du lanceur et du splash dans le build de test

## 2. Header unifié et adaptatif

- [ ] 2.1 Dans `app/_layout.tsx`, calculer les `screenOptions` du Stack avec `useColorScheme()` : fond du header = variable `--background` du thème (sombre #0C1113 / clair), texte/chevron = couleur adaptée, `headerShadowVisible: false`
- [ ] 2.2 Définir le titre global du header en « Meky » dans le Stack
- [ ] 2.3 Sur `app/index.tsx` (accueil), afficher le logo de l'app (Image depuis les assets de marque) à gauche du header via `headerLeft`/`Stack.Screen options`, sans bouton retour
- [ ] 2.4 Conserver le bouton retour natif et les titres de page sur les sous-pages (Nouveau code, Modifier le code, Exécuter le code)
- [ ] 2.5 Vérifier la bascule sombre/clair du header à chaud (changer le thème du téléphone)

## 3. Correction du lancement USSD

- [ ] 3.1 Dans `app/code/[id].tsx`, lancer `launchUssd(preview)` (formule substituée) au lieu de `launchUssd(code.code)` (formule brute)
- [ ] 3.2 Dans `src/lib/ussd.ts`, assouplir la gestion d'ouverture : si `canOpenURL` est vrai → `openURL` avec gestion de l'erreur effective ; si faux → message explicite « aucun dialer disponible, vérifiez qu'une application Téléphone est installée »
- [ ] 3.3 Vérifier que l'encodage URI (échappement `%23`/`%2A`) s'applique bien à la formule substituée
- [ ] 3.4 Ajouter/mettre à jour les tests unitaires d'`encodeUssdUri` et `launchUssd` (substitution, encodage, cas sans dialer)

## 4. Validation et build

- [ ] 4.1 `npm run typecheck` sans erreur
- [ ] 4.2 `npm test` (tous les tests verts, dont les nouveaux)
- [ ] 4.3 Commit : `feat: apply meky branding, unify header and fix ussd launch`
- [ ] 4.4 Build EAS preview (`eas build --platform android --profile preview`)
- [ ] 4.5 Installer sur appareil et vérifier : nom « Meky », icône, splash dark, header dark/clair, exécution USSD avec valeurs substituées
- [ ] 4.6 Publier la release GitHub avec le nouvel APK (ou mise à jour de la release v1.0.0)
## 1. Assets et branding

- [x] 1.1 Copier les assets de marque `assets/meky/*.png` vers `assets/` (icon, splash-icon, favicon, android-icon-foreground/background/monochrome) en remplacement des placeholders Expo
- [x] 1.2 Mettre à jour `app.json` : `name: "Meky"` (M majuscule), conserver `slug: "meky"`
- [x] 1.3 Ajouter la config `splash` dans `app.json` : `image: ./assets/splash-icon.png`, `resizeMode: contain`, `backgroundColor: #0C1113`
- [x] 1.4 Installer `expo-splash-screen` (`npx expo install expo-splash-screen`) et la configurer (fond `#0C1113`, image de marque)
- [x] 1.5 Vérifier le rendu des icônes du lanceur et du splash dans le build de test

## 2. Header unifié et adaptatif

- [x] 2.1 Dans `app/_layout.tsx`, calculer les `screenOptions` du Stack avec `useColorScheme()` : fond du header = variable `--background` du thème (sombre #0C1113 / clair), texte/chevron = couleur adaptée, `headerShadowVisible: false`
- [x] 2.2 Définir le titre global du header en « Meky » dans le Stack
- [x] 2.3 Sur `app/index.tsx` (accueil), afficher le logo de l'app (Image depuis les assets de marque) à gauche du header via `headerLeft`/`Stack.Screen options`, sans bouton retour
- [x] 2.4 Conserver le bouton retour natif et les titres de page sur les sous-pages (Nouveau code, Modifier le code, Exécuter le code)
- [x] 2.5 Vérifier la bascule sombre/clair du header à chaud (changer le thème du téléphone)

## 3. Correction du lancement USSD

- [x] 3.1 Dans `app/code/[id].tsx`, lancer `launchUssd(preview)` (formule substituée) au lieu de `launchUssd(code.code)` (formule brute)
- [x] 3.2 Dans `src/lib/ussd.ts`, lancer l'intent `android.intent.action.DIAL` directement via `expo-intent-launcher` (contourne `canOpenURL` qui renvoie à tort `false` sous Android 11+ package visibility), avec fallback `Linking.openURL` et messages d'erreur explicites
- [x] 3.3 Vérifier que l'encodage URI (échappement `%23`/`%2A`) s'applique bien à la formule substituée
- [x] 3.4 Ajouter/mettre à jour les tests unitaires d'`encodeUssdUri` et `launchUssd` (substitution, encodage, intent DIAL, fallback, cas sans dialer)

## 4. Validation et build

- [x] 4.1 `npm run typecheck` sans erreur
- [x] 4.2 `npm test` (tous les tests verts, dont les nouveaux)
- [x] 4.3 Commit : `feat: apply meky branding, unify header and fix ussd launch`
- [x] 4.4 Build EAS preview (`eas build --platform android --profile preview`)
- [x] 4.5 Installer sur appareil et vérifier : nom « Meky », icône, splash dark, header dark/clair, exécution USSD avec valeurs substituées
- [x] 4.6 Publier la release GitHub avec le nouvel APK (ou mise à jour de la release v1.0.0)

## 5. Corrections suite au test appareil (cycle 2)

- [x] 5.1 USSD : remplacer la vérification `canOpenURL` (cause de l'erreur « Aucun dialer disponible » sur Android 11+) par l'intent direct `ACTION_DIAL` via `expo-intent-launcher` + fallback `Linking.openURL`
- [x] 5.2 Header accueil : ajouter un espacement (`marginRight`) entre l'icône et le titre « Meky »
- [x] 5.3 Splash : passer les props au plugin `expo-splash-screen` (fond `#0C1113`, image, `imageWidth`, `contain`) et retirer la clé legacy `splash` (invalide en SDK 57) — le plugin était inactif en string seule
- [x] 5.4 `npx expo install --fix` + `expo-font` : 21/21 checks `expo-doctor` ✅
- [x] 5.5 Commit : `fix: launch USSD via ACTION_DIAL intent, pass splash plugin props, gap in header` (`9b7f937`)
- [x] 5.6 Rebuild EAS preview (`b241fb89`) + mise à jour de la release v1.0.0 (`meky.apk`, sha256 ac099e71…)
- [x] 5.7 Re-tester sur appareil : USSD (dialer doit s'ouvrir avec le code substitué), espacement header, splash dark
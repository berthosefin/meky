## 1. Configuration du build

- [x] 1.1 Installer `expo-build-properties` (dépendance de build, ajoutée à `package.json`)
- [x] 1.2 Déclarer le plugin `expo-build-properties` dans `app.json` avec `android.buildArchs: ["arm64-v8a", "armeabi-v7a"]` (→ propriété gradle `reactNativeArchitectures`, appliquée au packaging par le plugin RN)

## 2. Build et vérification

- [x] 2.1 Rebuild EAS preview (`eas build --platform android --profile preview`) — build `d435e94f`
- [x] 2.2 Télécharger l'artefact et contrôler le contenu : taille < 60 MB, `unzip -l` → seules les ABIs `arm64-v8a` + `armeabi-v7a` présentes, `x86`/`x86_64` absentes (design D4.2) — 58,1 MiB, 25/25 .so, sha256 `e54fb3cb`
- [x] 2.3 Installer et lancer l'app sur un device arm64 réel (vérification D4.3) — confirmé par l'utilisateur

## 3. Publication et validation

- [ ] 3.1 Remplacer l'asset `meky.apk` sur la release `v1.0.0` (delete + upload du nouvel APK)
- [ ] 3.2 Mettre à jour la note de release avec le nouvel ID de build EAS (convention du repo, design D3)
- [ ] 3.3 Vérifier le lien `releases/latest/download/meky.apk` (HTTP 200, `content-length` cohérent avec le nouvel APK, design D4.4)
- [ ] 3.4 Commit + push sur `main` (husky : jest + tsc + commitlint) — landing (`docs/`), specs et app code intacts (design Goals/Non-Goals)
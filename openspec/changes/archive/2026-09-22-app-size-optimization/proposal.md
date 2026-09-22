## Why

L'APK universel distribué actuellement pèse 103 MB alors que 81 % de son contenu (bibliothèques natives `.so`) est répété 4 fois, dont ~45 MB d'ABIs x86/x86_64 que seul un émulateur Android exécute. Sur un téléphone réel, ce poids est un frein au téléchargement via la landing et à l'installation sur des appareils modestes.

## What Changes

- Ajouter la dépendance de build `expo-build-properties` et configurer `android.buildArchs` dans `app.json` pour ne conserver que les ABIs utilisées par des téléphones réels : `arm64-v8a` et `armeabi-v7a` (compat 32-bit conservée).
- Résultat attendu : APK universel ≈ 57 MB (au lieu de 103 MB), sans changement de comportement, de fonctionnalités ou d'interface.
- Rebuild EAS (profile `preview`) + remplacement de `meky.apk` sur la release GitHub `v1.0.0` existante (convention du repo : pas de bump de version, la landing cible `releases/latest` sans modification).

## Capabilities

### New Capabilities
*(aucune — comportement utilisateur inchangé)*

### Modified Capabilities
*(aucune — pas de changement de spec)*

Le change est marqué `skip_specs: true` : pure modification de build/config, aucune exigence comportementale ne change.

## Impact

- `package.json` : ajout de `expo-build-properties` (dépendance de **build** uniquement — plugin de config Expo, zéro coût runtime, n'ajoute rien à l'APK).
- `app.json` : plugin `expo-build-properties` avec `android.buildArchs`.
- Pipeline release : rebuild EAS preview → vérification du contenu de l'APK (2 ABIs seulement) → mise à jour de la release `v1.0.0`.
- Aucun impact sur le code applicatif, les specs existantes, la landing (`docs/`) ou la feature « Frais & économies ».
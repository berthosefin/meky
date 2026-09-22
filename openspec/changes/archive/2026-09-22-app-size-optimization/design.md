## Context

Build Expo/React Native Android 0.86 (Expo SDK 57), distribué exclusivement via APK téléchargé depuis la landing (`docs/`). Le profil EAS `preview` (`eas.json`) produit un **APK universel** `buildType: apk` : un seul fichier contenant les libs natives pour toutes les ABIs. Mesuré sur la release `v1.0.0` actuelle : 103 MB dont **79,7 MB de `.so` non compressés** (mmap), répartis en 4 ABIs : x86 23,1 MB · x86_64 22,8 MB · arm64-v8a 22,3 MB · armeabi-v7a 15,3 MB. Les ABIs x86/x86_64 ne sont consommées que par les émulateurs (aucun téléphone réel depuis ~2016). Voir proposal.md — Why.

Contrainte de distribution : la landing pointe vers `https://github.com/berthosefin/meky/releases/latest/download/meky.apk` — **un seul fichier, nommé `meky.apk`, sur la release « Latest »**. Le repo suit une convention : les rebuilds mettent à jour la release `v1.0.0` sans bump de version (commentaire conservé dans le corps de la release avec l'ID de build EAS).

## Goals / Non-Goals

**Goals:**
- Ramener l'APK distribué de ~103 MB à ≈ 57 MB en supprimant uniquement les ABIs que les téléphones réels n'exécutent jamais.
- Conserver un **fichier unique** nommé `meky.apk` et un lien landing inchangé.
- Compatibilité totale conservée sur les téléphones (64-bit **et** 32-bit).

**Non-Goals:**
- Ne pas viser la taille minimale théorique (ex. arm64-only ≈ 42 MB) — sacrifierait les vieux devices 32-bit.
- Ne pas splitter l'APK par ABI (plusieurs fichiers = page de choix sur la landing, hors périmètre).
- Ne pas toucher au code applicatif, aux specs, à la feature « Frais & économies » ni à la landing.
- Pas de bump de version (`v1.0.0` reste).

## Decisions

**D1 — Filtrer les ABIs via `expo-build-properties`** (`android.buildArchs: ["arm64-v8a", "armeabi-v7a"]`), déclaré en plugin dans `app.json`.
- Pourquoi : le plugin écrit la propriété gradle `reactNativeArchitectures` ; le gradle plugin RN (`com.facebook.react`) la lit et l'applique au module app via `defaultConfig.ndk.abiFilters` → **toutes** les libs natives (ReactAndroid, Hermes, AAR tierces type reanimated/MMKV/expo-modules) sont filtrées au packaging. C'est la mécanique supportée et documentée par Expo/RN ; le plugin est une dépendance de build n'ajoutant rien au runtime ni à l'APK.
- Attention : `android.abiFilters` n'existe **pas** dans le schéma de `expo-build-properties` (57.0.21) — une telle clé est ignorée silencieusement (build 103 MB constaté le 2026-09-22, build EAS `6d01347f`). Utiliser impérativement `android.buildArchs`.
- Alternatives : (a) `android.ndk.abiFilters` legacy dans `app.json` — déprécié/support inégal selon SDK ; (b) split d'APK par ABI via gradle `splits` — casse le fichier unique exigé par la landing ; (c) AAB (`app-bundle`) — inutilisable, pas de Play Store.

**D2 — Conserver `armeabi-v7a`** : l'objectif « sans risque » prime. La réduction passe de 103 → 57 MB (on retire 45,9 MB de x86/x86_64) alors que arm64-only économiserait 15,3 MB de plus mais exclurait les rares devices 32-bit encore en circulation — non retenu.

**D3 — Publication via la convention existante** : rebuild `eas build --platform android --profile preview` → téléchargement de l'artefact → remplacement de l'asset `meky.apk` sur la release `v1.0.0` (delete + upload) et mise à jour de la note « Build EAS : <id> » dans le corps de la release. Landing et version intouchées.

**D4 — Vérification exigée avant publication** : (1) taille d'archive < 60 MB ; (2) inspection du contenu (`unzip -l`) : seules les ABIs `arm64-v8a` et `armeabi-v7a` présentes, `x86`/`x86_64` absentes ; (3) installation/test manuel sur un device arm64 ; (4) contrôle du lien `releases/latest/download/meky.apk` (HTTP 200, `content-length` cohérent).

## Risks / Trade-offs

- [App supprimée sur device arm64 (boulette ABI)] → Vérification D4 avant toucher la release ; un device arm64 réel doit installer et lancer l'app.
- [Device 32-bit exclu par erreur] → `armeabi-v7a` est conservé explicitement (D2) ; le contrôle D4.2 liste les 2 ABIs attendues.
- [Plugin `expo-build-properties` non respecté par EAS pour ce profil] → Vérifier sur l'artefact produit (D4.2), pas seulement sur la config.
- [Émulateur/serveur local de dev cassé (seul consommateur de x86)] → Non bloquant : le développement Android via device/émulateur arm64 reste supporté ; un dev x86 pur devrait passer par arm64 image.

## Migration Plan

Sans état à migrer (build uniquement) :
1. Config (app.json + package.json) → commit.
2. Rebuild EAS preview → contrôle D4 → publication release → commit du process éventuel.
3. Rollback : re-push du précédent APK `v1.0.0` (conservé) ou revert du commit config + rebuild.

## Open Questions

Aucune. La seule variable (conserver ou non armeabi-v7a) est tranchée en D2 par l'exigence « sans risque ».
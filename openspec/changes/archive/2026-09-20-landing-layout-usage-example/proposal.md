## Why

Après vérification sur appareil mobile, la landing en production présente trois défauts. Sur mobile, le header et le footer collent aux bords de l'écran (leur `padding` écrase le padding horizontal de `.wrap` par spécificité CSS), et la section hero n'a aucun padding vertical appliqué (l'icône de l'application touche la bordure du header). Surtout, la page ne montre pas le problème réel que Meky résout : un visiteur ne comprend pas à quoi sert l'app avant de l'installer.

## What Changes

- **Fix espacement mobile** : passage aux propriétés logiques CSS (`padding-inline` sur `.wrap`, `padding-block` sur les composants) pour éliminer les conflits de spécificité — header, footer et hero retrouvent leur respiration aux quatre bords
- **Section « exemple d'usage »** ajoutée entre le hero et les features : une formule USSD réaliste à variables (`#111*1*4*1*{NUMERO}*{MONTANT}#`) montrant en 3 étapes le problème résolu — enregistrer la formule une fois, renseigner `{NUMERO}` et `{MONTANT}` quand le besoin revient, et le dialer s'ouvre pré-rempli
- **Langage visuel identique à l'app** : panneau `APERÇU` en `font-mono` dans une carte bordée (comme l'écran d'exécution `app/code/[id].tsx`), chips numérotées cohérentes avec la section install
- **i18n FR/EN** : environ 9 nouvelles clés (`data-i18n`) pour la section exemple
- **Contrat spec** : nouvelle exigence « Illustration du cas d'usage » dans `public-distribution`

## Capabilities

### New Capabilities

<!-- Aucune -->

### Modified Capabilities

- `public-distribution` : ajout de l'exigence « Illustration du cas d'usage » (ADDED) — la landing SHALL présenter un exemple concret du problème résolu (formule USSD à variables, substitution, ouverture du dialer) dans les deux langues.

## Impact

- `docs/index.html` : fix CSS logique (`.wrap`/header/main/footer), nouvelle section « exemple d'usage » (3 cartes numérotées + panneau mono), ~9 nouvelles clés i18n fr/en
- Aucun changement du code applicatif (`src/`, `app.json`), aucune dépendance
- GitHub Pages re-publie automatiquement après push sur `main` ; le lien de téléchargement et les tags OG sont inchangés

## Assumptions

- L'exemple nomme un service réel (« Retrait MVola » / « MVola withdrawal ») pour la crédibilité, tout en gardant la promesse du hero universelle (aucune mention pays dans la description) — choix explicite, tracé ici
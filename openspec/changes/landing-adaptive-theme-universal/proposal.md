## Why

La landing v1 est publiée et vérifiée, mais son cadrage initial heurte le produit sur deux plans. Elle fige un thème sombre unique (`#0C1113` + accents bleus) alors que l'app Meky est entièrement adaptative (mode système via `useColorScheme`, palette zinc clair/sombre dans `global.css`) : le site ne ressemble pas à l'app. Son message « pour Madagascar » restreint l'audience alors que le code applicatif ne contient aucune référence au pays — Meky est un carnet générique de codes USSD.

## What Changes

- **Thème adaptatif sombre/clair** : refonte CSS sur variables calquées sur `global.css` de l'app (`:root` clair + `@media (prefers-color-scheme: dark)`), suivi automatique du système, sans bascule manuelle (comme l'app)
- **Palette app fidèle, zéro bleu** : fond `#09090B` / `#FAFAFA`, cartes `#18181B` / `#FFFFFF`, bouton primary `#E4E4E7` / `#0F172A`, rayons 8 px (carté) / 6 px (boutons), suppression de l'accent `#5BA3FE` et du gradient du titre
- **Logo = icône de l'app** : bascule de `docs/logo.png` (glyphe blanc transparent — invisible en mode clair) vers l'icône opaque `assets/icon.png` copiée en `docs/icon.png`, affichée en squircle dégradé, lisible dans les deux thèmes
- **Message universel** : retrait de toute mention de Madagascar (`<meta name="description">`, `hero.subtitle` FR/EN), mise à jour de la description du dépôt GitHub et retrait du topic `madagascar`
- **Icônes features en SVG line neutres** (`currentColor`) en remplacement des emojis 📴 🚫 📞, dans l'esprit des Ionicons muted de l'app
- **Tags Open Graph** (`og:title`, `og:description`, `og:image` → `icon.png`) pour des aperçus riches lors du partage par messagerie (WhatsApp/Telegram)

## Capabilities

### New Capabilities

<!-- Aucune -->

### Modified Capabilities

- `public-distribution` : l'identité visuelle exigée devient **adaptative** (palette exacte de l'app en sombre et en clair) au lieu d'un fond sombre unique `#0C1113`, avec ajout de l'exigence « Thème adaptatif sombre/clair » (suivi automatique du système, lisible dans les deux thèmes) et du caractère **universel** du message (aucune mention géographique dans le contenu bilingue).

## Impact

- `docs/index.html` : refonte CSS (variables + media query), remplacement du logo (squircle `icon.png`), SVG line icons, texts universalisés, tags OG dans le `<head>`
- `docs/icon.png` ajouté (copie de `assets/icon.png`, 1024×1024), `docs/logo.png` supprimé (asset mort : glyphe blanc transparent)
- `docs/favicon.png` inchangé
- Dépôt GitHub : description réécrite sans mention pays, topic `madagascar` retiré via `gh repo edit`
- Aucun changement du code applicatif (`src/`, `app.json`), aucune dépendance, GitHub Pages re-publie automatiquement après push sur `main`
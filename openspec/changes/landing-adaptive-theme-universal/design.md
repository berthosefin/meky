## Context

Landing v1 publiée et vérifiée sur GitHub Pages (`docs/index.html`, bilingue FR/EN, bouton `releases/latest/download/meky.apk`). Trois faits d'ancrage issus de l'exploration :

- L'app est **entièrement adaptative** : `useColorScheme()` + thème shadcn-zinc dans `global.css` avec `@media (prefers-color-scheme: dark)` ; le header natif reflète les mêmes couleurs (`#09090B` / `#FAFAFA`).
- L'icône de l'app est un **tile opaque `#0C1113` avec un glyphe blanc `#F8F8F8`** (vérifié par analyse des pixels). Le `docs/logo.png` actuel (glyphe blanc sur fond transparent) est illisible sur fond clair `#FAFAFA`.
- Aucun code applicatif ne référence un pays ni un opérateur : Meky est universel ; « Madagascar » ne vit que dans le marketing (landing, description repo, topic).

## Goals / Non-Goals

**Goals**
- Répliquer la palette exacte de l'app en sombre ET en clair, avec suivi automatique du système
- Exposer l'icône réelle de l'application (tile sombre/« glyphe clair ») en squircle, lisible dans les deux thèmes
- Universaliser le message (aucune mention géographique) y compris côté GitHub (description + topic)
- Moderniser les icônes features (SVG line) et préparer les aperçus de partage (Open Graph)

**Non-Goals**
- Bascule manuelle de thème (l'app n'en a pas) ni persistance de thème
- Changer le mécanisme i18n (data-i18n + objets fr/en), le lien de téléchargement ou la structure des sections
- Toucher au code applicatif ni aux specs non concernées de `public-distribution` (téléchargement, installation)

## Decisions

**D1 — CSS variables + `@media (prefers-color-scheme: dark)`, zéro JS pour le thème**
Reproduire exactement le mécanisme de `global.css` : `:root` porte la palette claire, la media query la palette sombre. Les tokens hex sont copiés tels quels depuis `global.css`. L'app suit le système sans toggle ; la landing fait pareil (`color-scheme: light dark` ajouté pour les contrôles natifs/scrollbars).
Alternatives : thème forcé par JS + `data-theme` + localStorage → superset inutile et divergent de l'app ; deux fichiers CSS séparés → surabondant.

**D2 — Palette app fidèle, zéro bleu**
Tous les composants basculent sur les tokens sémantiques : CTA `bg-primary text-primary-foreground` (`#E4E4E7` sur `#18181B` en sombre ; `#0F172A` sur `#F8FAFC` en clair), badges/chips `muted`, cartes `card` + `border`, note `muted-foreground`. Rayons alignés sur l'app : `rounded-lg` 8 px pour les cartes, `rounded-md` 6 px pour les boutons. Suppression du gradient de titre et du halo bleu.
Alternatives : conserver l'accent `#5BA3FE` issu de l'icône → choisi contre par décision utilisateur (fidélité totale à l'app).

**D3 — Logo = tile opaque de l'app en squircle**
Copier `assets/icon.png` → `docs/icon.png` et l'afficher dans un conteneur `border-radius ≈ 24 %` (header 32 px, hero 96 px). Sur fond sombre `#09090B` le tile `#0C1113` est quasi seamless ; sur fond clair il se lit comme une vraie icône d'app. Suppression de `docs/logo.png` (asset mort). Une bordure 1 px `border` très subtile peut ceinturer le tile en mode sombre si le contraste tile/fond est trop faible.
Alternatives : PNG transparent par thème (swap réseau) → complexité inutile ; garder `logo.png` → invisible en mode clair (glyphe blanc).

**D4 — Message universel (landing + GitHub)**
Réécrire `hero.subtitle` (FR/EN) et `meta description` : « carnet de codes USSD » générique. Côté GitHub : `gh repo edit --description` sans mention pays et `--remove-topic madagascar`. Le `title` (« Meky — Carnet de codes USSD ») et le badge (« Gratuit · Hors-ligne · Sans publicité ») restent inchangés.
Alternatives : nod d'origine « Fabriqué à Madagascar » en footer → refusé par décision utilisateur (universalisation totale).

**D5 — Feature icons en SVG line inline**
Trois SVG (`currentColor`, trait 2 px, 64 px) en remplacement des emojis : cloud-off (hors-ligne), ban (sans pub), phone-dial (une touche). Couleur `muted-foreground`, alignées sur le style Ionicons minds de l'app (empty-state).
Alternatives : emojis conservés → choisi contre (divergence stylistique) ; sprite/icon font → dépendance inutile.

**D6 — Tags Open Graph**
`og:title`, `og:description`, `og:image` (URL absolue `https://berthosefin.github.io/meky/icon.png`), `og:type=website`. L'usage dominant du lien est le partage par messagerie — les aperçus WhatsApp/Telegram en dépendent.
Alternatives : ne rien ajouter → aperçus métagénérés pauvres (titre seul).

## Risks / Trade-offs

- [Cache navigateur/Pages sur les anciens assets] → le build Pages régénère le site à chaque push ; fichier versionné/URL unique pour `icon.png` ; vérification post-push avec contrôle du HTML servi.
- [Tile `#0C1113` sur fond `#09090B` peu contrasté en sombre] → bordure 1 px `border` autour du squircle si besoin ; au pire, dégradé `#0C1113` reste reconnaissable.
- [Préférences OS mixtes (app en clair, landing en sombre…)] → comportement identique aux apps natives du système, assumé.
- [OG image mal dimensionnée] → `icon.png` est carré (1024×1024), conforme aux recommandations (≥ 600 px, ratio 1:1).

## Migration Plan

1. Rédaction `docs/index.html` (palette, squircle, SVG icons, textes, OG) + copie `docs/icon.png` + suppression `docs/logo.png`
2. Validation statique (alignement des clés i18n, syntaxe JS)
3. `gh repo edit` (description + retrait topic)
4. Commit + push → Pages rebuild
5. Vérification live : HTTP 200, présence de la media query, description/topics GitHub

Rollback : `git revert` des commits landing + rétablir description/topic GitHub.

## Open Questions

Aucune — toutes les décisions d'approche (palette exacte, icône opaque en squircle, universalisation totale, SVG line, OG tags) ont été tranchées avec l'utilisateur pendant l'exploration.
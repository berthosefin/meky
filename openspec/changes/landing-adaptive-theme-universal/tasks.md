## 1. Métadonnées GitHub

- [x] 1.1 Réécrire la description du dépôt sans mention de pays : `gh repo edit berthosefin/meky --description "Meky — carnet de codes USSD hors-ligne | Offline USSD code book"`
- [x] 1.2 Retirer le topic `madagascar` : `gh repo edit berthosefin/meky --remove-topic madagascar`

## 2. Refonte visuelle de la landing

- [x] 2.1 Copier `assets/icon.png` → `docs/icon.png` et supprimer `docs/logo.png`
- [x] 2.2 Remplacer le CSS par des tokens : `:root` claire + `@media (prefers-color-scheme: dark)` sombre (valeurs hex exactes de `global.css`), propriété `color-scheme: light dark`
- [x] 2.3 Appliquer les sémantiques app : CTA `bg-primary`/`text-primary-foreground`, chips et note en `muted`/`muted-foreground`, cartes `card` + `border`, rayons 8 px (cartes) / 6 px (boutons), suppression du bleu `#5BA3FE` et du gradient de titre
- [x] 2.4 Afficher le logo en squircle dégradé (~24 %) avec `docs/icon.png` (header + hero), bordure `border` subtile en mode sombre

## 3. Icônes features

- [x] 3.1 Remplacer les emojis par 3 SVG line inline en `currentColor` (hors-ligne, sans pub, une touche), couleur `muted-foreground`

## 4. Message universel et partage

- [x] 4.1 Réécrire `hero.subtitle` (FR et EN) et `<meta name="description">` sans mention de Madagascar
- [x] 4.2 Ajouter les tags Open Graph (`og:title`, `og:description`, `og:image` → URL absolue `icon.png`, `og:type`)

## 5. Validation et publication

- [x] 5.1 Valider statiquement : toutes les clés `data-i18n` présentes dans les objets `fr`/`en`, syntaxe JS OK
- [ ] 5.2 Commit + push sur `main`, attendre le rebuild Pages
- [ ] 5.3 Vérifier le site servé (HTTP 200, media query `prefers-color-scheme` présente, squircle `icon.png`) et les métadonnées GitHub (description sans pays, topic retiré)
## 1. Fix espacement (propriétés logiques)

- [ ] 1.1 `.wrap` : remplacer `padding: 0 20px` par `padding-inline: 20px` (max-width et margin inchangés)
- [ ] 1.2 `header.site` : `padding: 16px 0` → `padding-block: 16px`
- [ ] 1.3 `main` : `padding: 52px 0 36px` → `padding-block: 56px 40px` ; dans le media `≤480px`, `padding: 34px 0 22px` → `padding-block: 40px 24px`
- [ ] 1.4 `footer.site` : `padding: 22px 0 36px` → `padding-block: 22px 36px`

## 2. Section « exemple d'usage »

- [ ] 2.1 Insérer une section `<section class="example">` entre le hero et les features, avec titre, lead et 3 cartes numérotées (chips réutilisant le style de la section install)
- [ ] 2.2 Carte ① « Enregistrer une fois » : chip nom de code « Retrait MVola » (FR) / « MVola withdrawal » (EN) + formule mono `#111*1*4*1*{NUMERO}*{MONTANT}#` avec tokens `{…}` en relief
- [ ] 2.3 Carte ② « Quand le besoin revient » : paires `{NUMERO} → 0340000000`, `{MONTANT} → 5000` + panneau `APERÇU` mono `#111*1*4*1*0340000000*5000#` (copie visuelle de l'écran `app/code/[id].tsx`)
- [ ] 2.4 Carte ③ « Le dialer s'ouvre » : texte indiquant le pré-remplissage et « il ne reste qu'à appeler »

## 3. CSS de la section exemple

- [ ] 3.1 Ajouter la variable `--font-mono` (stack `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`) et l'appliquer aux formules/aperçu
- [ ] 3.2 `overflow-x: auto` sur les carrés de formule + taille `0.75rem` dans le media `≤480px` (jamais de `word-break`)
- [ ] 3.3 Styles des cartes : `rounded-lg`, fond `card` + `border`, tokens en `--foreground`/`--muted-foreground`, valeurs substituées sur fond `bg-muted` — aucun accent bleu

## 4. i18n FR/EN

- [ ] 4.1 Ajouter ~9 paires de clés (`example.title`, `example.lead`, `example.step1.name`/`formula`, `example.step2.*`, `example.step3.*`) aux objets `fr`/`en`, insérées avec `data-i18n`
- [ ] 4.2 Vérifier que chaque `data-i18n` de la page existe dans les deux objets

## 5. Validation et publication

- [ ] 5.1 Validation statique : toutes les clés `data-i18n` résolues en `fr`/`en`, syntaxe JS/HTML OK, `prefers-color-scheme` et structure des sections intactes
- [ ] 5.2 Commit + push sur `main`, attendre le rebuild GitHub Pages
- [ ] 5.3 Vérifier sur mobile : header/footer/hero espacés des bords, section exemple servée (HTTP 200), libellés FR/EN corrects
## Context

Landing en production (`docs/index.html`) depuis GitHub Pages, bilingue FR/EN, palette adaptative fidèle à l'app, téléchargement via `releases/latest/download/meky.apk`. Vérification sur appareil mobile (voir proposal.md — Why pour la motivation) :

- Le header et le footer collent aux bords de l'écran : `header.site` / `footer.site` (spécificité 0,1,1) écrasent le `padding: 0 20px` de `.wrap` (0,1,0).
- L'icône du hero touche la bordure du header : `main` (0,0,1) **perd** contre `.wrap`, donc `padding: 52px 0 36px` est du code mort — le hero n'a aucun padding vertical.
- La page ne montre pas le problème résolu par Meky ; un visiteur ne comprend pas l'utilité avant d'installer.

L'app fournit le langage visuel de référence dans `app/code/[id].tsx` : champs de variables, panneau `APERÇU` en `font-mono` dans une carte `rounded-lg border bg-card`, bouton « Exécuter l'USSD » → dialer pré-rempli. La spec delta (ADDED « Illustration du cas d'usage ») exige l'exemple concret bilingue.

## Goals / Non-Goals

**Goals**
- Rétablir la respiration du contenu aux quatre bords (header, footer, hero) via des propriétés logiques, sans combat de spécificité
- Ajouter une section « exemple d'usage » en 3 étapes après le hero, fidèle au rendu de l'app (panneau mono `APERÇU`, chips numérotées déjà utilisées par la section install)
- Documenter le fix par un mécanisme CSS composable plutôt qu'un patch ponctuel

**Non-Goals**
- Toucher au code applicatif (`src/`, `app.json`), au mécanisme i18n existant, au lien de téléchargement, aux tags OG
- Modifier les autres sections de la landing (hero, features, install) ni la palette
- Ajouter un thème manuel ou tout JS de thème

## Decisions

**D1 — Propriétés logiques : `padding-inline` sur `.wrap`, `padding-block` sur les composants**
Le bug vient de la spécificité : `header.site` (0,1,1) > `.wrap` (0,1,0) écrase le padding latéral ; `main` (0,0,1) < `.wrap` se fait voler son padding vertical. La correction sépare les axes :
- `.wrap` → `padding-inline: 20px` (ne gère que X)
- `header.site` → `padding-block: 16px` ; `main` → `padding-block: 56px 40px` ; `footer.site` → `padding-block: 22px 36px` (ne gèrent que Y)
- Media `≤480px` : `main` → `padding-block: 40px 24px`

Les propriétés logiques (`padding-block`/`padding-inline`, longhands) ne se chevauchant jamais sur le même axe, aucun conflit de spécificité ne peut resurgir et les composants restent composables (on peut retirer `.wrap` sans casser le vertical).
Alternatives : padding explicite complet par composant (`padding: 16px 20px`…) → simple mais duplique le 20px et reste fragile à toute évolution de `.wrap` ; réordonner la cascade → cache une fragilité au lieu de la supprimer.
Compatibilité : propriétés logiques supportées par Chrome/WebView depuis 2018 — cible Android sans risque.

**D2 — Section exemple : 3 cartes numérotées qui répliquent l'écran d'exécution de l'app**
Structure verticale, insérée entre `<section class="hero">` et `<section class="features">` :
1. **Enregistrer une fois** — chip « nom du code » + formule mono `#111*1*4*1*{NUMERO}*{MONTANT}#`, tokens `{…}` mis en relief
2. **Quand le besoin revient** — deux paires `{NUMERO} → 0340000000` et `{MONTANT} → 5000`, puis panneau `APERÇU` mono : `#111*1*4*1*0340000000*5000#` (copie visuelle du composant de l'app : `font-mono`, carte `rounded-lg border`, libellé de colonne « Aperçu »)
3. **Le dialer s'ouvre** — texte : pré-rempli, il ne reste qu'à appeler

Les chips numériques réutilisent la classe des étapes de la section install → cohérence de page immédiate. Placement après le hero : l'arc narratif « problème → solution → installation » imprime la valeur avant les arguments.
Alternatives : 2 panneaux avant/après → plus compact mais perd la mise en scène « quand le besoin revient » ; bandeau unique → trop scolaire pour de la landing commerciale.

**D3 — Pile monospace dédiée pour les formules**
La landing n'a pas encore de stack mono. Ajouter `--font-mono` en variable : `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`, appliquée aux carrés de formule et au panneau `APERÇU`, avec `overflow-x: auto` pour les écrans étroits (la formule substituée `#111*1*4*1*0340000000*5000#` dépasse ~320 px en taille normale).
Alternatives : `word-break` sur la formule → casse les tokens, illisible ; réduire seulement la taille en mobile → insuffisant sous 360 px.

**D4 — Mise en relief des tokens, zéro bleu**
Les tokens `{NUMERO}`/`{MONTANT}` sont rendus en `--foreground` gras dans la formule (le reste en `--muted-foreground`), et la version substituée montre les valeurs en `--foreground` dans un fond `bg-muted` — vocabulaire exact de l'app (zinc, aucune teinte bleue).

**D5 — Exemple concret (MVola) + promesse universelle, et i18n**
Le nom du code affiché est « Retrait MVola » (FR) / « MVola withdrawal » (EN) : un service réel rend l'exemple crédible, tandis que le hero et la description restent universels (aucune mention pays) — choix assumé et tracé dans le proposal.
La formule USSD elle-même est identique dans les deux langues (donnée technique) ; seules ~9 paires de clés i18n sont ajoutées (`example.title`, `example.lead`, `example.step1.*`, `example.step2.*`, `example.step3.*`) avec le mécanisme `data-i18n` existant.

## Risks / Trade-offs

- [La section exemple rallonge la landing] → Mitigation : 3 cartes compactes, même hauteur de souffle que la section install existante ; le CTA reste au-dessus du pli.
- [La formule mono déborde sur mobile] → Mitigation : `overflow-x: auto` + taille réduite (`0.75rem`) dans le media `≤480px`, jamais de `word-break`.
- [« MVola » réintroduit une référence de service] → Mitigation : choix utilisateur explicite (crédibilité > abstraction) ; la promesse hero reste universelle ; aucun opérateur mentionné ailleurs.

## Migration Plan

- Change appliqué → push sur `main` → GitHub Pages re-publie `docs/` automatiquement (aucune action de déploiement).
- Rollback : `git revert` du commit de la landing ; le lien de téléchargement et les assets de release ne sont pas affectés (le fix et la section ne touchent que `docs/index.html`).

## Open Questions

Aucune — le wording précis des textes de la section (finition de copie FR/EN) peut être affiné à l'implémentation sans changer ni la spec, ni l'approche, ni les tasks.
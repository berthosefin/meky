## Why

Meky est un carnet de codes USSD universel et hors-ligne. L'utilisateur a identifié un cas d'usage réel chez ses proches : le retrait d'argent mobile à l'agence, dont la grille de frais par paliers rend certains montants coûteux — un retrait peut être optimisé en le découpant en plusieurs retraits plus petits. Exemple vérifié sur la grille embarquée : 101 000 Ar en un retrait coûte 3 400 Ar ; en deux retraits (100 000 + 1 000) il coûte 2 000 Ar, soit 1 400 Ar d'économie.

L'app étant volontairement **universelle** (aucune mention d'opérateur ni de pays dans le produit, le marketing et les specs), cette fonctionnalité doit rester : (a) accessible, (b) **générique et non-marquée** — le barème est présenté comme un tarif de retrait commun, sans nom d'opérateur (MVola/OM/Airtel), (c) **cachée** — elle n'apparaît ni dans la description du produit, ni dans la landing, ni dans les specs publiques ; on la fait découvrir oralement.

## What Changes

- **Nouvel écran « Frais & économies »** (`app/fees.tsx`) : saisie d'un montant de retrait → affichage des frais d'un retrait unique selon le barème embarqué, du **meilleur découpage** (nombre de retraits, montants respectifs, frais de chaque retrait, frais totaux) et de **l'économie réalisée** par rapport au retrait unique
- **Barème embarqué générique** (`src/lib/fees.ts`) : grille de frais par paliers, versionnée avec une date de mise à jour, aucune marque d'opérateur ; état prêt à accueillir d'autres services avec la même structure
- **Optimiseur de découpage** : minimisation des frais totaux sur la grille (pièces = hauts de paliers + reste), sans plafond de nombre de retraits ni de montant (à ajuster si le tarif évolue) ; pièce minimale 100 Ar
- **Entrée discrète** : icône calculatrice dans le header de l'accueil, sans libellé marketing
- **Transparence des données** : date de mise à jour du barème affichée avec une note « vérifier le tarif en vigueur » (l'app est hors-ligne, la grille embarquée vieillit)

## Capabilities

### New Capabilities

- `fees-calculator` : calcul des frais de retrait et du découpage optimal pour un montant saisi, barème générique non-marqué, fraîcheur des données affichée.

### Modified Capabilities

<!-- Aucune -->

## Impact

- `src/lib/fees.ts` : nouvelle donnée (grille versionnée) + logique d'optimisation
- `app/fees.tsx` : nouvel écran ; route ajoutée dans `app/_layout.tsx`
- `app/index.tsx` : entrée discrète (icône calculatrice dans le header de l'accueil)
- Tests unitaires : découpage 101 000 → 2 000 Ar (économie 1 400) ; 240 000 → retrait unique optimal ; montant < 100 Ar → erreur
- **Aucun impact** sur `public-distribution`, la landing, la description du repo ni les topics GitHub (feature cachée) ; aucune dépendance nouvelle

## Assumptions

- Le barème embarqué est la grille de retrait actuelle (captures du 20/09/2026) ; le nom des opérateurs n'apparaît nulle part dans l'écran
- Pas de plafond de retraits, ni de limite quotidienne/d'agence : on ne modélise que les frais par paliers ; ces contraintes seront ajoutées si le tarif évolue
- Montant minimum 100 Ar, montants saisis comme entiers en Ariary
- La feature reste hors du marketing ; seuls les proches en sont informés oralement
- L'interface de l'application est en français (comme le reste de l'app)
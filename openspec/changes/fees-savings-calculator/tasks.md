## 1. Données et logique de calcul

- [x] 1.1 Créer `src/lib/fees.ts` : types `FeeBand`/`FeePlan`, plan `retrait` embarqué (29 paliers, `updatedAt: '2026-09-20'`, `minAmount: 100`, `maxAmount: 20_000_000`) — libellés génériques, aucune marque d'opérateur
- [x] 1.2 Implémenter `feeFor(amount, plan)` (borne basse et haute → erreur/exceptions en amont), et `optimalSplit(amount, plan)` (DP non bornée sur hauts de paliers + reste → `{ pieces[], totalFee, singleFee, savings }`)
- [x] 1.3 Formatage `formatAr(n)` via `Intl.NumberFormat('fr-FR')` + « Ar »

## 2. Tests unitaires

- [x] 2.1 `src/lib/__tests__/fees.test.ts` : 101 000 → `[100 000 (1 900), 1 000 (100)]`, total 2 000, économie 1 400
- [x] 2.2 240 000 → retrait unique optimal (pièces `[240 000]`, économie 0)
- [x] 2.3 500 100 → `[500 000 (4 700), 100 (100)]`, total 4 800, économie 4 000
- [x] 2.4 Bornes : `100` → 100 Ar ; `1 000` → 100 Ar ; `1 001` → 150 Ar ; montant < 100 ou > 20 000 000 → invalide

## 3. Écran « Frais & économies »

- [x] 3.1 Créer `app/fees.tsx` : `ScrollView` + `Input` clavier `numeric` (réutilise `keyboardFor('amount')`), validation (100…20 000 000 Ar) avec message d'erreur
- [x] 3.2 Cartes de résultat : « Retrait unique » (frais), « Découpage optimal » (ligne par retrait : montant + frais, puis frais totaux), « Vous économisez » (montant accentué)
- [x] 3.3 Note discrète en pied : « Barème mis à jour le 20/09/2026 · Vérifiez le tarif en vigueur »
- [x] 3.4 Ajouter la route `<Stack.Screen name="fees" options={{ title: 'Frais & économies' }} />` dans `app/_layout.tsx`

## 4. Entrée discrète sur l'accueil

- [x] 4.1 `headerRight` dans `app/index.tsx` : icône `calculator-outline` (Ionicons, `useIconColor()`, hitSlop) → `router.push('/fees')`, sans libellé commercial

## 5. Validation et publication

- [x] 5.1 Vérifier que l'écran ne contient aucune mention d'opérateur (MVola, OM, Airtel, Telma…) ni de pays
- [x] 5.2 Lancement des tests (jest) + typecheck (tsc) — sans régression des suites existantes
- [ ] 5.3 Commit + push sur `main` ; repo, landing et specs `public-distribution` intacts (feature cachée)
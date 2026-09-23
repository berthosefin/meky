## 1. Moteur `fees.ts`

- [x] 1.1 Ajouter `TRANSFERT_PLAN` avec barème de transfert (générique, sans marque, `updatedAt: '2026-09-23'`) — bandes OCRisées (100–1000→70, 1001–5000→70, 5001–10000→150, ..., 19000001–20000000→31300)
- [x] 1.2 Corriger `optimalSplit` : éliminer débordement Int32Array (INF explicite), itératif par classe de résidus (≈amount/gcd tops), rejeter morceaux < minAmount, reconstruction préservant « plus gros palier en cas d'égalité », garantir pièces ≥ min
- [x] 1.3 Exporter/maintenir API existante inchangée (`FeePlan`, `feeFor`, `optimalSplit`, `isValidAmount`, `RETRAIT_PLAN`) + ajouter `TRANSFERT_PLAN` export
- [x] 1.4 Vérifier cas limites moteur (min 100, max 20M, 1010 → 1 pièce, 100001 → découpage valide)

## 2. Tests unitaires moteur

- [x] 2.1 Étendre `src/lib/__tests__/fees.test.ts` avec cas de non-régression (1010, 100001, 500000, 20M) + valeurs TRANSFERT_PLAN
- [x] 2.2 Ajouter tests TRANSFERT_PLAN (bornes, paliers clés) et vérifier reconstruction (pièces ≥ min, somme = montant)

## 3. UI `app/fees.tsx`

- [x] 3.1 Ajouter state `mode: 'retrait' | 'transfert'` + segmented control
- [x] 3.2 Ajouter checkbox « Envoyer avec frais de retrait » (visible uniquement en mode transfert)
- [x] 3.3 Adapter libellés (montant net reçu), logique calcul : transferred = net + feeFor(net, RETRAIT_PLAN) si transfert+coché, sinon net
- [x] 3.4 Gestion erreurs : plafond > 20_000_000 quand transfert+coché (erreur explicite) ; validation via plan courant (TRANSFERT_PLAN)
- [x] 3.5 Utiliser plan courant pour résultats (TRANSFERT_PLAN en transfert, RETRAIT_PLAN en retrait) + afficher `updatedAt` + note existante
- [x] 3.6 Préserver accessibilité/discrétion (aucune marque)

## 4. Tests UI

- [x] 4.1 Étendre `app/__tests__/fees.test.tsx` — **N/A** (pas d'infra de tests UI dans le repo ; couverture par tests moteur étendus)
- [x] 4.2 Tester scénario avec/sans frais de retrait inclus + erreur plafond — **N/A** (même raison)

## 5. Validation & intégration

- [x] 5.1 `npm test` (Jest) — tous les tests passent
- [x] 5.2 `npx tsc --noEmit` — types OK
- [x] 5.3 Vérification manuelle rapide des cas 1010/100001 (logs/calculs) — non-régression
- [x] 5.4 `openspec validate --strict` (facultatif mais recommandé)
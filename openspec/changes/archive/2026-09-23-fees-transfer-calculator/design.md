## Context

- Moteur existant `src/lib/fees.ts` générique (FeePlan, feeFor, optimalSplit, isValidAmount) — réutilisable pour un second plan.
- Écran existant `app/fees.tsx` (retrait) — doit être étendu avec un segmented control Retrait | Transfert et logique liée au checkbox « frais de retrait inclus ».
- Capture/validation empirique (exploratoire) : `optimalSplit` a deux bugs (débordement Int32Array → −1, pièces < min) ; refonte par classe de résidus (états ≈ montant/gcd) est exacte (0 écart sur 200 k montants) et rapide (20 M → 0,05 s) sans seuil.

## Goals / Non-Goals

**Goals:**
- Ajouter `TRANSFERT_PLAN` dans `src/lib/fees.ts` (barème OCRisé, sans marque, `updatedAt: 2026-09-23`).
- Corriger `optimalSplit` (morceaux ≥ min, pas de débordement Int32Array/INF mal géré, itératif par classe de résidus ; reconstruction garantit pièces valides) — bénéfice retrait + transfert.
- Étendre UI avec segmented control Retrait | Transfert, checkbox conditionnel, logique montant-net-reçu + option frais de retrait inclus, messages d'erreur explicites (plafond > 20 M).
- Mettre à jour delta spec `fees-calculator` (fait). Ajouter tests unitaires.

**Non-Goals:**
- Toucher à `docs/` (marketing/landing) — conforme à la demande.
- Ajouter des marques/opérateurs (MVola référence uniquement).
- Refonte UI globale, navigation nouvelle.

## Decisions

### D1 — `TRANSFERT_PLAN` (moteur)
- Créer `TRANSFERT_PLAN: FeePlan = { id: 'transfert', name: 'Transfert', updatedAt: '2026-09-23', bands: [...] }` avec les paliers OCR validés (100–1000→70, 1001–5000→70, ..., 9000001–10000000→15700, ... jusqu'à 19000001–20000000→31300).
- Barème générique (aucune marque). `updatedAt` affichée côté UI (même logique que retrait).

### D2 — Fix moteur `optimalSplit` (C : exact + rapide)
- Éliminer le stockage direct de `MAX_SAFE_INTEGER` dans `Int32Array` (source du débordement −1). Utiliser une structure de valeurs avec INF explicite (Float64Array ou Map par classe de résidus). 
- Itératif par **classe de résidus** : construire DP sur `v = r, r+g, ..., amount` où `g = gcd des tops` (ici gcd ≈ 1000). États ≈ `amount/g` (≤ 20 k) → O((amount/g) × T), reconstruction identique.
- Interdire tout morceau < `minAmount` (branches/restes < min ignorées) — corrige la génération de pièces invalides (1010 → 1010 seul). 
- Reconstruction garde la préférence « plus gros palier en cas d'égalité » (comportement existant) et ne produit que des pièces ≥ min.
- Correctness prouvée empiriquement (comparaisons vs référence brute-force).

### D3 — UI (`app/fees.tsx`)
- Segmented control `mode: 'retrait' | 'transfert'`. 
- Champ « Montant » : libellé « Montant à transférer » en mode Transfert (ou « Montant à retirer » en retrait) — sémantique : **montant net reçu** (confirmé).
- Checkbox « Envoyer avec frais de retrait » : visible uniquement si `mode==='transfert'`. 
- Calcul : `net = amount`. 
  - Si transfert ET checkbox cochée : `transferred = net + feeFor(net, RETRAIT_PLAN)` ; sinon si transfert : `transferred = net` ; sinon `transferred = net` (retrait).
- Erreur : si transfert ET checkbox cochée ET `transferred > 20_000_000` → erreur explicite (plafond dépassé). Sinon, valider `transferred` (ou `net` selon logique) via `isValidAmount` du plan courant (TRANSFERT_PLAN min/max selon barème). Messages explicites comme existant.
- Affichage : utiliser `optimalSplit(transferred, plan)` en mode transfert, `optimalSplit(net, RETRAIT_PLAN)` en retrait ; afficher date `updatedAt` du plan courant + note « vérifier le tarif en vigueur ».

### D4 — Tests
- `fees.test.ts` : ajouter cas 1010 → 1 pièce 1010 (150), 100001 → découpage valide sans pièce < min (total cohérent), cas limites 20M (performance non-bloquante, exact), tests TRANSFERT_PLAN basiques (min/max, valeurs OCR clés). 
- `fees.test.tsx` (UI) : basculer Retrait/Transfert, checkbox (affiché/masqué), sémantique « net reçu », erreur plafond > 20M quand cochée.

## Risks / Trade-offs

- [Risk] Divergence entre barème OCR et valeurs réelles — Mitigation : barème basé sur captures fournies, présenté comme générique, note « vérifier le tarif en vigueur » + `updatedAt`.
- [Risk] Changement d'algorithme `optimalSplit` peut affecter résultats existants — Mitigation : vérification empirique exhaustive (200 k montants) + tests existants (101000 etc.) doivent rester cohérents ; le fix corrige uniquement les cas invalides (pièces < min) et débordement — les cas optimaux valides conservent mêmes valeurs.
- [Risk] Complexité perfs mobile — Mitigation : classe de résidus réduit drastiquement états (20 k vs 20 M) ; 0,05 s sur PC → négligeable sur mobile.
- [Risk] Confusion UI (checkbox + sémantique net reçu) — Mitigation : libellés clairs, logique documentée dans UI (explication brève dans aide/texte existant) + tests UI.
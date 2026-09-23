## Why

Le calculateur de frais de retrait a révélé deux bugs dans l'optimiseur (`optimalSplit`) : il génère des morceaux < min (pièces non valides) à cause d'un débordement `Int32Array` (MAX_SAFE → -1) entraînant des découpages absurdes (ex. 1010 → 1000+10) et des économies fantômes ; à 20 M Ar le calcul est O(montant×paliers) → blocage UI (~12 s sur PC). Parallèlement, il manque un **écran de calcul des frais de transfert** (complément discret du calculateur retrait), avec la même logique générique de moteur.

## What Changes

- **Moteur générique `fees.ts`** : ajout d'un plan `TRANSFERT_PLAN` (barème de transfert MVola, générique, sans marque d'opérateur) ; correction d'`optimalSplit` (évite morceaux < min, supprime débordement Int32Array, algorithme exact + rapide par classe de résidus, O((montant/gcd) × paliers)) → corrige bugs retrait + transfert.
- **UI `app/fees.tsx`** : ajout d'un **segmented control « Retrait | Transfert »** (même page), case à cocher « Envoyer avec frais de retrait » (uniquement visible en mode Transfert), logique : montant saisi = **montant net reçu par le destinataire** ; si cochée, montant transféré = net + frais_retrait(net) ; sinon transféré = net ; frais de transfert calculés sur le montant transféré. Respect strict de la discrétion (aucune marque).
- **Spec `fees-calculator` (MODIFIED)** : ajout des exigences pour le **calcul des frais de transfert** et l'**option « frais de retrait inclus »**, tout en conservant l'exigence d'entrée discrète et « barème générique non-marqué ».
- **Tests** : ajout/extension de tests unitaires sur `optimalSplit` (cas 1010, 100001, limites 20M) et sur les nouveaux scénarios Transfert (avec/sans frais de retrait inclus).

## Capabilities

### New Capabilities
- *Aucune* (pas de nouvelle capability)

### Modified Capabilities
- `fees-calculator`: Ajout du calcul des frais de **transfert** (barème générique, sans marque d'opérateur), option « frais de retrait inclus » avec sémantique montant-net-reçu, et consolidation du moteur `optimalSplit` (correction bugs + performance exacte/rapide). Les exigences existantes (discrétion, date de mise à jour + note « vérifier le tarif en vigueur », aucune marque) restent applicables au transfert.

## Impact
- `src/lib/fees.ts` (moteur)
- `app/fees.tsx` (UI)
- `openspec/specs/fees-calculator/spec.md` (delta)
- `src/lib/__tests__/fees.test.ts` (tests)
- `app/__tests__/fees.test.tsx` (UI tests) — le cas échéant
export interface FeeBand {
  min: number;
  max: number;
  fee: number;
}

export interface FeePlan {
  id: string;
  name: string;
  updatedAt: string;
  minAmount: number;
  maxAmount: number;
  bands: FeeBand[];
}

export interface SplitPiece {
  amount: number;
  fee: number;
}

export interface SplitResult {
  pieces: SplitPiece[];
  totalFee: number;
  singleFee: number;
  savings: number;
}

/**
 * Barème de retrait générique (non marqué) : aucune référence à un opérateur
 * ou un pays. Mise à jour manuelle quand le tarif évolue : ajuster
 * `updatedAt` et `bands`, puis relivrer l'application.
 */
export const RETRAIT_PLAN: FeePlan = {
  id: 'retrait',
  name: 'Retrait',
  updatedAt: '2026-09-20',
  minAmount: 100,
  maxAmount: 20_000_000,
  bands: [
    { min: 100, max: 1_000, fee: 100 },
    { min: 1_001, max: 5_000, fee: 150 },
    { min: 5_001, max: 10_000, fee: 275 },
    { min: 10_001, max: 20_000, fee: 550 },
    { min: 20_001, max: 25_000, fee: 650 },
    { min: 25_001, max: 50_000, fee: 1_300 },
    { min: 50_001, max: 100_000, fee: 1_900 },
    { min: 100_001, max: 250_000, fee: 3_400 },
    { min: 250_001, max: 500_000, fee: 4_700 },
    { min: 500_001, max: 1_000_000, fee: 8_800 },
    { min: 1_000_001, max: 2_000_000, fee: 14_700 },
    { min: 2_000_001, max: 3_000_000, fee: 19_600 },
    { min: 3_000_001, max: 4_000_000, fee: 24_500 },
    { min: 4_000_001, max: 5_000_000, fee: 29_400 },
    { min: 5_000_001, max: 6_000_000, fee: 34_300 },
    { min: 6_000_001, max: 7_000_000, fee: 39_200 },
    { min: 7_000_001, max: 8_000_000, fee: 44_100 },
    { min: 8_000_001, max: 9_000_000, fee: 49_000 },
    { min: 9_000_001, max: 10_000_000, fee: 53_900 },
    { min: 10_000_001, max: 11_000_000, fee: 59_000 },
    { min: 11_000_001, max: 12_000_000, fee: 64_000 },
    { min: 12_000_001, max: 13_000_000, fee: 69_000 },
    { min: 13_000_001, max: 14_000_000, fee: 74_000 },
    { min: 14_000_001, max: 15_000_000, fee: 79_000 },
    { min: 15_000_001, max: 16_000_000, fee: 84_000 },
    { min: 16_000_001, max: 17_000_000, fee: 89_000 },
    { min: 17_000_001, max: 18_000_000, fee: 94_000 },
    { min: 18_000_001, max: 19_000_000, fee: 98_000 },
    { min: 19_000_001, max: 20_000_000, fee: 100_000 },
  ],
};

/**
 * Barème de transfert générique (non marqué) : référence MVola uniquement,
 * sans marque d'opérateur dans l'application. Mise à jour manuelle : ajuster
 * `updatedAt` et `bands` si le tarif évolue.
 */
export const TRANSFERT_PLAN: FeePlan = {
  id: 'transfert',
  name: 'Transfert',
  updatedAt: '2026-09-23',
  minAmount: 100,
  maxAmount: 20_000_000,
  bands: [
    { min: 100, max: 1_000, fee: 70 },
    { min: 1_001, max: 5_000, fee: 70 },
    { min: 5_001, max: 10_000, fee: 150 },
    { min: 10_001, max: 25_000, fee: 250 },
    { min: 25_001, max: 50_000, fee: 500 },
    { min: 50_001, max: 100_000, fee: 1_000 },
    { min: 100_001, max: 250_000, fee: 1_900 },
    { min: 250_001, max: 500_000, fee: 1_900 },
    { min: 500_001, max: 1_000_000, fee: 3_200 },
    { min: 1_000_001, max: 2_000_000, fee: 3_800 },
    { min: 2_000_001, max: 3_000_000, fee: 5_000 },
    { min: 3_000_001, max: 4_000_000, fee: 6_300 },
    { min: 4_000_001, max: 5_000_000, fee: 7_500 },
    { min: 5_000_001, max: 6_000_000, fee: 9_400 },
    { min: 6_000_001, max: 7_000_000, fee: 10_700 },
    { min: 7_000_001, max: 8_000_000, fee: 12_500 },
    { min: 8_000_001, max: 9_000_000, fee: 14_400 },
    { min: 9_000_001, max: 10_000_000, fee: 15_700 },
    { min: 10_000_001, max: 11_000_000, fee: 16_800 },
    { min: 11_000_001, max: 12_000_000, fee: 17_900 },
    { min: 12_000_001, max: 13_000_000, fee: 19_000 },
    { min: 13_000_001, max: 14_000_000, fee: 20_100 },
    { min: 14_000_001, max: 15_000_000, fee: 21_200 },
    { min: 15_000_001, max: 16_000_000, fee: 22_300 },
    { min: 16_000_001, max: 17_000_000, fee: 23_400 },
    { min: 17_000_001, max: 18_000_000, fee: 24_500 },
    { min: 18_000_001, max: 19_000_000, fee: 25_600 },
    { min: 19_000_001, max: 20_000_000, fee: 31_300 },
  ],
};

/** Montant saisissable (entier, dans les bornes du barème). */
export function isValidAmount(amount: number, plan: FeePlan = RETRAIT_PLAN): boolean {
  return Number.isInteger(amount) && amount >= plan.minAmount && amount <= plan.maxAmount;
}

/** Frais d'un retrait unique. Hors barème → RangeError. */
export function feeFor(amount: number, plan: FeePlan = RETRAIT_PLAN): number {
  for (const band of plan.bands) {
    if (amount >= band.min && amount <= band.max) return band.fee;
  }
  throw new RangeError(`Montant hors barème: ${amount}`);
}

/**
 * Montant réellement transféré pour un montant net reçu par le destinataire.
 * Si l'option « frais de retrait inclus » est activée, l'expéditeur transfère
 * net + frais de retrait(net) ; sinon, il transfère exactement net.
 * Le montant net doit être valide (entier, dans les bornes du barème).
 */
export function transferAmountFor(net: number, includeRetraitFees: boolean): number {
  if (!isValidAmount(net, RETRAIT_PLAN)) {
    throw new RangeError(`Montant net invalide: ${net}`);
  }
  return includeRetraitFees ? net + feeFor(net, RETRAIT_PLAN) : net;
}

/** Frais interne : hors barème → Infinity (utilisé par l'optimiseur). */
function rawFee(amount: number, plan: FeePlan): number {
  for (const band of plan.bands) {
    if (amount >= band.min && amount <= band.max) return band.fee;
  }
  return Infinity;
}

/**
 * Meilleur découpage d'un montant en retraits/minima minimisant les frais totaux.
 * DP itérative par classe de résidus (≈ amount/gcd(tops)) — exact, rapide et sans débordement.
 */
export function optimalSplit(amount: number, plan: FeePlan = RETRAIT_PLAN): SplitResult {
  if (!isValidAmount(amount, plan)) {
    throw new RangeError(`Montant invalide: ${amount}`);
  }

  const tops = plan.bands
    .filter((band) => band.max <= amount)
    .map((band) => band.max)
    .sort((a, b) => a - b);

  if (tops.length === 0) {
    const singleFee = feeFor(amount, plan);
    return { pieces: [{ amount, fee: singleFee }], totalFee: singleFee, singleFee, savings: 0 };
  }

  const minAmt = plan.minAmount;
  const g = tops.length > 0 ? tops[0] : 1;
  const R = amount % g;

  // DP table par valeur (classe de résidus)
  const F = new Map<number, number>();

  for (let v = R; v <= amount; v += g) {
    if (v < minAmt) {
      F.set(v, Number.POSITIVE_INFINITY);
      continue;
    }
    let best = rawFee(v, plan);
    if (!Number.isFinite(best)) best = Number.POSITIVE_INFINITY;
    for (const t of tops) {
      if (t > v) break;
      const rest = v - t;
      if (rest === 0) {
        const cost = rawFee(t, plan);
        if (cost < best) best = cost;
        continue;
      }
      if (rest < minAmt) continue; // interdit pièce < min
      const fRest = F.get(rest);
      if (fRest === undefined) continue;
      if (!Number.isFinite(fRest)) continue;
      const cost = fRest + rawFee(t, plan);
      if (cost < best) best = cost;
    }
    F.set(v, Number.isFinite(best) ? best : Number.POSITIVE_INFINITY);
  }

  const pieces: SplitPiece[] = [];
  let rest = amount;
  while (rest > 0) {
    let best = rawFee(rest, plan);
    if (!Number.isFinite(best)) best = Number.POSITIVE_INFINITY;
    let bestTop = 0;
    for (let i = tops.length - 1; i >= 0; i--) {
      const t = tops[i];
      if (t > rest) continue;
      const r2 = rest - t;
      if (r2 === 0) {
        const cost = rawFee(t, plan);
        if (cost < best) {
          best = cost;
          bestTop = t;
        }
        continue;
      }
      if (r2 < minAmt) continue;
      const fR2 = F.get(r2);
      if (fR2 === undefined || !Number.isFinite(fR2)) continue;
      const cost = fR2 + rawFee(t, plan);
      if (cost < best) {
        best = cost;
        bestTop = t;
      }
    }
    if (bestTop === 0) {
      const fRestSingle = rawFee(rest, plan);
      pieces.push({ amount: rest, fee: fRestSingle });
      rest = 0;
    } else {
      pieces.push({ amount: bestTop, fee: rawFee(bestTop, plan) });
      rest -= bestTop;
    }
  }

  const singleFee = feeFor(amount, plan);
  const totalFeeVal = F.get(amount);
  const totalFee = Number.isFinite(totalFeeVal) ? (totalFeeVal as number) : singleFee;
  return { pieces, totalFee, singleFee, savings: singleFee - totalFee };
}

/** Format « 101 000 Ar » (format français). */
export function formatAr(n: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(n)} Ar`;
}
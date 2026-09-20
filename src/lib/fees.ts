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

/** Frais interne : hors barème → Infinity (utilisé par l'optimiseur). */
function rawFee(amount: number, plan: FeePlan): number {
  for (const band of plan.bands) {
    if (amount >= band.min && amount <= band.max) return band.fee;
  }
  return Infinity;
}

/**
 * Meilleur découpage d'un montant en retraits minimisant les frais totaux.
 * Programmation dynamique non bornée sur les hauts de paliers + retrait seul,
 * par fenêtre glissante (mémoire bornée par le plus grand palier utilisé).
 */
export function optimalSplit(amount: number, plan: FeePlan = RETRAIT_PLAN): SplitResult {
  if (!isValidAmount(amount, plan)) {
    throw new RangeError(`Montant invalide: ${amount}`);
  }

  const tops = plan.bands.filter((band) => band.max <= amount).map((band) => band.max);
  const size = tops.length > 0 ? tops[tops.length - 1] + 1 : 1;
  const F = new Int32Array(size);
  F[0] = 0;

  for (let a = 1; a <= amount; a++) {
    let best = rawFee(a, plan);
    if (!Number.isFinite(best)) best = Number.MAX_SAFE_INTEGER;
    for (const t of tops) {
      if (t > a) break; // tops triés croissants
      const cost = F[(a - t) % size] + rawFee(t, plan);
      if (cost < best) best = cost;
    }
    F[a % size] = best;
  }

  const pieces: SplitPiece[] = [];
  let rest = amount;
  while (rest > 0) {
    let best = rawFee(rest, plan);
    let bestTop = 0;
    // Parcours décroissant : en cas d'égalité, on garde le plus gros palier
    // (moins de retraits à l'écran, total de frais identique).
    for (let i = tops.length - 1; i >= 0; i--) {
      const t = tops[i];
      if (t > rest) continue;
      const cost = F[(rest - t) % size] + rawFee(t, plan);
      if (cost < best) {
        best = cost;
        bestTop = t;
      }
    }
    if (bestTop === 0) {
      pieces.push({ amount: rest, fee: rawFee(rest, plan) });
      rest = 0;
    } else {
      pieces.push({ amount: bestTop, fee: rawFee(bestTop, plan) });
      rest -= bestTop;
    }
  }

  const singleFee = feeFor(amount, plan);
  const totalFee = F[amount % size];
  return { pieces, totalFee, singleFee, savings: singleFee - totalFee };
}

/** Format « 101 000 Ar » (format français). */
export function formatAr(n: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(n)} Ar`;
}
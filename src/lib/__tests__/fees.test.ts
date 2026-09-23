import {
  feeFor,
  formatAr,
  isValidAmount,
  optimalSplit,
  RETRAIT_PLAN,
  transferAmountFor,
  TRANSFERT_PLAN,
} from '../fees';

describe('feeFor', () => {
  it('applies the 100–1 000 band fee', () => {
    expect(feeFor(100, RETRAIT_PLAN)).toBe(100);
    expect(feeFor(1_000, RETRAIT_PLAN)).toBe(100);
  });

  it('applies the 1 001–5 000 band fee', () => {
    expect(feeFor(1_001, RETRAIT_PLAN)).toBe(150);
    expect(feeFor(5_000, RETRAIT_PLAN)).toBe(150);
  });

  it('uses the 100 001–250 000 trap band', () => {
    expect(feeFor(100_001, RETRAIT_PLAN)).toBe(3_400);
    expect(feeFor(250_000, RETRAIT_PLAN)).toBe(3_400);
  });

  it('throws out of range', () => {
    expect(() => feeFor(99, RETRAIT_PLAN)).toThrow(RangeError);
    expect(() => feeFor(20_000_001, RETRAIT_PLAN)).toThrow(RangeError);
  });
});

describe('isValidAmount', () => {
  it('accepts bounds and rejects outside + non-integers', () => {
    expect(isValidAmount(100, RETRAIT_PLAN)).toBe(true);
    expect(isValidAmount(20_000_000, RETRAIT_PLAN)).toBe(true);
    expect(isValidAmount(99, RETRAIT_PLAN)).toBe(false);
    expect(isValidAmount(20_000_001, RETRAIT_PLAN)).toBe(false);
    expect(isValidAmount(100.5, RETRAIT_PLAN)).toBe(false);
  });
});

describe('optimalSplit', () => {
  it('splits 101 000 into 100 000 + 1 000 saving 1 400', () => {
    const result = optimalSplit(101_000, RETRAIT_PLAN);
    expect(result.pieces.map((p) => p.amount)).toEqual([100_000, 1_000]);
    expect(result.pieces.map((p) => p.fee)).toEqual([1_900, 100]);
    expect(result.totalFee).toBe(2_000);
    expect(result.singleFee).toBe(3_400);
    expect(result.savings).toBe(1_400);
  });

  it('keeps 240 000 as a single withdrawal (no saving)', () => {
    const result = optimalSplit(240_000, RETRAIT_PLAN);
    expect(result.pieces.map((p) => p.amount)).toEqual([240_000]);
    expect(result.totalFee).toBe(3_400);
    expect(result.savings).toBe(0);
  });

  it('splits 500 100 into 500 000 + 100 saving 4 000', () => {
    const result = optimalSplit(500_100, RETRAIT_PLAN);
    expect(result.pieces.map((p) => p.amount)).toEqual([500_000, 100]);
    expect(result.pieces.map((p) => p.fee)).toEqual([4_700, 100]);
    expect(result.totalFee).toBe(4_800);
    expect(result.singleFee).toBe(8_800);
    expect(result.savings).toBe(4_000);
  });

  it('splits 5 100 into 5 000 + 100 saving 25', () => {
    const result = optimalSplit(5_100, RETRAIT_PLAN);
    expect(result.pieces.map((p) => p.amount)).toEqual([5_000, 100]);
    expect(result.totalFee).toBe(250);
    expect(result.singleFee).toBe(275);
    expect(result.savings).toBe(25);
  });

  it('splits 10 001 into 1 000 + 9 001 saving 175', () => {
    const result = optimalSplit(10_001, RETRAIT_PLAN);
    expect(result.pieces.map((p) => p.amount)).toEqual([1_000, 9_001]);
    expect(result.totalFee).toBe(375);
    expect(result.singleFee).toBe(550);
    expect(result.savings).toBe(175);
  });

  it('splits 250 001 into 1 000 + 249 001 saving 1 200', () => {
    const result = optimalSplit(250_001, RETRAIT_PLAN);
    expect(result.pieces.map((p) => p.amount)).toEqual([1_000, 249_001]);
    expect(result.totalFee).toBe(3_500);
    expect(result.singleFee).toBe(4_700);
    expect(result.savings).toBe(1_200);
  });

  it('handles the minimum and maximum bounds', () => {
    const min = optimalSplit(100, RETRAIT_PLAN);
    expect(min.pieces).toEqual([{ amount: 100, fee: 100 }]);
    expect(min.savings).toBe(0);

    const max = optimalSplit(20_000_000, RETRAIT_PLAN);
    expect(max.totalFee).toBe(100_000);
    expect(max.savings).toBe(0);
  });

  it('throws for invalid amounts', () => {
    expect(() => optimalSplit(99, RETRAIT_PLAN)).toThrow(RangeError);
    expect(() => optimalSplit(20_000_001, RETRAIT_PLAN)).toThrow(RangeError);
  });
});

describe('optimalSplit — non-régression (bugs corrigés)', () => {
  it('keeps 1 010 as a single withdrawal (no invalid piece < min)', () => {
    const result = optimalSplit(1_010, RETRAIT_PLAN);
    expect(result.pieces.map((p) => p.amount)).toEqual([1_010]);
    expect(result.totalFee).toBe(150);
    expect(result.savings).toBe(0);
  });

  it('splits 100 001 without producing a piece below the minimum', () => {
    const result = optimalSplit(100_001, RETRAIT_PLAN);
    const pieces = result.pieces;
    expect(pieces.every((p) => p.amount >= RETRAIT_PLAN.minAmount)).toBe(true);
    expect(pieces.reduce((s, p) => s + p.amount, 0)).toBe(100_001);
    expect(pieces.reduce((s, p) => s + p.fee, 0)).toBe(result.totalFee);
    expect(result.totalFee).toBeLessThan(result.singleFee);
  });

  it('handles 500 000 and the 20 000 000 ceiling', () => {
    const half = optimalSplit(500_000, RETRAIT_PLAN);
    expect(half.pieces.map((p) => p.amount)).toEqual([500_000]);

    const max = optimalSplit(20_000_000, RETRAIT_PLAN);
    expect(max.totalFee).toBe(100_000);
    expect(max.savings).toBe(0);
    expect(max.pieces.every((p) => p.amount >= RETRAIT_PLAN.minAmount)).toBe(true);
    expect(max.pieces.reduce((s, p) => s + p.amount, 0)).toBe(20_000_000);
  });
});

describe('TRANSFERT_PLAN', () => {
  const TRF = TRANSFERT_PLAN;

  it('is non-branded and carries an update date', () => {
    expect(TRF.id).toBe('transfert');
    expect(TRF.name).toBe('Transfert');
    expect(TRF.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('applies OCR-ed band fees', () => {
    expect(feeFor(100, TRF)).toBe(70);
    expect(feeFor(1_000, TRF)).toBe(70);
    expect(feeFor(1_001, TRF)).toBe(70);
    expect(feeFor(5_000, TRF)).toBe(70);
    expect(feeFor(5_001, TRF)).toBe(150);
    expect(feeFor(10_000, TRF)).toBe(150);
    expect(feeFor(10_001, TRF)).toBe(250);
    expect(feeFor(25_000, TRF)).toBe(250);
    expect(feeFor(25_001, TRF)).toBe(500);
    expect(feeFor(50_000, TRF)).toBe(500);
  });

  it('validates bounds and throws out of range', () => {
    expect(isValidAmount(100, TRF)).toBe(true);
    expect(isValidAmount(20_000_000, TRF)).toBe(true);
    expect(isValidAmount(99, TRF)).toBe(false);
    expect(isValidAmount(20_000_001, TRF)).toBe(false);
    expect(() => feeFor(99, TRF)).toThrow(RangeError);
    expect(() => feeFor(20_000_001, TRF)).toThrow(RangeError);
  });

  it('splits amounts with valid pieces and coherent totals', () => {
    const cases = [101_000, 1_500_000, 20_000_000];
    for (const amount of cases) {
      const r = optimalSplit(amount, TRF);
      expect(r.pieces.every((p) => p.amount >= TRF.minAmount)).toBe(true);
      expect(r.pieces.reduce((s, p) => s + p.amount, 0)).toBe(amount);
      expect(r.pieces.reduce((s, p) => s + p.fee, 0)).toBe(r.totalFee);
      expect(r.totalFee).toBeLessThanOrEqual(r.singleFee);
    }
  });

  it('optimizes 101 000 into 100 000 + 1 000', () => {
    const result = optimalSplit(101_000, TRF);
    expect(result.pieces.map((p) => p.amount)).toEqual([100_000, 1_000]);
    expect(result.totalFee).toBe(1_070);
    expect(result.singleFee).toBe(1_900);
    expect(result.savings).toBe(830);
  });

  it('splits 10 000 into 5 000 + 5 000 (2×70 < 150)', () => {
    // Cas subtil : en transfert, découper au niveau du palier bat le single
    // (contrairement au retrait où 10 000 reste unique).
    const result = optimalSplit(10_000, TRF);
    expect(result.pieces.map((p) => p.amount)).toEqual([5_000, 5_000]);
    expect(result.totalFee).toBe(140);
    expect(result.singleFee).toBe(150);
    expect(result.savings).toBe(10);
  });

  it('splits 25 001 into 5 000 + 20 001 saving 180', () => {
    const result = optimalSplit(25_001, TRF);
    expect(result.pieces.map((p) => p.amount)).toEqual([5_000, 20_001]);
    expect(result.totalFee).toBe(320);
    expect(result.singleFee).toBe(500);
    expect(result.savings).toBe(180);
  });

  it('splits 50 001 into 25 000 + 5 000 + 20 001 saving 430', () => {
    const result = optimalSplit(50_001, TRF);
    expect(result.pieces.map((p) => p.amount)).toEqual([25_000, 5_000, 20_001]);
    expect(result.totalFee).toBe(570);
    expect(result.singleFee).toBe(1_000);
    expect(result.savings).toBe(430);
  });

  it('splits 500 001 into 5 000 + 495 001 saving 1 230', () => {
    const result = optimalSplit(500_001, TRF);
    expect(result.pieces.map((p) => p.amount)).toEqual([5_000, 495_001]);
    expect(result.totalFee).toBe(1_970);
    expect(result.singleFee).toBe(3_200);
    expect(result.savings).toBe(1_230);
  });

  it('splits 1 001 000 into 1 000 000 + 1 000 saving 530', () => {
    const result = optimalSplit(1_001_000, TRF);
    expect(result.pieces.map((p) => p.amount)).toEqual([1_000_000, 1_000]);
    expect(result.totalFee).toBe(3_270);
    expect(result.singleFee).toBe(3_800);
    expect(result.savings).toBe(530);
  });

  it('splits 2 000 001 into 5 000 + 1 995 001 saving 1 130', () => {
    const result = optimalSplit(2_000_001, TRF);
    expect(result.pieces.map((p) => p.amount)).toEqual([5_000, 1_995_001]);
    expect(result.totalFee).toBe(3_870);
    expect(result.singleFee).toBe(5_000);
    expect(result.savings).toBe(1_130);
  });

  it('splits 20 000 000 into 18 000 000 + 2 000 000 (ceiling no longer frozen)', () => {
    const result = optimalSplit(20_000_000, TRF);
    expect(result.pieces.map((p) => p.amount)).toEqual([18_000_000, 2_000_000]);
    expect(result.totalFee).toBe(28_300);
    expect(result.singleFee).toBe(31_300);
    expect(result.savings).toBe(3_000);
  });

  it('keeps 1 010 and 1 001 as single transfers (no invalid piece)', () => {
    expect(optimalSplit(1_010, TRF).pieces.map((p) => p.amount)).toEqual([1_010]);
    expect(optimalSplit(1_001, TRF).pieces.map((p) => p.amount)).toEqual([1_001]);
  });

  it('throws for invalid amounts', () => {
    expect(() => optimalSplit(99, TRF)).toThrow(RangeError);
    expect(() => optimalSplit(20_000_001, TRF)).toThrow(RangeError);
  });
});

describe('transferAmountFor', () => {
  it('returns the net amount when retrait fees are not included', () => {
    expect(transferAmountFor(10_000, false)).toBe(10_000);
    expect(transferAmountFor(100_001, false)).toBe(100_001);
    expect(transferAmountFor(20_000_000, false)).toBe(20_000_000);
  });

  it('adds the retrait fee on the net amount when included', () => {
    expect(transferAmountFor(1_000, true)).toBe(1_100); // 1 000 + 100
    expect(transferAmountFor(5_001, true)).toBe(5_276); // 5 001 + 275
    expect(transferAmountFor(100_001, true)).toBe(103_401); // 100 001 + 3 400
    expect(transferAmountFor(250_001, true)).toBe(254_701); // 250 001 + 4 700
  });

  it('reaches the 20 000 000 ceiling exactly from 19 900 000 net', () => {
    expect(transferAmountFor(19_900_000, true)).toBe(20_000_000);
  });

  it('exceeds the ceiling from a 20 000 000 net — UI must show an explicit error', () => {
    expect(transferAmountFor(20_000_000, true)).toBeGreaterThan(TRANSFERT_PLAN.maxAmount);
  });

  it('throws for invalid net amounts', () => {
    expect(() => transferAmountFor(99, true)).toThrow(RangeError);
    expect(() => transferAmountFor(20_000_001, false)).toThrow(RangeError);
    expect(() => transferAmountFor(100.5, true)).toThrow(RangeError);
  });
});

describe('formatAr', () => {
  it('formats with french separators and the Ar unit', () => {
    expect(normalizeSpaces(formatAr(101_000))).toBe('101 000 Ar');
    expect(normalizeSpaces(formatAr(1_000))).toBe('1 000 Ar');
    expect(normalizeSpaces(formatAr(100))).toBe('100 Ar');
  });
});

function normalizeSpaces(value: string): string {
  // Intl.NumberFormat('fr-FR') may emit a narrow no-break space (U+202F).
  return value.replace(/\s/g, ' ');
}
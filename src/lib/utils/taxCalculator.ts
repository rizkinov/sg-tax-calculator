export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export const PROGRESSIVE_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 20000, rate: 0 },
  { min: 20001, max: 30000, rate: 0.02 },
  { min: 30001, max: 40000, rate: 0.035 },
  { min: 40001, max: 80000, rate: 0.07 },
  { min: 80001, max: 120000, rate: 0.115 },
  { min: 120001, max: 160000, rate: 0.15 },
  { min: 160001, max: 200000, rate: 0.18 },
  { min: 200001, max: 240000, rate: 0.19 },
  { min: 240001, max: 280000, rate: 0.195 },
  { min: 280001, max: 320000, rate: 0.20 },
  { min: 320001, max: null, rate: 0.22 },
];

export const CORPORATE_TAX_RATE = 0.17;

export type TaxPayerType = 'EMPLOYEE' | 'SOLE_PROPRIETOR' | 'CORPORATION';

export function calculateTax(income: number, type: TaxPayerType): number {
  if (type === 'CORPORATION') {
    return income * CORPORATE_TAX_RATE;
  }

  let totalTax = 0;
  let remainingIncome = income;

  for (const bracket of PROGRESSIVE_TAX_BRACKETS) {
    if (remainingIncome <= 0) break;

    const taxableInThisBracket = bracket.max 
      ? Math.min(remainingIncome, bracket.max - bracket.min + 1)
      : remainingIncome;

    totalTax += taxableInThisBracket * bracket.rate;
    remainingIncome -= taxableInThisBracket;
  }

  return totalTax;
}

export function calculateTaxBreakdown(income: number, type: TaxPayerType): {
  bracket: TaxBracket;
  taxableAmount: number;
  taxForBracket: number;
}[] {
  if (type === 'CORPORATION') {
    return [{
      bracket: { min: 0, max: null, rate: CORPORATE_TAX_RATE },
      taxableAmount: income,
      taxForBracket: income * CORPORATE_TAX_RATE
    }];
  }

  const breakdown: {
    bracket: TaxBracket;
    taxableAmount: number;
    taxForBracket: number;
  }[] = [];
  let remainingIncome = income;

  for (const bracket of PROGRESSIVE_TAX_BRACKETS) {
    if (remainingIncome <= 0) break;

    const taxableInThisBracket = bracket.max 
      ? Math.min(remainingIncome, bracket.max - bracket.min + 1)
      : remainingIncome;

    if (taxableInThisBracket > 0) {
      breakdown.push({
        bracket,
        taxableAmount: taxableInThisBracket,
        taxForBracket: taxableInThisBracket * bracket.rate
      });
    }

    remainingIncome -= taxableInThisBracket;
  }

  return breakdown;
} 
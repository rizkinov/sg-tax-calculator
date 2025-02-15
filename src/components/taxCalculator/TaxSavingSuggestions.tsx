'use client';

import { formatCurrency } from "@/lib/utils";
import { PROGRESSIVE_TAX_BRACKETS, TaxBracket } from "@/lib/utils/taxCalculator";
import { Card } from "@/components/ui/card";

interface TaxSavingSuggestionsProps {
  income: number;
  currentRelief: number;
  taxableIncome: number;
}

export function TaxSavingSuggestions({ income, currentRelief, taxableIncome }: TaxSavingSuggestionsProps) {
  // Find current tax bracket
  const currentBracket = PROGRESSIVE_TAX_BRACKETS.find(
    bracket => taxableIncome > bracket.min && (!bracket.max || taxableIncome <= bracket.max)
  );

  // Find previous bracket
  const previousBracket = PROGRESSIVE_TAX_BRACKETS.find(
    bracket => currentBracket && bracket.max === currentBracket.min
  );

  // Early return if no valid brackets found or if already in lowest bracket
  if (!currentBracket || !previousBracket || !previousBracket.max || currentBracket.rate <= previousBracket.rate) {
    return null;
  }

  // Calculate how much more relief needed to drop to lower bracket
  const reliefNeeded = taxableIncome - previousBracket.max;
  const maxAdditionalRelief = Math.min(
    reliefNeeded,
    16000 - (currentRelief || 0) // Assuming max total relief of $16,000
  );

  if (maxAdditionalRelief <= 0) {
    return null;
  }

  // Calculate potential tax savings
  const currentTax = taxableIncome * currentBracket.rate;
  const potentialTaxableIncome = taxableIncome - maxAdditionalRelief;
  const potentialTax = potentialTaxableIncome * previousBracket.rate;
  const savings = currentTax - potentialTax;

  return (
    <Card className="p-4 bg-muted/50">
      <h3 className="font-semibold text-lg mb-2">Tax Saving Opportunity</h3>
      <div className="space-y-2">
        <p>
          You are currently in the {(currentBracket.rate * 100).toFixed(1)}% tax bracket.
        </p>
        <p>
          By contributing an additional {formatCurrency(maxAdditionalRelief)} to your eligible tax relief,
          you could move to the {(previousBracket.rate * 100).toFixed(1)}% tax bracket.
        </p>
        <p className="font-medium text-primary">
          Potential tax savings: {formatCurrency(savings)}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Consider topping up your CPF or SRS to maximize your tax savings.
          Consult a tax professional for personalized advice.
        </p>
      </div>
    </Card>
  );
} 
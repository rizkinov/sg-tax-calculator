'use client';

import { formatCurrency } from "@/lib/utils";
import { PROGRESSIVE_TAX_BRACKETS } from "@/lib/utils/taxCalculator";
import { Card } from "@/components/ui/card";

interface TaxSavingSuggestionsProps {
  income: number;
  currentRelief: number;
  taxableIncome: number;
}

export function TaxSavingSuggestions({ income, currentRelief, taxableIncome }: TaxSavingSuggestionsProps) {
  const MAX_CPF_RELIEF = 16000; // $8,000 own + $8,000 family
  const MAX_SRS_FOREIGNER = 35700;
  const TOTAL_MAX_RELIEF = MAX_CPF_RELIEF + MAX_SRS_FOREIGNER; // $51,700

  // Don't show suggestions if income is too low to be taxed
  if (taxableIncome <= 20000) {
    return null;
  }

  // Find current tax bracket
  const currentBracket = PROGRESSIVE_TAX_BRACKETS.find(
    bracket => taxableIncome >= bracket.min && (bracket.max === null || taxableIncome <= bracket.max)
  );

  if (!currentBracket) return null;

  // Find the next lower bracket
  const currentBracketIndex = PROGRESSIVE_TAX_BRACKETS.indexOf(currentBracket);
  if (currentBracketIndex <= 0) return null;

  const previousBracket = PROGRESSIVE_TAX_BRACKETS[currentBracketIndex - 1];
  if (!previousBracket.max) return null;

  // Calculate remaining relief capacity
  const remainingReliefCapacity = TOTAL_MAX_RELIEF - currentRelief;
  const isOverLimit = currentRelief > TOTAL_MAX_RELIEF;

  // Calculate how much relief needed to drop to lower bracket
  const reliefNeeded = taxableIncome - previousBracket.max;
  if (reliefNeeded <= 0) return null;

  // Calculate suggested relief and potential savings
  const suggestedRelief = Math.min(reliefNeeded, Math.max(0, remainingReliefCapacity));
  const currentTaxRate = currentBracket.rate;
  const lowerTaxRate = previousBracket.rate;
  const potentialSavings = reliefNeeded * (currentTaxRate - lowerTaxRate);

  // Only show if there are meaningful savings
  if (potentialSavings <= 0) return null;

  return (
    <Card className="p-4 bg-muted/50">
      <h3 className="font-semibold text-lg mb-2">Tax Saving Opportunity</h3>
      <div className="space-y-2">
        <p>
          You are currently in the {(currentBracket.rate * 100).toFixed(1)}% tax bracket.
        </p>
        {isOverLimit ? (
          <p className="text-destructive">
            Your current relief (${formatCurrency(currentRelief)}) exceeds the maximum combined limit of ${formatCurrency(TOTAL_MAX_RELIEF)}.
            Consider adjusting your relief contributions to stay within the limits.
          </p>
        ) : suggestedRelief > 0 ? (
          <p>
            By contributing an additional {formatCurrency(suggestedRelief)} to your eligible tax relief,
            you could move to the {(previousBracket.rate * 100).toFixed(1)}% tax bracket.
          </p>
        ) : (
          <p>
            You need to reduce your taxable income by {formatCurrency(reliefNeeded)} to move to the {(previousBracket.rate * 100).toFixed(1)}% tax bracket.
          </p>
        )}
        <p className="font-medium text-primary">
          Potential tax savings: {formatCurrency(potentialSavings)}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Maximum relief limits:
          <ul className="list-disc ml-6 mt-1">
            <li>CPF Cash Top-up: Up to $16,000 ($8,000 own account + $8,000 family members)</li>
            <li>SRS Contributions: Up to $35,700 for Foreigners, $15,300 for Citizens & PR</li>
          </ul>
          Consult a tax professional for personalized advice.
        </p>
      </div>
    </Card>
  );
} 
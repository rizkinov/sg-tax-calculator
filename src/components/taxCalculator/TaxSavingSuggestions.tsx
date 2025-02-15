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
  const remainingReliefCapacity = 16000 - currentRelief;
  if (remainingReliefCapacity <= 0) return null;

  // Calculate how much relief needed to drop to lower bracket
  const reliefNeeded = taxableIncome - previousBracket.max;
  if (reliefNeeded <= 0) return null;

  const suggestedRelief = Math.min(reliefNeeded, remainingReliefCapacity);

  // Calculate potential savings
  const currentTaxRate = currentBracket.rate;
  const lowerTaxRate = previousBracket.rate;
  const potentialSavings = (suggestedRelief * currentTaxRate) - (suggestedRelief * lowerTaxRate);

  return (
    <Card className="p-4 bg-muted/50">
      <h3 className="font-semibold text-lg mb-2">Tax Saving Opportunity</h3>
      <div className="space-y-2">
        <p>
          You are currently in the {(currentBracket.rate * 100).toFixed(1)}% tax bracket.
        </p>
        <p>
          By contributing an additional {formatCurrency(suggestedRelief)} to your eligible tax relief,
          you could move to the {(previousBracket.rate * 100).toFixed(1)}% tax bracket.
        </p>
        <p className="font-medium text-primary">
          Potential tax savings: {formatCurrency(potentialSavings)}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Consider topping up your CPF (up to $8,000 for own account, $8,000 for family members) 
          or SRS (up to $15,300 for Citizens & PR, $35,700 for Foreigners) to maximize your tax savings.
          Consult a tax professional for personalized advice.
        </p>
      </div>
    </Card>
  );
} 
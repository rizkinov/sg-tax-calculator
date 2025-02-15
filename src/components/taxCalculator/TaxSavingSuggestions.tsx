'use client';

import { formatCurrency } from "@/lib/utils";
import { PROGRESSIVE_TAX_BRACKETS, calculateTax } from "@/lib/utils/taxCalculator";
import { Card } from "@/components/ui/card";
import { ExternalLinkIcon, PartyPopper } from "lucide-react";
import { TaxBreakdown } from "./TaxBreakdown";

interface TaxSavingSuggestionsProps {
  income: number;
  currentRelief: number;
  taxableIncome: number;
  citizenshipStatus: 'CITIZEN_PR' | 'FOREIGNER';
}

export function TaxSavingSuggestions({ 
  income, 
  currentRelief, 
  taxableIncome,
  citizenshipStatus 
}: TaxSavingSuggestionsProps) {
  const MAX_CPF_RELIEF = citizenshipStatus === 'CITIZEN_PR' ? 16000 : 0;
  const MAX_SRS = citizenshipStatus === 'FOREIGNER' ? 35700 : 15300;
  const TOTAL_MAX_RELIEF = MAX_CPF_RELIEF + MAX_SRS;

  // Calculate remaining relief capacity by type
  let remainingSRSCapacity = 0;
  let remainingCPFCapacity = 0;
  let remainingReliefCapacity = 0;

  if (citizenshipStatus === 'FOREIGNER') {
    // For foreigners, simple SRS calculation
    remainingSRSCapacity = Math.max(0, MAX_SRS - currentRelief);
    remainingCPFCapacity = 0;
    remainingReliefCapacity = remainingSRSCapacity;
  } else {
    // For Citizens/PR, split between SRS and CPF
    const usedSRS = Math.min(currentRelief, MAX_SRS);
    const usedCPF = Math.max(0, currentRelief - usedSRS);
    
    remainingSRSCapacity = Math.max(0, MAX_SRS - usedSRS);
    remainingCPFCapacity = Math.max(0, MAX_CPF_RELIEF - usedCPF);
    remainingReliefCapacity = remainingSRSCapacity + remainingCPFCapacity;
  }

  const isOverLimit = currentRelief > TOTAL_MAX_RELIEF;

  // Early returns
  if (taxableIncome <= 20000) return null;
  if (remainingReliefCapacity <= 0) return null;

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

  // Calculate current tax
  const currentTax = calculateTax(taxableIncome, 'EMPLOYEE');

  // Calculate tax with maximum possible additional relief
  const possibleRelief = Math.min(
    remainingReliefCapacity,
    citizenshipStatus === 'FOREIGNER' ? 
      Math.min(remainingSRSCapacity, income - taxableIncome) :
      Math.min(remainingSRSCapacity + remainingCPFCapacity, income - taxableIncome)
  );
  const newTaxableIncome = taxableIncome - possibleRelief;
  const newTax = calculateTax(newTaxableIncome, 'EMPLOYEE');
  
  // Calculate tax savings
  const taxSavings = currentTax - newTax;
  if (taxSavings <= 0) return null;

  // Check if we can reach lower bracket
  const canReachLowerBracket = newTaxableIncome <= previousBracket.max;

  return (
    <Card className="p-4 bg-muted/50">
      <div className="space-y-2">
        {canReachLowerBracket ? (
          <>
            <h3 className="font-semibold text-lg mb-2">Tax Saving Opportunity</h3>
            <p>
              You are currently in the {(currentBracket.rate * 100).toFixed(1)}% tax bracket.
            </p>
            {isOverLimit ? (
              <p className="text-destructive">
                Your current relief (${formatCurrency(currentRelief)}) exceeds the maximum combined limit of ${formatCurrency(TOTAL_MAX_RELIEF)}.
                Consider adjusting your relief contributions to stay within the limits.
              </p>
            ) : (
              <p>
                By contributing an additional {formatCurrency(possibleRelief)} to your eligible tax relief,
                you could move to the {(previousBracket.rate * 100).toFixed(1)}% tax bracket.
              </p>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <PartyPopper className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Tax Optimization Note</h3>
            </div>
            <p>
              You are currently in the {(currentBracket.rate * 100).toFixed(1)}% tax bracket. Even with maximum available relief 
              (additional {formatCurrency(possibleRelief)}), you would remain in this bracket.
            </p>
            <p>
              However, you can still save on taxes by maximizing your eligible relief!
            </p>
          </>
        )}

        <p className="font-medium text-primary">
          Potential tax savings: {formatCurrency(taxSavings)}
        </p>

        <div className="mt-4 p-4 bg-background/50 rounded-lg space-y-4">
          <div>
            <h4 className="font-medium mb-2">Available Relief Capacity</h4>
            <div className="space-y-2 text-sm">
              {citizenshipStatus === 'CITIZEN_PR' ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>SRS Contributions:</div>
                    <div className="text-right">
                      ${formatCurrency(remainingSRSCapacity)} remaining
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>CPF Cash Top-up:</div>
                    <div className="text-right">
                      ${formatCurrency(remainingCPFCapacity)} remaining
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-medium border-t pt-2">
                    <div>Total Available:</div>
                    <div className="text-right">
                      ${formatCurrency(remainingReliefCapacity)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>SRS Contributions:</div>
                  <div className="text-right">
                    ${formatCurrency(remainingSRSCapacity)} remaining
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Current Tax Breakdown</h4>
            <TaxBreakdown 
              taxableIncome={taxableIncome} 
              totalTax={currentTax}
              showDetails
              className="bg-background/50"
            />
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Tax After Relief</h4>
            <TaxBreakdown 
              taxableIncome={newTaxableIncome} 
              totalTax={newTax}
              showDetails
              className="bg-background/50"
            />
          </div>
        </div>
      </div>
    </Card>
  );
} 
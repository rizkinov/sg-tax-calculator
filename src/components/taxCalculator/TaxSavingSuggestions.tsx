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
  citizenshipStatus,
  cpfTopUp = 0,    // Add these parameters to track individual contributions
  srsContribution = 0
}: TaxSavingSuggestionsProps & {
  cpfTopUp?: number;
  srsContribution?: number;
}) {
  // 1. Define maximum relief limits
  const MAX_CPF_RELIEF = citizenshipStatus === 'CITIZEN_PR' ? 16000 : 0;
  const MAX_SRS = citizenshipStatus === 'FOREIGNER' ? 35700 : 15300;
  const TOTAL_MAX_RELIEF = MAX_CPF_RELIEF + MAX_SRS;

  // 2. Calculate remaining relief capacity with validation
  let remainingSRSCapacity = 0;
  let remainingCPFCapacity = 0;
  
  if (citizenshipStatus === 'FOREIGNER') {
    // For foreigners, only SRS is available
    if (srsContribution > MAX_SRS) {
      console.warn('SRS contribution exceeds maximum limit');
      remainingSRSCapacity = 0;
    } else {
      remainingSRSCapacity = Math.max(0, MAX_SRS - srsContribution);
    }
    remainingCPFCapacity = 0;
  } else {
    // For Citizens/PR, handle CPF and SRS separately
    // Handle CPF
    if (cpfTopUp > MAX_CPF_RELIEF) {
      console.warn('CPF top-up exceeds maximum limit');
      remainingCPFCapacity = 0;
    } else {
      remainingCPFCapacity = Math.max(0, MAX_CPF_RELIEF - cpfTopUp);
    }

    // Handle SRS
    if (srsContribution > MAX_SRS) {
      console.warn('SRS contribution exceeds maximum limit');
      remainingSRSCapacity = 0;
    } else {
      remainingSRSCapacity = Math.max(0, MAX_SRS - srsContribution);
    }
  }
  
  const remainingReliefCapacity = remainingCPFCapacity + remainingSRSCapacity;
  const isOverLimit = currentRelief > TOTAL_MAX_RELIEF;

  // Add validation warnings
  const warnings = [];
  if (citizenshipStatus === 'FOREIGNER' && cpfTopUp > 0) {
    warnings.push('Foreigners are not eligible for CPF Cash Top-up');
  }
  if (cpfTopUp > MAX_CPF_RELIEF) {
    warnings.push(`CPF Cash Top-up exceeds maximum limit of ${formatCurrency(MAX_CPF_RELIEF)}`);
  }
  if (srsContribution > MAX_SRS) {
    warnings.push(`SRS contribution exceeds maximum limit of ${formatCurrency(MAX_SRS)}`);
  }
  if (currentRelief > TOTAL_MAX_RELIEF) {
    warnings.push(`Total relief exceeds maximum combined limit of ${formatCurrency(TOTAL_MAX_RELIEF)}`);
  }

  // 3. Calculate tax savings
  const grossTax = calculateTax(income, 'EMPLOYEE');
  const currentTax = calculateTax(taxableIncome, 'EMPLOYEE');
  const currentTaxSavings = grossTax - currentTax;

  // 4. Calculate potential savings with remaining relief
  const potentialTaxableIncome = Math.max(0, taxableIncome - remainingReliefCapacity);
  const potentialTax = calculateTax(potentialTaxableIncome, 'EMPLOYEE');
  const additionalTaxSavings = currentTax - potentialTax;
  const totalPotentialSavings = currentTaxSavings + additionalTaxSavings;

  // Early returns
  if (taxableIncome <= 20000) return null;
  if (remainingReliefCapacity <= 0) return null;
  if (additionalTaxSavings <= 0) return null;

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

  // Check if we can reach lower bracket with remaining relief
  const canReachLowerBracket = potentialTaxableIncome <= previousBracket.max;

  return (
    <Card className="p-4 bg-muted/50">
      <div className="space-y-2">
        {/* Show warnings if any */}
        {warnings.length > 0 && (
          <div className="space-y-1 mb-4">
            {warnings.map((warning, index) => (
              <p key={index} className="text-sm text-destructive">
                Warning: {warning}
              </p>
            ))}
          </div>
        )}

        {canReachLowerBracket ? (
          <>
            <h3 className="font-semibold text-lg mb-2">Tax Saving Opportunity</h3>
            <p>
              You are currently in the {(currentBracket.rate * 100).toFixed(1)}% tax bracket.
            </p>
            <p>
              By contributing an additional {formatCurrency(remainingReliefCapacity)} to your eligible tax relief,
              you could move to the {(previousBracket.rate * 100).toFixed(1)}% tax bracket.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <PartyPopper className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Tax Optimization Note</h3>
            </div>
            <p>
              You are currently in the {(currentBracket.rate * 100).toFixed(1)}% tax bracket. Even with maximum available relief 
              (additional {formatCurrency(remainingReliefCapacity)}), you would remain in this bracket.
            </p>
            <p>
              However, you can still save on taxes by maximizing your eligible relief!
            </p>
          </>
        )}

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>Current Tax Savings:</div>
            <div className="text-right font-medium">{formatCurrency(currentTaxSavings)}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Additional Potential Savings:</div>
            <div className="text-right font-medium text-primary">{formatCurrency(additionalTaxSavings)}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t pt-2">
            <div>Total Potential Savings:</div>
            <div className="text-right font-medium">{formatCurrency(totalPotentialSavings)}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-background/50 rounded-lg space-y-4">
          <div>
            <h4 className="font-medium mb-2">Available Relief Capacity</h4>
            <div className="space-y-2 text-sm">
              {citizenshipStatus === 'CITIZEN_PR' ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>CPF Cash Top-up:</div>
                    <div className="text-right">
                      {formatCurrency(remainingCPFCapacity)} remaining
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>SRS Contributions:</div>
                    <div className="text-right">
                      {formatCurrency(remainingSRSCapacity)} remaining
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-medium border-t pt-2">
                    <div>Total Available:</div>
                    <div className="text-right">
                      {formatCurrency(remainingReliefCapacity)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>SRS Contributions:</div>
                  <div className="text-right">
                    {formatCurrency(remainingSRSCapacity)} remaining
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
              taxableIncome={potentialTaxableIncome} 
              totalTax={potentialTax}
              showDetails
              className="bg-background/50"
            />
          </div>
        </div>
      </div>
    </Card>
  );
} 
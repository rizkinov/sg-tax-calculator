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

  // Don't show suggestions if income is too low to be taxed
  if (taxableIncome <= 20000) return null;

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
  if (remainingReliefCapacity <= 0) return null;

  // Calculate current tax
  const currentTax = calculateTax(taxableIncome, 'EMPLOYEE');

  // Calculate tax with maximum possible additional relief
  const possibleRelief = Math.min(remainingReliefCapacity, income - taxableIncome);
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

        <div className="text-sm text-muted-foreground mt-4 space-y-4">
          <div>
            <p className="font-medium mb-2">
              Maximum relief limits shown here only include:
            </p>
            <ul className="list-disc ml-6">
              {citizenshipStatus === 'CITIZEN_PR' ? (
                <>
                  <li>CPF Cash Top-up Relief: Up to $16,000
                    <ul className="list-disc ml-6 mt-1">
                      <li>Own CPF Account: Up to $8,000</li>
                      <li>Family Members' CPF Accounts: Up to $8,000</li>
                    </ul>
                  </li>
                  <li>SRS Contributions: Up to ${formatCurrency(MAX_SRS)}</li>
                  <li className="font-medium mt-1">Total combined limit: Up to ${formatCurrency(TOTAL_MAX_RELIEF)}</li>
                </>
              ) : (
                <>
                  <li>SRS Contributions: Up to ${formatCurrency(MAX_SRS)}</li>
                  <li className="font-medium mt-1">Total limit: Up to ${formatCurrency(TOTAL_MAX_RELIEF)}</li>
                </>
              )}
            </ul>
          </div>

          <div className="pt-2 border-t">
            <p className="mb-2">
              Other tax reliefs are available but not included in this calculation:
            </p>
            <ul className="list-disc ml-6">
              <li>Course Fees Relief</li>
              <li>Parent Relief</li>
              <li>Working Mother's Child Relief</li>
              <li>Life Insurance Relief</li>
              <li>And more...</li>
            </ul>
            <a 
              href="https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline mt-2"
            >
              Learn more about tax reliefs on IRAS website
              <ExternalLinkIcon className="h-3 w-3" />
            </a>
          </div>

          <p className="italic">
            Consult a tax professional for personalized advice.
          </p>
        </div>
      </div>
    </Card>
  );
} 
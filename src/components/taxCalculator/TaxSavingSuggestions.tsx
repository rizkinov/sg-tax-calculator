'use client';

import { formatCurrency } from "@/lib/utils";
<<<<<<< HEAD
import { Trophy, ExternalLink, InfoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
=======
import { PROGRESSIVE_TAX_BRACKETS, calculateTax } from "@/lib/utils/taxCalculator";
import { Card } from "@/components/ui/card";
import { ExternalLinkIcon, PartyPopper } from "lucide-react";
import { TaxBreakdown } from "./TaxBreakdown";
<<<<<<< HEAD
>>>>>>> parent of b36dd81 (Update TaxSavingSuggestions.tsx)
=======
>>>>>>> parent of b36dd81 (Update TaxSavingSuggestions.tsx)

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
  
<<<<<<< HEAD
  const isMaximized = citizenshipStatus === 'FOREIGNER' 
    ? currentRelief >= MAX_SRS 
    : currentRelief >= TOTAL_MAX_RELIEF;

<<<<<<< HEAD
  if (taxableIncome <= 20000) return null;
=======
  // Early returns
  if (taxableIncome <= 20000) return null;
  if (remainingReliefCapacity <= 0) return null;
>>>>>>> parent of b36dd81 (Update TaxSavingSuggestions.tsx)
=======
  const remainingReliefCapacity = remainingSRSCapacity + remainingCPFCapacity;
  const isOverLimit = currentRelief > TOTAL_MAX_RELIEF;

  // Early returns
  if (taxableIncome <= 20000) return null;
  if (remainingReliefCapacity <= 0) return null;
>>>>>>> parent of b36dd81 (Update TaxSavingSuggestions.tsx)

  const remainingRelief = MAX_SRS - currentRelief;
  const potentialSavings = (remainingRelief * (citizenshipStatus === 'FOREIGNER' ? 0.22 : 0.20));
  
  // Calculate potential taxable income after maximizing relief
  const potentialTaxableIncome = Math.max(0, taxableIncome - remainingRelief);

  return (
<<<<<<< HEAD
    <div className="rounded-lg border bg-white p-4">
      {isMaximized ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h3 className="font-semibold text-lg">Congratulations!</h3>
            <Badge variant="success">Maximum Relief Achieved</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            You have maximized your {citizenshipStatus === 'FOREIGNER' ? 'SRS contributions' : 'tax relief contributions'}!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">Tax Relief Progress</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Maximum relief limits:</p>
                  {citizenshipStatus === 'CITIZEN_PR' ? (
                    <ul className="list-disc ml-4 mt-2">
                      <li>SRS: $15,300</li>
                      <li>CPF Top-up: $16,000</li>
                    </ul>
                  ) : (
                    <ul className="list-disc ml-4 mt-2">
                      <li>SRS: $35,700</li>
                    </ul>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Current Taxable Income:</div>
                <div className="text-right font-medium">${formatCurrency(taxableIncome)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Available Relief:</div>
                <div className="text-right font-medium">${formatCurrency(remainingRelief)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm border-t pt-2">
                <div>Potential Taxable Income:</div>
                <div className="text-right font-medium">${formatCurrency(potentialTaxableIncome)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-primary font-medium">
                <div>Potential Tax Savings:</div>
                <div className="text-right">${formatCurrency(potentialSavings)}</div>
              </div>
            </div>

            <div className="pt-3 border-t">
              <p className="text-sm">
                You can still contribute up to ${formatCurrency(remainingRelief)} to your
                {citizenshipStatus === 'FOREIGNER' ? ' SRS account ' : ' tax relief '} 
                to maximize your tax savings.
              </p>
            </div>
=======
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
<<<<<<< HEAD
>>>>>>> parent of b36dd81 (Update TaxSavingSuggestions.tsx)

            <div className="grid gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <a 
                  href="https://www.iras.gov.sg/taxes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Learn more about tax reliefs
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
=======

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
>>>>>>> parent of b36dd81 (Update TaxSavingSuggestions.tsx)
          </div>
        </div>
      )}
    </div>
  );
} 
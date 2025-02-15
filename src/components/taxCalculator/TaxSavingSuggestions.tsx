'use client';

import { formatCurrency } from "@/lib/utils";
import { 
  PROGRESSIVE_TAX_BRACKETS, 
  calculateTax, 
  calculateTaxBreakdown 
} from "@/lib/utils/taxCalculator";
import { Card } from "@/components/ui/card";
import { ExternalLinkIcon, PartyPopper, Download } from "lucide-react";
import { TaxBreakdown } from "./TaxBreakdown";
import { Button } from "@/components/ui/button";
import { exportTaxOptimizationToExcel } from '@/lib/utils/excelExport';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TaxSavingSuggestionsProps {
  income: number;
  currentRelief: number;
  taxableIncome: number;
  citizenshipStatus: 'CITIZEN_PR' | 'FOREIGNER';
  cpfTopUp?: number;
  srsContribution?: number;
  breakdown: ReturnType<typeof calculateTaxBreakdown>;
}

export function TaxSavingSuggestions({ 
  income, 
  currentRelief,
  taxableIncome,
  citizenshipStatus,
  cpfTopUp = 0,    // Add these parameters to track individual contributions
  srsContribution = 0,
  breakdown
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

  // Add this helper function at the top of the component
  function isReliefMaximized(
    citizenshipStatus: 'CITIZEN_PR' | 'FOREIGNER',
    cpfTopUp: number,
    srsContribution: number
  ): boolean {
    if (citizenshipStatus === 'CITIZEN_PR') {
      return cpfTopUp >= MAX_CPF_RELIEF && srsContribution >= MAX_SRS;
    }
    return srsContribution >= MAX_SRS;
  }

  if (isReliefMaximized(citizenshipStatus, cpfTopUp, srsContribution)) {
    return (
      <Card className="p-4 bg-muted/50">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-lg">Congratulations!</h3>
          </div>
          
          {citizenshipStatus === 'CITIZEN_PR' ? (
            <p>
              You have maximized your tax relief by contributing the full amount to both CPF 
              (<span className="font-semibold">{formatCurrency(MAX_CPF_RELIEF).replace('SGD', '')}</span>) and SRS 
              (<span className="font-semibold">{formatCurrency(MAX_SRS).replace('SGD', '')}</span>). 
              This will help you save <span className="font-semibold">{formatCurrency(currentTaxSavings).replace('SGD', '')}</span> in taxes.
            </p>
          ) : (
            <p>
              You have maximized your tax relief by contributing the full SRS amount 
              of <span className="font-semibold">{formatCurrency(MAX_SRS).replace('SGD', '')}</span>. 
              This will help you save <span className="font-semibold">{formatCurrency(currentTaxSavings).replace('SGD', '')}</span> in taxes.
            </p>
          )}

          <div className="mt-4">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="current-tax">
                <AccordionTrigger className="bg-background/50 px-4 rounded-t">
                  Tax Breakdown
                </AccordionTrigger>
                <AccordionContent className="bg-background/50 px-4 pb-4 rounded-b">
                  <div className="pt-2">
                    <TaxBreakdown 
                      taxableIncome={taxableIncome} 
                      totalTax={currentTax}
                      showDetails
                      className="bg-background/50"
                      removeCurrencyPrefix
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </Card>
    );
  }

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
            <p className="mb-2">
              You are currently in the <span className="font-semibold">{(currentBracket.rate * 100).toFixed(1)}%</span> tax bracket.
            </p>
            <p className="mb-2">
              To move to the <span className="font-semibold">{(previousBracket.rate * 100).toFixed(1)}%</span> tax bracket, 
              you must contribute at least <span className="font-semibold">{formatCurrency(taxableIncome - previousBracket.max).replace('SGD', '')}</span> in eligible tax relief.
            </p>
            <p>
              You may contribute up to <span className="font-semibold">{formatCurrency(remainingReliefCapacity).replace('SGD', '')}</span>—any contribution within this range 
              will lower your taxable income and help you benefit from the lower tax rate.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <PartyPopper className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Tax Optimization Note</h3>
            </div>
            <p className="mb-2">
              You are currently in the <span className="font-semibold">{(currentBracket.rate * 100).toFixed(1)}%</span> tax bracket.
            </p>
            <p>
              While you'll remain in this bracket even with maximum relief contributions, 
              you can still save <span className="font-semibold">{formatCurrency(additionalTaxSavings).replace('SGD', '')}</span> in taxes 
              by utilizing your remaining eligible relief of <span className="font-semibold">
              {formatCurrency(remainingReliefCapacity).replace('SGD', '')}</span>.
            </p>
          </>
        )}

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>Current Tax Savings:</div>
            <div className="text-right font-medium">{formatCurrency(currentTaxSavings).replace('SGD', '')}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Additional Potential Savings:</div>
            <div className="text-right font-medium text-primary">{formatCurrency(additionalTaxSavings).replace('SGD', '')}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t pt-2">
            <div>Total Potential Savings:</div>
            <div className="text-right font-medium">{formatCurrency(totalPotentialSavings).replace('SGD', '')}</div>
          </div>
        </div>

        <div className="mt-4">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="relief-capacity">
              <AccordionTrigger className="bg-background/50 px-4 rounded-t">
                Available Relief Capacity
              </AccordionTrigger>
              <AccordionContent className="bg-background/50 px-4 pb-4 rounded-b">
                <div className="space-y-2 text-sm pt-2">
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
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="current-tax">
              <AccordionTrigger className="bg-background/50 px-4 rounded-t">
                Current Tax Breakdown
              </AccordionTrigger>
              <AccordionContent className="bg-background/50 px-4 pb-4 rounded-b">
                <div className="pt-2">
                  <TaxBreakdown 
                    taxableIncome={taxableIncome} 
                    totalTax={currentTax}
                    showDetails
                    className="bg-background/50"
                    removeCurrencyPrefix
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="potential-tax">
              <AccordionTrigger className="bg-background/50 px-4 rounded-t">
                Tax After Relief
              </AccordionTrigger>
              <AccordionContent className="bg-background/50 px-4 pb-4 rounded-b">
                <div className="pt-2">
                  <TaxBreakdown 
                    taxableIncome={potentialTaxableIncome} 
                    totalTax={potentialTax}
                    showDetails
                    className="bg-background/50"
                    removeCurrencyPrefix
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Card>
  );
} 
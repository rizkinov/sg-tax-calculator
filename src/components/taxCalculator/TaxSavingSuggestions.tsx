'use client';

import { formatCurrency } from "@/lib/utils";
import { PROGRESSIVE_TAX_BRACKETS, calculateTax } from "@/lib/utils/taxCalculator";
import { Card } from "@/components/ui/card";
import { ExternalLinkIcon, PartyPopper, Trophy, Sparkles, ExternalLink, Info } from "lucide-react";
import { TaxBreakdown } from "./TaxBreakdown";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
  const remainingSRSCapacity = MAX_SRS - (
    citizenshipStatus === 'FOREIGNER' ? currentRelief : Math.min(currentRelief, MAX_SRS)
  );
  const remainingCPFCapacity = citizenshipStatus === 'CITIZEN_PR' ? 
    Math.max(0, MAX_CPF_RELIEF - Math.max(0, currentRelief - MAX_SRS)) : 0;
  
  const remainingReliefCapacity = remainingSRSCapacity + remainingCPFCapacity;
  const isOverLimit = currentRelief > TOTAL_MAX_RELIEF;

  // Check if relief is already maximized (updated logic)
  const isMaximized = citizenshipStatus === 'FOREIGNER' 
    ? currentRelief >= MAX_SRS 
    : currentRelief >= TOTAL_MAX_RELIEF;

  console.log({
    currentRelief,
    MAX_SRS,
    MAX_CPF_RELIEF,
    TOTAL_MAX_RELIEF,
    remainingSRSCapacity,
    remainingCPFCapacity,
    isMaximized,
    citizenshipStatus
  });

  // Early returns
  if (taxableIncome <= 20000) return null;
  // Remove this condition to always show the card when maximized
  // if (remainingReliefCapacity <= 0 && !isMaximized) return null;

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
      Math.min(
        // For Citizens/PR, consider both SRS and CPF limits
        remainingSRSCapacity + remainingCPFCapacity,
        income - taxableIncome
      )
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
        {isMaximized ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <motion.div 
              className="flex items-center gap-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1] }}
            >
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h3 className="font-semibold text-lg">Congratulations!</h3>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </motion.div>
            </motion.div>

            <div className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-4">
                <p className="font-medium">
                  You have maximized your {citizenshipStatus === 'FOREIGNER' ? 'SRS contributions' : 'tax relief contributions'}!
                </p>
                
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-sm">Current Utilization</h4>
                  {citizenshipStatus === 'CITIZEN_PR' ? (
                    <>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>SRS Contributions</span>
                            <span className="font-medium">${formatCurrency(Math.min(currentRelief, MAX_SRS))} / ${formatCurrency(MAX_SRS)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${(Math.min(currentRelief, MAX_SRS) / MAX_SRS) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>CPF Cash Top-up</span>
                            <span className="font-medium">${formatCurrency(Math.max(0, currentRelief - MAX_SRS))} / ${formatCurrency(MAX_CPF_RELIEF)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${(Math.max(0, currentRelief - MAX_SRS) / MAX_CPF_RELIEF) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>SRS Contributions</span>
                        <span className="font-medium">${formatCurrency(currentRelief)} / ${formatCurrency(MAX_SRS)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(currentRelief / MAX_SRS) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  Other Tax Relief Options
                  <HoverCard>
                    <HoverCardTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      These additional reliefs can help you save more on taxes, even after maximizing your {citizenshipStatus === 'FOREIGNER' ? 'SRS' : 'CPF and SRS'} contributions.
                    </HoverCardContent>
                  </HoverCard>
                </h4>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start" asChild>
                    <a 
                      href="https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/tax-reliefs/course-fees-relief"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Course Fees Relief
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <a 
                      href="https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/tax-reliefs/parent-relief"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Parent Relief
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <a 
                      href="https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/tax-reliefs/working-mother-s-child-relief-(wmcr)"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Working Mother's Child Relief
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : canReachLowerBracket ? (
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

        {!isMaximized && (
          <p className="font-medium text-primary">
            Potential tax savings: {formatCurrency(taxSavings)}
          </p>
        )}

        <div className="mt-4 p-4 bg-background/50 rounded-lg space-y-4">
          {!isMaximized && (
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
          )}
          
          <div className={cn(!isMaximized && "border-t pt-4")}>
            <h4 className="font-medium mb-3">Current Tax Breakdown</h4>
            <TaxBreakdown 
              taxableIncome={taxableIncome} 
              totalTax={currentTax}
              showDetails
              className="bg-background/50"
            />
          </div>
          
          {!isMaximized && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Tax After Relief</h4>
              <TaxBreakdown 
                taxableIncome={newTaxableIncome} 
                totalTax={newTax}
                showDetails
                className="bg-background/50"
              />
            </div>
          )}
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
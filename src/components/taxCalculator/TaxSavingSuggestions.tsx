'use client';

import { formatCurrency } from "@/lib/utils";
import { Trophy, ExternalLink, InfoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

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
  
  const isMaximized = citizenshipStatus === 'FOREIGNER' 
    ? currentRelief >= MAX_SRS 
    : currentRelief >= TOTAL_MAX_RELIEF;

  if (taxableIncome <= 20000) return null;

  const remainingRelief = MAX_SRS - currentRelief;
  const potentialSavings = (remainingRelief * (citizenshipStatus === 'FOREIGNER' ? 0.22 : 0.20));

  return (
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
            <p className="text-sm">
              You can still contribute up to ${formatCurrency(remainingRelief)} to your
              {citizenshipStatus === 'FOREIGNER' ? ' SRS account ' : ' tax relief '} 
              to maximize your tax savings.
            </p>
            <p className="text-sm font-medium">
              Potential tax savings: Up to ${formatCurrency(potentialSavings)}
            </p>
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <a 
                  href={citizenshipStatus === 'FOREIGNER' 
                    ? "https://www.iras.gov.sg/taxes/individual-income-tax/foreigners/tax-reliefs-for-foreigners"
                    : "https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Learn more about tax reliefs
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
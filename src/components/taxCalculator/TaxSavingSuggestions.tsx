'use client';

import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const MAX_SRS = citizenshipStatus === 'FOREIGNER' ? 35700 : 15300;
  
  // Simple check for maximized
  const isMaximized = currentRelief >= MAX_SRS;

  console.log('Simple debug:', {
    currentRelief,
    MAX_SRS,
    isMaximized,
    citizenshipStatus,
    renderingCondition: isMaximized && taxableIncome > 20000
  });

  // Only basic checks
  if (taxableIncome <= 20000) {
    console.log('Returning null due to low taxable income');
    return null;
  }

  return (
    <Card className="p-4 bg-muted/50">
      <div className="space-y-2">
        {isMaximized ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h3 className="font-semibold text-lg">Congratulations!</h3>
              <Badge variant="success">
                Maximum Relief Achieved
              </Badge>
            </div>
            <p>
              You have maximized your {citizenshipStatus === 'FOREIGNER' ? 'SRS contributions' : 'tax relief contributions'}!
            </p>
            <p className="text-sm text-muted-foreground">
              Current SRS: ${formatCurrency(currentRelief)} / ${formatCurrency(MAX_SRS)}
            </p>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-lg">Not Maximized</h3>
            <p>Current relief: ${formatCurrency(currentRelief)}</p>
            <p>Maximum SRS: ${formatCurrency(MAX_SRS)}</p>
          </div>
        )}
      </div>
    </Card>
  );
} 
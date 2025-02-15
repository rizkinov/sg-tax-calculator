'use client';

import { formatCurrency } from "@/lib/utils";
import { PROGRESSIVE_TAX_BRACKETS } from "@/lib/utils/taxCalculator";
import { cn } from "@/lib/utils";

interface TaxBreakdownProps {
  taxableIncome: number;
  totalTax: number;
  showDetails?: boolean;
  className?: string;
}

export function TaxBreakdown({ 
  taxableIncome, 
  totalTax, 
  showDetails = false,
  className 
}: TaxBreakdownProps) {
  const breakdown = PROGRESSIVE_TAX_BRACKETS.reduce((acc, bracket, index) => {
    const prevMax = index > 0 ? PROGRESSIVE_TAX_BRACKETS[index - 1].max || 0 : 0;
    const min = bracket.min;
    const max = bracket.max;
    
    if (taxableIncome <= prevMax) return acc;
    
    const taxableAmount = Math.min(
      max ? max - prevMax : taxableIncome - prevMax,
      taxableIncome - prevMax
    );
    
    if (taxableAmount <= 0) return acc;
    
    const taxForBracket = taxableAmount * bracket.rate;
    
    return [...acc, {
      rate: bracket.rate,
      taxableAmount,
      taxForBracket,
      min,
      max
    }];
  }, [] as Array<{
    rate: number;
    taxableAmount: number;
    taxForBracket: number;
    min: number;
    max: number | null;
  }>);

  const totalCalculatedTax = breakdown.reduce((sum, item) => sum + item.taxForBracket, 0);

  return (
    <div className={cn("rounded-lg", className)}>
      {showDetails && (
        <div className="space-y-1.5 mb-3">
          {breakdown.map((item, index) => (
            <div 
              key={index} 
              className={cn(
                "grid grid-cols-[1fr,auto] gap-2 px-3 py-1.5 rounded",
                item.taxForBracket > 0 && "bg-muted"
              )}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {(item.rate * 100).toFixed(1)}%
                  </span>
                  <span>
                    on ${formatCurrency(item.taxableAmount)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(item.min)} to {item.max ? formatCurrency(item.max) : 'above'}
                </div>
              </div>
              <div className="font-medium tabular-nums">
                ${formatCurrency(item.taxForBracket)}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className={cn(
        "grid grid-cols-[1fr,auto] gap-2 px-3 py-2",
        "bg-primary/5 rounded font-medium"
      )}>
        <div className="flex items-center gap-2">
          <span>Total Tax</span>
          {totalCalculatedTax !== totalTax && (
            <span className="text-xs text-muted-foreground">
              (rounded)
            </span>
          )}
        </div>
        <div className="tabular-nums">
          ${formatCurrency(totalTax)}
        </div>
      </div>
    </div>
  );
} 
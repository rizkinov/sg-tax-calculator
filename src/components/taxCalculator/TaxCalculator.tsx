'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { TaxCalculatorInputs, taxCalculatorSchema } from '@/lib/utils/validationSchema';
import { calculateTax, calculateTaxBreakdown, TaxPayerType } from '@/lib/utils/taxCalculator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { TaxPieChart } from './TaxPieChart';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from 'lucide-react';
import { TaxSavingSuggestions } from './TaxSavingSuggestions';

export function TaxCalculator() {
  const [result, setResult] = useState<{
    totalTax: number;
    breakdown: ReturnType<typeof calculateTaxBreakdown>;
    totalRelief: number;
    taxableIncome: number;
  } | null>(null);

  const form = useForm<TaxCalculatorInputs>({
    resolver: zodResolver(taxCalculatorSchema),
    defaultValues: {
      income: undefined,
      taxpayerType: 'EMPLOYEE',
      citizenshipStatus: 'CITIZEN_PR',
      cpfTopUp: 0,
      srsContribution: 0,
    },
  });

  function onSubmit(data: TaxCalculatorInputs) {
    const totalRelief = (data.cpfTopUp || 0) + (data.srsContribution || 0);
    const taxableIncome = Math.max(0, data.income - totalRelief);
    const totalTax = calculateTax(taxableIncome, data.taxpayerType as TaxPayerType);
    const breakdown = calculateTaxBreakdown(taxableIncome, data.taxpayerType as TaxPayerType);
    setResult({ 
      totalTax, 
      breakdown,
      totalRelief,
      taxableIncome: taxableIncome,
    });
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Singapore Tax Calculator</h1>
      <p className="text-sm text-muted-foreground mb-6">
        This calculator provides an unofficial estimate only. We do not store your data. Your inputs are processed locally on your device.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="taxpayerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxpayer Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select taxpayer type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="SOLE_PROPRIETOR">Sole Proprietor</SelectItem>
                    <SelectItem value="CORPORATION">Corporation</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('taxpayerType') !== 'CORPORATION' && (
            <FormField
              control={form.control}
              name="citizenshipStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Citizenship Status</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset CPF top-up when switching to foreigner
                      if (value === 'FOREIGNER') {
                        form.setValue('cpfTopUp', 0);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select citizenship status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CITIZEN_PR">Singapore Citizen / PR</SelectItem>
                      <SelectItem value="FOREIGNER">Foreigner</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Income (SGD)</FormLabel>
                <FormControl>
                  <Input
                    id="income"
                    type="number"
                    placeholder="Enter your annual income"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('taxpayerType') !== 'CORPORATION' && 
           form.watch('citizenshipStatus') === 'CITIZEN_PR' && (
            <FormField
              control={form.control}
              name="cpfTopUp"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>CPF Cash Top-up (Optional)</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger type="button" onClick={(e) => e.preventDefault()}>
                          <InfoIcon className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Maximum tax relief:</p>
                          <ul className="list-disc ml-4 mt-1">
                            <li>Own account: Up to $8,000</li>
                            <li>Family members: Up to $8,000</li>
                            <li>Total maximum: $16,000</li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter CPF top-up amount"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="srsContribution"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>SRS Contribution (Optional)</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button" onClick={(e) => e.preventDefault()}>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Maximum contribution:</p>
                        <ul className="list-disc ml-4 mt-1">
                          <li>Singapore Citizens & PR: $15,300</li>
                          <li>Foreigners: $35,700</li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter SRS contribution"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Calculate Tax</Button>
        </form>
      </Form>

      {result && (
        <div className="mt-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tax Calculation Results</h2>
            <div className="p-4 border rounded space-y-2">
              <p>Gross Income: {formatCurrency(form.getValues('income'))}</p>
              <p>Total Relief: {formatCurrency(result.totalRelief)}</p>
              <p>Taxable Income: {formatCurrency(result.taxableIncome)}</p>
              <p className="font-bold border-t pt-2">
                Total Tax: {formatCurrency(result.totalTax)}
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Breakdown:</h3>
              {result.breakdown.map((item, index) => (
                <div key={index} className="p-2 border rounded text-sm">
                  <p>Rate: {(item.bracket.rate * 100).toFixed(1)}%</p>
                  <p>Taxable Amount: {formatCurrency(item.taxableAmount)}</p>
                  <p>Tax: {formatCurrency(item.taxForBracket)}</p>
                </div>
              ))}
            </div>
          </div>

          <TaxPieChart 
            income={form.getValues('income')} 
            tax={result.totalTax} 
          />

          {form.getValues('taxpayerType') !== 'CORPORATION' && (
            <TaxSavingSuggestions
              income={form.getValues('income')}
              currentRelief={result.totalRelief}
              taxableIncome={result.taxableIncome}
              citizenshipStatus={form.getValues('citizenshipStatus')}
            />
          )}

          <div className="mt-8 text-sm text-muted-foreground space-y-2 border-t pt-4">
            <p className="font-medium">Disclaimer:</p>
            <p>
              Tax calculations are based on IRAS guidelines projected for Year of Assessment 2024 
              (income earned in 2023). Rates and thresholds may change. Please verify with{' '}
              <a 
                href="https://www.iras.gov.sg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                IRAS
              </a>
              {' '}for the most current information.
            </p>
            <p className="text-xs">
              Last updated: February 2024
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 
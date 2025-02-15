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

export function TaxCalculator() {
  const [result, setResult] = useState<{
    totalTax: number;
    breakdown: ReturnType<typeof calculateTaxBreakdown>;
  } | null>(null);

  const form = useForm<TaxCalculatorInputs>({
    resolver: zodResolver(taxCalculatorSchema),
    defaultValues: {
      income: undefined,
      taxpayerType: 'EMPLOYEE',
    },
  });

  function onSubmit(data: TaxCalculatorInputs) {
    const totalTax = calculateTax(data.income, data.taxpayerType as TaxPayerType);
    const breakdown = calculateTaxBreakdown(data.income, data.taxpayerType as TaxPayerType);
    setResult({ totalTax, breakdown });
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Singapore Tax Calculator</h1>
      
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

          <FormField
            control={form.control}
            name="income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Income (SGD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter your annual income"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    value={field.value || ''}
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
            <div className="p-4 border rounded">
              <p className="font-bold">
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
        </div>
      )}
    </div>
  );
} 
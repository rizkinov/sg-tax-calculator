import * as XLSX from 'xlsx';
import { formatCurrency } from '../utils';

interface ExportData {
  income: number;
  totalRelief: number;
  taxableIncome: number;
  totalTax: number;
  breakdown: {
    bracket: { min: number; max: number | null; rate: number };
    taxableAmount: number;
    taxForBracket: number;
  }[];
  cpfTopUp?: number;
  srsContribution?: number;
}

interface TaxOptimizationData {
  currentBracket: {
    rate: number;
    min: number;
    max: number | null;
  };
  currentTaxSavings: number;
  additionalTaxSavings: number;
  totalPotentialSavings: number;
  remainingCapacity: {
    cpf: number;
    srs: number;
    total: number;
  };
  currentTax: {
    taxableIncome: number;
    breakdown: {
      bracket: { min: number; max: number | null; rate: number };
      taxableAmount: number;
      taxForBracket: number;
    }[];
    totalTax: number;
  };
  potentialTax: {
    taxableIncome: number;
    breakdown: {
      bracket: { min: number; max: number | null; rate: number };
      taxableAmount: number;
      taxForBracket: number;
    }[];
    totalTax: number;
  };
}

export function exportToExcel(data: ExportData) {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  
  // Format tax breakdown data
  const breakdownRows = data.breakdown.map(item => ({
    'Tax Rate': `${(item.bracket.rate * 100).toFixed(1)}%`,
    'Income Range': item.bracket.max ? 
      `${formatCurrency(item.bracket.min)} - ${formatCurrency(item.bracket.max)}` :
      `Above ${formatCurrency(item.bracket.min)}`,
    'Taxable Amount': formatCurrency(item.taxableAmount),
    'Tax': formatCurrency(item.taxForBracket)
  }));

  // Summary data
  const summaryData = [
    ['Singapore Tax Calculation Summary', ''],
    ['', ''],
    ['Income Details', ''],
    ['Gross Income', formatCurrency(data.income)],
    ['Total Relief', formatCurrency(data.totalRelief)],
    ['└ CPF Cash Top-up', formatCurrency(data.cpfTopUp || 0)],
    ['└ SRS Contribution', formatCurrency(data.srsContribution || 0)],
    ['Taxable Income', formatCurrency(data.taxableIncome)],
    ['Total Tax', formatCurrency(data.totalTax)],
    ['', ''],
    ['Tax Breakdown by Rate', ''],
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Add breakdown table
  const breakdownWS = XLSX.utils.json_to_sheet(breakdownRows);
  XLSX.utils.sheet_add_json(ws, breakdownRows, {
    origin: 'A12'
  });

  // Add to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Tax Calculation');

  // Generate Excel file
  XLSX.writeFile(wb, 'singapore-tax-calculation.xlsx');
}

export function exportTaxOptimizationToExcel(data: TaxOptimizationData) {
  const wb = XLSX.utils.book_new();

  // Summary data
  const summaryData = [
    ['Tax Optimization Summary', ''],
    ['', ''],
    ['Current Tax Bracket', `${(data.currentBracket.rate * 100).toFixed(1)}%`],
    ['', ''],
    ['Tax Savings', ''],
    ['Current Tax Savings', formatCurrency(data.currentTaxSavings)],
    ['Additional Potential Savings', formatCurrency(data.additionalTaxSavings)],
    ['Total Potential Savings', formatCurrency(data.totalPotentialSavings)],
    ['', ''],
    ['Available Relief Capacity', ''],
    ['CPF Cash Top-up', formatCurrency(data.remainingCapacity.cpf)],
    ['SRS Contribution', formatCurrency(data.remainingCapacity.srs)],
    ['Total Available', formatCurrency(data.remainingCapacity.total)],
    ['', ''],
    ['Current Tax Breakdown', ''],
    ['Taxable Income', formatCurrency(data.currentTax.taxableIncome)],
    ['Total Tax', formatCurrency(data.currentTax.totalTax)],
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(summaryData);

  // Add current tax breakdown
  const currentBreakdownRows = data.currentTax.breakdown.map(item => ({
    'Tax Rate': `${(item.bracket.rate * 100).toFixed(1)}%`,
    'Income Range': item.bracket.max ? 
      `${formatCurrency(item.bracket.min)} - ${formatCurrency(item.bracket.max)}` :
      `Above ${formatCurrency(item.bracket.min)}`,
    'Taxable Amount': formatCurrency(item.taxableAmount),
    'Tax': formatCurrency(item.taxForBracket)
  }));

  XLSX.utils.sheet_add_json(ws, currentBreakdownRows, {
    origin: 'A18'
  });

  // Add potential tax section
  const potentialTaxStart = 19 + currentBreakdownRows.length;
  const potentialTaxData = [
    ['', ''],
    ['Tax After Relief', ''],
    ['Taxable Income', formatCurrency(data.potentialTax.taxableIncome)],
    ['Total Tax', formatCurrency(data.potentialTax.totalTax)],
  ];

  XLSX.utils.sheet_add_aoa(ws, potentialTaxData, {
    origin: `A${potentialTaxStart}`
  });

  // Add potential tax breakdown
  const potentialBreakdownRows = data.potentialTax.breakdown.map(item => ({
    'Tax Rate': `${(item.bracket.rate * 100).toFixed(1)}%`,
    'Income Range': item.bracket.max ? 
      `${formatCurrency(item.bracket.min)} - ${formatCurrency(item.bracket.max)}` :
      `Above ${formatCurrency(item.bracket.min)}`,
    'Taxable Amount': formatCurrency(item.taxableAmount),
    'Tax': formatCurrency(item.taxForBracket)
  }));

  XLSX.utils.sheet_add_json(ws, potentialBreakdownRows, {
    origin: `A${potentialTaxStart + 4}`
  });

  // Add to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Tax Optimization');

  // Generate Excel file
  XLSX.writeFile(wb, 'tax-optimization-details.xlsx');
} 
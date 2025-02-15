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
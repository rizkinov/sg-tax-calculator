'use client';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { formatCurrency } from '@/lib/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TaxPieChartProps {
  income: number;
  tax: number;
}

export function TaxPieChart({ income, tax }: TaxPieChartProps) {
  const netIncome = income - tax;

  const data: ChartData<'pie'> = {
    labels: ['Net Income', 'Tax'],
    datasets: [
      {
        data: [netIncome, tax],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = ((value / income) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-4">Income Breakdown</h3>
      <div className="w-full max-w-xs mx-auto">
        <Pie data={data} options={options} />
      </div>
      <div className="mt-4 text-sm text-center space-y-1">
        <p>Gross Income: {formatCurrency(income)}</p>
        <p>Net Income: {formatCurrency(netIncome)} ({((netIncome / income) * 100).toFixed(1)}%)</p>
        <p>Total Tax: {formatCurrency(tax)} ({((tax / income) * 100).toFixed(1)}%)</p>
      </div>
    </div>
  );
} 
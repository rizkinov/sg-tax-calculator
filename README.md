# Singapore Tax Calculator

A web-based calculator for estimating Singapore income tax, with support for tax relief planning through CPF and SRS contributions.

## Features

- Calculate income tax for Employees, Sole Proprietors, and Corporations
- Support for CPF Cash Top-up and SRS contribution tax reliefs
- Visual breakdown of tax calculations with pie charts
- Smart tax savings suggestions
- Mobile-friendly interface

## Tax Calculation Methodology

### Individual Tax (Employees and Sole Proprietors)

The calculator uses Singapore's progressive tax rate structure for Year of Assessment 2024:

| Chargeable Income | Tax Rate (%) |
|------------------|--------------|
| First $20,000    | 0           |
| Next $10,000     | 2           |
| Next $10,000     | 3.5         |
| Next $40,000     | 7           |
| Next $40,000     | 11.5        |
| Next $40,000     | 15          |
| Next $40,000     | 18          |
| Next $40,000     | 19          |
| Next $40,000     | 19.5        |
| Next $40,000     | 20          |
| Above $320,000   | 22          |

### Corporate Tax
Flat rate of 17% on chargeable income.

### Tax Relief Options

1. **CPF Cash Top-up**
   - Maximum $8,000 for own account
   - Additional $8,000 for family members
   - Total maximum: $16,000

2. **SRS Contributions**
   - Singapore Citizens & PR: Up to $15,300
   - Foreigners: Up to $35,700

### Tax Savings Calculation

The tax savings suggestion feature works by:

1. **Identifying Tax Brackets**
   - Determines your current tax bracket based on taxable income
   - Identifies the next lower tax bracket

2. **Relief Calculation**
   - Calculates how much additional relief is needed to move to the lower bracket
   - Considers remaining relief capacity (up to maximum limits)
   - Suggests the smaller amount between:
     - Relief needed to reach lower bracket
     - Remaining relief capacity

3. **Savings Calculation**
   Example:
   - Current income: $200,000 (18% bracket)
   - Lower bracket threshold: $160,000 (15% bracket)
   - Suggested relief: $8,000
   - Tax savings = Relief amount × (Current rate - Lower rate)
   - $8,000 × (18% - 15%) = $240 in tax savings

## Development

Built with:
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- Chart.js
- Zod for validation

## Disclaimer

This calculator provides unofficial estimates only. All calculations should be verified with IRAS for the most current rates and regulations. 
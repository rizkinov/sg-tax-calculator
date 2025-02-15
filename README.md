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

The calculator supports two main types of tax relief with their respective limits:

1. **CPF Cash Top-up Relief**
   - Own CPF Account: Up to $8,000
   - Family Members' CPF Accounts: Up to $8,000
   - Total CPF Relief Limit: $16,000

2. **Supplementary Retirement Scheme (SRS) Relief**
   - Singapore Citizens & PR: Up to $15,300
   - Foreigners: Up to $35,700

Maximum Combined Relief:
- Citizens & PR: Up to $31,300 ($16,000 CPF + $15,300 SRS)
- Foreigners: Up to $51,700 ($16,000 CPF + $35,700 SRS)

### Tax Savings Calculation

The tax savings suggestion feature works by:

1. **Identifying Tax Brackets**
   - Determines your current tax bracket based on taxable income
   - Identifies the next lower tax bracket

2. **Relief Calculation**
   - Calculates how much additional relief is needed to move to the lower bracket
   - Considers remaining relief capacity (based on citizenship status)
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

The calculator will suggest optimal relief contributions while ensuring you stay within the maximum relief limits based on the type of relief and your residency status.

## Development

Built with:
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- Chart.js
- Zod for validation

## Disclaimer

This calculator provides unofficial estimates only. All calculations should be verified with IRAS for the most current rates and regulations. Tax relief limits and eligibility criteria may change - please consult IRAS or a tax professional for the most up-to-date information. 
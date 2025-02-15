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

1. **CPF Cash Top-up Relief** (Singapore Citizens & PR only)
   - Own CPF Account: Up to $8,000
   - Family Members' CPF Accounts: Up to $8,000
   - Total CPF Relief Limit: $16,000

2. **Supplementary Retirement Scheme (SRS) Relief**
   - Singapore Citizens & PR: Up to $15,300
   - Foreigners: Up to $35,700

Maximum Combined Relief:
- Citizens & PR: Up to $31,300 ($16,000 CPF + $15,300 SRS)
- Foreigners: Up to $35,700 (SRS only)

### Tax Savings Calculation Examples

#### Example 1: Singapore Citizen/PR - Can Move to Lower Bracket

Input:
- Annual Income: $165,000
- Taxpayer Type: Employee
- Citizenship: Singapore Citizen/PR
- Current Relief: $4,000 (CPF Cash Top-up)

Calculation:
1. Current Status:
   - Taxable Income: $161,000 ($165,000 - $4,000)
   - Current Tax Bracket: 18% (taxable income between $160,000 to $200,000)
   - Total Tax: $16,750

2. Tax Saving Opportunity:
   - Next Lower Bracket: 15% (applies to income between $120,000 to $160,000)
   - Additional Relief Needed: $1,000 ($161,000 - $160,000)
   - Maximum Combined Relief: $31,300
     * CPF Cash Top-up: $16,000 ($8,000 own + $8,000 family)
     * SRS: $15,300
   - Current Relief Used: $4,000
   - Remaining Relief Capacity: $27,300 ($31,300 max - $4,000 current)
   - Suggested Relief: $1,000 (enough to move to lower bracket)
   - Potential Tax Savings: $30 
     ($1,000 × (18% - 15%) = $1,000 × 3% = $30)

#### Example 2: Singapore Citizen/PR - Maximum Relief but Same Bracket

Input:
- Annual Income: $200,000
- Taxpayer Type: Employee
- Citizenship: Singapore Citizen/PR
- Current Relief: $8,000 (CPF Cash Top-up)

Calculation:
1. Current Status:
   - Taxable Income: $192,000 ($200,000 - $8,000)
   - Current Tax Bracket: 18% (taxable income between $160,000 to $200,000)
   - Total Tax: $19,709.82

2. Tax Optimization Note:
   - Remaining in 18% bracket even with maximum relief
   - Maximum Combined Relief: $31,300
   - Current Relief Used: $8,000
   - Additional Possible Relief: $23,300
   - Potential Tax Savings: $699
     ($23,300 × 3% = $699 savings within same bracket)

#### Example 3: Foreigner - SRS Only

Input:
- Annual Income: $200,000
- Taxpayer Type: Employee
- Citizenship: Foreigner
- Current Relief: $10,000 (SRS)

Calculation:
1. Current Status:
   - Taxable Income: $190,000 ($200,000 - $10,000)
   - Current Tax Bracket: 18% (taxable income between $160,000 to $200,000)
   - Total Tax: $19,349.82

2. Tax Optimization Note:
   - Maximum Relief: $35,700 (SRS only, not eligible for CPF)
   - Current Relief Used: $10,000
   - Additional Possible Relief: $25,700
   - Potential Tax Savings: $771
     ($25,700 × 3% = $771 savings within same bracket)
   - Note: Not eligible for CPF Cash Top-up

#### Example 4: Singapore Citizen/PR - Lower Income Bracket

Input:
- Annual Income: $100,000
- Taxpayer Type: Employee
- Citizenship: Singapore Citizen/PR
- Current Relief: $5,000 (CPF Cash Top-up)

Calculation:
1. Current Status:
   - Taxable Income: $95,000 ($100,000 - $5,000)
   - Current Tax Bracket: 11.5% (taxable income between $80,000 to $120,000)
   - Total Tax: $5,350

2. Tax Saving Opportunity:
   - Next Lower Bracket: 7% (applies to income between $40,000 to $80,000)
   - Additional Relief Needed: $15,000 ($95,000 - $80,000)
   - Maximum Combined Relief: $31,300
   - Current Relief Used: $5,000
   - Remaining Relief Capacity: $26,300
   - Suggested Relief: $15,000 (can move to lower bracket)
   - Potential Tax Savings: $675
     ($15,000 × (11.5% - 7%) = $15,000 × 4.5% = $675)

Note: The calculator suggests optimal relief contributions while ensuring you stay within the maximum relief limits based on your residency status. Other tax reliefs (e.g., Parent Relief, Course Fees Relief) are not included in these calculations but could provide additional tax savings.

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
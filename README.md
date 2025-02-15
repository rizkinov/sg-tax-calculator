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

#### Example 1: Singapore Citizen/PR

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

2. Tax Saving Opportunity:
   - Next Lower Bracket: 15% (applies to income between $120,000 to $160,000)
   - Additional Relief Needed: $32,000 ($192,000 - $160,000)
   - Maximum Combined Relief: $31,300
     * CPF Cash Top-up: $16,000 ($8,000 own + $8,000 family)
     * SRS: $15,300
   - Current Relief Used: $8,000
   - Remaining Relief Capacity: $23,300 ($31,300 max - $8,000 current)
   - Suggested Relief: $23,300 (limited by remaining capacity)
   - Potential Tax Savings: $699 
     ($23,300 × (18% - 15%) = $23,300 × 3% = $699)

3. Available Options:
   - Can contribute up to $8,000 more to CPF
   - Can contribute up to $15,300 to SRS
   - Total remaining capacity: $23,300

#### Example 2: Foreigner

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

2. Tax Saving Opportunity:
   - Next Lower Bracket: 15% (applies to income between $120,000 to $160,000)
   - Additional Relief Needed: $30,000 ($190,000 - $160,000)
   - Maximum Relief: $35,700 (SRS only, not eligible for CPF)
   - Current Relief Used: $10,000
   - Remaining Relief Capacity: $25,700 ($35,700 max - $10,000 current)
   - Suggested Relief: $25,700 (limited by remaining capacity)
   - Potential Tax Savings: $771
     ($25,700 × (18% - 15%) = $25,700 × 3% = $771)

3. Available Options:
   - Can contribute up to $25,700 more to SRS
   - Not eligible for CPF Cash Top-up
   - Total remaining capacity: $25,700

Note: The calculator suggests optimal relief contributions while ensuring you stay within the maximum relief limits based on your residency status. Other tax reliefs (e.g., Parent Relief, Course Fees Relief) are not included in these calculations.

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
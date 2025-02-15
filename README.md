# Singapore Tax Calculator

A web-based calculator for estimating Singapore income tax, with support for tax relief planning through CPF and SRS contributions. All calculations are performed locally in your browser with no server storage.

## Features

### Tax Calculation
- Progressive tax calculation for YA2024
- Support for Citizens/PR and Foreigners
- Detailed breakdown by tax brackets
- Visual representation with pie charts
- Export calculations to Excel

### Tax Relief Support
- **CPF Cash Top-up (Citizens/PR)**
  - Maximum: $16,000 ($8,000 own + $8,000 family)
  - Real-time validation of limits
  - Automatic calculation of remaining capacity
- **SRS Contributions**
  - Citizens/PR: $15,300
  - Foreigners: $35,700
  - Automatic adjustment based on residency status

### Tax Optimization
- Real-time tax saving suggestions
- Bracket movement analysis
- Current vs potential tax comparison
- Relief capacity tracking
- Automatic limit validation
- Warning system for exceeded limits

## How It Works

### Tax Calculation Process
```typescript
// 1. Calculate total relief
const totalRelief = cpfTopUp + srsContribution

// 2. Determine taxable income
const taxableIncome = Math.max(0, income - totalRelief)

// 3. Apply progressive tax rates
const tax = calculateProgressiveTax(taxableIncome)

// 4. Calculate potential savings
const additionalRelief = calculateRemainingReliefCapacity()
const potentialTax = calculateProgressiveTax(taxableIncome - additionalRelief)
const possibleSavings = tax - potentialTax
```

### Relief Limits
```typescript
// For Citizens/PR
const MAX_CPF_RELIEF = 16000  // $8,000 own + $8,000 family
const MAX_SRS = 15300

// For Foreigners
const MAX_SRS = 35700
const MAX_CPF_RELIEF = 0      // Not eligible
```

## Development

### Setup
```
npm install
npm run dev
```

### Tech Stack
- **Framework:** Next.js 14
- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Form Handling:** React Hook Form, Zod
- **Visualization:** Chart.js
- **Data Export:** XLSX

### Key Components
- Progressive tax bracket calculator
- Relief capacity tracker
- Tax optimization analyzer
- Excel report generator
- Interactive tax breakdown charts

## Disclaimer

This calculator provides unofficial estimates based on IRAS guidelines for Year of Assessment 2024 (income earned in 2023). While we strive for accuracy, please verify all calculations with IRAS or a qualified tax professional. Tax rates and thresholds are subject to change.

For the most current information, visit [IRAS](https://www.iras.gov.sg).

Last Updated: February 2025

## License

MIT 
import { z } from 'zod';

export const taxCalculatorSchema = z.object({
  income: z.number({
    required_error: 'Please enter your annual income',
    invalid_type_error: 'Income must be a number',
  })
    .min(0, 'Income must be a positive number')
    .max(10000000, 'Income must be less than 10 million'),
  taxpayerType: z.enum(['EMPLOYEE', 'SOLE_PROPRIETOR', 'CORPORATION'], {
    required_error: 'Please select a taxpayer type',
  }),
  cpfTopUp: z.number()
    .min(0, 'CPF top-up must be a positive number')
    .max(16000, 'Maximum CPF top-up relief is $16,000 ($8,000 for own account and $8,000 for family members)')
    .optional()
    .default(0),
  srsContribution: z.number()
    .min(0, 'SRS contribution must be a positive number')
    .max(35700, 'Maximum SRS contribution is $15,300 for Citizens & PR, and $35,700 for Foreigners')
    .optional()
    .default(0),
});

export type TaxCalculatorInputs = z.infer<typeof taxCalculatorSchema>; 
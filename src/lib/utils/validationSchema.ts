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
  citizenshipStatus: z.enum(['CITIZEN_PR', 'FOREIGNER'], {
    required_error: 'Please select your citizenship status',
  }),
  cpfTopUp: z.number()
    .min(0, 'CPF top-up must be a positive number')
    .max(16000, 'Maximum CPF top-up relief is $16,000 ($8,000 for own account and $8,000 for family members)')
    .optional()
    .default(0),
  srsContribution: z.number()
    .min(0, 'SRS contribution must be a positive number')
    .optional()
    .default(0),
}).refine((data) => {
  const maxSRS = data.citizenshipStatus === 'FOREIGNER' ? 35700 : 15300;
  return data.srsContribution <= maxSRS;
}, {
  message: (data) => {
    const maxSRS = data.citizenshipStatus === 'FOREIGNER' ? 35700 : 15300;
    return `Maximum SRS contribution is $${maxSRS.toLocaleString()} for ${
      data.citizenshipStatus === 'FOREIGNER' ? 'Foreigners' : 'Citizens & PR'
    }`;
  },
  path: ['srsContribution'], // This will show the error on the SRS field
});

export type TaxCalculatorInputs = z.infer<typeof taxCalculatorSchema>; 
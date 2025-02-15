import { z } from 'zod';

const srsSchema = z.number()
  .min(0, 'SRS contribution must be a positive number')
  .optional()
  .default(0);

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
  srsContribution: z.object({
    citizenshipStatus: z.enum(['CITIZEN_PR', 'FOREIGNER']),
    value: srsSchema,
  }).transform((data) => {
    const maxSRS = data.citizenshipStatus === 'FOREIGNER' ? 35700 : 15300;
    if (data.value > maxSRS) {
      throw new Error(`Maximum SRS contribution is $${maxSRS.toLocaleString()} for ${
        data.citizenshipStatus === 'FOREIGNER' ? 'Foreigners' : 'Citizens & PR'
      }`);
    }
    return data.value;
  }),
});

export type TaxCalculatorInputs = z.infer<typeof taxCalculatorSchema>; 
import { render, screen } from '@testing-library/react';
import { TaxSavingSuggestions } from '../TaxSavingSuggestions';

describe('TaxSavingSuggestions', () => {
  const testCases = [
    {
      name: 'Citizen can move to lower bracket',
      props: {
        income: 165000,
        currentRelief: 4000,
        taxableIncome: 161000,
        citizenshipStatus: 'CITIZEN_PR' as const,
      },
      expectedSavings: 30,
      shouldShowLowerBracketMessage: true,
    },
    {
      name: 'Citizen stays in same bracket',
      props: {
        income: 200000,
        currentRelief: 8000,
        taxableIncome: 192000,
        citizenshipStatus: 'CITIZEN_PR' as const,
      },
      expectedSavings: 4194,
      shouldShowLowerBracketMessage: false,
    },
    {
      name: 'Foreigner with SRS only',
      props: {
        income: 200000,
        currentRelief: 10000,
        taxableIncome: 190000,
        citizenshipStatus: 'FOREIGNER' as const,
      },
      expectedSavings: 4626,
      shouldShowLowerBracketMessage: false,
    },
  ];

  testCases.forEach(({ name, props, expectedSavings, shouldShowLowerBracketMessage }) => {
    it(name, () => {
      render(<TaxSavingSuggestions {...props} />);
      
      expect(screen.getByText(`Potential tax savings: $${expectedSavings.toLocaleString()}`)).toBeInTheDocument();
      
      if (shouldShowLowerBracketMessage) {
        expect(screen.getByText(/you could move to the/i)).toBeInTheDocument();
      } else {
        expect(screen.getByText(/you would remain in this bracket/i)).toBeInTheDocument();
      }
    });
  });
}); 
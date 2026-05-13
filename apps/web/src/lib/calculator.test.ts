/**
 * Unit Tests for AI Case Calculator
 * 
 * Run with: npm test
 */

import {
  calculateEstimate,
  determineInjuryCategory,
  getSeverityWeight,
  getFaultModifier,
  getTimingModifier,
  calculateWithoutAttorney,
  calculateWithAttorney,
  formatCurrency,
  formatRange,
  shouldShowStatuteWarning,
  validateInputs,
} from './calculator';

import { CALC_CONSTANTS } from './sources';
import { CalculatorInputs, InjurySelection } from './types';

describe('Calculator Core Functions', () => {
  
  describe('determineInjuryCategory', () => {
    it('returns "none" when noInjury is true', () => {
      const injuries: InjurySelection = {
        softTissue: [],
        substantial: [],
        catastrophic: [],
        noInjury: true,
      };
      expect(determineInjuryCategory(injuries)).toBe('none');
    });

    it('returns "catastrophic" when catastrophic injuries selected', () => {
      const injuries: InjurySelection = {
        softTissue: ['body_aches'],
        substantial: ['broken_bones'],
        catastrophic: ['brain_injury'],
        noInjury: false,
      };
      expect(determineInjuryCategory(injuries)).toBe('catastrophic');
    });

    it('returns "substantial" when substantial but no catastrophic', () => {
      const injuries: InjurySelection = {
        softTissue: ['body_aches'],
        substantial: ['broken_bones'],
        catastrophic: [],
        noInjury: false,
      };
      expect(determineInjuryCategory(injuries)).toBe('substantial');
    });

    it('returns "soft_tissue" when only soft tissue injuries', () => {
      const injuries: InjurySelection = {
        softTissue: ['cuts_scrapes_bruises'],
        substantial: [],
        catastrophic: [],
        noInjury: false,
      };
      expect(determineInjuryCategory(injuries)).toBe('soft_tissue');
    });

    it('returns "none" when no injuries selected and noInjury false', () => {
      const injuries: InjurySelection = {
        softTissue: [],
        substantial: [],
        catastrophic: [],
        noInjury: false,
      };
      expect(determineInjuryCategory(injuries)).toBe('none');
    });
  });

  describe('getSeverityWeight', () => {
    it('returns correct weights for each category', () => {
      expect(getSeverityWeight('none')).toBe(0);
      expect(getSeverityWeight('soft_tissue')).toBe(0.15);
      expect(getSeverityWeight('substantial')).toBe(0.5);
      expect(getSeverityWeight('catastrophic')).toBe(1.0);
    });
  });

  describe('getFaultModifier', () => {
    it('returns correct modifiers', () => {
      expect(getFaultModifier('not_at_fault')).toBe(1.0);
      expect(getFaultModifier('partial_fault')).toBe(0.5);
      expect(getFaultModifier('at_fault')).toBe(0);
    });
  });

  describe('getTimingModifier', () => {
    it('returns correct modifiers', () => {
      expect(getTimingModifier('less_than_30_days')).toBe(1.0);
      expect(getTimingModifier('one_to_three_months')).toBe(1.0);
      expect(getTimingModifier('three_to_six_months')).toBe(0.95);
      expect(getTimingModifier('six_to_twelve_months')).toBe(0.90);
      expect(getTimingModifier('one_to_two_years')).toBe(0.80);
      expect(getTimingModifier('more_than_two_years')).toBe(0.50);
    });
  });

  describe('shouldShowStatuteWarning', () => {
    it('returns true for old accidents', () => {
      expect(shouldShowStatuteWarning('one_to_two_years')).toBe(true);
      expect(shouldShowStatuteWarning('more_than_two_years')).toBe(true);
    });

    it('returns false for recent accidents', () => {
      expect(shouldShowStatuteWarning('less_than_30_days')).toBe(false);
      expect(shouldShowStatuteWarning('six_to_twelve_months')).toBe(false);
    });
  });

  describe('calculateWithoutAttorney', () => {
    it('returns zero range for no injuries', () => {
      const result = calculateWithoutAttorney(0, 1, 1, false);
      expect(result.low).toBe(0);
      expect(result.high).toBe(0);
    });

    it('includes property damage when flagged', () => {
      const withProperty = calculateWithoutAttorney(0.5, 1, 1, true);
      const withoutProperty = calculateWithoutAttorney(0.5, 1, 1, false);
      expect(withProperty.low).toBeGreaterThan(withoutProperty.low);
      expect(withProperty.high).toBeGreaterThan(withoutProperty.high);
    });

    it('applies fault modifier correctly', () => {
      const notAtFault = calculateWithoutAttorney(0.5, 1.0, 1, false);
      const partialFault = calculateWithoutAttorney(0.5, 0.5, 1, false);
      expect(partialFault.high).toBe(Math.ceil(notAtFault.high * 0.5));
    });

    it('rounds UP all values', () => {
      const result = calculateWithoutAttorney(0.15, 1, 1, false);
      expect(result.low).toBe(Math.ceil(CALC_CONSTANTS.BODILY_INJURY_AVG * 0.15 * 0.5));
      expect(result.high).toBe(Math.ceil(CALC_CONSTANTS.BODILY_INJURY_AVG * 0.15));
    });
  });

  describe('calculateWithAttorney', () => {
    it('applies multiplier method correctly', () => {
      const severityWeight = 0.5;
      const result = calculateWithAttorney(severityWeight, 1, 1, false);
      
      const economic = CALC_CONSTANTS.BODILY_INJURY_AVG * severityWeight;
      const expectedGrossLow = economic + (economic * CALC_CONSTANTS.MULTIPLIER_LOW);
      const expectedGrossHigh = economic + (economic * CALC_CONSTANTS.MULTIPLIER_HIGH);
      
      expect(result.grossLow).toBe(Math.ceil(expectedGrossLow));
      expect(result.grossHigh).toBe(Math.ceil(expectedGrossHigh));
    });

    it('calculates net after fees correctly', () => {
      const result = calculateWithAttorney(0.5, 1, 1, false);
      const feeRate = CALC_CONSTANTS.ASSUMED_CONTINGENT_FEE;
      
      expect(result.netLow).toBeLessThan(result.grossLow);
      expect(result.netHigh).toBeLessThan(result.grossHigh);
      expect(result.assumedFeeRate).toBe(feeRate);
    });

    it('includes fee disclaimer', () => {
      const result = calculateWithAttorney(0.5, 1, 1, false);
      expect(result.assumedFeeDisclaimer).toContain('33%');
      expect(result.assumedFeeDisclaimer).toContain('illustrative');
    });

    it('rounds UP all values', () => {
      const result = calculateWithAttorney(0.15, 1, 1, true);
      expect(Number.isInteger(result.grossLow)).toBe(true);
      expect(Number.isInteger(result.grossHigh)).toBe(true);
      expect(Number.isInteger(result.netLow)).toBe(true);
      expect(Number.isInteger(result.netHigh)).toBe(true);
    });
  });

  describe('formatCurrency', () => {
    it('formats with dollar sign and commas', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(28278)).toBe('$28,278');
      expect(formatCurrency(0)).toBe('$0');
    });

    it('rounds to whole dollars', () => {
      expect(formatCurrency(1000.99)).toBe('$1,001');
      expect(formatCurrency(1000.01)).toBe('$1,000');
    });
  });

  describe('formatRange', () => {
    it('formats range with dash', () => {
      expect(formatRange(1000, 5000)).toBe('$1,000 – $5,000');
    });
  });
});

describe('Full Calculation Scenarios', () => {
  
  const baseInputs: CalculatorInputs = {
    accidentType: 'car_accident',
    injuries: {
      softTissue: [],
      substantial: [],
      catastrophic: [],
      noInjury: false,
    },
    faultStatus: 'not_at_fault',
    accidentTiming: 'less_than_30_days',
    zipCode: '90210',
    hasPropertyDamage: false,
  };

  describe('Scenario: Soft tissue injury, not at fault, recent', () => {
    it('calculates reasonable ranges', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        injuries: {
          softTissue: ['body_aches'],
          substantial: [],
          catastrophic: [],
          noInjury: false,
        },
      };

      const result = calculateEstimate(inputs);

      expect(result.severityCategory).toBe('soft_tissue');
      expect(result.withoutAttorney.low).toBeGreaterThan(0);
      expect(result.withoutAttorney.high).toBeGreaterThan(result.withoutAttorney.low);
      expect(result.withAttorney.grossHigh).toBeGreaterThan(result.withoutAttorney.high);
      expect(result.citations.length).toBeGreaterThan(0);
      expect(result.disclaimers.length).toBeGreaterThan(0);
    });
  });

  describe('Scenario: Catastrophic injury with property damage', () => {
    it('calculates maximum severity ranges', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        injuries: {
          softTissue: [],
          substantial: [],
          catastrophic: ['brain_injury', 'paralysis'],
          noInjury: false,
        },
        hasPropertyDamage: true,
      };

      const result = calculateEstimate(inputs);

      expect(result.severityCategory).toBe('catastrophic');
      expect(result.severityWeight).toBe(1.0);
      expect(result.withAttorney.grossHigh).toBeGreaterThan(100000);
    });
  });

  describe('Scenario: At fault accident', () => {
    it('returns zero ranges', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        injuries: {
          softTissue: ['body_aches'],
          substantial: [],
          catastrophic: [],
          noInjury: false,
        },
        faultStatus: 'at_fault',
      };

      const result = calculateEstimate(inputs);

      expect(result.withoutAttorney.low).toBe(0);
      expect(result.withoutAttorney.high).toBe(0);
      expect(result.disclaimers.some(d => d.includes('your fault'))).toBe(true);
    });
  });

  describe('Scenario: Old accident (statute warning)', () => {
    it('shows statute of limitations warning', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        injuries: {
          softTissue: ['body_aches'],
          substantial: [],
          catastrophic: [],
          noInjury: false,
        },
        accidentTiming: 'more_than_two_years',
      };

      const result = calculateEstimate(inputs);

      expect(result.showStatuteWarning).toBe(true);
      expect(result.disclaimers[0]).toContain('TIME-SENSITIVE');
      expect(result.timingModifier).toBe(0.5);
    });
  });

  describe('Scenario: No injuries', () => {
    it('returns property-only value if property damage', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        injuries: {
          softTissue: [],
          substantial: [],
          catastrophic: [],
          noInjury: true,
        },
        hasPropertyDamage: true,
      };

      const result = calculateEstimate(inputs);

      expect(result.severityCategory).toBe('none');
      expect(result.withoutAttorney.low).toBe(CALC_CONSTANTS.PROPERTY_DAMAGE_AVG);
    });
  });
});

describe('Input Validation', () => {
  it('catches missing accident type', () => {
    const errors = validateInputs({});
    expect(errors).toContain('Please select an accident type');
  });

  it('validates zip code format', () => {
    const errors = validateInputs({ zipCode: '123' });
    expect(errors).toContain('Please enter a valid 5-digit zip code');
  });

  it('returns no errors for complete valid input', () => {
    const errors = validateInputs({
      accidentType: 'car_accident',
      injuries: { softTissue: [], substantial: [], catastrophic: [], noInjury: true },
      faultStatus: 'not_at_fault',
      accidentTiming: 'less_than_30_days',
      zipCode: '90210',
    });
    expect(errors.length).toBe(0);
  });
});

describe('Model Version and Citations', () => {
  it('includes model version in result', () => {
    const inputs: CalculatorInputs = {
      accidentType: 'car_accident',
      injuries: { softTissue: ['body_aches'], substantial: [], catastrophic: [], noInjury: false },
      faultStatus: 'not_at_fault',
      accidentTiming: 'less_than_30_days',
      zipCode: '90210',
      hasPropertyDamage: false,
    };

    const result = calculateEstimate(inputs);
    expect(result.modelVersion).toBeDefined();
    expect(result.modelVersion).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('includes citations with valid URLs', () => {
    const inputs: CalculatorInputs = {
      accidentType: 'car_accident',
      injuries: { softTissue: ['body_aches'], substantial: [], catastrophic: [], noInjury: false },
      faultStatus: 'not_at_fault',
      accidentTiming: 'less_than_30_days',
      zipCode: '90210',
      hasPropertyDamage: true,
    };

    const result = calculateEstimate(inputs);
    
    expect(result.citations.length).toBeGreaterThan(0);
    result.citations.forEach(citation => {
      expect(citation.url).toMatch(/^https?:\/\//);
      expect(citation.sourceName).toBeTruthy();
    });
  });
});

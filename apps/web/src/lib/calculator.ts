/**
 * AI Case Calculator - Deterministic Calculation Engine
 * 
 * All calculations are based on publicly available sources.
 * All monetary outputs are rounded UP to nearest dollar.
 */

import {
  CalculatorInputs,
  CalculatorResult,
  InjuryCategory,
  InjurySelection,
  FaultStatus,
  AccidentTiming,
  WithoutAttorneyResult,
  WithAttorneyResult,
} from './types';

import {
  CALC_CONSTANTS,
  Citation,
  createCitation,
  MODEL_VERSION,
} from './sources';

/**
 * Round UP to nearest dollar (always optimistic rounding)
 */
function roundUp(value: number): number {
  return Math.ceil(value);
}

/**
 * Determine the highest injury severity category from selections
 */
export function determineInjuryCategory(injuries: InjurySelection): InjuryCategory {
  if (injuries.noInjury) {
    return 'none';
  }
  
  if (injuries.catastrophic.length > 0) {
    return 'catastrophic';
  }
  
  if (injuries.substantial.length > 0) {
    return 'substantial';
  }
  
  if (injuries.softTissue.length > 0) {
    return 'soft_tissue';
  }
  
  return 'none';
}

/**
 * Get severity weight for injury category
 */
export function getSeverityWeight(category: InjuryCategory): number {
  return CALC_CONSTANTS.SEVERITY_WEIGHTS[category];
}

/**
 * Get fault modifier
 */
export function getFaultModifier(faultStatus: FaultStatus): number {
  return CALC_CONSTANTS.FAULT_MODIFIERS[faultStatus];
}

/**
 * Get timing modifier
 */
export function getTimingModifier(timing: AccidentTiming): number {
  return CALC_CONSTANTS.TIMING_MODIFIERS[timing];
}

/**
 * Check if statute of limitations warning should be shown
 */
export function shouldShowStatuteWarning(timing: AccidentTiming): boolean {
  return timing === 'one_to_two_years' || timing === 'more_than_two_years';
}

/**
 * Calculate Model A: Without Attorney (Early Settlement Band)
 * Based on III paid-claim averages with conservative composition
 */
export function calculateWithoutAttorney(
  severityWeight: number,
  faultModifier: number,
  timingModifier: number,
  hasPropertyDamage: boolean
): WithoutAttorneyResult {
  const bodilyInjuryBase = CALC_CONSTANTS.BODILY_INJURY_AVG * severityWeight;
  const propertyComponent = hasPropertyDamage ? CALC_CONSTANTS.PROPERTY_DAMAGE_AVG : 0;
  
  const combinedModifier = faultModifier * timingModifier;
  
  const rawLow = (bodilyInjuryBase * 0.5 + propertyComponent) * combinedModifier;
  const rawHigh = (bodilyInjuryBase * 1.0 + propertyComponent) * combinedModifier;
  
  return {
    low: roundUp(rawLow),
    high: roundUp(rawHigh),
  };
}

/**
 * Calculate Model B: With Attorney (Negotiated Upside Band)
 * Applies multiplier method for non-economic damages
 */
export function calculateWithAttorney(
  severityWeight: number,
  faultModifier: number,
  timingModifier: number,
  hasPropertyDamage: boolean
): WithAttorneyResult {
  const bodilyInjuryBase = CALC_CONSTANTS.BODILY_INJURY_AVG * severityWeight;
  const propertyComponent = hasPropertyDamage ? CALC_CONSTANTS.PROPERTY_DAMAGE_AVG : 0;
  const totalEconomic = bodilyInjuryBase + propertyComponent;
  
  const combinedModifier = faultModifier * timingModifier;
  
  const nonEconomicLow = totalEconomic * CALC_CONSTANTS.MULTIPLIER_LOW;
  const nonEconomicHigh = totalEconomic * CALC_CONSTANTS.MULTIPLIER_HIGH;
  
  const grossLow = (totalEconomic + nonEconomicLow) * combinedModifier;
  const grossHigh = (totalEconomic + nonEconomicHigh) * combinedModifier;
  
  const feeRate = CALC_CONSTANTS.ASSUMED_CONTINGENT_FEE;
  const netLow = grossLow * (1 - feeRate);
  const netHigh = grossHigh * (1 - feeRate);
  
  return {
    grossLow: roundUp(grossLow),
    grossHigh: roundUp(grossHigh),
    netLow: roundUp(netLow),
    netHigh: roundUp(netHigh),
    assumedFeeRate: feeRate,
    assumedFeeDisclaimer: `The "after fees" estimate assumes a ${Math.round(feeRate * 100)}% contingent fee as an illustrative example only. Actual attorney fees vary by firm and case complexity.`,
  };
}

/**
 * Get citations used in calculation
 */
function getCalculationCitations(hasPropertyDamage: boolean): Citation[] {
  const citations: Citation[] = [
    createCitation('III', 'bodilyInjuryAvg'),
  ];
  
  if (hasPropertyDamage) {
    citations.push(createCitation('III', 'propertyDamageAvg'));
  }
  
  citations.push(createCitation('LAWYERS_COM', 'multiplierLow'));
  citations.push(createCitation('LAWYERS_COM', 'multiplierHigh'));
  
  return citations;
}

/**
 * Get disclaimers based on calculation context
 */
function getDisclaimers(showStatuteWarning: boolean, faultStatus: FaultStatus): string[] {
  const disclaimers: string[] = [
    'This calculator provides illustrative estimates for educational purposes only. It is NOT legal advice and does NOT predict your actual case outcome.',
    'Real settlements and verdicts vary significantly based on specific facts, evidence, jurisdiction, insurance coverage, and many other factors.',
    'The ranges shown are based on publicly available industry averages and standard estimation frameworks.',
    'Consult with a qualified attorney for advice specific to your situation.',
  ];
  
  if (showStatuteWarning) {
    disclaimers.unshift(
      '⚠️ TIME-SENSITIVE: Most states impose a 2-3 year deadline (statute of limitations) to file personal injury claims. Based on your accident date, you should consult an attorney promptly to understand your specific deadline.'
    );
  }
  
  if (faultStatus === 'at_fault') {
    disclaimers.push(
      'Note: Since you indicated the accident was your fault, recovery from the other party is typically not available. However, you may have other coverage options. Consult an attorney for your specific situation.'
    );
  }
  
  if (faultStatus === 'partial_fault') {
    disclaimers.push(
      'Note: Partial fault can reduce your recovery under comparative/contributory negligence rules, which vary by state. The estimates above reflect a simplified reduction.'
    );
  }
  
  return disclaimers;
}

/**
 * Main calculation function
 */
export function calculateEstimate(inputs: CalculatorInputs): CalculatorResult {
  const severityCategory = determineInjuryCategory(inputs.injuries);
  const severityWeight = getSeverityWeight(severityCategory);
  const faultModifier = getFaultModifier(inputs.faultStatus);
  const timingModifier = getTimingModifier(inputs.accidentTiming);
  const showStatuteWarning = shouldShowStatuteWarning(inputs.accidentTiming);
  
  const withoutAttorney = calculateWithoutAttorney(
    severityWeight,
    faultModifier,
    timingModifier,
    inputs.hasPropertyDamage
  );
  
  const withAttorney = calculateWithAttorney(
    severityWeight,
    faultModifier,
    timingModifier,
    inputs.hasPropertyDamage
  );
  
  const citations = getCalculationCitations(inputs.hasPropertyDamage);
  const disclaimers = getDisclaimers(showStatuteWarning, inputs.faultStatus);
  
  return {
    withoutAttorney,
    withAttorney,
    severityCategory,
    severityWeight,
    faultModifier,
    timingModifier,
    showStatuteWarning,
    modelVersion: MODEL_VERSION,
    calculatedAt: new Date().toISOString(),
    citations,
    disclaimers,
  };
}

/**
 * Format currency for display (rounded up values)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format range for display
 */
export function formatRange(low: number, high: number): string {
  return `${formatCurrency(low)} – ${formatCurrency(high)}`;
}

/**
 * Get human-readable injury category label
 */
export function getInjuryCategoryLabel(category: InjuryCategory): string {
  const labels: Record<InjuryCategory, string> = {
    none: 'No Injuries',
    soft_tissue: 'Soft Tissue Injuries',
    substantial: 'Substantial Injuries',
    catastrophic: 'Catastrophic Injuries',
  };
  return labels[category];
}

/**
 * Validate calculator inputs
 */
export function validateInputs(inputs: Partial<CalculatorInputs>): string[] {
  const errors: string[] = [];
  
  if (!inputs.accidentType) {
    errors.push('Please select an accident type');
  }
  
  if (!inputs.injuries) {
    errors.push('Please select your injuries');
  }
  
  if (!inputs.faultStatus) {
    errors.push('Please indicate fault status');
  }
  
  if (!inputs.accidentTiming) {
    errors.push('Please select when the accident occurred');
  }
  
  if (!inputs.zipCode || !/^\d{5}$/.test(inputs.zipCode)) {
    errors.push('Please enter a valid 5-digit zip code');
  }
  
  return errors;
}

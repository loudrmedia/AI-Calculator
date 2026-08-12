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
  return timing === 'thirteen_to_eighteen_months' || timing === 'more_than_eighteen_months';
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
    'Esta calculadora ofrece estimados ilustrativos con fines educativos únicamente. NO constituye asesoría legal y NO predice el resultado real de su caso.',
    'Los acuerdos y veredictos reales varían considerablemente según los hechos específicos, la evidencia, la jurisdicción, la cobertura del seguro y muchos otros factores.',
    'Los rangos mostrados se basan en promedios de la industria disponibles públicamente y en marcos de estimación estándar.',
    'Consulte con un abogado calificado para recibir asesoría específica sobre su situación.',
  ];
  
  if (showStatuteWarning) {
    disclaimers.unshift(
      '⚠️ URGENTE: La mayoría de los estados imponen un plazo de 2 a 3 años (plazo de prescripción) para presentar reclamos por lesiones personales. Según la fecha de su accidente, debería consultar con un abogado lo antes posible para conocer su plazo específico.'
    );
  }
  
  if (faultStatus === 'at_fault') {
    disclaimers.push(
      'Nota: Como usted indicó que el accidente fue su culpa, por lo general no es posible recuperar compensación de la otra parte. Sin embargo, es posible que tenga otras opciones de cobertura. Consulte con un abogado sobre su situación específica.'
    );
  }
  
  if (faultStatus === 'partial_fault') {
    disclaimers.push(
      'Nota: La culpa parcial puede reducir su compensación según las reglas de negligencia comparativa o contributiva, que varían según el estado. Los estimados anteriores reflejan una reducción simplificada.'
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
    errors.push('Por favor seleccione un tipo de accidente');
  }
  
  if (!inputs.injuries) {
    errors.push('Por favor seleccione sus lesiones');
  }
  
  if (!inputs.faultStatus) {
    errors.push('Por favor indique quién tuvo la culpa');
  }
  
  if (!inputs.accidentTiming) {
    errors.push('Por favor seleccione cuándo ocurrió el accidente');
  }
  
  if (!inputs.zipCode || !/^\d{5}$/.test(inputs.zipCode)) {
    errors.push('Por favor ingrese un código postal válido de 5 dígitos');
  }
  
  return errors;
}

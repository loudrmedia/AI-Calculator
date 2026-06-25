/**
 * Type definitions for AI Case Calculator
 */

export type AccidentType = 
  | 'car_accident'
  | 'motorcycle_accident'
  | 'truck_accident'
  | 'bicycle_accident'
  | 'other';

export type InjuryCategory = 
  | 'none'
  | 'soft_tissue'
  | 'substantial'
  | 'catastrophic';

export type SoftTissueInjury = 
  | 'body_aches'
  | 'cuts_scrapes_bruises'
  | 'other';

export type SubstantialInjury = 
  | 'broken_bones'
  | 'internal_bleeding'
  | 'scarring'
  | 'memory_loss'
  | 'other';

export type CatastrophicInjury = 
  | 'surgery_required'
  | 'brain_injury'
  | 'organ_loss'
  | 'coma'
  | 'paralysis'
  | 'amputation'
  | 'other';

export type InjurySelection = {
  softTissue: SoftTissueInjury[];
  substantial: SubstantialInjury[];
  catastrophic: CatastrophicInjury[];
  noInjury: boolean;
};

export type FaultStatus = 
  | 'not_at_fault'
  | 'partial_fault'
  | 'at_fault';

export type AccidentTiming = 
  | 'within_7_days'
  | 'eight_to_30_days'
  | 'one_to_six_months'
  | 'seven_to_twelve_months'
  | 'thirteen_to_eighteen_months'
  | 'more_than_eighteen_months';

export interface CalculatorInputs {
  accidentType: AccidentType;
  injuries: InjurySelection;
  faultStatus: FaultStatus;
  accidentTiming: AccidentTiming;
  zipCode: string;
  hasPropertyDamage: boolean;
  accidentDescription?: string;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consentTimestamp: string;
  consentText: string;
}

export interface WithoutAttorneyResult {
  low: number;
  high: number;
}

export interface WithAttorneyResult {
  grossLow: number;
  grossHigh: number;
  netLow: number;
  netHigh: number;
  assumedFeeRate: number;
  assumedFeeDisclaimer: string;
}

export interface CalculatorResult {
  withoutAttorney: WithoutAttorneyResult;
  withAttorney: WithAttorneyResult;
  severityCategory: InjuryCategory;
  severityWeight: number;
  faultModifier: number;
  timingModifier: number;
  showStatuteWarning: boolean;
  modelVersion: string;
  calculatedAt: string;
  citations: import('./sources').Citation[];
  disclaimers: string[];
}

export interface LeadSubmission {
  inputs: CalculatorInputs;
  contact: ContactInfo;
  result: CalculatorResult;
  utmParams: UTMParams;
  submittedAt: string;
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export type FunnelStep = 
  | 'accident_type'
  | 'injuries'
  | 'fault'
  | 'timing'
  | 'zip_code'
  | 'description'
  | 'contact'
  | 'results';

export interface FunnelState {
  currentStep: FunnelStep;
  completedSteps: FunnelStep[];
  inputs: Partial<CalculatorInputs>;
  contact: Partial<ContactInfo>;
  result: CalculatorResult | null;
}

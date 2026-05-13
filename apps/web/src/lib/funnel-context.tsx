'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  FunnelState, 
  FunnelStep, 
  CalculatorInputs, 
  ContactInfo, 
  CalculatorResult,
  InjurySelection,
} from './types';
import { calculateEstimate } from './calculator';

const STEPS: FunnelStep[] = [
  'accident_type',
  'injuries',
  'fault',
  'timing',
  'zip_code',
  'description',
  'name',
  'contact',
  'results',
];

const STEP_LABELS: Record<FunnelStep, string> = {
  accident_type: 'Accident Type',
  injuries: 'Injuries',
  fault: 'Fault',
  timing: 'Timing',
  zip_code: 'Location',
  description: 'Details',
  name: 'Name',
  contact: 'Contact',
  results: 'Results',
};

type Action =
  | { type: 'SET_ACCIDENT_TYPE'; payload: CalculatorInputs['accidentType'] }
  | { type: 'SET_INJURIES'; payload: InjurySelection }
  | { type: 'SET_FAULT_STATUS'; payload: CalculatorInputs['faultStatus'] }
  | { type: 'SET_TIMING'; payload: CalculatorInputs['accidentTiming'] }
  | { type: 'SET_ZIP_CODE'; payload: string }
  | { type: 'SET_HAS_PROPERTY_DAMAGE'; payload: boolean }
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'SET_FIRST_NAME'; payload: string }
  | { type: 'SET_LAST_NAME'; payload: string }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PHONE'; payload: string }
  | { type: 'SET_CONSENT'; payload: { timestamp: string; text: string } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: FunnelStep }
  | { type: 'CALCULATE_RESULT' }
  | { type: 'RESET' };

const initialInjuries: InjurySelection = {
  softTissue: [],
  substantial: [],
  catastrophic: [],
  noInjury: false,
};

const initialState: FunnelState = {
  currentStep: 'accident_type',
  completedSteps: [],
  inputs: {
    hasPropertyDamage: true,
    injuries: initialInjuries,
  },
  contact: {},
  result: null,
};

function reducer(state: FunnelState, action: Action): FunnelState {
  switch (action.type) {
    case 'SET_ACCIDENT_TYPE':
      return {
        ...state,
        inputs: { ...state.inputs, accidentType: action.payload },
      };
    case 'SET_INJURIES':
      return {
        ...state,
        inputs: { ...state.inputs, injuries: action.payload },
      };
    case 'SET_FAULT_STATUS':
      return {
        ...state,
        inputs: { ...state.inputs, faultStatus: action.payload },
      };
    case 'SET_TIMING':
      return {
        ...state,
        inputs: { ...state.inputs, accidentTiming: action.payload },
      };
    case 'SET_ZIP_CODE':
      return {
        ...state,
        inputs: { ...state.inputs, zipCode: action.payload },
      };
    case 'SET_HAS_PROPERTY_DAMAGE':
      return {
        ...state,
        inputs: { ...state.inputs, hasPropertyDamage: action.payload },
      };
    case 'SET_DESCRIPTION':
      return {
        ...state,
        inputs: { ...state.inputs, accidentDescription: action.payload },
      };
    case 'SET_FIRST_NAME':
      return {
        ...state,
        contact: { ...state.contact, firstName: action.payload },
      };
    case 'SET_LAST_NAME':
      return {
        ...state,
        contact: { ...state.contact, lastName: action.payload },
      };
    case 'SET_EMAIL':
      return {
        ...state,
        contact: { ...state.contact, email: action.payload },
      };
    case 'SET_PHONE':
      return {
        ...state,
        contact: { ...state.contact, phone: action.payload },
      };
    case 'SET_CONSENT':
      return {
        ...state,
        contact: {
          ...state.contact,
          consentTimestamp: action.payload.timestamp,
          consentText: action.payload.text,
        },
      };
    case 'NEXT_STEP': {
      const currentIndex = STEPS.indexOf(state.currentStep);
      if (currentIndex < STEPS.length - 1) {
        const completedSteps = state.completedSteps.includes(state.currentStep)
          ? state.completedSteps
          : [...state.completedSteps, state.currentStep];
        return {
          ...state,
          currentStep: STEPS[currentIndex + 1],
          completedSteps,
        };
      }
      return state;
    }
    case 'PREV_STEP': {
      const currentIndex = STEPS.indexOf(state.currentStep);
      if (currentIndex > 0) {
        return {
          ...state,
          currentStep: STEPS[currentIndex - 1],
        };
      }
      return state;
    }
    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };
    case 'CALCULATE_RESULT': {
      const inputs = state.inputs as CalculatorInputs;
      const result = calculateEstimate(inputs);
      return {
        ...state,
        result,
      };
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface FunnelContextValue {
  state: FunnelState;
  dispatch: React.Dispatch<Action>;
  currentStepIndex: number;
  totalSteps: number;
  progress: number;
  currentStepLabel: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isComplete: boolean;
}

const FunnelContext = createContext<FunnelContextValue | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const currentStepIndex = STEPS.indexOf(state.currentStep);
  const totalSteps = STEPS.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;
  const currentStepLabel = STEP_LABELS[state.currentStep];
  const canGoBack = currentStepIndex > 0;
  const canGoForward = currentStepIndex < totalSteps - 1;
  const isComplete = state.currentStep === 'results';

  return (
    <FunnelContext.Provider
      value={{
        state,
        dispatch,
        currentStepIndex,
        totalSteps,
        progress,
        currentStepLabel,
        canGoBack,
        canGoForward,
        isComplete,
      }}
    >
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnel() {
  const context = useContext(FunnelContext);
  if (!context) {
    throw new Error('useFunnel must be used within a FunnelProvider');
  }
  return context;
}

export { STEPS, STEP_LABELS };

'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  WizardState,
  WizardAction,
  WizardStep,
  WizardInputs,
} from '@/lib/types';

// =============================================================================
// DEFAULT VALUES
// =============================================================================

export const DEFAULT_INPUTS: WizardInputs = {
  // Step 1 — About You
  age: 0,
  familyType: 'single',
  dependentChildren: 1,
  state: 'NSW',

  // Step 2 — Income
  incomeRange: 'under-90k',
  exactIncome: null,

  // Step 3 — Insurance Status
  coverStatus: 'never',
  currentTier: 'none',
  currentPremiumPerMonth: null,
  extrasOnly: false,
  yearsHeld: 1,
  yearDropped: null,

  // Step 4 — Health Needs
  includeHealthNeeds: false,
  dentalVisitsPerYear: 0,
  opticalClaimsPerYear: 0,
  physioSessionsPerYear: 0,
  plannedProcedures: [],
  extrasDesired: 'none',
};

export const DEFAULT_STATE: WizardState = {
  currentStep: 1,
  inputs: DEFAULT_INPUTS,
  isComplete: false,
};

// =============================================================================
// REDUCER
// =============================================================================

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.step };

    case 'NEXT':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 5) as WizardStep,
      };

    case 'PREV':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1) as WizardStep,
      };

    case 'UPDATE_INPUT':
      return {
        ...state,
        inputs: { ...state.inputs, ...action.payload },
      };

    case 'RESET':
      return { ...DEFAULT_STATE };

    case 'RESTORE':
      return action.state;

    default:
      return state;
  }
}

// =============================================================================
// CONTEXT
// =============================================================================

interface WizardContextValue {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  updateInputs: (payload: Partial<WizardInputs>) => void;
  goToStep: (step: WizardStep) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

interface WizardProviderProps {
  children: ReactNode;
  initialState?: WizardState;
}

export function WizardProvider({ children, initialState }: WizardProviderProps) {
  const [state, dispatch] = useReducer(wizardReducer, initialState ?? DEFAULT_STATE);

  const updateInputs = useCallback(
    (payload: Partial<WizardInputs>) => dispatch({ type: 'UPDATE_INPUT', payload }),
    [],
  );

  const goToStep = useCallback(
    (step: WizardStep) => dispatch({ type: 'GO_TO_STEP', step }),
    [],
  );

  const next = useCallback(() => dispatch({ type: 'NEXT' }), []);
  const prev = useCallback(() => dispatch({ type: 'PREV' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return (
    <WizardContext.Provider
      value={{ state, dispatch, updateInputs, goToStep, next, prev, reset }}
    >
      {children}
    </WizardContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a <WizardProvider>');
  }
  return context;
}

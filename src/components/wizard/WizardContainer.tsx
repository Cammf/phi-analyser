'use client';

import { useWizard } from '@/components/wizard/WizardContext';
import WizardProgress from '@/components/wizard/WizardProgress';
import Step1AboutYou from '@/components/wizard/steps/Step1AboutYou';
import Step2Income from '@/components/wizard/steps/Step2Income';

// Steps 3–5 will be imported here as they are built in later tasks

export default function WizardContainer() {
  const { state } = useWizard();

  function renderStep() {
    switch (state.currentStep) {
      case 1:
        return <Step1AboutYou />;
      case 2:
        return <Step2Income />;
      // case 3: return <Step3InsuranceStatus />;
      // case 4: return <Step4HealthNeeds />;
      // case 5: return <Step5Review />;
      default:
        return <Step1AboutYou />;
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="mb-3">Should I Get Private Health Insurance?</h1>
        <p className="text-muted max-w-2xl mx-auto">
          Answer a few questions and we&apos;ll compare the real cost of insurance vs going
          without — based on your income, age, and situation.
        </p>
      </div>

      <WizardProgress currentStep={state.currentStep} />

      {renderStep()}
    </div>
  );
}

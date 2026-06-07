import { useState } from "react";
import {StepDefinition} from "@/app/ux/forms/multi-step-form/registration/steps/Types";

export function useMultiStepForm(steps: StepDefinition[]) {
  const [currentStep, setCurrentStep] = useState(0);
   const step = steps[currentStep];

  // s+1 als Schritt bleibt beim letzten Schritt stehen
  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));

  // s-1 bleibt bei 0 (First stehen)
  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // Für Später evtl. wenn FormNav eingebaut wird, um auf Validierte Steps zu Springen
  const goTo = (i: number) =>
    setCurrentStep(Math.max(0, Math.min(i, steps.length - 1)));


  return {
    Step: steps[currentStep],
    stepFields: step.fields,
    isFirst: currentStep === 0,
    isLast: currentStep === steps.length - 1,
    next,
    back,
    goTo,
    totalSteps: steps.length,
  };
}

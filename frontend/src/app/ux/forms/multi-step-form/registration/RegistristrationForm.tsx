'use client';
import FloatingInput from "@/app/ui/form/FloatingInput";
import React, {useState} from "react";
import { useFormContext } from "react-hook-form";
import { FormProvider } from "@/app/ux/providers/FormProvider";
import {buildExtraAttributesSchema, registrationFormSchema} from "@/app/ux/utils/validationRegistrationForm";
import { useMultiStepForm } from "@/app/ux/hooks/useMultiStepForm";
import { PersonalInfoStep, ConditionsStep,PersonalInfoStepFields, NoticeStep} from "@/app/ux/forms/multi-step-form/registration/steps/index";
import TabletStepLayout from "../TabletStepLayout";
import StepNavigation from "@/app/ux/forms/multi-step-form/StepNavigation";
import {RegFormFieldDef, StepDefinition} from "@/app/ux/forms/multi-step-form/registration/steps/Types";
import {api} from "@/app/lib/generated/api";




type FormPorops = {
    steps: StepDefinition[],
    fieldDefs?: RegFormFieldDef[]
}
export function Form({ steps, fieldDefs }: FormPorops ) {
  const { handleSubmit,trigger,formState } = useFormContext();
   const { Step, isFirst, isLast, next, back, stepFields} = useMultiStepForm(steps);
   const { Component } = Step;
   // const StepComponent = Step.Component; dann unten <StepComponent onNext={...  > benutzen



  const onSubmit = () => {
    console.log("Formulardaten:");
    // Todo: Speichern der Form
  };

   const handleNext = async () => {
        // nur aktuelle Felder validieren
        // oder trigger(["first_name", "last_name", ...]) für bestimmte Felder
        const valid = await trigger(stepFields);
        if (valid) {
          next();
        }
  }

    return (
           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full  " >
                <Component fieldDefs={fieldDefs} onNext={next} onBack={back} />
                <StepNavigation
                    isFirst={isFirst}
                    isLast={isLast}
                    onNext={handleNext}
                    onBack={back}
                />
           </form>
    );
}
export default function RegistrationFrom() {
    const { data, error, isLoading } = api.regformfielddef.list();
    if (isLoading) return <div className="text-gray-500">Lade Felder...</div>;
    if (error) return <div className="text-red-600">Fehler beim Laden: {(error as Error).message}</div>;

   const dynamicStepFields = [
        ...PersonalInfoStepFields,
        ...(data?.map(f => `${f.field_key}`) ?? [])
];

    const steps: StepDefinition[] = [
    { Component: PersonalInfoStep, fields: dynamicStepFields },
    { Component: ConditionsStep, fields: ["agreed"] },
    { Component: NoticeStep, fields: ["notice_accepted"],
  },
];
    const extra = buildExtraAttributesSchema(data ?? [])
    const schema = registrationFormSchema.extend({extra_attributes: extra})


    return (
        <FormProvider schema={schema}>
            <Form fieldDefs={data} steps={steps}  />
        </FormProvider>
    )
}
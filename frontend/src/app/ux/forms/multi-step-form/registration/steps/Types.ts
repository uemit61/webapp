
import {components} from "@/app/lib/generated/types";

export type RegFormFieldDef = components["schemas"]["RegFormFieldDef"]

export type StepProps = {
  onNext?: () => void;
  onBack?: () => void;
};

export type StepComponent = React.FC<StepProps>;

export type StepDefinition = {
  Component: React.FC<StepProps & {fieldDefs?: RegFormFieldDef[]}  >;
  fields: string[];
};
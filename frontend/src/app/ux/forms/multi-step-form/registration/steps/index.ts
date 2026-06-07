import {fixFields} from "@/app/lib/data";
export { default as PersonalInfoStep } from "./PersonalInfoStep";
export { default as ConditionsStep } from "./ConditionsStep";
export { default as NoticeStep } from "./NoticeStep";
// export { default as SignatureStep } from "./SignatureStep";
// export { default as GuarantorSignatureStep } from "./GuarantorSignatureStep";




export const PersonalInfoStepFields = fixFields.flatMap(row =>
  row.fields.map(field => field.field_id)
);


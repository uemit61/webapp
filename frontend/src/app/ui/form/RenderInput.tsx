import CheckBoxInput from "@/app/ui/form/CheckBoxInput";
import FloatingInput from "@/app/ui/form/FloatingInput";
import SelectInput, {Option} from "@/app/ui/form/SelectInput";
import RadioInput from "@/app/ui/form/RadioInput";
import {
    FieldValues,
    Path,
    UseFormClearErrors,
    UseFormRegister,
    UseFormSetError,
    UseFormSetValue
} from "react-hook-form";
import React from "react";

interface RenderInputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  field: { field_id: string; label: string; field_type: string; required?: boolean },
    label: string;
  name: Path<T>; // React Hook Form: name ist der Schlüssel im Form
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  setError: UseFormSetError<T>;
  clearErrors: UseFormClearErrors<T>;
  error?: string;
  field_key?:string;
  own_size?: string;
  required?: boolean;
}

//Bitte Inline_Prop ändern danke über Interface oder type bitte!!!
export function renderInput<T extends FieldValues>(
    field: FieldValues,
    register: UseFormRegister<FieldValues>,
    setValue:UseFormSetValue<FieldValues>,
    setError:UseFormSetError<FieldValues>,
    clearErrors:UseFormClearErrors<FieldValues>,
    error?: string,
    ):React.JSX.Element{
    const fieldName = field.field_id as Path<T>;
    switch (field.field_type){
        case "select":
            return (
                <SelectInput
                    label={field.label}
                    name={fieldName}
                    id={field.field_id}
                    field_key ={field.field_key}
                    options={field.options}
                    register={register}
                    required={field.required}
                    error={error}


                />
            ); // Kein break nötig, da return das switch beendet.
        case "radio":
             return (
                 <RadioInput
                     name={fieldName}
                     label={field.label}
                     id={field.field_id}
                     field_key ={field.field_key}
                     options={field.options}
                     register={register}
                     required={field.required}
                     error={error}

                 />
             );
        case "checkbox":
             return (
                  <CheckBoxInput
                      label={field.label}
                      name={fieldName}
                      id={field.field_id}
                      field_key ={field.field_key}
                      register={register}
                      required={field.required}
                      error={error}


                  />
             );
        default:
             return (
                 <FloatingInput
                    label={field.label}
                    id={field.field_id}
                    name={fieldName}
                    field_key ={field.field_key}
                    type={field.field_type}
                    register={register}
                    setValue={setValue}
                    setError={setError}
                    error={error}
                    clearErrors={clearErrors}
                    required={field.required}


                 />
             );
    }
}
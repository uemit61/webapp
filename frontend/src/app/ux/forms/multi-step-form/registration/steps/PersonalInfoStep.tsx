'use client'

import { fixFields } from "@/app/lib/data";
import {FieldValues, useFormContext} from "react-hook-form";
import {api} from "@/app/lib/generated/api";
import {JSX} from "react";
import { renderInput } from "@/app/ui/form/RenderInput"
import { RegFormFieldDef} from "@/app/ux/forms/multi-step-form/registration/steps/Types";
import FloatingInput from "@/app/ui/form/FloatingInput";


export default function PersonalInfoStep({ fieldDefs }: { fieldDefs?: RegFormFieldDef[] }) {
  const {
    register,
    setValue,
    setError,
    clearErrors,
    formState: { errors },

  } = useFormContext();



  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md flex flex-col gap-6 w-full">

          <h1 className="text-center text-2xl font-bold italic text-blue-600 mb-2">
            Persönliche Daten
          </h1>

          {
              fixFields.map(
                  (row, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="flex flex-col md:flex-row gap-4 w-full"
                        >
                              {
                                  row.fields.map(
                                      (field) => (
                                          <div
                                              key={field.field_id}
                                              className={`${field.size ?? "w-full"} flex flex-col`}
                                          >

                                              {renderInput(field, register, setValue, setError, clearErrors,(errors as any)[field.field_id]?.message )}
                                          </div>
                                      )
                                  )
                              }
                        </div>
                  )
              )
          }

          {
              (
                    ()=> {
                        let lastRowIndex = 1;
                        const retVal: JSX.Element[] = [];
                        let innerDiv: JSX.Element[] = [];
                        let inputType: JSX.Element[] = [];
                        const len = fixFields.length;
                        let i=0;

                        for (const field of fieldDefs ?? []) {
                            if(lastRowIndex !== field.rowIndex) {

                                retVal.push(
                                    <div
                                        key={lastRowIndex}
                                        className={`flex flex-col md:flex-row gap-4 w-full `}
                                    >
                                        {innerDiv}
                                    </div>
                                );
                                innerDiv = []; lastRowIndex++;
                            }
                            innerDiv.push(
                                <div key={field.field_id+len}
                                     className={`${field.size ?? "w-full" } flex flex-col `}
                                >
                                    {renderInput({ ...field, field_id: field.field_key }, register, setValue, setError,clearErrors,(errors as any)?.extra_attributes?.[field.field_id]?.message )}
                                </div> );
                            i++;
                            if(fieldDefs?.length === i){
                                retVal.push(
                                    <div
                                        key={lastRowIndex+len}
                                        className="flex flex-col md:flex-row gap-4 w-full"
                                    > {innerDiv} </div>
                                );
                            }
                        }
                        return retVal;
                    }
              )()
          }

    </div>
  );
}

"use client";

import {FieldValues, Path, UseFormClearErrors, useFormContext, UseFormRegister} from "react-hook-form";
import React from "react";

export type Option = {
  value: string | number ;
  label: string;
};



interface SelectInputProps<T extends FieldValues>
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
    name: Path<T>; // React Hook Form: name ist der Schlüssel im Form
    register: UseFormRegister<T>;
    label: string;
    field_key:string;
    options: Option[];
    error?: string;
    own_size?: string;
}

export default function SelectInput<T extends FieldValues>({
    id,
    name,
    label,
    options,
    register,
    error,
    field_key,
    ...props
}: SelectInputProps<T>) {

  return (
    <div className={`flex flex-col gap-1`}>
        <div className={"flex text-xs flex-col pt-2 rounded-xl bg-gray-200"}>
              <label htmlFor={id} className="px-3 pt-2 text-xs text-gray-500 font-medium">
                    {label}
              </label>

              <select
                id={id}
                {...register(name)}
                className={`  px-3 pt-0 mb-1 py-1 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                {...props}
              >
                <option value="">Bitte wählen...</option>

                {
                    options.map(
                        (opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        )
                    )
                }
              </select>


        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

"use client";

import {FieldValues, Path, UseFormClearErrors, useFormContext, UseFormRegister} from "react-hook-form";
import React from "react";

export type Option = {
  value: string | number ;
  label: string;
};



interface RadioInputProps<T extends FieldValues>
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
    name: Path<T>; // React Hook Form: name ist der Schlüssel im Form
    register: UseFormRegister<T>;
    label: string;
    options: Option[];
    error?: string;
    field_key?:string;
    required?: boolean;
}

export default function RadioInput<T extends FieldValues>({
    id,
    name,
    label,
    options,
    register,
    field_key,
    error,
    ...props
}: RadioInputProps<T>) {
    return (
        <>
            <div className={`flex flex-col flex-wrap text-xs  px-3 pt-1 gap-2 bg-gray-200  rounded-xl`}>

              <label htmlFor={id} className=" text-gray-500 font-medium">
                    {label}
              </label>
              <div className="flex flex-col mb-3   md:flex-row md:justify-between justify-center gap-4  ">
                {options.map((opt) => (

                  <label
                      key={opt.value}
                      htmlFor={String(opt.value)}
                      className="flex items-center gap-2 "
                  >

                      <input
                            type="radio"
                            id={id}
                            value={opt.value}
                            {...register(name)}
                            className="h-4 w-4 accent-blue-600"
                      />
                      {opt.label}
                  </label>
                ))}
              </div>
            </div>
            {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </>
    );
}
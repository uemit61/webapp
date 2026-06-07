"use client";

import {
    FieldValues,
    Path, useForm, UseFormClearErrors, useFormContext,
    UseFormRegister,
} from "react-hook-form";
import React from "react";

interface CheckBoxInputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<T>;
  field_key?:string;
  register: UseFormRegister<T>;
  error?: string;

}

export default function CheckBoxInput<T extends  FieldValues>({id,name,field_key, label,register,error, ...props}: CheckBoxInputProps<T>) {
    return (
    <div className={`flex flex-col `}>
      <label className="inline-flex items-center gap-3">
        <input
          type="checkbox"
          id={id}
          {...register(name)}
          className="h-4 w-4 appearance-auto accent-green-600 cursor-pointer"
        />
        <span className={"text-gray-700"} >{label}</span>
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
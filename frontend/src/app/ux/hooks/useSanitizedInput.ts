import React, { useRef } from "react";
import {
  FieldValues,
  Path,
  UseFormSetValue,
  UseFormSetError,
  UseFormClearErrors,
} from "react-hook-form";

const forbiddenPattern = /[#'</>"=]/g;

export function useSanitizedInput<T extends FieldValues>(
  name: Path<T>,
  label: string,
  setValue: UseFormSetValue<T>,
  setError: UseFormSetError<T>,
  clearErrors: UseFormClearErrors<T>,
  opts: { required?: boolean } = { required: false },
) {

    const preventRef = useRef(false)
    const errorMessage = useRef('')
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const value = e.target.value;

         const cleaned = value.replace(forbiddenPattern, "");

         if((value !== cleaned || !value)) {
             preventRef.current = true
             const inputValue = value.at(-1)
             opts = { required: false };
             errorMessage.current = !value ?
                 (opts ? `${label} darf nicht leer sein.` :'')
                 : `Unzulässiges Zeichen (${inputValue}) wurde nicht eingefügt.`
         }

        if(preventRef.current)
        {
             setError(name, {
                type: "manual",
                message: errorMessage.current,
             });

             if (timeoutRef.current) clearTimeout(timeoutRef.current)

             timeoutRef.current = setTimeout(() => clearErrors(name), 3000)
             preventRef.current = false;
        }
        setValue(name, cleaned as T[typeof name]);
    };

    return { handleChange, }
}
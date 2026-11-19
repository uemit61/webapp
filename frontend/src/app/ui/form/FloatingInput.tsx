import React from "react";
import {

    UseFormRegister,
    RegisterOptions,
    FieldValues,
    Path,
    UseFormSetValue,
    UseFormSetError,
    UseFormClearErrors
} from "react-hook-form";
import {useSanitizedInput} from "@/app/ux/hooks/useSanitizedInput";


interface FloatingInputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<T>; // React Hook Form: name ist der Schlüssel im Form
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  setError: UseFormSetError<T>;
  clearErrors: UseFormClearErrors<T>;
  field_key?:string;
  error?: string;
}

function FloatingInput<T extends FieldValues>(
    { label, id, name, register, setValue, setError,
        clearErrors, error, field_key,
        ...props }:FloatingInputProps<T>)
{


  const { handleChange } = useSanitizedInput(
        name,
        label,
        setValue,
        setError,
        clearErrors

    );

  return (
    <div className={` flex flex-col relative `}>
      <input
        {...register(name)}
        onChange={handleChange}
        placeholder=" "
        className={`peer  bg-gray-200 block w-full  px-3 pt-7 pb-2 text-sm placeholder-transparent  rounded-xl
          ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}
        `}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 top-2 text-sm transition-all
          ${error ? "text-red-500" : "text-gray-500 peer-focus:text-blue-500"}
          peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
          peer-focus:top-2 peer-focus:text-sm
        `}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default FloatingInput;

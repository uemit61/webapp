import { useForm, FormProvider as RHFProvider } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type GenericFormProviderProps<TSchema extends ZodType<any, any, any>> = {
  schema: TSchema;
  defaultValues?: z.infer<TSchema>;
  mode?: "onBlur" | "onChange" | "onSubmit" | "all";
  children: React.ReactNode;
};

export function FormProvider<TSchema extends ZodType<any, any, any>>({
  schema,
  defaultValues,
  mode = "all",
  children,
}: GenericFormProviderProps<TSchema>) {
  const methods = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema) as any, // hier akzeptiert TS nun das Schema
    defaultValues,
    mode: "all",
  });

  return <RHFProvider {...methods}>{children}</RHFProvider>;
}

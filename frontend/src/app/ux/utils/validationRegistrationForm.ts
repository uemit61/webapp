import { z } from "zod";
import type { components } from "@/app/lib/generated/types";


type RegFormFieldDef = components["schemas"]["RegFormFieldDef"];

const trim = (v: unknown) => (typeof v === "string" ? v.trim() : v);
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const PHONE_REGEX = /^(?:\+|00)?\d[\d\s-]{7,}$/;

export function buildExtraAttributesSchema(fieldDefs: RegFormFieldDef[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fieldDefs) {
    const isRequired = field.required === true;
    const errorMsg = field.error_messages ?? `${field.label} ist erforderlich`;

    switch (field.field_type) {

      case "number": {
        const base = z.preprocess(
          trim,
          z.coerce.number().refine(
              (val) => !isNaN(val), errorMsg)
        );
        shape[field.field_id] = isRequired ? base : base.optional();
        break;
      }

      case "email": {
        const base = z.preprocess(
          trim,
          z.string().email(errorMsg)
        );
        shape[field.field_id] = isRequired
          ? z.preprocess(trim, z.string().min(1, errorMsg).email(errorMsg))
          : base.optional();
        break;
      }

      case "tel":{
        const base = z.preprocess(
            trim,
            z.string().regex(
                /^[+\d][\d\s-]{5,}$/,
                field.error_messages ?? "Ungültige Telefonnummer")
            );
        shape[field.field_id] = isRequired
            ? z.preprocess(trim, z.string().min(1, errorMsg).regex(PHONE_REGEX, errorMsg))
            : base.optional();
        break;
      }

      case "password": {
        const base = z.preprocess(
            trim,
            z.string().regex(
                PASSWORD_REGEX,
                field.error_messages ?? "Passwort muss mind. 8 Zeichen, Groß-/Kleinbuchstaben, Zahlen und Sonderzeichen enthalten"
            )
        );
        shape[field.field_id] = isRequired ? base : base.optional();
        break;
      }

      case "url": {
        const base = z.preprocess(
          trim,
          z.string().url(field.error_messages ?? "Ungültige URL")
        );
        shape[field.field_id] = isRequired
          ? z.preprocess(
              trim,
              z.string().min(1, errorMsg).url(field.error_messages ?? "Ungültige URL"))
          : base.optional();
        break;
      }

      case "text":
      {
        let base = z.preprocess(trim, z.string());
        if (field.min_length) {
          base = base.refine(
            (val) => val.length >= field.min_length!,
            errorMsg
          );
        }

        if (field.max_length) {
          base = base.refine(
            (val) => val.length <= field.max_length!,
            errorMsg
          );
        }

        shape[field.field_id] = isRequired
          ? z.preprocess(trim, z.string().min(1, errorMsg))
          : base.optional();
        break;
      }

      case "checkbox": {
        shape[field.field_id] = isRequired
          ? z.literal(true, { message: errorMsg ?? "Du musst den Bedingungen zustimmen"})
          : z.boolean().optional();
        break;
      }

      case "select":
      case "radio": {
         let values: string[] = [];

try {
  const raw = field.options;
  let parsed: Array<{ value: string; label: string }> = [];
  if (Array.isArray(raw)) {
    // Backend liefert bereits ein Array (korrektes Format)
    parsed = raw;
  } else if (typeof raw === "string" && raw.trim() !== "") {
    // String aus DB -> JSON parsen
    parsed = JSON.parse(raw);
  }
  values = parsed.map(opt => opt.value);
} catch {
  throw new Error(
    `RegFormFieldDef-Konfigurationsfehler: options für Feld '${field.field_id}' sind kein gültiges JSON oder Array`
  );
}
        // Nicht möglich, aber wenn...
        if (values.length === 0) {
            throw new Error(
                `RegFormFieldDef-Konfigurationsfehler: Feld '${field.field_id}' hat keine Options`
            )
        }

        const enumSchema = z.enum(values as [string, ...string[]], {
          message: errorMsg,
        });
        shape[field.field_id] = isRequired ? enumSchema : enumSchema.optional();
        break;
      }

      default:
        // Ignorieren (textarea, file, ... folgen später)
        break;
    }
  }

  return z.object(shape);

}

export const registrationFormSchema = z.object({
    // Fixe Felder
    first_name: z.preprocess(
        trim,
        z.string().min(2, "Vorname muss mindestens 2 Zeichen haben")),
    last_name: z.preprocess(
            trim,
            z.string().min(2, "Nachname muss mindestens 2 Zeichen haben")),
    street: z.preprocess(
        trim,
        z.string().min(1,"Straße ist erforderlich")),
    house_number: z.preprocess(
        trim,
        z.string().min(1,"Hausnummer ist erforderlich")),
    zip: z.preprocess(
        trim,
        z.string().min(1,"Postleitzahl ist erforderlich")),
    city:z.preprocess(
        trim,
        z.string().min(1,"Wohnort is erforderlich")),
    date_of_birth: z.preprocess(
        trim,
        z.string().min(1,"Geburtsdatum ist erforderlich").regex(/^\d{4}-\d{2}-\d{2}$/,  "Bitte im Format MM/TT/JJJJ eingeben")
    ),
    phone: z.preprocess(
        trim,
        z.string().min(1,"Telefonnummer ist erforderlich")
        .regex(PHONE_REGEX, "Ungültige Telefonnummer")
    ),
    name_bondsman: z.preprocess(
        trim,
        z.string().min(1,"Bitte einen Bürgen angeben.")),
    email: z.preprocess(
        trim,
        z.string().min(1,"E-Mail ist erforderlich").email("Ungültige E-Mail-Adresse")
    ),

    agreed: z.preprocess(
        trim,
        z.literal(true,{message: "Du musst den Bedingungen zustimmen" })),

    notice_accepted: z.preprocess(
      (v) => v === true,
      z.literal(true, { message: "Bitte bestätigen Sie den Hinweis." })
),

    signature: z.preprocess(
        trim,
        z.string().min(1,"Unterschrift ist erforderlich")),
    signature_bondsman: z.preprocess(
        trim,
        z.string().optional()),

});

export type RegistrationFormData = z.infer<typeof registrationFormSchema>;







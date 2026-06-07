import CheckBoxInput from "@/app/ui/form/CheckBoxInput";
import {useFormContext} from "react-hook-form";
import React, {useState} from "react";
export default function ConditionsStep(){

    const {
    register,
    formState: { errors }
  } = useFormContext();
     const [accepted, setAccepted] = useState(false);

    return (
    <div className="flex flex-col max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      {/* Titel */}
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Mitgliedschaftsbedingungen & Zustimmung
      </h2>

      {/* Textabschnitt */}
      <div className="text-gray-700 leading-relaxed mb-6 space-y-3">
        <p>
          Zunächst kann nur eine <strong>„Mitgliedschaft auf Probe“</strong> beantragt werden.
          Nach Absolvierung der Probezeit entscheidet der Vorstand in Absprache mit dem Bürgen
          über die Aufnahme als Vollmitglied.
        </p>
        <p>
          Erhalte ich die Vollmitgliedschaft, wird der Ligabeitrag für die verbleibende Saison
          zuzüglich der Aufnahmegebühr sofort fällig. Sollte ich über den Zeitraum von
          12 aufeinander folgenden Monaten an keiner Veranstaltung teilnehmen, erlischt meine
          Mitgliedschaft automatisch.
        </p>
        <p>
          Die Kündigung der Mitgliedschaft ist mit einer Frist von 4 Wochen zum Saisonende
          möglich. Maßgebend für den Ligabetrieb ist immer das laufende Kalenderjahr.
        </p>
        <p>
          Sollte meine Mitgliedschaft erlöschen, werden meine Daten aus der Turnierverliste sowie
          aus laufenden Ranglisten entfernt, bleiben aber teilweise anderweitig gespeichert.
        </p>
        <p>
          Für eine erneute Mitgliedschaft gilt das gleiche Aufnahmeverfahren wie für neue
          Mitglieder, inklusive der erneuten Benennung eines Bürgen.
        </p>
        <p>
          Mit meiner Unterschrift bestätige ich, dass ich die <strong>Satzung</strong> und die{" "}
          <strong>Beitragsordnung</strong> zur Kenntnis genommen habe und anerkenne. Ich erkläre
          mich außerdem damit einverstanden, dass mein Name und Fotos von mir auf der
          Vereinshomepage und in sozialen Netzwerken veröffentlicht werden dürfen.
        </p>
      </div>

        <CheckBoxInput
            id={"agreed"}
            register={register}
            error={((errors.agreed?.message) as string) }
            required
            name={"agreed"}
            label={'Ich bestätige, dass ich die Mitgliedschaftsbedingungen gelesen habe und ihnen zustimme.'}></CheckBoxInput>
    {/*    <div className="flex items-start gap-3">*/}
    {/*    <input*/}
    {/*      type="checkbox"*/}
    {/*      id={"agreed"}*/}
    {/*      {...register(*/}
    {/*              "agreed",*/}
    {/*              { required: true,}*/}
    {/*          )*/}
    {/*      }*/}
    {/*      className="mt-1 h-5 w-5 accent-blue-600"*/}
    {/*      onChange={(e) => setAccepted(e.target.checked)}*/}
    {/*    />*/}
    {/*    <label htmlFor={"agreed"} className="text-gray-700 text-sm">*/}
    {/*        <p>Ich bestätige, dass ich die Mitgliedschaftsbedingungen gelesen habe und ihnen zustimme.</p>*/}
    {/*    </label>*/}
    {/*  </div>*/}

    {/*  /!* Fehlermeldung *!/*/}
    {/*  {errors.agreed && (*/}
    {/*    <p className="text-red-500 text-sm">*/}
    {/*      {(errors.agreed.message as string) ?? "Bitte bestätigen Sie den Hinweis."}*/}
    {/*    </p>*/}
    {/*  )}*/}
    </div>


    )
}
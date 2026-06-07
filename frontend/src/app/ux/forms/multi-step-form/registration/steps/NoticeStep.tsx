'use client';

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import CheckBoxInput from "@/app/ui/form/CheckBoxInput";


export default function NoticeStep() {
  const { register, formState: { errors } } = useFormContext();
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md flex flex-col gap-6 w-full">
      {/* Titel */}
      <h2 className="text-center text-2xl font-bold italic text-blue-600 mb-2">
        Hinweis zu Geldeinsätzen
      </h2>

      {/* Beschreibung */}
      <p className="text-gray-700 leading-relaxed text-center">
        Auf das <strong>Verbot von Geldeinsätzen, Nebenwetten oder vergleichbaren Einsätzen</strong>{" "}
        wurde ich ausdrücklich hingewiesen.
        Ein Regelverstoß hat den <strong>sofortigen Ausschluss</strong> aus dem Verein zur Folge!
      </p>
     <CheckBoxInput
         id={"notice_accepted"}
         name={"notice_accepted"}
         register={register}
         error={((errors.notice_accepted?.message) as string) }
         required
         label={'Ich bestätige, dass ich über das Verbot von Geldeinsätzen, Nebenwetten oder vergleichbaren\n' +
             '          Einsätzen informiert wurde und dieses anerkenne.'}>
     </CheckBoxInput>

    </div>
  );
}

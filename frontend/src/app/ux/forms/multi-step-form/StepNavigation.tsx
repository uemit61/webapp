'use client '

type Props = {
  onBack: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export default function StepNavigation({ onBack, onNext, isFirst, isLast }: Props) {
  return (
    <div className="text-white flex justify-between mt-6">
      {!isFirst && (
        <button type="button" onClick={onBack} className="px-4 py-2 bg-blue-700 rounded">
          Zurück
        </button>
      )}
      {!isLast && (
        <button type="button" onClick={onNext} className="ml-auto px-4 py-2  transition-all bg-blue-700 rounded">
          Weiter
        </button>
      )}
      {isLast && (
        <button type="submit"  className="ml-auto px-4 py-2   transition-all bg-green-700 rounded">
          Absenden
        </button>
      )}
    </div>
  );
}

import { useLocationAnswerStore } from "@/lib/stores/locationAnswer.store";
import { useState } from "react";

export type LocationModalProps = {
  onClose: () => void;
  onSelect: (distance: string) => void;
};

export default function LocationModal({
  onClose,
  onSelect,
}: LocationModalProps) {
  const distances = [
    { label: "가까이", value: 500 },
    { label: "적당히", value: 1000 },
    { label: "멀리", value: 3000 },
  ];
  const [selected, setSelected] = useState<number>(500);
  const { setRadius } = useLocationAnswerStore();

  const handleSelect = (value: number, label: string) => {
    setSelected(value);
    onSelect(label);
    setRadius(value);
  };

  return (
    <div className="flex items-end justify-center pt-2">
      <div className="h-[15.5rem] w-[22.525rem] flex-shrink-0 rounded-t-[1.25rem] border-t border-t-grey-darkHover bg-[#FFFEFD] p-4">
        <div className="mb-2 flex justify-end">
          <button className="text-black" onClick={onClose}>
            ✕
          </button>
        </div>
        {distances.map(({ label, value }) => (
          <div key={value} className="flex items-center py-3">
            <button
              onClick={() => handleSelect(value, label)}
              className="flex items-center gap-2"
            >
              <span
                className={`h-4 w-4 rounded-full border border-black ${selected === value ? "bg-red-500" : "bg-white"}`}
              />
              <span className="text-black">{label}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

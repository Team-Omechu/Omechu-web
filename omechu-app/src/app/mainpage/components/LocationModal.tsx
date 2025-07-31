import { useState } from "react";

export type LocationModalProps = {
  onClose: () => void;
  onSelect: (distance: string) => void;
};

export default function LocationModal({
  onClose,
  onSelect,
}: LocationModalProps) {
  const distances = ["가까이", "적당히", "멀리"];
  const [selected, setSelected] = useState<string>("가까이");

  const handleSelect = (d: string) => {
    setSelected(d);
    onSelect(d);
  };

  return (
    <div className="flex items-end justify-center pt-2">
      <div className="h-[15.5rem] w-[22.525rem] flex-shrink-0 rounded-t-[1.25rem] border-t border-t-grey-darkHover bg-[#FFFEFD] p-4">
        <div className="mb-2 flex justify-end">
          <button className="text-black" onClick={onClose}>
            ✕
          </button>
        </div>
        {distances.map((d) => (
          <div key={d} className="flex items-center py-3">
            <button
              onClick={() => handleSelect(d)}
              className="flex items-center gap-2"
            >
              <span
                className={`h-4 w-4 rounded-full border border-black ${selected === d ? "bg-red-500" : "bg-white"}`}
              />
              <span className="text-black">{d}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

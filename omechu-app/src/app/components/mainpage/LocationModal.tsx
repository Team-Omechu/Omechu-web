import { useState } from "react";

export type LocationModalProps = {
  onClose: () => void;
  onSelect: (distance: string) => void;
}

export default function LocationModal({
  onClose,
  onSelect,
}:LocationModalProps) {
  const distances = ["가까이","적당히","멀리"];
  const [selected, setSelected] = useState<string>("가까이");

  const handleSelect = (d:string) => {
    setSelected(d);
    onSelect(d);
  }

  return (
    <div className="flex justify-center items-end pt-2">
      <div className="w-[22.525rem] h-[16.6875rem] flex-shrink-0 bg-[#FFFEFD] rounded-t-[1.25rem] border-t border-t-[#626262] p-4">
        <div className="flex justify-end mb-2">
          <button className="text-black" onClick={onClose}>✕</button>
        </div>
        {distances.map((d) => (
          <div key={d} className="flex items-center py-3">
            <button
              onClick={() => handleSelect(d)}
              className="flex items-center gap-2"
            >
              <span
                className={`w-4 h-4 rounded-full border border-black
                  ${selected === d ? "bg-red-500 " : "bg-white"}`}
              />
              <span className="text-black">{d}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

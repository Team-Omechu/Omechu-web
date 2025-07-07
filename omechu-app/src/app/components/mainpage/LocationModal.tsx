export default function LocationModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (distance: string) => void;
}) {
  const distances = ["100m", "300m", "500m", "1km", "2km"];

  return (
    <div className="flex justify-center items-end pt-4">
      <div className="bg-white rounded-md p-4 max-h-[240px] w-full">
        <div className="flex justify-end mb-2">
          <button className="text-black" onClick={onClose}>✕</button>
        </div>
        {distances.map((d) => (
          <div key={d} className="flex items-center py-2">
            <button
              onClick={() => onSelect(d)}
              className="flex items-center gap-2"
            >
              <span
                className="w-4 h-4 rounded-full border bg-white text-black"
              />
              <span className="text-black">{d}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

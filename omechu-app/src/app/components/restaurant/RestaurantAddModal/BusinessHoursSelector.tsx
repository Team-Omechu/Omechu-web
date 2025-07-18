import TimeDropdown from "./TimeDropdown";

interface BusinessHoursSelectorProps {
  selectedDays: string[];
  toggleDay: (day: string) => void;
  startTime: string;
  endTime: string;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
}

export default function BusinessHoursSelector({
  selectedDays,
  toggleDay,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
}: BusinessHoursSelectorProps) {
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  return (
    <>
      <div className="mb-2 text-sm font-medium text-gray-700">영업 시간</div>
      <div className="mb-2 flex flex-wrap gap-1">
        {days.map((day) => (
          <button
            key={day}
            className={`rounded-lg border border-gray-700 px-2 py-1 text-sm ${
              selectedDays.includes(day)
                ? "bg-[#3FA2FF] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => toggleDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      <div className="mb-4 flex items-center gap-2 text-sm">
        <TimeDropdown
          label="시작 시간"
          value={startTime}
          onChange={setStartTime}
        />
        <span className="mb-2 text-xl text-gray-500">~</span>
        <TimeDropdown label="종료 시간" value={endTime} onChange={setEndTime} />
      </div>
    </>
  );
}

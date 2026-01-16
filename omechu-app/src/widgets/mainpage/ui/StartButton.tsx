interface StartButtonProps {
  title: string;
  subTitle: string;
  onClick: () => void;
  selected?: boolean;
  dimmed?: boolean;
}

export function StartButton({
  title,
  subTitle,
  onClick,
  selected = false,
  dimmed = false,
}: StartButtonProps) {
  const base = [
    "h-19 w-60 rounded-[1rem] bg-white p-3",
    "shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
    "transition-all duration-200 ease-out",
    "focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2 focus-visible:outline-none",
  ].join(" ");

  const interactive = [
    "hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.22)]",
    "active:translate-y-0 active:shadow-[0_8px_20px_rgba(0,0,0,0.16)]",
  ].join(" ");

  const selectedStyle = selected
    ? "scale-[1.06] border-2 border-red-500 shadow-[0_18px_45px_rgba(0,0,0,0.25)]"
    : "border border-transparent";

  const dimmedStyle = dimmed ? "opacity-50" : "opacity-100";

  return (
    <div>
      <button
        type="button"
        aria-pressed={selected}
        className={[base, interactive, selectedStyle, dimmedStyle].join(" ")}
        onClick={onClick}
      >
        <p className="text-[1.125rem] font-semibold">{title}</p>
        <p className="mt-1 mb-1 text-sm whitespace-nowrap">{subTitle}</p>
      </button>
    </div>
  );
}

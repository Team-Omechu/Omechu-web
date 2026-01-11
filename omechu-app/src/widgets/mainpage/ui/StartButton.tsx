interface StartButtonProps {
  title: string;
  subTitle: string;
  onClick: () => void;
}
export function StartButton({ title, subTitle, onClick }: StartButtonProps) {
  return (
    <div>
      <button
        className={[
          "h-19 w-60 rounded-[1rem] bg-white p-3",
          "shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
          "transition-shadow transition-transform duration-200 ease-out",
          "hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.22)]",
          "active:translate-y-0 active:shadow-[0_8px_20px_rgba(0,0,0,0.16)]",
          "focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2 focus-visible:outline-none",
        ].join(" ")}
        onClick={onClick}
      >
        <p className="text-[1.125rem] font-semibold">{title}</p>
        <p className="mt-1 mb-1 text-sm whitespace-nowrap">{subTitle}</p>
      </button>
    </div>
  );
}

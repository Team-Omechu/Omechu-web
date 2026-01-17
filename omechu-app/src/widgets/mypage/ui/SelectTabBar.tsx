import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type SelectTabBarProps = {
  tabs: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
};

export function SelectTabBar({
  tabs,
  selectedIndex,
  onSelect,
  className,
}: SelectTabBarProps) {
  return (
    <section
      className={twMerge(
        "bg-brand-secondary flex w-84.5 gap-2 rounded-xl p-1.25",
        className,
      )}
    >
      {tabs.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={twMerge(
            clsx(
              "text-body-4-medium h-12 w-39 rounded-xl p-2.5 transition-all duration-300",
              selectedIndex === index
                ? "bg-brand-primary text-brand-secondary"
                : "text-font-medium",
            ),
          )}
        >
          {item}
        </button>
      ))}
    </section>
  );
}

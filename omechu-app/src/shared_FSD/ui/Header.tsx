type HeaderProps = {
  title?: React.ReactNode;
  leftChild?: React.ReactNode;
  rightChild?: React.ReactNode;
  className?: string;
};

export const Header = ({
  title,
  leftChild,
  rightChild,
  className,
}: HeaderProps) => {
  return (
    <header
      className={`border-grey-darkHoverActive bg-main-normal hover:bg-main-normal-hover relative z-10 flex min-h-[49px] w-full items-center border-none px-5 py-2.5 text-[#393939] ${className}`}
    >
      <div className="flex w-1/5 justify-start">{leftChild}</div>
      <div className="flex w-3/5 justify-center text-xl font-medium">
        {title}
      </div>
      <div className="flex w-1/5 justify-end">{rightChild}</div>
    </header>
  );
};

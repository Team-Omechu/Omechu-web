type HeaderProps = {
  title?: React.ReactNode;
  leftChild?: React.ReactNode;
  rightChild?: React.ReactNode;
  className?: string;
};

const Header = ({ title, leftChild, rightChild, className }: HeaderProps) => {
  return (
    <header
      className={`relative z-10 flex min-h-[49px] w-full items-center border-b border-[#828282] bg-[#f8d5ff] px-5 py-2.5 text-black hover:bg-[#dfc0e6] dark:bg-[#baa0bf] dark:text-white dark:hover:bg-[#958099] ${className}`}
    >
      <div className="flex w-1/5 justify-start">{leftChild}</div>
      <div className="flex w-3/5 justify-center text-xl font-medium">
        {title}
      </div>
      <div className="flex w-1/5 justify-end">{rightChild}</div>
    </header>
  );
};

export default Header;

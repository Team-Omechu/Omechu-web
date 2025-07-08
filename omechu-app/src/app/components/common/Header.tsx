type HeaderProps = {
  title?: React.ReactNode;
  leftChild?: React.ReactNode;
  rightChild?: React.ReactNode;
  className?: string;
};

const Header = ({ title, leftChild, rightChild, className }: HeaderProps) => {
  return (
    <header
      className={`relative z-10 flex items-center px-5 py-2.5 w-full 
        border-b border-[#828282] text-black 
        bg-[#f8d5ff] hover:bg-[#dfc0e6]
        dark:bg-[#baa0bf] dark:text-white dark:hover:bg-[#958099]
        ${className}`}
    >
      <div className="flex justify-start w-1/5">{leftChild}</div>
      <div className="flex justify-center w-3/5 text-xl font-medium">
        {title}
      </div>
      <div className="flex justify-end w-1/5">{rightChild}</div>
    </header>
  );
};

export default Header;

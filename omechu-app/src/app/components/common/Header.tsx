type HeaderProps = {
  title?: React.ReactNode;
  leftChild?: React.ReactNode;
  rightChild?: React.ReactNode;
  className?: string;
};

const Header = ({ title, leftChild, rightChild, className }: HeaderProps) => {
  return (
    <header
      className={`flex items-center px-5 py-2.5 w-full border-b border-[#828282] ${className}`}
    >
      <div className="flex justify-start w-1/4">{leftChild}</div>
      <div className="flex justify-center w-1/2 text-xl font-medium">
        {title}
      </div>
      <div className="flex justify-end w-1/4">{rightChild}</div>
    </header>
  );
};

export default Header;

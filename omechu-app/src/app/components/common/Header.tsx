type HeaderProps = {
  title?: React.ReactNode;
  leftChild?: React.ReactNode;
  rightChild?: React.ReactNode;
};

const Header = ({ title, leftChild, rightChild }: HeaderProps) => {
  return (
    <header className="flex items-center px-3.5 py-2.5 w-full h-11 border-b-[1px] border-[#828282]">
      <div className="flex justify-start w-1/4">{leftChild}</div>
      <div className="flex justify-center w-1/2 text-xl font-medium">
        {title}
      </div>
      <div className="flex justify-end w-1/4">{rightChild}</div>
    </header>
  );
};

export default Header;

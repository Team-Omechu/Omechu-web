type HeaderProps = {
  title?: React.ReactNode;
  leftChild?: React.ReactNode;
  rightChild?: React.ReactNode;
};

const Header = ({ title, leftChild, rightChild }: HeaderProps) => {
  return (
    <header
      className="flex items-center px-5 py-2.5 w-full border-b border-[#828282] hover:bg-[#dfc0e6]"
      style={{
        paddingTop:
          typeof window !== "undefined" &&
          /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)
            ? "env(safe-area-inset-top)"
            : "0.625rem",
      }} // 이 부분은 아이폰일 때 상단 노치 관련 paddingTop 조정하는 부분
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

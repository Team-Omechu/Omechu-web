interface MenuInputListProps {
  menus: string[];
  onAddMenu: () => void;
  onRemoveMenu: (index: number) => void;
  onMenuChange: (index: number, value: string) => void;
}

export default function MenuInputList({
  menus,
  onAddMenu,
  onRemoveMenu,
  onMenuChange,
}: MenuInputListProps) {
  return (
    <>
      <div className="mb-1 text-sm font-medium text-gray-700">
        대표 메뉴 {menus.length}/3
      </div>
      {menus.map((menu, idx) => (
        <div key={idx} className="mb-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="메뉴명을 입력하세요"
            value={menu}
            onChange={(e) => onMenuChange(idx, e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button onClick={() => onRemoveMenu(idx)}>✖</button>
        </div>
      ))}
      {menus.length < 3 && (
        <button
          onClick={onAddMenu}
          className="mb-4 text-lg text-gray-700 hover:text-black"
        >
          ＋
        </button>
      )}
    </>
  );
}

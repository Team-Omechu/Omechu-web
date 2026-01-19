"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/shared/ui/search/SearchBar";
import { FoodBox } from "@/shared/ui/box/FoodBox";

// 임시 메뉴 데이터
const dummyMenus = [
  { name: "사케동", image_link: "/menu/salmon_bowl.png" },
  { name: "낙지 볶음", image_link: "/menu/octopus.png" },
  { name: "규동", image_link: "/menu/beef_bowl.png" },
  { name: "오므라이스", image_link: "/menu/omurice.png" },
  { name: "연어 샐러드", image_link: "/menu/salmon_salad.png" },
  { name: "베이글", image_link: "/menu/bagel.png" },
  { name: "타코", image_link: "/menu/taco.png" },
  { name: "된장찌개", image_link: "/menu/soybean.png" },
  { name: "샌드위치", image_link: "/menu/sandwich.png" },
];

export default function MenuBattlePage() {
  const router = useRouter();

  const [battleName, setBattleName] = useState("점심 메뉴 결정전: The Battle");
  const [search, setSearch] = useState("");
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const menus = dummyMenus;

  const filteredMenus = useMemo(() => {
    if (!search.trim()) return menus;
    return menus.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [menus, search]);

  const toggleMenu = (name: string) => {
    setSelectedMenus((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    );
  };

  const handleCreateBattle = () => {
    if (selectedMenus.length === 0) {
      alert("최소 1개 이상의 메뉴를 선택해주세요!");
      return;
    }
    setShowModal(true);
  };

  const fakeRoomId = "local123";

  return (
    <main className="min-h-screen bg-[#F7D8FF] pb-32">
      {/* 상단 */}
      <header className="flex items-center justify-between px-4 pb-4 pt-8">
        <button
          onClick={() => router.back()}
          className="text-2xl"
        >{`<`}</button>
        <h2 className="text-lg font-semibold">메뉴 배틀</h2>
        <div className="text-xl">👤</div>
      </header>

      {/* 배틀방 이름 */}
      <section className="mt-2 px-4">
        <p className="mb-2 text-lg font-semibold">배틀방 이름</p>
        <input
          className="w-full rounded-xl bg-white px-4 py-3 text-gray-700 outline-none"
          value={battleName}
          onChange={(e) => setBattleName(e.target.value)}
        />
      </section>

      {/* 검색 */}
      <section className="mt-6 px-4">
        <p className="mb-2 text-lg font-semibold">후보 메뉴</p>
        <SearchBar
          placeholder="음식명을 검색하세요"
          inputValue={search}
          setInputValue={setSearch}
          onSearch={() => {}}
          suggestionList={[]}
        />
      </section>

      {/* 메뉴 리스트 */}
      <section className="mt-6 px-4">
        <div className="grid grid-cols-3 gap-4">
          {filteredMenus.map((food, idx) => (
            <FoodBox
              src={food.image_link}
              title={food.name}
              isSelected={selectedMenus.includes(food.name)}
              onClick={() => toggleMenu(food.name)}
            />
          ))}
        </div>
      </section>

      {/* 하단 */}
      <footer className="fixed bottom-0 left-0 right-0 rounded-t-2xl bg-white px-6 py-5 shadow-[0_-4px_15px_rgba(0,0,0,0.1)]">
        <p className="mb-2 font-medium text-gray-600">
          선택된 메뉴 {selectedMenus.length}개
        </p>

        <button
          onClick={handleCreateBattle}
          className="w-full rounded-2xl bg-[#FF7A9E] py-3 text-center text-lg font-semibold text-white"
        >
          배틀방 생성
        </button>
      </footer>

      {/* 생성 완료 모달 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg">
            <h3 className="mb-2 text-lg font-bold">
              [{battleName}] 생성 완료!
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              아래 링크를 친구들에게 공유해주세요
              <br />
              https://localhost/{fakeRoomId}
            </p>

            <button className="mb-3 w-full rounded-xl border py-3">
              공유하기
            </button>

            <button
              className="w-full rounded-xl bg-[#FF7A9E] py-3 text-white"
              onClick={() =>
                router.push(
                  `/menubattle/join/${fakeRoomId}?battleName=${encodeURIComponent(
                    battleName,
                  )}`,
                )
              }
            >
              바로 참여하기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

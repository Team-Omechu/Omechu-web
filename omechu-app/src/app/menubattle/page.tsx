/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMemo, useState, useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Input, Toast } from "@/shared";
import { FoodBox } from "@/shared";
import { BattleButton } from "@/shared";
import { Button } from "@/shared";

const dummyMenus = [
  { name: "사케동", image_link: "/sample/sample-pasta.png" },
  { name: "낙지 볶음", image_link: "/sample/sample-pasta.png" },
  { name: "규동", image_link: "/sample/sample-pasta.png" },
  { name: "오므라이스", image_link: "/sample/sample-pasta.png" },
  { name: "연어 샐러드", image_link: "/sample/sample-pasta.png" },
  { name: "베이글", image_link: "/sample/sample-pasta.png" },
  { name: "타코", image_link: "/sample/sample-pasta.png" },
  { name: "된장찌개", image_link: "/sample/sample-pasta.png" },
  { name: "샌드위치", image_link: "/sample/sample-pasta.png" },
];

export default function MenuBattlePage() {
  const router = useRouter();

  /* 상단 "이미 방 번호가 있나요?" 입력값 */
  const [joinCode, setJoinCode] = useState("");

  /* 방 상태 */
  const [battleName, setBattleName] = useState("점심 메뉴 결정전: The Battle");
  const [roomNumber, setRoomNumber] = useState("2134");
  const [search, setSearch] = useState("");
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  /* 참여(Join) 관련 상태 */
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);

  /* Toast 상태 */
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  /* 방 번호 참여 처리 */
  const handleEnterByCode = async () => {
    const code = joinCode.trim();

    if (!code) {
      setToastMessage("참여 코드를 입력해주세요.");
      setShowToast(true);
      return;
    }

    const exists = await checkRoomExists(code);

    if (exists) {
      // ✅ 테스트용: 바로 play 페이지로 이동
      router.push(`/menubattle/play/${code}`);
    } else {
      setToastMessage(
        "방이 존재하지 않습니다.\n참여 코드를 다시 확인해 주세요.",
      );
      setShowToast(true);
    }
  };

  /* 메뉴 필터링 */
  const filteredMenus = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return dummyMenus;
    return dummyMenus.filter((m) => m.name.toLowerCase().includes(q));
  }, [search]);

  const toggleMenu = (name: string) => {
    setSelectedMenus((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    );
  };

  /* 배틀방 생성 */
  const handleCreateBattle = () => {
    if (selectedMenus.length === 0) {
      setToastMessage("최소 1개 이상의 메뉴를 선택해주세요.");
      setShowToast(true);
      return;
    }
    setShowCreateModal(true);
  };

  /* =====================
   * (중요) 방 존재 여부 체크
   * 현재는 더미
   * TODO: API 연동 예정
   * ===================== */
  const checkRoomExists = async (room: string) => {
    return room === roomNumber;
  };

  /* =====================
   * Join 흐름 여부
   * 지금 페이지에서는 false
   * TODO: join 페이지 분리 후 true
   * ===================== */
  const isJoinFlow = false;

  useEffect(() => {
    if (!isJoinFlow) return;

    const run = async () => {
      const exists = await checkRoomExists(roomNumber);

      if (exists) {
        setShowNicknameModal(true);
      } else {
        setToastMessage(
          "방이 존재하지 않습니다.\n참여 코드를 다시 확인해 주세요.",
        );
        setShowToast(true);
      }
    };

    run();
  }, []);

  /* 닉네임 검증*/
  const isValidNickname = (value: string) => {
    const regex = /^[a-zA-Z0-9가-힣]{1,20}$/;
    return regex.test(value);
  };

  /* 방 참여 처리 */
  const handleJoinRoom = () => {
    if (!isValidNickname(nickname)) {
      setToastMessage("닉네임은 한/영/숫자 1~20자만 가능합니다.");
      setShowToast(true);
      return;
    }

    if (participants.includes(nickname)) {
      setToastMessage("이미 사용 중인 닉네임입니다.");
      setShowToast(true);
      return;
    }

    // 참가자 등록 (테스트용)
    setParticipants((prev) => [...prev, nickname]);

    // 모달 닫기
    setShowNicknameModal(false);

    // ✅ play 페이지로 이동
    router.push(`/menubattle/play/${roomNumber}`);
  };

  /* Toast 자동 사라짐 처리 */
  useEffect(() => {
    if (!showToast) return;

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 2500); // 2.5초 후 사라짐

    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <main className="min-h-screen bg-[#F7D8FF] pb-32">
      {/* 상단 */}
      <header className="flex items-center justify-between px-4 pt-8 pb-4">
        <button onClick={() => router.back()} className="text-2xl">
          {`<`}
        </button>
        <h2 className="text-lg font-semibold">메뉴 배틀</h2>
        <div className="text-xl">👤</div>
      </header>

      {/* 이미 방 번호가 있나요? */}
      <section className="mt-2 px-4">
        <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
          <p className="text-body-4-medium text-font-high">
            이미 방 번호가 있나요?
          </p>

          <div className="mt-3 flex items-center gap-3">
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="참여 코드"
              className="border-font-disabled text-font-high text-caption-1 h-10 flex-1 border bg-white"
            />

            {/* 시안의 작은 '입장' 버튼 */}
            <button
              type="button"
              onClick={handleEnterByCode}
              className="bg-font-medium text-caption-1 disabled:bg-font-disabled h-10 w-16 rounded-xl text-white"
              disabled={!joinCode.trim()}
            >
              입장
            </button>
          </div>
        </div>
      </section>

      {/* 배틀방 이름 */}
      <section className="mt-2 px-4">
        <p className="mb-2 text-lg font-semibold">배틀방 이름</p>
        <Input
          value={battleName}
          onChange={(e) => setBattleName(e.target.value)}
          placeholder="배틀방 이름을 입력하세요"
          className="w-full border-none bg-white"
        />
      </section>

      {/* 검색 */}
      <section className="mt-6 px-4">
        <p className="mb-2 text-lg font-semibold">후보 메뉴</p>
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="음식명을 검색하세요"
          className="flex w-full items-center border-none bg-white"
        />
      </section>

      {/* 메뉴 리스트 */}
      <section className="mt-6 px-4">
        <div className="grid grid-cols-3 gap-4">
          {filteredMenus.map((food) => (
            <FoodBox
              key={food.name}
              src={food.image_link}
              title={food.name}
              isSelected={selectedMenus.includes(food.name)}
              onClick={() => toggleMenu(food.name)}
            />
          ))}
        </div>
      </section>

      {/* 하단 CTA */}
      <footer className="fixed right-0 bottom-0 left-0 rounded-t-2xl bg-white px-6 py-5 shadow">
        <p className="mb-2 text-gray-600">
          선택된 메뉴 {selectedMenus.length}개
        </p>
        <BattleButton
          width="xl"
          className="w-full"
          onClick={handleCreateBattle}
        >
          배틀방 생성
        </BattleButton>
      </footer>

      {/* 생성 완료 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="relative w-full max-w-sm rounded-2xl bg-white px-3.75 py-3.75 text-center">
            {/* 닫기 버튼 */}
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-3.75 right-3.75"
              aria-label="닫기"
            >
              <Image src="/x/close_big.svg" alt="닫기" width={20} height={20} />
            </button>

            {/* 타이틀 */}
            <div className="pt-6">
              <h3 className="text-body-3-medium wrap-break-word">
                [{battleName}] 생성 완료!
              </h3>
            </div>

            {/* 설명 */}
            <p className="text-caption-1 text-font-placeholder mt-2">
              아래 링크를 친구들과 공유하세요
            </p>

            {/* 방 번호 박스 */}
            <div className="border-font-disabled mt-3 rounded-xl border px-4 py-3">
              <p className="text-caption-2 text-font-placeholder">방 번호</p>
              <p className="text-body-4-medium text-font-high mt-1">
                {roomNumber}
              </p>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-3 flex gap-3">
              <Button
                width="md"
                bgColor="grey"
                className="text-font-medium flex-1"
              >
                공유하기
              </Button>

              <Button
                width="md"
                className="flex-1 bg-[#FF7A9E] text-white"
                onClick={() => setShowNicknameModal(true)}
              >
                바로 참여하기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 닉네임 입력 모달 (join 전용) */}
      {showNicknameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="relative w-full max-w-sm rounded-2xl bg-white px-3.75 py-3.75 text-center">
            {/* 닫기 버튼 */}
            <button
              type="button"
              onClick={() => setShowNicknameModal(false)}
              className="text-font-placeholder absolute top-3.75 right-3.75 text-xl"
              aria-label="닫기"
            >
              <Image src="/x/close_big.svg" alt="닫기" width={20} height={20} />
            </button>

            <div className="pt-6">
              <h3 className="text-body-3-medium wrap-break-word">
                {battleName}
              </h3>
            </div>

            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="mt-4 w-full"
            />
            <Button
              width="xl"
              className="mt-3 w-full bg-[#FF7A9E] text-white"
              onClick={handleJoinRoom}
            >
              입장하기
            </Button>
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast
        show={showToast}
        state="error"
        message={toastMessage}
        className="bottom-32"
      />
    </main>
  );
}

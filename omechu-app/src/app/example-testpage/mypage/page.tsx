import { Header } from "@/shared_FSD/index";

import SetAlarmCard from "./ui/SetAlarmCard";
import UserInfoCard from "./ui/UserInfoCard";

const MOCK_USER_INFO = {
  name: "제나",
  exerciseStatus: "다이어트 중",
  favoriteFood: "한식 다른 나라",
  allergy: "갑각류",
};

export default function MypageMain() {
  return (
    <>
      <Header title="마이페이지" isRightChild={true} />
      <main className="mt-10 flex h-[80dvh] flex-col items-center gap-4 border border-black px-5">
        <UserInfoCard {...MOCK_USER_INFO} />
        <SetAlarmCard />
      </main>
    </>
  );
}

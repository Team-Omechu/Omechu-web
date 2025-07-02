"use client";

import Header from "@/app/components/common/Header";
import { useRouter } from "next/navigation";

export default function ProfileEdit() {
  const router = useRouter();
  return (
    <>
      <Header
        title={"프로필 관리"}
        leftChild={
          <button
            onClick={() => {
              router.back();
            }}
          >
            {"<"}
          </button>
        }
      />
    </>
  );
}

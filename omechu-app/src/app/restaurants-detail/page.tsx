"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "../components/common/Header";

export default function RestaurantsDetial() {
  const router = useRouter();
  return (
    <>
      <Header
        leftChild={
          <button
            onClick={() => {
              router.push("/mypage");
            }}
          >
            {"<"}
          </button>
        }
        title={"추천 목록 관리"}
      />
    </>
  );
}

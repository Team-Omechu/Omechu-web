import Image from "next/image";
import Link from "next/link";

import Header from "@/app/components/common/Header";

export default function Favorites() {
  return (
    <>
      <Header
        title={"찜 목록"}
        leftChild={
          <Link href={"/mypage"}>
            <Image
              src={"/header_left_arrow.png"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </Link>
        }
      />
      <main>
        {/* 필터 - 최신 순 | 오래된 순 */}
        <section></section>
        {/* 찜 목록 */}
      </main>
    </>
  );
}

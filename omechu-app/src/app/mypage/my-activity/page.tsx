import Image from "next/image";
import Link from "next/link";

import Header from "@/app/components/common/Header";

export default function MyActivity() {
  return (
    <>
      <Header
        title={"활동 내역"}
        leftChild={
          <Link href={"/mypage"}>
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </Link>
        }
      />
      <main className="min-h-full w-full px-6 pb-8 pt-3"></main>
    </>
  );
}

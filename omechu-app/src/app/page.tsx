import Image from "next/image";

import BottomNav from "./components/common/Bottom";

export default function Home() {
  return (
    <>
      <div className="flex h-screen items-center justify-center pb-20">
        <Image src={"/logo_3d.png"} alt={"logo_3d"} width={250} height={30} />
      </div>
      <BottomNav />
    </>
  );
}

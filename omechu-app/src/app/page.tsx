import BottomNav from "./components/common/Bottom";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex items-center justify-center h-screen pb-20">
        <Image src={"/logo_3d.png"} alt={"logo_3d"} width={250} height={30} />
      </div>
      <BottomNav />
    </>
  );
}

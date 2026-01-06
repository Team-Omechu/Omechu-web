//! 26.01.06 작업 완료

import Image from "next/image";

import BaseModal from "@/shared_FSD/ui/modal/BaseModal";

const BattleModal = () => {
  <BaseModal
    leftButtonText="다시추천"
    rightButtonText="선택하기"
    onLeftButtonClick={() => {}}
    onRightButtonClick={() => {}}
  >
    <Image
      src={"/sample/sample-pasta.png"}
      alt="음식 이미지"
      width={130}
      height={130}
    />
    <div className="text-body-2-bold text-font-high">순대국밥</div>
  </BaseModal>;
};

export default BattleModal;

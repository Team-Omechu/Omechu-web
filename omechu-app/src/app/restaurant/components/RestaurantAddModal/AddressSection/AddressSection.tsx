import ModalWrapper from "@/components/common/ModalWrapper";

import AddressSearchModal from "./AddressSearchModal";

interface AddressSectionProps {
  address: string;
  detailAddress: string;
  setAddress: (v: string) => void;
  setDetailAddress: (v: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (v: boolean) => void;
}

export default function AddressSection({
  address,
  detailAddress,
  setAddress,
  setDetailAddress,
  isSearchModalOpen,
  setIsSearchModalOpen,
}: AddressSectionProps) {
  return (
    <>
      <div className="mb-2 text-sm font-medium text-gray-700">주소</div>
      <div className="mb-2 flex items-center gap-2">
        <textarea
          placeholder="주소지를 입력해 주세요"
          value={address}
          readOnly
          className={`flex-1 whitespace-normal break-keep rounded-md border border-grey-dark-hover bg-gray-200 px-3 py-2 text-sm text-gray-800 ${
            address
              ? "border-grey-dark-hover bg-white text-gray-800"
              : "cursor-not-allowed border-grey-dark-hover bg-gray-200 text-gray-400"
          }`}
        />
        <button
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          className="rounded-full bg-[#3FA2FF] px-4 py-2 text-sm text-white"
        >
          주소찾기
        </button>
      </div>
      <input
        type="text"
        placeholder="상세 주소를 입력해 주세요 (선택)"
        value={detailAddress}
        onChange={(e) => setDetailAddress(e.target.value)}
        disabled={!address}
        className={`mb-6 w-full rounded-md border px-3 py-2 text-sm ${
          address
            ? "border-grey-dark-hover bg-white text-gray-800"
            : "cursor-not-allowed border-grey-dark-hover bg-gray-200 text-gray-400"
        }`}
      />
      {isSearchModalOpen && (
        <ModalWrapper>
          <AddressSearchModal
            onClose={() => setIsSearchModalOpen(false)}
            onSelect={(selectedAddress) => {
              setAddress(selectedAddress);
              setIsSearchModalOpen(false);
            }}
          />
        </ModalWrapper>
      )}
    </>
  );
}

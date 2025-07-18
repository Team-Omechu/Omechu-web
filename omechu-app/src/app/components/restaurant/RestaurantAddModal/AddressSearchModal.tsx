"use client";

import { useState, useEffect } from "react";

type AddressSearchModalProps = {
  onClose: () => void;
  onSelect: (address: string) => void;
};

const MOCK_ADDRESSES = [
  "서울특별시 성동구 왕십리로 36 (성수도1가, 강변 건영 아파트)",
  "서울특별시 성동구 왕십리로 21길 36 (행당동)",
  "서울특별시 성동구 왕십리로 24길 36 (홍익대)",
];

export default function AddressSearchModal({
  onClose,
  onSelect,
}: AddressSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = MOCK_ADDRESSES.filter((addr) =>
      addr.includes(query.trim()),
    );
    setResults(filtered);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // 검색 결과 이미 실시간 반영되므로 따로 로직은 생략 가능
    }
  };

  const handleSelect = (address: string) => {
    onSelect(address);
    onClose();
  };

  return (
    <div className="w-11/12 max-w-md rounded-2xl bg-white px-5 py-6 text-sm shadow-lg">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between text-base font-semibold">
        <span>주소 검색</span>
        <button onClick={onClose}>✕</button>
      </div>

      {/* 검색창 */}
      <input
        type="text"
        placeholder="동(읍/면/리) 또는 도로명 주소를 입력해 주세요"
        className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={() => setQuery(query)}
        className="mb-4 w-full rounded-md bg-[#3FA2FF] py-2 text-white"
      >
        검색
      </button>

      {/* 검색 결과 리스트 */}
      <div className="flex flex-col gap-2">
        {results.map((addr, idx) => (
          <button
            key={idx}
            className="w-full rounded-md border border-gray-300 bg-[#f8f8f8] px-4 py-2 text-left hover:bg-[#e0f3ff]"
            onClick={() => handleSelect(addr)}
          >
            {addr}
          </button>
        ))}
        {results.length === 0 && query && (
          <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

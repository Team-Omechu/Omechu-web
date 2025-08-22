"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  onClose: () => void;
  // 기존 AddressSection과의 호환: 문자열만 쓰는 경우
  onSelect: (formattedAddress: string) => void;
  // 좌표/이름/컴포넌트까지 받고 싶은 경우(선택)
  onSelectFull?: (data: {
    formattedAddress: string;
    location: { lat: number; lng: number };
    placeId: string;
    displayName?: string;
    addressComponents?: any;
  }) => void;
};

type Prediction = {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

export default function AddressSearchModal({
  onClose,
  onSelect,
  onSelectFull,
}: Props) {
  const [q, setQ] = useState("");
  const [sessionToken, setSessionToken] = useState<string>(() =>
    crypto.randomUUID(),
  );
  const [loading, setLoading] = useState(false);
  const [preds, setPreds] = useState<Prediction[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 디바운스
  const debTimer = useRef<number | null>(null);
  useEffect(() => {
    if (debTimer.current) window.clearTimeout(debTimer.current);
    if (!q) {
      setPreds([]);
      setError(null);
      return;
    }
    debTimer.current = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `/api/places/autocomplete?input=${encodeURIComponent(q)}&sessiontoken=${sessionToken}`;
        const res = await fetch(url);
        const data = await res.json();
        // 서버에서 sessiontoken을 재발급해준 경우 갱신
        if (data.sessiontoken && data.sessiontoken !== sessionToken) {
          setSessionToken(data.sessiontoken);
        }
        if (
          data.status &&
          data.status !== "OK" &&
          data.status !== "ZERO_RESULTS"
        ) {
          setError(data.error_message ?? data.status);
          setPreds([]);
        } else {
          setPreds(data.predictions ?? []);
        }
      } catch (e: any) {
        setError(e?.message ?? "검색 실패");
        setPreds([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debTimer.current) window.clearTimeout(debTimer.current);
    };
  }, [q, sessionToken]);

  const helper = useMemo(
    () =>
      !q
        ? "도로명/지번/건물명을 입력해주세요"
        : loading
          ? "검색 중..."
          : preds.length
            ? ""
            : "결과가 없습니다",
    [q, loading, preds.length],
  );

  const handlePick = async (p: Prediction) => {
    try {
      setLoading(true);
      const url = `/api/places/details?placeId=${p.place_id}&sessiontoken=${sessionToken}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.status !== "OK" || !json.result) {
        throw new Error(json.error_message ?? json.status ?? "상세조회 실패");
      }

      const r = json.result;
      const formattedAddress: string = r.formatted_address ?? p.description;
      const lat = r.geometry?.location?.lat;
      const lng = r.geometry?.location?.lng;
      const displayName: string | undefined = r.name;

      // 문자열만 쓰는 곳(기존 AddressSection)은 그대로 동작
      onSelect(formattedAddress);

      // 전체 데이터도 필요하면 선택적으로 전달
      if (onSelectFull && typeof lat === "number" && typeof lng === "number") {
        onSelectFull({
          formattedAddress,
          location: { lat, lng },
          placeId: r.place_id ?? p.place_id,
          displayName,
          addressComponents: r.address_components,
        });
      }

      // 세션 종료 후 모달 닫기
      setSessionToken(crypto.randomUUID());
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "선택 처리 중 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">주소 검색</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
        >
          닫기
        </button>
      </div>

      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="예) 서울시 강남구 테헤란로 212"
        className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring"
      />

      {!!helper && <div className="mb-2 text-xs text-gray-500">{helper}</div>}

      {error && (
        <div className="mb-2 rounded-md bg-red-50 p-2 text-xs text-red-600">
          {error}
        </div>
      )}

      <ul className="max-h-80 overflow-auto">
        {preds.map((p) => (
          <li key={p.place_id}>
            <button
              type="button"
              onClick={() => handlePick(p)}
              className="flex w-full flex-col gap-0.5 rounded-md px-3 py-2 text-left hover:bg-gray-50"
            >
              <span className="text-sm font-medium text-gray-800">
                {p.structured_formatting?.main_text ?? p.description}
              </span>
              <span className="text-xs text-gray-500">
                {p.structured_formatting?.secondary_text ?? p.description}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

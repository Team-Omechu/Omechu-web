import type { TermsConfig, TermsType } from "./types";
import { termsForService } from "./data/service";
import { termsForPersonalInfo } from "./data/personalInfo";
import { termsForLocationInfo } from "./data/locationInfo";

/**
 * 약관 설정 중앙 관리
 * - 새로운 약관 추가 시 이 파일만 수정하면 됨
 */
export const TERMS_CONFIG: Record<TermsType, TermsConfig> = {
  service: {
    title: "서비스 이용약관",
    data: termsForService,
  },
  "personal-info": {
    title: "개인정보 처리방침",
    data: termsForPersonalInfo,
  },
  "location-info": {
    title: "위치기반 서비스 이용약관",
    data: termsForLocationInfo,
  },
} as const;

/**
 * 약관 목록 (메뉴용)
 */
export const TERMS_MENU_LIST = [
  { id: 1, type: "service" as TermsType, title: "서비스 이용약관" },
  { id: 2, type: "personal-info" as TermsType, title: "개인정보 처리방침" },
  {
    id: 3,
    type: "location-info" as TermsType,
    title: "위치기반 서비스 이용약관",
  },
] as const;

/**
 * 약관 타입 유효성 검사
 */
export function isValidTermsType(type: string): type is TermsType {
  return type in TERMS_CONFIG;
}

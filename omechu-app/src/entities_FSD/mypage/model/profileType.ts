// TODO: [FSD 마이그레이션] 이 파일은 삭제하면 아직 안됨..
// 새 위치: src/entities/user/model/profile.types.ts
// 이 위치를 전부 사용하면 그때 수정 가능

export interface ProfileType {
  id: number;
  email: string;
  nickname: string;
  bodyType: string;
  gender: string;
  exercise: string;
  prefer: string[];
  allergy: string[];
  profileImageUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileBody {
  email?: string;
  nickname?: string;
  body_type?: string;
  gender?: string;
  exercise?: string;
  prefer?: string[];
  allergy?: string[];
  profileImageUrl?: string;
}

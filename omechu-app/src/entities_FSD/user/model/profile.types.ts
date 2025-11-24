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

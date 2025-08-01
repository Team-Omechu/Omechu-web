export interface ProfileType {
  id: number;
  email: string;
  nickname: string | null;
  body_type: string | null;
  gender: string | null;
  exercise: string | null;
  prefer: string[];
  allergy: string[];
  profileImageUrl: string | null;
  created_at: string;
  updated_at: string;
}

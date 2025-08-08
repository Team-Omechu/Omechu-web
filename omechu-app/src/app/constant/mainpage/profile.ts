export type ProfileResponse = {
  resultType: string;
  error: null;
  success: {
    id: number;
    email: string;
    nickname: string;
    body_type: string;
    gender: string;
    exercise: string;
    prefer: string[];        // 선호 음식 카테고리
    allergy: string[];       // 알레르기 정보
    profileImageUrl: string;
    created_at: string;      // ISO 날짜 문자열
    updated_at: string;      // ISO 날짜 문자열
  };
};

export type heartResponse = {
  userId: number;
  restaurantId: number;
}

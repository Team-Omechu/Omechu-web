export const GENDER_MAP: { [key: string]: string } = {
  여성: "female",
  남성: "male",
};

export const EXERCISE_MAP: { [key: string]: string } = {
  "다이어트 중": "dieting",
  "증량 중": "bulking",
  "유지 중": "maintaining",
};

export const PREFER_MAP: { [key: string]: string } = {
  한식: "korean",
  양식: "western",
  중식: "chinese",
  일식: "japanese",
  "다른나라 음식": "other",
};

export const ALLERGY_MAP: { [key: string]: string } = {
  "달걀(난류) 알레르기": "egg",
  "우유 알레르기": "milk",
  "갑각류 알레르기": "shellfish",
  "해산물 알레르기": "seafood",
  "견과류 알레르기": "nuts",
};

export const CONSTITUTION_MAP: { [key: string]: string } = {
  감기: "cold",
  소화불량: "indigestion",
  더위잘탐: "heat_sensitive",
  추위잘탐: "cold_sensitive",
};

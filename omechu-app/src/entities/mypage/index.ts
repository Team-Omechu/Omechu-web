// ============================================
// entities/mypage 배럴 export
// FSD 규칙: entities는 shared만 의존
// ============================================

// API
export { fetchProfile, ProfileApiError } from "./api/profile";
export { updateProfile } from "./api/updateProfile";
export { fetchHeartList, likePlace, unlikePlace } from "./api/favorites";
export {
  fetchMukburimStats,
  type MukburimStats,
  type PeriodOption,
} from "./api/mukburim";
export {
  fetchRecommendManagement,
  exceptMenu,
  removeExceptMenu,
} from "./api/recommend";
export {
  fetchMyReviews,
  fetchMyPlaces,
  toggleReviewLike,
  deleteMyReview,
  type MyPlaceItem,
  type FetchMyPlaceResponse,
  type MyReviewItem,
  type FetchMyReviewsResponse,
} from "./api/myActivity";
export { updateRestaurant } from "./api/updateRestaurant";

// Model
export {
  type UpdateProfilePayload,
  type CompleteProfilePayload,
  type ProfileLike,
  buildUpdatePayloadFromStore,
  buildCompletePayloadFromStore,
} from "./model/profilePayload";
export { type MyPlaceApiResponseType } from "./model/MyPlaceApiResponseType";
export { useProfile } from "./model/useProfile";
export { useProfileQuery } from "./model/useProfileQuery";
export { resetBasicStateAndSync } from "./model/resetBasicState";

// UI

export { default as AuthErrorModalSection } from "./ui/AuthErrorModalSection";

export { default as EditStart } from "./ui/EditStart";
export { default as FoodStep } from "./ui/FoodStep";
export { default as GenderStep } from "./ui/GenderStep";
export { default as InfoRow } from "./ui/InfoRow";
export { default as MenuSection } from "./ui/MenuSection";
export { default as NicknameInput } from "./ui/NicknameInput";
export { default as ProfileImageUploader } from "./ui/ProfileImageUploader";
export { default as ProfileSection } from "./ui/ProfileSection";
export { default as StateStep } from "./ui/StateStep";

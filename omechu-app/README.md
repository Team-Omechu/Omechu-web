# `src/app` 디렉토리 구조 및 설명

Next.js v.15.4.2 App Router 기반의 `src/app` 폴더 전체 구조를 정리하고, 각 파일·폴더의 역할을 설명합니다.

## 전체 디렉토리 트리

```plaintext
src/app
├── (auth)/
│   ├── layout.tsx
│   ├── forgot-password/
│   │   ├── components/
│   │   │   └── ForgotPasswordForm.tsx
│   │   ├── page.tsx
│   │   └── sent/
│   │       ├── components/
│   │       │   └── EmailSentMessage.tsx
│   │       └── page.tsx
│   ├── reset-password/
│   │   ├── components/
│   │   │   └── ResetPasswordForm.tsx
│   │   └── page.tsx
│   ├── sign-in/
│   │   ├── components/
│   │   │   └── SignInForm.tsx
│   │   └── page.tsx
│   ├── sign-up/
│   │   ├── components/
│   │   │   ├── SignUpForm.tsx
│   │   │   ├── TermsAgreement.tsx
│   │   │   ├── TermsModal.tsx
│   │   │   └── UserInfoFields.tsx
│   │   └── page.tsx
│   └── logouttest/
│       └── page.tsx
│
├── auth/
│   ├── components/
│   │   └── Checkbox.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── schemas/
│   │   └── auth.schema.ts
│   └── store.ts
│
├── components/
│   ├── common/
│   │   ├── AlertModal.tsx
│   │   ├── Bottom.tsx
│   │   ├── button/
│   │   │   ├── BottomButton.tsx
│   │   │   ├── ListButton.tsx
│   │   │   ├── RoundButton.tsx
│   │   │   └── SquareButton.tsx
│   │   ├── CustomDatePicker.tsx
│   │   ├── FloatingActionButton.tsx
│   │   ├── Header.tsx
│   │   ├── Input.tsx
│   │   ├── ModalWrapper.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SortSelector.tsx
│   │   ├── TagItem.tsx
│   │   ├── Toast.tsx
│   │   └── …(기타 공용 컴포넌트)
│   │
│   ├── mainpage/
│   │   ├── MealStyleButton.tsx
│   │   ├── MealTypeButton.tsx
│   │   ├── MealIngredientButton.tsx
│   │   └── MainLoading.tsx
│   │
│   ├── mypage/
│   │   ├── FoodieBox.tsx
│   │   └── SelectTabBar.tsx
│   │
│   ├── settings/
│   │   └── PasswordInput.tsx
│   │
│   └── user-info-setup/
│       ├── AllergyStep.tsx
│       ├── ConditionStep.tsx
│       ├── FoodStep.tsx
│       ├── GenderStep.tsx
│       ├── StateStep.tsx
│       └── UserInfoSetupLayout.tsx
│
├── constant/
│   ├── choSeong.ts
│   ├── foodItems.ts
│   ├── initialFoodList.ts
│   ├── RegionList.ts
│   ├── restaurant/
│   │   ├── restaurantList.ts
│   │   ├── restaurantList2.ts
│   │   ├── restaurantFoodList.ts
│   │   ├── sampleReviews.ts
│   │   └── reviewSummary.ts
│   ├── suggestionList.ts
│   ├── terms/
│   │   ├── locationInfo.ts
│   │   ├── personlInfo.ts
│   │   └── service.ts
│   └── UserInfoEditSteps.ts
│
├── fullmenu/
│   ├── components/
│   │   ├── FilterModal.tsx
│   │   ├── FilterSection.tsx
│   │   └── FoodListSection.tsx
│   ├── menu-detail/
│   │   ├── page.tsx
│   │   └── recipe-detail/
│   │       └── page.tsx
│   └── page.tsx
│
├── globals.css
│
├── layout.tsx
│
├── page.module.css
│
├── page.tsx
│
├── ClientLayout.tsx
│
├── lib/
│   ├── api/
│   │   ├── auth.ts
│   │   └── client.ts
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── providers/
│   │   └── ReactQueryProvider.tsx
│   ├── schemas/
│   │   └── onboarding.schema.ts
│   └── stores/
│       ├── auth.store.ts
│       ├── onboarding.store.ts
│       ├── questionAnswer.store.ts
│       ├── locationAnswer.store.ts
│       ├── tagData.store.ts
│       └── userInfoSetup.store.ts
│
├── mainpage/
│   ├── api/
│   │   └── api.ts
│   ├── components/
│   │   ├── BudgetStep.tsx
│   │   ├── ExcludeButton.tsx
│   │   ├── FinalChoiceStep.tsx
│   │   ├── LocationModal.tsx
│   │   ├── MenuCard.tsx
│   │   ├── MoodStep.tsx
│   │   ├── PurposeStep.tsx
│   │   ├── QuestionAnswerLayout.tsx
│   │   ├── RandomRecommendModal.tsx
│   │   ├── TagCard.tsx
│   │   └── WhoStep.tsx
│   ├── example_testpage/
│   │   ├── components/
│   │   │   ├── LoginPromptModal.tsx
│   │   │   └── LoginPromptModal2.tsx
│   │   └── page.tsx
│   ├── hooks/
│   │   ├── useGetRecommendMenu.ts
│   │   └── useGetRestaurants.ts
│   ├── location-answer/
│   │   └── page.tsx
│   ├── meal-answer/
│   │   └── page.tsx
│   ├── question-answer/
│   │   └── [step]/
│   │       └── page.tsx
│   ├── random-recommend/
│   │   └── page.tsx
│   ├── result/
│   │   └── [menuId]/
│   │       └── page.tsx
│   └── utils/
│       └── handleLocation.ts
│
├── mypage/
│   ├── api/
│   │   ├── favorites.ts
│   │   ├── myActivity.ts
│   │   ├── profile.ts
│   │   └── updateProfile.ts
│   ├── AuthErrorModalSection.tsx
│   ├── favorites/
│   │   └── page.tsx
│   ├── foodie-log/
│   │   └── page.tsx
│   ├── hooks/
│   │   ├── useProfile.ts
│   │   └── useProfileQuery.ts
│   ├── my-activity/
│   │   ├── edit/
│   │   │   └── [id]/
│   │   │       ├── INITIAL_RESTAURANT_DATA.ts
│   │   │       └── page.tsx
│   │   └── page.tsx
│   ├── profile-edit/
│   │   ├── NicknameInput.tsx
│   │   ├── ProfileEditSection.tsx
│   │   └── ProfileImageUploader.tsx
│   ├── recommended-list/
│   │   └── page.tsx
│   ├── settings/
│   │   ├── account-settings/
│   │   │   ├── change-password/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── terms/
│   │       ├── location-info/
│   │       │   └── page.tsx
│   │       ├── personal-info/
│   │       │   └── page.tsx
│   │       └── service/
│   │           └── page.tsx
│   ├── types/
│   │   └── profileType.ts
│   └── user-info-edit/
│       ├── [step]/
│       │   ├── AllergyStep.tsx
│       │   ├── ConditionStep.tsx
│       │   ├── FoodStep.tsx
│       │   ├── GenderStep.tsx
│       │   └── StateStep.tsx
│       ├── InfoRow.tsx
│       └── page.tsx
│
└── onboarding/
    ├── [step]/
    │   └── page.tsx
    ├── api/
    │   └── onboarding.ts
    ├── components/
    │   ├── AllergyStep.tsx
    │   ├── ConstitutionStep.tsx
    │   ├── GenderStep.tsx
    │   ├── OnboardingStepLayout.tsx
    │   ├── PreferredFoodStep.tsx
    │   ├── ProfileStep.tsx
    │   └── WorkoutStatusStep.tsx
    ├── hooks/
    │   └── useOnboarding.ts
    └── utils/
        └── enum-mapper.ts


주요 폴더·파일 설명

(auth)/
	•	Parallel Route Group: 로그인·회원가입·비밀번호 재설정과 관련된 UI 전용 라우트 그룹
	•	구성:
	•	layout.tsx — 공통 레이아웃 (예: 인증 전용 헤더)
	•	forgot-password, reset-password, sign-in, sign-up, logouttest 페이지

auth/
	•	비즈니스 로직: 인증 상태 관리, 스키마, 훅
	•	구성:
	•	components/Checkbox.tsx
	•	hooks/useAuth.ts
	•	schemas/auth.schema.ts (Zod 등)
	•	store.ts (Zustand 인증 스토어)

components/
	•	공용 UI 컴포넌트 모음
	•	common/ — 버튼, 모달, 토스트, 입력 등 재사용 가능한 컴포넌트
	•	도메인별 하위 폴더: mainpage/, mypage/, settings/, user-info-setup/

constant/
	•	상수 데이터 및 샘플 데이터 저장
	•	terms/, restaurant/ 등 도메인별 세부 폴더 포함

fullmenu/
	•	전체 메뉴 보기 기능 관련 페이지 및 컴포넌트

lib/
	•	공통 라이브러리
	•	api/ — 클라이언트 API 호출 (Axios 인스턴스 등)
	•	hooks/ — 전역 훅
	•	providers/ — React Query Provider
	•	schemas/, stores/ — Zod 스키마, Zustand 스토어

mainpage/
	•	메인 플로우 (메뉴 추천 질문 → 결과)
	•	api/, hooks/, components/, utils/로 세분화

mypage/
	•	사용자 마이페이지
	•	활동 기록, 즐겨찾기, 프로필 편집, 설정 등

onboarding/
	•	회원 온보딩 플로우 (단계별 질문형 페이지)

최상위 루트 파일
	•	layout.tsx — 전역 레이아웃 (폰트·글로벌 CSS·Provider 래핑)
	•	ClientLayout.tsx — 공통 헤더·네비게이션·푸터
	•	page.tsx — 루트 홈 페이지
	•	loading.tsx / error.tsx — Suspense 로딩·에러 UI
	•	globals.css / page.module.css — Tailwind 외 전역·모듈 CSS

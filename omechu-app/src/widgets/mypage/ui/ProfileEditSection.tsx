"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/entities/mypage/api/updateProfile";
import {
  getPresignedUrl,
  uploadToS3,
  ModalWrapper,
  BaseModal,
  LoadingSpinner,
} from "@/shared";
import { useAuthStore } from "@/entities/user/model/auth.store";
import { useProfile } from "@/entities/mypage/model/useProfile";
import ProfileImageUploader from "@/entities/mypage/ui/ProfileImageUploader";
import NicknameInput from "@/entities/mypage/ui/NicknameInput";

export default function ProfileEditSection() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { profile, loading } = useProfile();
  const queryClient = useQueryClient();

  // 상태
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDeleted, setImageDeleted] = useState(false); // 사용자가 이미지 삭제를 눌렀는지 플래그
  const [nickname, setNickname] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  // 최초 프로필 불러오면 상태 초기화
  useEffect(() => {
    if (profile) {
      setProfileImageUrl(profile.profileImageUrl ?? null);
      setNickname(profile.nickname ?? "");
      setImageDeleted(false);
    }
  }, [profile]);

  // 닉네임 유효성 검증
  useEffect(() => {
    setIsValid(/^[A-Za-z가-힣]{2,12}$/.test(nickname));
  }, [nickname]);

  // 저장
  const handleSave = async () => {
    setIsLoading(true);
    setSaveError(null);
    try {
      let imageUrl = profileImageUrl;

      // 새 파일 업로드가 있는 경우: 업로드 후 URL 사용, 삭제 플래그 해제
      if (profileImageFile) {
        try {
          const { uploadUrl, fileUrl } = await getPresignedUrl(
            profileImageFile.name,
            profileImageFile.type,
          );
          console.log("[ProfileEdit] presign OK", {
            uploadUrl: uploadUrl?.slice(0, 120) + "…",
            fileUrl,
          });

          await uploadToS3(uploadUrl, profileImageFile, { acl: "public-read" });

          imageUrl = fileUrl;
          setProfileImageUrl(fileUrl);
          setImageDeleted(false);
        } catch (e: any) {
          console.error(
            "[ProfileEdit] 이미지 업로드 실패:",
            e?.response?.data || e,
          );
          throw e; // 상위 catch 로 에러 메시지 처리
        }
      }

      // 삭제 의도 vs 설정 의도 분기
      const payload: {
        nickname: string;
        profileImageUrl?: string | null;
        profileImageDelete?: boolean;
      } = { nickname };

      if (imageDeleted && !profileImageFile) {
        // 삭제 의도: 백엔드가 flag 또는 null 중 무엇이든 처리할 수 있도록 둘 다 보냄
        payload.profileImageDelete = true;
        payload.profileImageUrl = null;
      } else if (imageUrl) {
        // 새 이미지 또는 기존 이미지 유지
        payload.profileImageUrl = imageUrl;
      }
      await updateProfile(payload);
      // React Query 캐시 즉시 반영 + 백그라운드 재검증
      queryClient.setQueryData(["profile"], (prev: any) => {
        const prevObj = prev ?? {};
        return {
          ...prevObj,
          nickname,
          profileImageUrl:
            imageDeleted && !profileImageFile
              ? null
              : (imageUrl ?? prevObj.profileImageUrl ?? null),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setShowModal(true);
    } catch (e: any) {
      setSaveError("프로필 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner
        label="프로필 정보 불러오는 중..."
        className="h-[calc(100dvh-3rem)] overflow-y-hidden"
      />
    );
  }

  return (
    <main className="scrollbar-hide relative flex flex-col items-center overflow-y-auto px-4 py-32">
      <section className="mt-24 flex h-44 items-center justify-center gap-10">
        <ProfileImageUploader
          imagePreview={imagePreview}
          profileImageUrl={profileImageUrl}
          onImageChange={(file, previewUrl) => {
            setProfileImageFile(file);
            setImagePreview(previewUrl);
            setImageDeleted(false); // 새 이미지 선택 시 삭제 의도 해제
          }}
          onImageDelete={() => {
            setImagePreview(null);
            setProfileImageFile(null);
            setProfileImageUrl(null);
            setImageDeleted(true); // 삭제 의도 표시
          }}
        />
        <NicknameInput
          nickname={nickname}
          onChange={setNickname}
          isValid={isValid}
        />
      </section>
      <section className="mt-28">
        <button
          onClick={handleSave}
          disabled={!isValid || isLoading}
          onMouseDown={() => !(!isValid || isLoading) && setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => !(!isValid || isLoading) && setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          aria-pressed={isPressed}
          className={`h-12 w-[335px] rounded-md text-lg font-medium text-white transition-colors duration-150 ${
            !isValid || isLoading
              ? "bg-grey-normal cursor-not-allowed"
              : isPressed
                ? "bg-[#DD6362]"
                : "bg-primary-normal hover:bg-primary-normal-hover"
          } `}
        >
          {isLoading ? "저장 중..." : "저장"}
        </button>
        {saveError && <div className="mt-2 text-red-500">{saveError}</div>}
      </section>
      {showModal && (
        <ModalWrapper>
          <BaseModal
            title="프로필 변경 완료"
            desc="이제 맛집을 찾으러 가볼까요?"
            rightButtonText="완료"
            isCloseButtonShow={false}
            onRightButtonClick={() => {
              setShowModal(false);
              router.push("/");
            }}
          />
        </ModalWrapper>
      )}
    </main>
  );
}

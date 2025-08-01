import { useEffect, useState } from "react";
import { fetchProfile } from "../api/profile";
import { ProfileType } from "../types/profileType";

// userId는 number 타입으로 사용합니다.
export function useProfile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; raw?: any } | null>(
    null,
  );
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchProfile()
      .then((data) => {
        if (mounted) setProfile(data);
      })
      .catch((err) => {
        if (mounted) {
          if (err?.response?.status === 401) {
            setError({ message: "로그인이 필요합니다.", raw: err });
          } else {
            setError({
              message: "프로필 정보를 불러올 수 없습니다.",
              raw: err,
            });
          }
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { profile, loading, error };
}

import { useEffect, useState } from "react";
import { getProfile } from "../api/profile";

// userId는 number 타입으로 사용합니다.
export function useProfile(userId?: number) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    if (!userId) {
      setProfile(null);
      setLoading(false);
      setError("로그인이 필요합니다.");
      return;
    }

    getProfile(userId)
      .then((data) => {
        if (mounted) setProfile(data);
      })
      .catch((err) => {
        if (mounted) {
          if (err?.response?.status === 401) setError("로그인이 필요합니다.");
          else setError("프로필 정보를 불러올 수 없습니다.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [userId]);

  return { profile, loading, error };
}

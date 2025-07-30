import { useEffect, useState } from "react";
import { getProfile } from "../api/profile";

export function useProfile(userId?: number) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    if (userId == null) {
      setProfile(null);
      setLoading(false);
      setError("로그인이 필요합니다.");
      return;
    }

    getProfile(userId)
      .then((data) => {
        if (mounted) setProfile(data);
      })
      .catch(() => {
        if (mounted) setError("프로필 정보를 불러올 수 없습니다.");
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

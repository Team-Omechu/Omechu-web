import { axiosInstance } from "@/shared/lib/axiosInstance";
import { useAuthStore } from "@/entities/user/model/auth.store";
import axios from "axios";

/** 스웨거 기준 기간 옵션 (직접입력은 start/end 사용) */
export type PeriodOption =
  | "전체"
  | "1주" 
  | "1개월"
  | "3개월"
  | "6개월"
  | "1년"
  | "직접입력";

export interface MukburimStats {
  period: string; // 예: "1개월"
  dateRange: {
    startDate: string; // "YYYY-MM-DD"
    endDate: string; // "YYYY-MM-DD"
    displayRange: string; // "2025. 7. 12. ~ 2025. 8. 12."
  };
  summary: {
    totalRecords: number;
    uniqueMenus: number;
    averagePerDay: number;
  };
  menuStatistics: Array<{ menu_name: string; count: number }>;
}

export interface FetchMukburimStatsParams {
  period?: PeriodOption; // "직접입력"이 아니면 이 값으로 조회
  startDate?: string; // 직접입력일 때만 사용: "YYYY-MM-DD"
  endDate?: string; // 직접입력일 때만 사용: "YYYY-MM-DD"
}

const authHeader = () => {
  const token = useAuthStore.getState().accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * 먹부림 통계 조회
 * - period 제공 시: period만 전송 ("전체", "1개월" 등 — axios가 알아서 URL 인코딩해줍니다)
 * - period === "직접입력" 이면: startDate/endDate를 전송
 */
export async function fetchMukburimStats({
  period = "1개월",
  startDate,
  endDate,
}: FetchMukburimStatsParams = {}): Promise<MukburimStats> {
  const isCustom = period === "직접입력";
  const params: Record<string, string | undefined> = {};

  if (isCustom) {
    params.startDate = startDate;
    params.endDate = endDate;
  } else if (period) {
    params.period = period; // "1개월" 같은 한글 값 그대로 주면 axios가 인코딩
  }

  try {
    const { data } = await axiosInstance.get("/mukburim/statistics", {
      headers: authHeader(),
      params,
    });

    if (data?.resultType !== "SUCCESS" || !data?.success) {
      const reason =
        data?.error?.reason ??
        (data?.error ? JSON.stringify(data.error) : "통계 조회 실패");
      throw new Error(reason);
    }

    return data.success as MukburimStats;
  } catch (err) {
    // 스웨거 명세: 400(지원하지 않는 기간), 404(데이터 없음)
    if (axios.isAxiosError(err) && err.response) {
      const status = err.response.status;
      const reason =
        (err.response.data as any)?.error?.reason ??
        `요청 실패 (HTTP ${status})`;

      if (status === 400) {
        throw new Error(`요청 파라미터 오류: ${reason}`);
      }
      if (status === 404) {
        // 필요하면 빈 데이터로 반환하고 UI에서 '데이터 없음' 표시해도 됨
        throw new Error("해당 기간에 먹부림 기록이 없습니다.");
      }
      if (status === 401 || status === 403) {
        throw new Error("인증이 필요합니다. 다시 로그인해 주세요.");
      }
      throw new Error(reason);
    }
    throw err;
  }
}

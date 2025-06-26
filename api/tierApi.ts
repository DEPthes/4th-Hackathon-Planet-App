import { QUERY_KEYS } from "@/lib/queryClient";
import { getToken } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";

// 티어 응답 타입 정의
export interface TierResponse {
  id: number;
  userId: number;
  month: string; // YYYY-MM 형식
  tier: string;
  experiencePoint: number;
  currentExp: number;
  maxExp: number;
  level: number;
  createdAt: string;
  lastModifiedAt: string;
}

// 티어 API 에러 클래스
class TierApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "TierApiError";
  }
}

// 티어 API 요청 공통 함수
async function tierApiRequest<T>(
  endpoint: string,
  options: RequestInit & {
    requireAuth?: boolean;
  } = {}
): Promise<T> {
  const { requireAuth = true, ...requestOptions } = options;

  // 기본 헤더 설정
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // 인증이 필요한 경우 토큰 추가
  if (requireAuth) {
    const token = await getToken();
    if (!token) {
      throw new TierApiError(401, "인증 토큰이 없습니다.");
    }
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}${endpoint}`;

  // 요청 타임아웃 설정
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      ...requestOptions,
      headers: {
        ...defaultHeaders,
        ...requestOptions.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 401) {
        throw new TierApiError(
          401,
          "인증이 필요합니다. 로그인을 다시 해주세요."
        );
      }

      throw new TierApiError(response.status, errorText || response.statusText);
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text);
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new TierApiError(408, "요청 시간이 초과되었습니다.");
    }

    if (error instanceof TypeError) {
      throw new TierApiError(0, "네트워크 연결을 확인해주세요.");
    }

    if (error instanceof TierApiError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new TierApiError(
      500,
      `알 수 없는 오류가 발생했습니다: ${errorMessage}`
    );
  }
}

// API 함수들
async function getCurrentMonthTier(): Promise<TierResponse> {
  return tierApiRequest<TierResponse>("/tier/current");
}

// TanStack Query Hooks
export function useCurrentMonthTier() {
  return useQuery({
    queryKey: QUERY_KEYS.USER_TIER_CURRENT,
    queryFn: getCurrentMonthTier,
    staleTime: 1000 * 60 * 5, // 5분
    retry: 2,
  });
}

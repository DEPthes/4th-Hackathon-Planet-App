import { QueryClient } from "@tanstack/react-query";

// Query Client 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 30, // 30분 (이전 cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query Keys 상수 정의
export const QUERY_KEYS = {
  // 퀘스트 관련
  QUEST_TODAY: ["quest", "today"] as const,
  QUEST_SUGGESTIONS: ["quest", "suggestions"] as const,
  QUEST_MY_HISTORY: (startDate: string, endDate: string) =>
    ["quest", "my", "history", startDate, endDate] as const,

  // 사용자 관련
  USER_ME: ["user", "me"] as const,
  USER_TIER_CURRENT: ["user", "tier", "current"] as const,
  USER_TIER_SPECIFIC: (year: number, month: number) =>
    ["user", "tier", year, month] as const,
} as const;

// Planet Quest API with TanStack Query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../lib/queryClient";
import { getToken } from "../lib/storage";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://planet.myunghyun.me";

console.log("QUEST API_BASE_URL:", API_BASE_URL);

// API 응답 타입 정의
export interface QuestSuggestionResponse {
  uuid: string;
  title: string;
  createdAt: string;
  requesterEmail: string;
}

export interface QuestResponse {
  id: number;
  title: string;
  encouragement: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  lastModifiedAt: string;
  evidenceImage?: {
    id: string;
    fileName: string;
    size: number;
  };
  feedback?: string;
}

// API 에러 처리
class QuestApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "QuestApiError";
  }
}

// 기본 fetch 래퍼
async function questApiRequest<T>(
  endpoint: string,
  options: RequestInit & {
    requireAuth?: boolean;
    isMultipart?: boolean;
  } = {}
): Promise<T> {
  const {
    requireAuth = true,
    isMultipart = false,
    ...requestOptions
  } = options;
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {};

  if (!isMultipart) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  // Storage에서 토큰 가져오기
  if (requireAuth) {
    try {
      const authToken = await getToken();
      if (authToken) {
        defaultHeaders["Authorization"] = `Bearer ${authToken}`;
      }
    } catch (error) {
      console.error("🔑 토큰 가져오기 실패:", error);
    }
  }

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
        throw new QuestApiError(
          401,
          "인증이 필요합니다. 로그인을 다시 해주세요."
        );
      }

      throw new QuestApiError(
        response.status,
        errorText || response.statusText
      );
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text);
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new QuestApiError(408, "요청 시간이 초과되었습니다.");
    }

    if (error instanceof TypeError) {
      throw new QuestApiError(0, "네트워크 연결을 확인해주세요.");
    }

    if (error instanceof QuestApiError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new QuestApiError(
      500,
      `알 수 없는 오류가 발생했습니다: ${errorMessage}`
    );
  }
}

// API 함수들
async function generateQuestSuggestions(): Promise<QuestSuggestionResponse[]> {
  return questApiRequest<QuestSuggestionResponse[]>(
    "/quest/suggestions/generate",
    {
      method: "POST",
    }
  );
}

async function getCachedQuestSuggestions(): Promise<QuestSuggestionResponse[]> {
  return questApiRequest<QuestSuggestionResponse[]>("/quest/suggestions");
}

export async function approveQuestSuggestion(
  uuid: string
): Promise<QuestResponse> {
  return questApiRequest<QuestResponse>(`/quest/suggestions/${uuid}/approve`, {
    method: "POST",
  });
}

export async function getTodayQuest(): Promise<QuestResponse | null> {
  try {
    return await questApiRequest<QuestResponse>("/quest/today");
  } catch (error) {
    if (
      error instanceof QuestApiError &&
      (error.status === 404 || error.status === 400)
    ) {
      return null;
    }
    throw error;
  }
}

async function completeQuest(
  questId: number,
  evidenceImage?: string
): Promise<QuestResponse> {
  const formData = new FormData();

  if (evidenceImage) {
    try {
      const response = await fetch(evidenceImage);
      const imageBlob = await response.blob();
      formData.append("evidenceImage", imageBlob, "evidence.jpg");
    } catch (error) {
      throw new QuestApiError(400, "이미지 처리에 실패했습니다.");
    }
  }

  return questApiRequest<QuestResponse>(`/quest/${questId}/complete`, {
    method: "PUT",
    body: formData,
    isMultipart: true,
  });
}

async function getMyQuestsBetween(
  startDate: string,
  endDate: string
): Promise<QuestResponse[]> {
  const params = new URLSearchParams({ startDate, endDate });
  return questApiRequest<QuestResponse[]>(`/quest/my?${params}`);
}

// TanStack Query Hooks
export function useQuestSuggestions() {
  return useQuery({
    queryKey: QUERY_KEYS.QUEST_SUGGESTIONS,
    queryFn: getCachedQuestSuggestions,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

export function useTodayQuest() {
  return useQuery({
    queryKey: QUERY_KEYS.QUEST_TODAY,
    queryFn: getTodayQuest,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useMyQuestsHistory(startDate: string, endDate: string) {
  return useQuery({
    queryKey: QUERY_KEYS.QUEST_MY_HISTORY(startDate, endDate),
    queryFn: () => getMyQuestsBetween(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useGenerateQuestSuggestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateQuestSuggestions,
    onSuccess: (data) => {
      // 캐시 업데이트
      queryClient.setQueryData(QUERY_KEYS.QUEST_SUGGESTIONS, data);
    },
  });
}

export function useApproveQuestSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveQuestSuggestion,
    onSuccess: (data) => {
      // 오늘의 퀘스트 캐시 업데이트
      queryClient.setQueryData(QUERY_KEYS.QUEST_TODAY, data);
      // 제안 목록 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUEST_SUGGESTIONS });
    },
  });
}

export function useCompleteQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questId,
      evidenceImage,
    }: {
      questId: number;
      evidenceImage?: string;
    }) => completeQuest(questId, evidenceImage),
    onSuccess: (data) => {
      // 오늘의 퀘스트 캐시 업데이트
      queryClient.setQueryData(QUERY_KEYS.QUEST_TODAY, data);
      // 히스토리 무효화
      queryClient.invalidateQueries({
        queryKey: ["quest", "my", "history"],
        type: "all",
      });
    },
  });
}

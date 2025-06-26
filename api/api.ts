// Planet API 클라이언트
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://planet.myunghyun.me";

console.log("API_BASE_URL:", API_BASE_URL); // 디버깅용

// API 요청 타입 정의
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  mbti:
    | "ISTJ"
    | "ISFJ"
    | "INFJ"
    | "INTJ"
    | "ISTP"
    | "ISFP"
    | "INFP"
    | "INTP"
    | "ESTP"
    | "ESFP"
    | "ENFP"
    | "ENTP"
    | "ESTJ"
    | "ESFJ"
    | "ENFJ"
    | "ENTJ";
  gender: "Male" | "Female";
  hobbies: string[];
}

export interface UserUpdateRequest {
  password?: string;
  name?: string;
  mbti?:
    | "ISTJ"
    | "ISFJ"
    | "INFJ"
    | "INTJ"
    | "ISTP"
    | "ISFP"
    | "INFP"
    | "INTP"
    | "ESTP"
    | "ESFP"
    | "ENFP"
    | "ENTP"
    | "ESTJ"
    | "ESFJ"
    | "ENFJ"
    | "ENTJ";
  gender?: "Male" | "Female";
  hobbies?: string[];
}

export interface UserResponse {
  email: string;
  name: string;
  role: "User" | "Admin";
  mbti: string;
  gender: "Male" | "Female";
  hobbies: string[];
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  user: UserResponse;
}

// API 에러 처리
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// 기본 fetch 래퍼
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  console.log("🚀 API 요청 시작:", {
    url,
    method: options.method || "GET",
    headers: { ...defaultHeaders, ...options.headers },
    body: options.body,
  });

  // 타임아웃 설정 (10초)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log("⏰ API 요청 타임아웃");
    controller.abort();
  }, 10000);

  try {
    console.log("📡 fetch 요청 시작...");

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("✅ fetch 응답 수신:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      console.log("❌ API 에러 - 응답 텍스트 읽는 중...");
      const errorText = await response.text();
      // console.error("💥 API 에러 응답:", errorText);
      throw new ApiError(response.status, errorText || response.statusText);
    }

    console.log("📄 JSON 파싱 중...");
    const data = await response.json();
    console.log("🎉 API 성공 응답:", data);
    return data;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    const errorInfo = {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };

    console.error("💥 API 요청 실패:", errorInfo);

    // 타임아웃 에러
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(
        408,
        "요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요."
      );
    }

    // 네트워크 에러인 경우
    if (error instanceof TypeError) {
      console.error("🌐 네트워크 에러 상세:", error.message);
      throw new ApiError(
        0,
        "네트워크 연결을 확인해주세요. 인터넷 연결을 확인하거나 서버가 정상적으로 작동하는지 확인해주세요."
      );
    }

    // 이미 ApiError인 경우 그대로 전달
    if (error instanceof ApiError) {
      throw error;
    }

    // 기타 에러
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ApiError(500, `알 수 없는 오류가 발생했습니다: ${errorMessage}`);
  }
}

// 회원가입 API
export async function signUp(data: SignUpRequest): Promise<UserResponse> {
  return apiRequest<UserResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 로그인 API
export async function signIn(data: SignInRequest): Promise<SignInResponse> {
  console.log(data);
  return apiRequest<SignInResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 내 정보 조회 API
export async function getMe(token: string): Promise<UserResponse> {
  console.log(token);
  return apiRequest<UserResponse>("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 내 정보 수정 API
export async function updateUser(
  email: string,
  data: UserUpdateRequest,
  token: string
): Promise<UserResponse> {
  return apiRequest<UserResponse>(`/users/${encodeURIComponent(email)}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

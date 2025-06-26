// Planet API 클라이언트
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

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

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText || response.statusText);
  }

  return response.json();
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
  return apiRequest<SignInResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 내 정보 조회 API
export async function getMe(token: string): Promise<UserResponse> {
  return apiRequest<UserResponse>("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

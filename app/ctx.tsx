import { createContext, use, type PropsWithChildren } from "react";
import { useStorageState } from "../hooks/useStorageState";

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  signUp: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  signUp: () => null,
  session: null,
  isLoading: false,
});

// 이 훅을 사용해서 유저 정보를 접근할 수 있다.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // 로그인 로직 구현
          setSession("xxx");
        },
        signOut: () => {
          setSession(null);
        },
        signUp: () => {
          // 회원가입 로직 구현
          setSession("xxx");
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 기본 export 추가 (라우트 경고 방지용)
export default function EmptyCtx() {
  return null;
}

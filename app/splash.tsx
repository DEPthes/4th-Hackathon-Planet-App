import { SplashScreen } from "expo-router";
import { useSession } from "./ctx";

export function SplashScreenController() {
  const { isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}

// 기본 export 추가 (라우트 경고 방지용)
export default function EmptySplash() {
  return null;
}

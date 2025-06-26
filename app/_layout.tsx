import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { SessionProvider, useSession } from "./ctx";
import { SplashScreenController } from "./splash";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "login",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PretendardRegular: require("../assets/fonts/Pretendard-Regular.otf"),
    PretendardSemiBold: require("../assets/fonts/Pretendard-SemiBold.otf"),
    PretendardBold: require("../assets/fonts/Pretendard-Bold.otf"),
    // Pretendard: require("../assets/fonts/PretendardVariable.ttf"), // Variable 폰트는 주석 처리
  });
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // SplashScreen.preventAutoHideAsync(); // 제거
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      setAppIsReady(true);
    }
  }, [loaded]);

  // onLayoutRootView에서 SplashScreen.hideAsync() 호출 제거
  const onLayoutRootView = useCallback(() => {}, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <SessionProvider>
      <SplashScreenController />
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <RootNavigator />
      </View>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session } = useSession();
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(app)/(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen
            name="signup"
            options={{
              title: "회원가입",
              headerShadowVisible: false,
              headerTransparent: true,
            }}
          />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

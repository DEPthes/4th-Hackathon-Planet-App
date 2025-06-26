import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { MAIN_COLOR } from "@/constants/Colors";
import { useSession } from "../../ctx";

export default function TabOneScreen() {
  const { signOut, session } = useSession();

  useEffect(() => {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    if (!session) {
      router.replace("/login");
    }
  }, [session]);

  // 세션이 없으면 빈 화면 표시 (리다이렉트 중)
  if (!session) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      <Text
        style={{ marginTop: 24, color: "red" }}
        onPress={() => {
          signOut();
        }}
      >
        로그아웃
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MAIN_COLOR,
    fontFamily: "Pretendard",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

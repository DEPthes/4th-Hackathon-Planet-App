import { router } from "expo-router";
import { Text, View } from "react-native";
import { useSession } from "./ctx";

export default function Login() {
  const { signIn } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          signIn();
          router.replace("/");
        }}
      >
        로그인
      </Text>
    </View>
  );
}

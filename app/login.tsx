import { signIn as apiSignIn } from "@/api/api";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSession } from "./ctx";

export default function Login() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<"email" | "password" | "login" | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      // 입력값 검증
      if (!email.trim()) {
        setError("email");
        Alert.alert("입력 오류", "이메일을 입력해주세요.");
        return;
      }
      if (!password.trim()) {
        setError("password");
        Alert.alert("입력 오류", "비밀번호를 입력해주세요.");
        return;
      }

      setIsLoading(true);
      setError("");

      // Planet API 로그인 호출
      const response = await apiSignIn({
        email: email.trim(),
        password: password.trim(),
      });

      // 토큰과 사용자 정보 저장
      signIn(response.accessToken);

      Alert.alert("로그인 성공", `${response.user.name}님, 환영합니다!`, [
        {
          text: "확인",
          onPress: () => router.replace("/(app)/(tabs)"),
        },
      ]);
    } catch (error: any) {
      console.error("로그인 오류:", error);
      Alert.alert(
        "로그인 실패",
        error.message || "로그인 중 오류가 발생했습니다."
      );

      if (error.status === 401) {
        setError("login");
        Alert.alert("로그인 실패", "이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (error.status === 404) {
        setError("login");
        Alert.alert("로그인 실패", "이메일이 존재하지 않습니다.");
      } else {
        setError("login");
        Alert.alert(
          "로그인 실패",
          error.message || "로그인 중 오류가 발생했습니다."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error === "email" && styles.inputError]}
          placeholder="이메일"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError("");
          }}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {error === "email" && (
          <Text style={styles.errorText}>이메일을 입력해주세요</Text>
        )}

        <TextInput
          style={[styles.input, error === "password" && styles.inputError]}
          placeholder="비밀번호"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
          secureTextEntry
          autoCapitalize="none"
        />
        {error === "password" && (
          <Text style={styles.errorText}>비밀번호를 입력해주세요</Text>
        )}
        {error === "login" && (
          <Text style={styles.errorText}>
            이메일 또는 비밀번호가 올바르지 않습니다
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? "로그인 중..." : "로그인"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.signupButton}
          onPress={() => {
            router.replace("/signup");
          }}
        >
          <Text style={styles.signupButtonText}>회원가입</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  errorText: {
    color: "#ff3b30",
    marginBottom: 10,
    fontSize: 14,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
    gap: 10,
  },
  loginButton: {
    backgroundColor: "#9C9FEE",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signupButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#9C9FEE",
  },
  signupButtonText: {
    color: "#9C9FEE",
    fontSize: 16,
    fontWeight: "600",
  },
});

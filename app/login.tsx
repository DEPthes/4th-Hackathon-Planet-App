import { signIn as apiSignIn } from "@/api/api";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
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
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      // 입력값 검증
      if (!email.trim()) {
        setError("email");
        return;
      }
      if (!password.trim()) {
        setError("password");
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

      router.replace("/(app)/(tabs)");
    } catch (error: any) {
      if (error.status === 400) {
        setError("login");
        return;
      }
      // console.error("로그인 오류:", error);

      // if (error.status === 401) {
      //   setError("login");
      //   Alert.alert("로그인 실패", "이메일 또는 비밀번호가 올바르지 않습니다.");
      // } else if (error.status === 404) {
      //   setError("login");
      //   Alert.alert("로그인 실패", "이메일이 존재하지 않습니다.");
      // } else {
      //   setError("login");
      //   Alert.alert(
      //     "로그인 실패",
      //     error.message || "로그인 중 오류가 발생했습니다."
      //   );
      // }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 타이틀 섹션 */}
      <View style={styles.titleContainer}>
        <Image source={require("@/assets/images/icon.png")} />
      </View>

      {/* 입력 필드 섹션 */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, error === "email" && styles.inputError]}
            placeholder="이메일을 입력하세요."
            placeholderTextColor="#3A3A3A"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {error === "email" && (
            <Text style={styles.errorText}>*이메일을 입력하세요</Text>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                error === "password" && styles.inputError,
              ]}
              placeholder="비밀번호를 입력하세요."
              placeholderTextColor="#3A3A3A"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError("");
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Image
                  source={require("@/assets/images/icon/lucide_eye-closed.png")}
                />
              ) : (
                <Image
                  source={require("@/assets/images/icon/lucide_eye.png")}
                />
              )}
            </Pressable>
          </View>
          {error === "password" && (
            <Text style={styles.errorText}>*비밀번호를 입력하세요</Text>
          )}
        </View>
      </View>

      {/* 로그인 에러 메시지 */}
      {error === "login" && (
        <Text style={styles.loginErrorText}>
          이메일 또는 패스워드가 일치하지 않습니다
        </Text>
      )}

      {/* 버튼 섹션 */}
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
    padding: 32,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  planetIconContainer: {
    position: "relative",
    marginBottom: 16,
  },
  planetGradient: {
    width: 71,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  planetCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  starContainer: {
    position: "absolute",
    right: -20,
    top: -8,
  },
  star: {
    backgroundColor: "#FFFFFF",
    position: "absolute",
  },
  largeStar: {
    width: 38.5,
    height: 38.5,
    borderRadius: 1.4,
    right: 0,
    top: 0,
  },
  smallStar: {
    width: 14.5,
    height: 14.5,
    borderRadius: 0.7,
    right: -7,
    top: 23,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 64,
    fontWeight: "400",
    textAlign: "center",
    color: "#9B9FEE",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 326,
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 41,
    backgroundColor: "#ECEDFE",
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Pretendard",
    color: "#3A3A3A",
  },
  inputError: {},
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 12,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeIcon: {
    fontSize: 12,
  },
  errorText: {
    color: "#929498",
    fontSize: 12,
    fontFamily: "Pretendard",
    marginTop: 8,
  },
  loginErrorText: {
    color: "#929498",
    fontSize: 12,
    fontFamily: "Pretendard",
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 326,
    gap: 16,
  },
  loginButton: {
    backgroundColor: "#9B9FEE",
    height: 59,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Pretendard",
    fontWeight: "700",
  },
  signupButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  signupButtonText: {
    color: "#929498",
    fontSize: 14,
    fontFamily: "Pretendard",
    fontWeight: "700",
  },
});

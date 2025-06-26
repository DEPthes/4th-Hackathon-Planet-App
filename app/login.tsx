import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSession } from "./ctx";

export default function Login() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<"email" | "password" | "login" | "">("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("email");
      return;
    }
    try {
      signIn();
      router.replace("/");
    } catch (error) {
      setError("login");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
        />
        {error === "email" && <Text style={styles.errorText}>이메일 오류</Text>}

        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error === "password" && (
          <Text style={styles.errorText}>비밀번호 오류</Text>
        )}
        {error === "login" && <Text style={styles.errorText}>로그인 오류</Text>}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
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

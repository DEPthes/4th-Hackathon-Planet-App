/**
 * 회원가입 페이지 컴포넌트
 * 사용자의 기본 정보(이메일, 비밀번호)와 추가 정보(성별, MBTI, 취미)를 입력받아 회원가입을 처리합니다.
 */

import { signUp, type SignUpRequest } from "@/api/api";
import UserAgeSelect from "@/components/signup/UserAgeSelect";
import UserGenderSelect from "@/components/signup/UserGenderSelect";
import UserHobbySelect from "@/components/signup/UserHobbySelect";
import UserMbtiSelect from "@/components/signup/UserMbtiSelect";
import { FONT_SUB, MAIN_COLOR2, SUB_COLOR } from "@/constants/Colors";
import { FONT_STYLE } from "@/constants/Fonts";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from "react-native";

// MBTI 기본값 설정
const DEFAULT_MBTI = "ESTJ";

const Signup = () => {
  // 사용자 입력 상태 관리
  const [name, setName] = useState(""); // 이름
  const [email, setEmail] = useState(""); // 이메일
  const [password, setPassword] = useState(""); // 비밀번호
  const [passwordCheck, setPasswordCheck] = useState(""); // 비밀번호 확인
  const [gender, setGender] = useState<"male" | "female" | null>(null); // 성별
  const [mbti, setMbti] = useState(""); // MBTI
  const [hobbies, setHobbies] = useState<string[]>([]); // 취미 목록
  const [input, setInput] = useState(""); // 직접 입력 취미
  const [age, setAge] = useState<"10대" | "20대" | "30대" | "40대 이상" | null>(
    null
  ); // 연령대
  // 비밀번호 표시 여부
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isPasswordCheckError, setIsPasswordCheckError] = useState(false);

  /**
   * 필수 입력 항목이 모두 입력되었는지 확인
   * - 이름, 이메일, 비밀번호, 비밀번호 확인이 비어있지 않은지
   * - 성별이 선택되었는지
   * - MBTI가 선택되었는지
   * - 취미가 1개 이상 선택되었는지
   */
  const isEmpty =
    name.trim() === "" ||
    email.trim() === "" ||
    password.trim() === "" ||
    passwordCheck.trim() === "" ||
    gender === null ||
    mbti === "" ||
    hobbies.length === 0;

  /**
   * 새로운 취미를 추가하는 함수
   * @param hobby - 추가할 취미
   */
  const handleAddHobby = (hobby: string) => {
    if (!hobbies.includes(hobby)) {
      setHobbies([...hobbies, hobby]);
    }
  };

  /**
   * 회원가입 처리 함수
   * Planet API를 통해 실제 회원가입을 진행합니다.
   *
   * 처리 과정:
   * 1. 입력값 검증 (필수 항목 확인)
   * 2. 비밀번호 일치 확인
   * 3. Planet API 회원가입 요청
   * 4. 성공 시 로그인 페이지로 이동
   * 5. 실패 시 에러 메시지 표시
   */
  const handleSignup = async () => {
    // 에러 상태 초기화
    setIsEmailError(false);
    setIsPasswordError(false);
    setIsPasswordCheckError(false);

    // 1. 필수 입력 항목 검증
    if (isEmpty) {
      // 각 필드별 에러 상태 설정
      if (name.trim() === "") setIsEmailError(true); // 이름 에러 표시를 위해 임시로 이메일 에러 사용
      if (email.trim() === "") setIsEmailError(true);
      if (password.trim() === "") setIsPasswordError(true);
      if (passwordCheck.trim() === "") setIsPasswordCheckError(true);

      return;
    }

    // 2. 비밀번호 일치 확인
    if (password !== passwordCheck) {
      setIsPasswordCheckError(true);
      return;
    }

    setIsLoading(true);

    try {
      // 3. Planet API 회원가입 요청 데이터 준비
      const signUpData: SignUpRequest = {
        email: email.trim(),
        password: password.trim(),
        name: name.trim() || `${age || "미지정"}세 사용자`, // 실제 이름 사용, 없으면 연령대
        mbti: mbti as SignUpRequest["mbti"],
        gender: gender === "male" ? "Male" : "Female",
        hobbies: hobbies,
      };

      // 4. Planet API 회원가입 호출
      const userResponse = await signUp(signUpData);

      // 5. 회원가입 성공 - 로그인 페이지로 이동
      router.replace("/login");
    } catch (error: any) {
      // 6. 회원가입 실패 - 에러 메시지 표시
      console.error("Planet API 회원가입 오류:", error);

      let errorMessage = "회원가입 중 오류가 발생했습니다.";

      // API 에러 상태에 따른 메시지 처리
      if (error.status === 409) {
        errorMessage = "이미 가입된 이메일입니다.";
        setIsEmailError(true);
      } else if (error.status === 400) {
        errorMessage = "입력된 정보가 올바르지 않습니다.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("회원가입 실패", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.form}>
      <ScrollView>
        {/* 기본 정보 입력 폼 */}
        <View style={styles.container}>
          <Text style={[styles.label, { marginBottom: 24 }]}>
            기본 정보를 입력해주세요.
          </Text>
          <Text style={styles.infoLabel}>이름</Text>
          <TextInput
            style={styles.inputFull}
            value={name}
            onChangeText={setName}
            placeholder="이름을 입력하세요"
            placeholderTextColor="#3A3A3A"
            autoCapitalize="none"
          />
          {isEmailError && (
            <Text style={styles.errorText}>* 이름을 입력하세요</Text>
          )}
          <Text style={styles.infoLabel}>이메일</Text>
          <TextInput
            style={styles.inputFull}
            value={email}
            onChangeText={setEmail}
            placeholder="이메일을 입력하세요"
            placeholderTextColor="#3A3A3A"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {isEmailError && (
            <Text style={styles.errorText}>* 이메일을 입력하세요</Text>
          )}
          <Text style={styles.infoLabel}>비밀번호</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.inputFull}
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력하세요"
              secureTextEntry={!showPassword}
              placeholderTextColor="#3A3A3A"
              autoCapitalize="none"
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword((v) => !v)}
            >
              <Image
                source={
                  showPassword
                    ? require("@/assets/images/icon/lucide_eye.png")
                    : require("@/assets/images/icon/lucide_eye-closed.png")
                }
                style={styles.eyeButton}
              />
            </Pressable>
          </View>
          {isPasswordError && (
            <View>
              <Text style={styles.errorText}>
                * 영어 대소문자, 숫자, 특수기호 조합 최소 8자 이상
              </Text>
              <Text style={[styles.errorText, { marginTop: -8 }]}>
                * 비밀번호를 입력하세요
              </Text>
            </View>
          )}
          <Text style={styles.infoLabel}>비밀번호 확인</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.inputFull}
              value={passwordCheck}
              onChangeText={setPasswordCheck}
              placeholder="비밀번호를 다시 입력하세요"
              secureTextEntry={!showPasswordCheck}
              placeholderTextColor="#3A3A3A"
              autoCapitalize="none"
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPasswordCheck((v) => !v)}
            >
              <Image
                source={
                  showPasswordCheck
                    ? require("@/assets/images/icon/lucide_eye.png")
                    : require("@/assets/images/icon/lucide_eye-closed.png")
                }
                style={styles.eyeButton}
              />
            </Pressable>
          </View>
          {isPasswordCheckError && (
            <Text style={styles.errorText}>* 비밀번호가 일치하지 않습니다</Text>
          )}
        </View>

        {/* 추가 정보 입력 폼 */}
        <View style={styles.container}>
          {/* 성별 선택 */}
          <Text style={styles.label}>나의 성별을 선택하세요.</Text>
          <UserGenderSelect value={gender} onChange={setGender} />

          <Text style={[styles.label, { marginTop: 64, marginBottom: 24 }]}>
            연령대를 선택하세요
          </Text>
          <UserAgeSelect value={age} onChange={setAge} />
          {/* MBTI 선택 */}
          <Text style={[styles.label, { marginTop: 64 }]}>
            나의 MBTI 성격 유형을 선택하세요.
          </Text>
          <UserMbtiSelect value={mbti} onChange={setMbti} />

          {/* 취미 선택 */}
          <Text style={styles.label}>
            평소 좋아하는 취미 키워드를 선택하세요.{"\n"}입력하신 정보는 언제든
            바꿀 수 있습니다.
          </Text>
          <UserHobbySelect value={hobbies} onChange={setHobbies} />

          {/* 취미 직접 입력 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="직접 입력"
            />
          </View>
        </View>

        {/* 미입력 항목 경고 메시지 */}
        {isEmpty && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>*입력되지 않은 정보가 있습니다</Text>
          </View>
        )}

        {/* 회원가입 버튼 */}
        <Pressable
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>저장</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  form: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  helper: {
    width: "80%",
    color: "#929498",
    fontSize: 13,
    marginBottom: 4,
  },
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  label: {
    ...(FONT_STYLE.bodyM as TextStyle),
    color: "#929498",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyContainer: {
    width: "100%",
    backgroundColor: "#fff",
    marginLeft: 24,
  },
  emptyText: {
    ...FONT_STYLE.titleS,
    color: SUB_COLOR,
    marginTop: 16,
    marginBottom: 8,
  },
  button: {
    width: "80%",
    marginHorizontal: "auto",
    height: 52,
    backgroundColor: SUB_COLOR,
    borderRadius: 30,
    marginTop: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    ...FONT_STYLE.buttonL,
    color: "#fff",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  input: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#E4E4E4",
    width: 100,
    marginRight: 8,
    fontSize: 14,
    color: "#3A3A3A",
  },
  inputFull: {
    width: "100%",
    padding: 10,
    height: 48,
    borderRadius: 4,
    borderBottomWidth: 1,
    borderColor: "#E4E4E4",
    backgroundColor: MAIN_COLOR2,
    fontSize: 16,
    color: "#3A3A3A",
    marginBottom: 16,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    ...FONT_STYLE.bodyL,
    color: "black",
    marginBottom: 16,
  },
  eyeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 16,
    height: 16,
  },
  errorText: {
    ...FONT_STYLE.bodyS,
    color: FONT_SUB,
    marginBottom: 16,
  },
});

export default Signup;

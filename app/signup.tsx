/**
 * 회원가입 페이지 컴포넌트
 * 사용자의 기본 정보(이메일, 비밀번호)와 추가 정보(성별, MBTI, 취미)를 입력받아 회원가입을 처리합니다.
 */

import UserAgeSelect from "@/components/signup/UserAgeSelect";
import UserGenderSelect from "@/components/signup/UserGenderSelect";
import UserHobbySelect from "@/components/signup/UserHobbySelect";
import UserMbtiSelect from "@/components/signup/UserMbtiSelect";
import { MAIN_COLOR2, SUB_COLOR } from "@/constants/Colors";
import { FONT_STYLE } from "@/constants/Fonts";
import React, { useState } from "react";
import {
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

  /**
   * 필수 입력 항목이 모두 입력되었는지 확인
   * - 이메일, 비밀번호, 비밀번호 확인이 비어있지 않은지
   * - 성별이 선택되었는지
   * - MBTI가 기본값에서 변경되었는지
   * - 취미가 1개 이상 선택되었는지
   */
  const isEmpty =
    email.trim() === "" ||
    password.trim() === "" ||
    passwordCheck.trim() === "" ||
    gender === null ||
    mbti === DEFAULT_MBTI ||
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
   * TODO: 실제 회원가입 로직 구현 필요
   */
  const handleSignup = () => {
    console.log("signup");
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
          <Text style={styles.infoLabel}>비밀번호</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.inputFull, { flex: 1 }]}
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
          <Text style={styles.infoLabel}>비밀번호 확인</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.inputFull, { flex: 1 }]}
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
        <Pressable style={styles.button} onPress={handleSignup}>
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
    top: 6,
    width: 16,
    height: 16,
  },
});

export default Signup;

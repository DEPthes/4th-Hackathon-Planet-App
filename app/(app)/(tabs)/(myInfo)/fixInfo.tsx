/**
 * 사용자 정보 수정 페이지 컴포넌트
 * 현재 사용자의 정보를 불러와서 수정할 수 있는 페이지입니다.
 */

import {
  getMe,
  updateUser,
  type UserResponse,
  type UserUpdateRequest,
} from "@/api/api";
import UserGenderSelect from "@/components/signup/UserGenderSelect";
import UserHobbySelect from "@/components/signup/UserHobbySelect";
import UserMbtiSelect from "@/components/signup/UserMbtiSelect";
import { SUB_COLOR } from "@/constants/Colors";
import { FONT_STYLE } from "@/constants/Fonts";
import { getToken, saveUserInfo } from "@/lib/storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from "react-native";

const FixInfo = () => {
  // 사용자 입력 상태 관리
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | null>(null);
  const [mbti, setMbti] = useState("");
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [input, setInput] = useState(""); // 직접 입력 취미

  // 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 성별 변환 함수
  const convertGenderToApi = (
    genderValue: "Male" | "Female" | null
  ): "Male" | "Female" | undefined => {
    return genderValue || undefined;
  };

  // 성별 변환 함수 (API -> UI)
  const convertGenderFromApi = (apiGender: string): "Male" | "Female" => {
    return apiGender as "Male" | "Female";
  };

  // 사용자 정보 로드
  const loadUserInfo = async () => {
    try {
      setIsLoadingUserInfo(true);

      const token = await getToken();
      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다.", [
          { text: "확인", onPress: () => router.replace("/login") },
        ]);
        return;
      }

      const userData = await getMe(token);
      setUserInfo(userData);

      // 폼에 기존 데이터 설정
      setName(userData.name);
      setGender(convertGenderFromApi(userData.gender));
      setMbti(userData.mbti);
      setHobbies(userData.hobbies);
    } catch (error) {
      console.error("사용자 정보 로드 실패:", error);
      Alert.alert("오류", "사용자 정보를 불러올 수 없습니다.");
    } finally {
      setIsLoadingUserInfo(false);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  // 비밀번호가 일치하는지 확인
  const isPasswordValid =
    password === "" || (password !== "" && password === confirmPassword);

  /**
   * 필수 입력 항목이 모두 입력되었는지 확인
   */
  const isEmpty =
    name.trim() === "" ||
    gender === null ||
    mbti === "" ||
    hobbies.length === 0;

  /**
   * 새로운 취미를 추가하는 함수
   */
  const handleAddHobby = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !hobbies.includes(trimmedInput)) {
      setHobbies([...hobbies, trimmedInput]);
      setInput("");
    }
  };

  /**
   * 사용자 정보 수정 처리 함수
   */
  const handleUpdateInfo = async () => {
    if (!userInfo) return;

    // 1. 필수 입력 항목 검증
    if (isEmpty) {
      Alert.alert("오류", "모든 필수 항목을 입력해주세요.");
      return;
    }

    // 2. 비밀번호 일치 확인
    if (!isPasswordValid) {
      Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다.");
        return;
      }

      // 3. 수정 데이터 준비
      const updateData: UserUpdateRequest = {
        name: name.trim(),
        mbti: mbti as UserUpdateRequest["mbti"],
        gender: convertGenderToApi(gender),
        hobbies: hobbies,
      };

      // 비밀번호가 입력된 경우에만 포함
      if (password.trim()) {
        updateData.password = password;
      }

      // 4. API 호출
      const updatedUser = await updateUser(userInfo.email, updateData, token);

      // 5. 저장된 사용자 정보 업데이트
      await saveUserInfo(updatedUser);

      // 6. 성공 처리
      Alert.alert("수정 완료", "정보가 성공적으로 수정되었습니다.", [
        {
          text: "확인",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error("사용자 정보 수정 오류:", error);

      let errorMessage = "정보 수정 중 오류가 발생했습니다.";

      // API 에러 상태에 따른 메시지 처리
      if (error.status === 400) {
        errorMessage = "입력된 정보가 올바르지 않습니다.";
      } else if (error.status === 401) {
        errorMessage = "인증이 필요합니다. 다시 로그인해주세요.";
      } else if (error.status === 403) {
        errorMessage = "수정 권한이 없습니다.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("수정 실패", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 화면
  if (isLoadingUserInfo) {
    return (
      <SafeAreaView style={styles.form}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#9B9FEE" />
          <Text style={styles.loadingText}>사용자 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 사용자 정보가 없는 경우
  if (!userInfo) {
    return (
      <SafeAreaView style={styles.form}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            사용자 정보를 불러올 수 없습니다.
          </Text>
          <Pressable onPress={() => router.back()} style={styles.button}>
            <Text style={styles.buttonText}>뒤로가기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.form}>
      <ScrollView>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← 뒤로</Text>
            </Pressable>
          </View>

          {/* 이름 입력 */}
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.inputFull}
            value={name}
            onChangeText={setName}
            placeholder="이름을 입력하세요"
          />

          {/* 이메일 (수정 불가) */}
          <Text style={styles.label}>이메일 (수정 불가)</Text>
          <View style={styles.disabledInput}>
            <Text style={styles.disabledInputText}>{userInfo.email}</Text>
          </View>

          {/* 비밀번호 변경 (선택사항) */}
          <Text style={styles.label}>
            새 비밀번호 (변경하지 않으려면 비워두세요)
          </Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.inputFull}
              value={password}
              onChangeText={setPassword}
              placeholder="새 비밀번호"
              secureTextEntry={!showPassword}
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text>{showPassword ? "숨김" : "보기"}</Text>
            </Pressable>
          </View>

          {password !== "" && (
            <>
              <Text style={styles.label}>새 비밀번호 확인</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.inputFull}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="새 비밀번호 확인"
                  secureTextEntry={!showConfirmPassword}
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text>{showConfirmPassword ? "숨김" : "보기"}</Text>
                </Pressable>
              </View>
              {!isPasswordValid && (
                <Text style={styles.errorText}>
                  비밀번호가 일치하지 않습니다.
                </Text>
              )}
            </>
          )}

          {/* 성별 선택 */}
          <Text style={styles.label}>성별을 선택하세요.</Text>
          <UserGenderSelect
            value={
              gender === "Male" ? "male" : gender === "Female" ? "female" : null
            }
            onChange={(value) =>
              setGender(
                value === "male" ? "Male" : value === "female" ? "Female" : null
              )
            }
          />

          {/* MBTI 선택 */}
          <Text style={[styles.label, { marginTop: 64 }]}>
            MBTI 성격 유형을 선택하세요.
          </Text>
          <UserMbtiSelect value={mbti} onChange={setMbti} />

          {/* 취미 선택 */}
          <Text style={styles.label}>좋아하는 취미 키워드를 선택하세요.</Text>
          <UserHobbySelect value={hobbies} onChange={setHobbies} />

          {/* 취미 직접 입력 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="직접 입력"
              onSubmitEditing={handleAddHobby}
            />
            <Pressable onPress={handleAddHobby} style={styles.addButton}>
              <Text style={styles.addButtonText}>추가</Text>
            </Pressable>
          </View>
        </View>

        {/* 미입력 항목 경고 메시지 */}
        {isEmpty && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>*입력되지 않은 정보가 있습니다</Text>
          </View>
        )}

        {/* 저장 버튼 */}
        <Pressable
          style={[
            styles.button,
            isLoading || isEmpty || !isPasswordValid
              ? styles.disabledButton
              : {},
          ]}
          onPress={handleUpdateInfo}
          disabled={isEmpty || isLoading || !isPasswordValid}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "저장 중..." : "저장"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  form: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "PretendardRegular",
    color: "#666666",
  },
  errorText: {
    fontSize: 16,
    fontFamily: "PretendardRegular",
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 16,
  },
  container: {
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: "PretendardRegular",
    color: "#9B9FEE",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "PretendardBold",
    color: "#000000",
  },
  label: {
    ...(FONT_STYLE.bodyM as TextStyle),
    color: "#929498",
    marginTop: 16,
    marginBottom: 8,
  },
  inputFull: {
    width: "100%",
    padding: 16,
    height: 52,
    borderRadius: 8,
    backgroundColor: "#ECEDFE",
    fontSize: 16,
    fontFamily: "PretendardRegular",
    color: "#3A3A3A",
    marginBottom: 16,
  },
  disabledInput: {
    width: "100%",
    padding: 16,
    height: 52,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    marginBottom: 16,
  },
  disabledInputText: {
    fontSize: 16,
    fontFamily: "PretendardRegular",
    color: "#999999",
  },
  passwordRow: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#E4E4E4",
    marginRight: 8,
    fontSize: 14,
    fontFamily: "PretendardRegular",
    color: "#3A3A3A",
  },
  addButton: {
    backgroundColor: "#9B9FEE",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: "PretendardSemiBold",
    color: "#FFFFFF",
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
    backgroundColor: "#9B9FEE",
    borderRadius: 30,
    marginTop: 14,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#E4E4E4",
  },
  buttonText: {
    ...FONT_STYLE.buttonL,
    color: "#fff",
    textAlign: "center",
  },
});

export default FixInfo;

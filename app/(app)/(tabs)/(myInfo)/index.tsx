import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getMe, UserResponse } from "../../../../api/api";
import { clearAll, getToken } from "../../../../lib/storage";
import { useSession } from "../../../ctx";

const MyInfo = () => {
  const { signOut } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // MBTI 타입을 한글로 변환하는 함수
  const getMbtiDisplay = (mbti: string) => {
    const mbtiMap: { [key: string]: string } = {
      I: "I (내향)",
      E: "E (외향)",
      S: "S (감각)",
      N: "N (직관)",
      T: "T (사고)",
      F: "F (감정)",
      J: "J (판단)",
      P: "P (인식)",
    };

    return mbti.split("").map((char) => mbtiMap[char] || char);
  };

  // 성별을 한글로 변환하는 함수
  const getGenderDisplay = (gender: string) => {
    return gender === "Male" ? "남자" : "여자";
  };

  // 사용자 정보 로드
  const loadUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        throw new Error("로그인 토큰이 없습니다.");
      }

      const userData = await getMe(token);
      setUserInfo(userData);
    } catch (err) {
      console.error("사용자 정보 로드 실패:", err);
      setError(
        err instanceof Error ? err.message : "사용자 정보를 불러올 수 없습니다."
      );

      // 토큰이 유효하지 않은 경우 로그아웃 처리
      if (err instanceof Error && err.message.includes("토큰")) {
        Alert.alert("로그인 필요", "다시 로그인해주세요.", [
          {
            text: "확인",
            onPress: () => signOut(),
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  // 화면이 포커스될 때마다 사용자 정보 새로 불러오기
  useFocusEffect(
    useCallback(() => {
      loadUserInfo();
    }, [loadUserInfo])
  );

  // 로그아웃 처리
  const handleLogout = async () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            await clearAll();
            signOut();
          } catch (error) {
            console.error("로그아웃 실패:", error);
            signOut(); // 실패해도 로그아웃 처리
          }
        },
      },
    ]);
  };

  // 로딩 상태
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#9B9FEE" />
          <Text style={styles.loadingText}>사용자 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 에러 상태
  if (error || !userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {error || "사용자 정보를 불러올 수 없습니다."}
          </Text>
          <Pressable onPress={loadUserInfo} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadUserInfo}
            colors={["#9B9FEE"]}
            tintColor="#9B9FEE"
          />
        }
      >
        {/* 이름 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이름</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{userInfo.name}</Text>
          </View>
        </View>

        {/* 이메일 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이메일</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{userInfo.email}</Text>
          </View>
        </View>

        {/* 취미 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>취미</Text>
          <View style={styles.tagContainer}>
            {userInfo.hobbies.map((hobby, index) => (
              <View key={index} style={styles.selectedTag}>
                <Text style={styles.selectedTagText}>{hobby}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* MBTI 성격 유형 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MBTI 성격 유형</Text>
          <View style={styles.tagContainer}>
            {getMbtiDisplay(userInfo.mbti).map((type, index) => (
              <View key={index} style={styles.selectedTag}>
                <Text style={styles.selectedTagText}>{type}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 성별 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>성별</Text>
          <View style={styles.genderContainer}>
            <View style={styles.selectedGenderTag}>
              <Text style={styles.selectedGenderText}>
                {getGenderDisplay(userInfo.gender)}
              </Text>
            </View>
          </View>
        </View>

        {/* 로그아웃 버튼 */}
        <View style={styles.logoutContainer}>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
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
  retryButton: {
    backgroundColor: "#9B9FEE",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: "PretendardSemiBold",
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#000000",
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 16,
    fontFamily: "PretendardRegular",
    color: "#333333",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedTag: {
    backgroundColor: "#9B9FEE",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 100,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagText: {
    fontSize: 14,
    fontFamily: "PretendardRegular",
    fontWeight: "400",
    color: "#FFFFFF",
  },
  genderContainer: {
    alignItems: "flex-start",
  },
  selectedGenderTag: {
    backgroundColor: "#9B9FEE",
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 100,
    width: "100%",
    alignItems: "center",
  },
  selectedGenderText: {
    fontSize: 16,
    fontFamily: "PretendardSemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
  },
  logoutContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logoutButton: {
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: "PretendardRegular",
    fontWeight: "400",
    color: "#3A3A3A",
  },
});

export default MyInfo;

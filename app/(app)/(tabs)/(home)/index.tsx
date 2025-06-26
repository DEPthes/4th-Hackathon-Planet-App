import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useGenerateQuestSuggestions,
  useTodayQuest,
} from "../../../../api/questApi";
import { useCurrentMonthTier } from "../../../../api/tierApi";
import {
  getTierImage,
  getTierNumber,
  getTierStarImage,
} from "../../../../utils/tierImages";
import { useSession } from "../../../ctx";

export default function HomeScreen() {
  const { session } = useSession();

  // TanStack Query hooks
  const {
    data: todayQuest,
    isLoading: isTodayQuestLoading,
    error: todayQuestError,
  } = useTodayQuest();

  const generateMutation = useGenerateQuestSuggestions();

  // 티어 데이터 가져오기
  const { data: tierData, refetch } = useCurrentMonthTier();

  useEffect(() => {
    refetch();
  }, []);

  // 경험치 포인트를 100으로 나누어 진행률 계산
  const progress = tierData?.experiencePoint
    ? (tierData.experiencePoint / 100) * 100
    : 0;

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

  const handleQuestGeneration = async () => {
    try {
      await generateMutation.mutateAsync();
      // 퀘스트 선택 페이지로 이동
      router.push("/(app)/(tabs)/(home)/questSelection");
    } catch (error) {
      Alert.alert("오류", "퀘스트 생성에 실패했습니다. 다시 시도해주세요.");
      console.error("퀘스트 생성 오류:", error);
    }
  };

  const handleTodayQuestPress = () => {
    if (todayQuest) {
      if (todayQuest.isCompleted) {
        Alert.alert("완료된 퀘스트", "이미 완료된 퀘스트입니다.");
      } else {
        router.push("/(app)/(tabs)/(home)/questProgress");
      }
    }
  };

  // 퀘스트 상태에 따른 버튼 렌더링
  const renderQuestButton = () => {
    if (isTodayQuestLoading) {
      return (
        <View style={styles.questButton}>
          <LinearGradient
            colors={["#9B9FEE", "#7B7FE8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.questButtonGradient}
          >
            <Text style={styles.questButtonText}>로딩 중...</Text>
          </LinearGradient>
        </View>
      );
    }

    if (todayQuest) {
      if (todayQuest.isCompleted) {
        return (
          <View style={[styles.questButton, { opacity: 0.6 }]}>
            <LinearGradient
              colors={["#9B9FEE", "#7B7FE8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.questButtonGradient}
            >
              <Text style={styles.questButtonText}>오늘의 퀘스트 완료!</Text>
            </LinearGradient>
          </View>
        );
      } else {
        return (
          <Pressable
            style={styles.questButton}
            onPress={handleTodayQuestPress}
            android_ripple={{ color: "rgba(255,255,255,0.2)" }}
          >
            <LinearGradient
              colors={["#9B9FEE", "#7B7FE8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.questButtonGradient}
            >
              <Text style={styles.questButtonText}>퀘스트 진행하기</Text>
            </LinearGradient>
          </Pressable>
        );
      }
    }

    // 오늘의 퀘스트가 없는 경우
    return (
      <Pressable
        style={styles.questButton}
        onPress={handleQuestGeneration}
        disabled={generateMutation.isPending}
        android_ripple={{ color: "rgba(255,255,255,0.2)" }}
      >
        <LinearGradient
          colors={["#9B9FEE", "#7B7FE8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.questButtonGradient}
        >
          <Text style={styles.questButtonText}>
            {generateMutation.isPending ? "생성 중..." : "행성 퀘스트 생성하기"}
          </Text>
        </LinearGradient>
      </Pressable>
    );
  };

  const tier = tierData?.tier || "TinyStar";

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /> */}
      <Text style={styles.title}>오늘의 행성 퀘스트</Text>
      {/* 진행률 바 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={["#ECEDFE", "#9B9FEE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${progress}%` }]}
          />
        </View>

        {/* 행성 캐릭터 */}
        <View style={styles.planetContainer}>
          <Image source={getTierStarImage(getTierNumber(tier))} />
        </View>

        {/* 별 아이콘 - 상태바 끝에 위치 */}
        <View style={[styles.starContainer, { left: `${progress}%` }]}>
          <Image source={require("@/assets/images/tier/Star.png")} />
          <Text style={styles.experiencePoint}>
            {tierData?.experiencePoint}
          </Text>
        </View>
      </View>

      {/* 메인 행성 일러스트 영역 */}
      <Image source={getTierImage(getTierNumber(tier))} />

      {/* 퀘스트 버튼 */}
      {renderQuestButton()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    width: "100%",
    textAlign: "center",
    color: "#3A3A3A",
    marginTop: 60,
  },
  questTitleContainer: {
    marginTop: 24,
    height: 51,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  questTitle: {
    fontSize: 16,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#3A3A3A",
  },
  currentQuestContainer: {
    marginHorizontal: 24,
    marginVertical: 16,
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#9B9FEE",
  },
  currentQuestTitle: {
    fontSize: 14,
    fontFamily: "PretendardSemiBold",
    color: "#3A3A3A",
    marginBottom: 4,
  },
  currentQuestStatus: {
    fontSize: 12,
    fontFamily: "PretendardRegular",
    color: "#9B9FEE",
  },
  progressContainer: {
    marginTop: 60,
    height: 46,
    marginHorizontal: 24,
    position: "relative",
    justifyContent: "center",
  },
  progressBarBackground: {
    height: 16,
    backgroundColor: "#E4E4E4",
    borderRadius: 100,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 100,
  },
  planetContainer: {
    position: "absolute",
    left: 50,
    top: -11,
    width: 46,
    height: 46,
  },
  planet: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  planetInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  planetEmoji: {
    fontSize: 20,
  },
  starContainer: {
    position: "absolute",
    top: 0,
    width: 30,
    height: 30,
    marginLeft: -15,
  },
  star: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  starText: {
    fontSize: 14,
  },
  mainPlanetContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 40,
  },
  planetBackground: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mainPlanet: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  mainPlanetGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  mainPlanetEmoji: {
    fontSize: 60,
  },
  smallStar1: {
    position: "absolute",
    top: 30,
    left: 40,
  },
  smallStar2: {
    position: "absolute",
    bottom: 40,
    right: 30,
  },
  smallStarText: {
    fontSize: 16,
  },
  planetRing: {
    position: "absolute",
    width: 160,
    height: 4,
    borderRadius: 2,
    opacity: 0.7,
  },
  planetByContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  planetByText: {
    fontSize: 24,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#9B9FEE",
  },
  questButton: {
    marginHorizontal: 24,
    marginBottom: 40,
    borderRadius: 12,
    overflow: "hidden",
  },
  questButtonGradient: {
    marginTop: 40,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  questButtonText: {
    fontSize: 16,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  experiencePoint: {
    position: "absolute",
    top: -8,
    left: -20,
    fontSize: 16,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#3A3A3A",
  },
});

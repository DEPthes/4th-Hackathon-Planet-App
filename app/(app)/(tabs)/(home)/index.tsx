import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useGenerateQuestSuggestions,
  useTodayQuest,
} from "../../../../api/questApi";
import { useSession } from "../../../ctx";

export default function HomeScreen() {
  const { session } = useSession();
  const [progress, setProgress] = useState(82); // 진행률 예시 (0-100)

  // TanStack Query hooks
  const {
    data: todayQuest,
    isLoading: isTodayQuestLoading,
    error: todayQuestError,
  } = useTodayQuest();

  const generateMutation = useGenerateQuestSuggestions();

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
        router.push("/(app)/(tabs)/(home)/questProgressNew");
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
              <Text style={styles.questButtonText}>✅ 오늘의 퀘스트 완료!</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 퀘스트 제목 */}
      <View style={styles.questTitleContainer}>
        <Text style={styles.questTitle}>오늘의 행성 퀘스트</Text>
      </View>

      {/* 현재 퀘스트 정보 */}
      {todayQuest && (
        <View style={styles.currentQuestContainer}>
          <Text style={styles.currentQuestTitle}>{todayQuest.title}</Text>
          <Text style={styles.currentQuestStatus}>
            {todayQuest.isCompleted ? "완료됨" : "진행 중"}
          </Text>
        </View>
      )}

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
          <LinearGradient
            colors={["#9B9FEE", "#ECEDFE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.planet}
          >
            <View style={styles.planetInner}>
              <Text style={styles.planetEmoji}>🪐</Text>
            </View>
          </LinearGradient>
        </View>

        {/* 별 아이콘 */}
        <View style={styles.starContainer}>
          <LinearGradient
            colors={["#ECEDFE", "#9B9FEE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.star}
          >
            <Text style={styles.starText}>⭐</Text>
          </LinearGradient>
        </View>
      </View>

      {/* 메인 행성 일러스트 영역 */}
      <View style={styles.mainPlanetContainer}>
        <LinearGradient
          colors={["#ECEDFE", "#FFFFFF"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.planetBackground}
        >
          {/* 메인 행성 */}
          <View style={styles.mainPlanet}>
            <LinearGradient
              colors={["#9B9FEE", "#ECEDFE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mainPlanetGradient}
            >
              <Text style={styles.mainPlanetEmoji}>🌍</Text>
            </LinearGradient>
          </View>

          {/* 작은 별들 */}
          <View style={styles.smallStar1}>
            <Text style={styles.smallStarText}>✨</Text>
          </View>
          <View style={styles.smallStar2}>
            <Text style={styles.smallStarText}>⭐</Text>
          </View>

          {/* 행성 고리 */}
          <LinearGradient
            colors={["#9B9FEE", "#ECEDFE"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.planetRing}
          />
        </LinearGradient>
      </View>

      {/* 행성별 텍스트 */}
      <View style={styles.planetByContainer}>
        <Text style={styles.planetByText}>행성별</Text>
      </View>

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
    height: 46,
    marginHorizontal: 24,
    position: "relative",
    justifyContent: "center",
    marginBottom: 35,
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
    right: 30,
    top: 0,
    width: 30,
    height: 30,
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
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  questButtonText: {
    fontSize: 16,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

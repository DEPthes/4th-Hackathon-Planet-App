import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSession } from "../../../ctx";

export default function HomeScreen() {
  const { session } = useSession();
  const [progress, setProgress] = useState(82); // 진행률 예시 (0-100)

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

  const handleQuestGeneration = () => {
    // 퀘스트 선택 페이지로 이동
    router.push("/(app)/(tabs)/(home)/questSelection");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 퀘스트 제목 */}
      <View style={styles.questTitleContainer}>
        <Text style={styles.questTitle}>오늘의 행성 퀘스트</Text>
      </View>

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

      {/* 퀘스트 생성 버튼 */}
      <Pressable
        style={styles.questButton}
        onPress={handleQuestGeneration}
        android_ripple={{ color: "rgba(255,255,255,0.2)" }}
      >
        <LinearGradient
          colors={["#9B9FEE", "#7B7FE8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.questButtonGradient}
        >
          <Text style={styles.questButtonText}>행성 퀘스트 생성하기</Text>
        </LinearGradient>
      </Pressable>
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
    elevation: 3,
  },
  planetInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  planetEmoji: {
    fontSize: 24,
  },
  starContainer: {
    position: "absolute",
    right: 20,
    top: -11,
    width: 40,
    height: 40,
  },
  star: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "15deg" }],
  },
  starText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  mainPlanetContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  planetBackground: {
    flex: 1,
    borderRadius: 20,
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  mainPlanet: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  mainPlanetGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#9B9FEE",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  mainPlanetEmoji: {
    fontSize: 80,
  },
  smallStar1: {
    position: "absolute",
    top: 50,
    left: 50,
  },
  smallStar2: {
    position: "absolute",
    bottom: 80,
    right: 60,
  },
  smallStarText: {
    fontSize: 24,
    opacity: 0.8,
  },
  planetRing: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    height: 38,
    borderRadius: 19,
    opacity: 0.6,
  },
  planetByContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  planetByText: {
    fontSize: 20,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#3A3A3A",
  },
  questButton: {
    marginHorizontal: 24,
    marginBottom: 40,
    borderRadius: 100,
    overflow: "hidden",
    shadowColor: "#9B9FEE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  questButtonGradient: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  questButtonText: {
    fontSize: 16,
    fontFamily: "PretendardSemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function QuestCompleteScreen() {
  const params = useLocalSearchParams();

  // 전달받은 데이터 파싱
  const questData = params.questData
    ? JSON.parse(params.questData as string)
    : null;
  const expGained = (params.expGained as string) || "20";

  const handleClose = () => {
    router.push("/(app)/(tabs)/(home)");
  };

  const handleViewPlanet = () => {
    // TODO: 내 행성 보기 화면으로 이동
    console.log("내 행성 보기");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerIcon} />
        <Text style={styles.headerTitle}>퀘스트 완료</Text>
        <View style={styles.headerIcon} />
      </View>

      {/* 컨텐츠 영역 */}
      <View style={styles.content}>
        {/* 경험치 획득 박스 */}
        <View style={styles.expContainer}>
          <View style={styles.expBox}>
            <Text style={styles.expText}>경험치 +{expGained}</Text>
          </View>
          <Text style={styles.levelText}>
            다음 레벨업까지 20pt 남았어요. 조금 더 화이팅!
          </Text>
        </View>

        {/* 축하 일러스트 영역 */}
        <View style={styles.illustrationContainer}>
          {/* 캐릭터 영역 */}
          <View style={styles.characterContainer}>
            <Image source={require("@/assets/images/complete.png")} />
          </View>
        </View>

        {/* AI 피드백 메시지 */}
        <Text style={styles.feedbackText}>
          {questData?.feedback ||
            "고르신 책 글귀는 저도 마음에 드는데요?\n인생을 살아가며 꼭 필요한 문장같아요.\n책을 읽으며 힐링이 되셨길 바라요."}
        </Text>

        {/* 하단 버튼들 */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </Pressable>
          <Pressable style={styles.planetButton} onPress={handleClose}>
            <Text style={styles.planetButtonText}>내 행성 보기</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 47, // Status bar height
  },
  headerIcon: {
    width: 22,
    height: 22,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  expContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  expBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 31,
    marginBottom: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expText: {
    fontSize: 24,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#9B9FEE",
    textAlign: "center",
  },
  levelText: {
    fontSize: 14,
    fontFamily: "PretendardRegular",
    fontWeight: "400",
    color: "#000000",
    textAlign: "center",
  },
  illustrationContainer: {
    height: 250,
    marginBottom: 32,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  characterContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  characterPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: "#F5F5F5",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  characterEmoji: {
    fontSize: 50,
  },
  decorationContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  star: {
    position: "absolute",
  },
  star1: {
    top: 20,
    left: 20,
  },
  star2: {
    top: 40,
    right: 30,
  },
  star3: {
    bottom: 80,
    left: 30,
  },
  star4: {
    bottom: 60,
    right: 20,
  },
  star5: {
    top: 80,
    right: 80,
  },
  starText: {
    fontSize: 20,
    opacity: 0.8,
  },
  planetRing: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    height: 20,
    borderRadius: 10,
    opacity: 0.6,
    zIndex: 0,
  },
  feedbackText: {
    fontSize: 14,
    fontFamily: "PretendardRegular",
    fontWeight: "400",
    color: "#3A3A3A",
    textAlign: "center",
    lineHeight: 17,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: "auto",
    marginBottom: 55,
  },
  closeButton: {
    flex: 1,
    backgroundColor: "#ECEDFE",
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: "PretendardSemiBold",
    fontWeight: "600",
    color: "#9B9FEE",
  },
  planetButton: {
    flex: 1,
    backgroundColor: "#9B9FEE",
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: "center",
  },
  planetButtonText: {
    fontSize: 16,
    fontFamily: "PretendardSemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomNav: {
    height: 88,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 34, // Safe area bottom
  },
  navItem: {
    alignItems: "center",
    width: 40,
  },
  navText: {
    fontSize: 12,
    fontFamily: "PretendardRegular",
    fontWeight: "400",
    color: "#000000",
    marginTop: 4,
    textAlign: "center",
  },
});

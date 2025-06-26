import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface QuestData {
  title: string;
  description: string;
  emoji: string;
}

export default function QuestProgress() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 예시 퀘스트 데이터 (실제로는 route params나 state에서 받아올 것)
  const questData: QuestData = {
    title: "책 읽고, 마음에 드는 문장 고르기",
    description: "괜찮은 문장이 있었나요? 천천히, 조용히 찾아보세요.",
    emoji: "✍️",
  };

  const handleImageUpload = async () => {
    try {
      // 권한 요청
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "권한 필요",
          "사진을 업로드하려면 갤러리 접근 권한이 필요합니다."
        );
        return;
      }

      // 이미지 선택
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        // 퀘스트 완료 화면으로 이동
        handleQuestComplete(result.assets[0].uri);
      }
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      Alert.alert("오류", "이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  const handleCompleteWithoutPhoto = () => {
    Alert.alert("퀘스트 완료", "사진 없이 퀘스트를 완료하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "완료", onPress: () => handleQuestComplete(null) },
    ]);
  };

  const handleQuestComplete = (imageUri: string | null) => {
    // 퀘스트 완료 처리 로직
    console.log("퀘스트 완료:", { questData, imageUri });

    // TODO: API 호출하여 퀘스트 완료 처리
    // TODO: 퀘스트 완료 화면으로 이동 또는 홈으로 돌아가기

    Alert.alert("축하합니다!", "퀘스트를 완료했습니다! 🎉", [
      { text: "확인", onPress: () => router.replace("/(app)/(tabs)/(home)") },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollView}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerText}>퀘스트 진행중..</Text>
        </View>

        {/* 퀘스트 정보 박스 */}
        <View style={styles.questInfoContainer}>
          <View style={styles.questInfoBox}>
            <Text style={styles.questInfoTitle}>오늘의 행성 퀘스트</Text>
            <Text style={styles.questInfoDescription}>
              : {questData.title}
              {questData.emoji}
            </Text>
          </View>
          <Text style={styles.encouragementText}>{questData.description}</Text>
        </View>

        {/* 중앙 일러스트 영역 */}
        <View style={styles.illustrationContainer}>
          <Image source={require("@/assets/images/charactor.png")} />
        </View>

        {/* 하단 버튼들 */}
        <View style={styles.buttonContainer}>
          {/* 사진 업로드 버튼 */}
          <Pressable style={styles.uploadButton} onPress={handleImageUpload}>
            <LinearGradient
              colors={["#9B9FEE", "#9B9FEE"]}
              style={styles.uploadButtonGradient}
            >
              <Text style={styles.uploadButtonText}>사진 업로드하기</Text>
            </LinearGradient>
          </Pressable>

          {/* 사진 없이 완료 버튼 */}
          <Pressable
            style={styles.completeWithoutPhotoButton}
            onPress={handleCompleteWithoutPhoto}
          >
            <Text style={styles.completeWithoutPhotoText}>
              사진 없이 완료하기
            </Text>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
  },
  questInfoContainer: {
    marginBottom: 20,
  },
  questInfoBox: {
    backgroundColor: "#ECEDFE",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 35,
    marginBottom: 16,
    marginHorizontal: 10,
  },
  questInfoTitle: {
    fontSize: 16,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#000000",
    height: 40,
  },
  questInfoDescription: {
    fontSize: 14,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#9B9FEE",
  },
  encouragementText: {
    fontSize: 14,
    fontFamily: "PretendardRegular",
    fontWeight: "400",
    color: "#3A3A3A",
    textAlign: "center",
  },
  illustrationContainer: {
    flex: 1,
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  bookContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  bookPlaceholder: {
    width: 160,
    height: 160,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookEmoji: {
    fontSize: 60,
  },
  decorationContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  planetRing: {
    position: "absolute",
    bottom: 80,
    left: 30,
    right: 30,
    height: 30,
    borderRadius: 15,
    opacity: 0.6,
  },
  star: {
    position: "absolute",
  },
  star1: {
    top: 30,
    left: 30,
  },
  star2: {
    top: 60,
    right: 50,
  },
  star3: {
    bottom: 120,
    left: 40,
  },
  star4: {
    bottom: 100,
    right: 30,
  },
  star5: {
    top: 100,
    left: 60,
  },
  starText: {
    fontSize: 16,
    opacity: 0.8,
  },
  uploadHintText: {
    fontSize: 14,
    fontFamily: "PretendardRegular",
    fontWeight: "400",
    color: "#929498",
    textAlign: "center",
    marginTop: 20,
  },
  buttonContainer: {
    gap: 16,
    paddingBottom: 24,
  },
  uploadButton: {
    borderRadius: 100,
    overflow: "hidden",
  },
  uploadButtonGradient: {
    paddingVertical: 20,
    alignItems: "center",
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: "PretendardSemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
  },
  completeWithoutPhotoButton: {
    backgroundColor: "#ECEDFE",
    borderRadius: 100,
    paddingVertical: 20,
    alignItems: "center",
  },
  completeWithoutPhotoText: {
    fontSize: 16,
    fontFamily: "PretendardSemiBold",
    fontWeight: "600",
    color: "#9B9FEE",
  },
});

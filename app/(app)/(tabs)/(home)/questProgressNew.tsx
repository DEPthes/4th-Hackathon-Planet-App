import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCompleteQuest, useTodayQuest } from "../../../../api/questApi";

export default function QuestProgressNewScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  // TanStack Query hooks
  const {
    data: todayQuest,
    isLoading: isTodayQuestLoading,
    error: todayQuestError,
  } = useTodayQuest();

  const completeMutation = useCompleteQuest();

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "권한 필요",
        "사진 라이브러리에 접근하려면 권한이 필요합니다."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setSelectedImage(asset.uri);
      setFileName(asset.fileName || "선택된 이미지");
    }
  };

  const handleComplete = async () => {
    if (!todayQuest) {
      Alert.alert("오류", "퀘스트 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const result = await completeMutation.mutateAsync({
        questId: todayQuest.id,
        evidenceImage: selectedImage || undefined,
      });

      router.push({
        pathname: "/(app)/(tabs)/(home)/questComplete",
        params: {
          questData: JSON.stringify(result),
          expGained: "20", // 또는 result에서 경험치 정보를 가져올 수 있다면
        },
      });
    } catch (error) {
      Alert.alert("오류", "퀘스트 완료에 실패했습니다. 다시 시도해주세요.");
      console.error("퀘스트 완료 오류:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>퀘스트 진행중..</Text>
      </View>

      {/* 컨텐츠 영역 */}
      <View style={styles.content}>
        {/* 퀘스트 정보 박스 */}
        <View style={styles.questInfoContainer}>
          <View style={styles.questInfoBox}>
            <Text style={styles.questInfoTitle}>오늘의 행성 퀘스트</Text>
            <Text style={styles.questInfoDescription}>
              : 책 읽고, 마음에 드는 문장 고르기✍️
            </Text>
          </View>
          <Text style={styles.encouragementText}>
            괜찮은 문장이 있었나요? 천천히, 조용히 찾아보세요.
          </Text>
        </View>

        {/* 사진 업로드 영역 */}
        <View style={styles.uploadSection}>
          <Pressable style={styles.uploadBox} onPress={pickImage}>
            <Text style={styles.uploadText}>사진</Text>
          </Pressable>

          {/* 파일명 표시 */}
          <View style={styles.fileNameContainer}>
            <Feather name="paperclip" size={12} color="#929498" />
            <Text style={styles.fileName}>{fileName || "이미지 파일명"}</Text>
          </View>
        </View>

        {/* 완료 버튼 */}
        <Pressable
          style={[
            styles.completeButton,
            completeMutation.isPending && { opacity: 0.6 },
          ]}
          onPress={handleComplete}
          disabled={completeMutation.isPending}
        >
          <Text style={styles.completeButtonText}>
            {completeMutation.isPending ? "완료 처리 중..." : "퀘스트 완료"}
          </Text>
        </Pressable>
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 47, // Status bar height
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
    paddingHorizontal: 40, // 24px 기본 + 16px 추가
    paddingTop: 27, // 헤더와의 간격
  },
  questInfoContainer: {
    marginBottom: 27,
  },
  questInfoBox: {
    backgroundColor: "#ECEDFE",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 35,
    marginBottom: 16,
  },
  questInfoTitle: {
    fontSize: 16,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#000000",
    marginBottom: 10,
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
  uploadSection: {
    marginBottom: 27,
  },
  uploadBox: {
    width: 310,
    height: 310,
    backgroundColor: "#E4E4E4",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    alignSelf: "center",
  },
  uploadText: {
    fontSize: 13,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#3A3A3A",
    letterSpacing: -0.325,
  },
  fileNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 40, // 왼쪽 정렬
    gap: 6,
  },
  fileName: {
    fontSize: 12,
    fontFamily: "PretendardRegular",
    fontWeight: "400",
    color: "#929498",
  },
  completeButton: {
    backgroundColor: "#9B9FEE",
    borderRadius: 100,
    paddingVertical: 20,
    marginHorizontal: 16,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 27,
  },
  completeButtonText: {
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

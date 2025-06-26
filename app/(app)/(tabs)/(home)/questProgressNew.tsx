import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StatusBar,
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

  console.log("todayQuest", todayQuest);

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
      await completeMutation.mutateAsync({
        questId: todayQuest.id,
        evidenceImage: selectedImage || undefined,
      });

      Alert.alert(
        "퀘스트 완료!",
        "퀘스트가 성공적으로 완료되었습니다! 홈으로 돌아갑니다.",
        [
          {
            text: "확인",
            onPress: () => {
              router.push("/(app)/(tabs)/(home)");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("오류", "퀘스트 완료에 실패했습니다. 다시 시도해주세요.");
      console.error("퀘스트 완료 오류:", error);
    }
  };

  if (isTodayQuestLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9B9FEE" />
          <Text style={styles.loadingText}>퀘스트를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (todayQuestError || !todayQuest) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>퀘스트를 불러오지 못했습니다.</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>홈으로 돌아가기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (todayQuest.isCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.completedContainer}>
          <Text style={styles.completedTitle}>✅ 퀘스트 완료!</Text>
          <Text style={styles.completedText}>이미 완료된 퀘스트입니다.</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>홈으로 돌아가기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>퀘스트 진행중..</Text>
      </View>

      {/* 퀘스트 정보 박스 */}
      <View style={styles.questInfoContainer}>
        <View style={styles.questInfoBox}>
          <Text style={styles.questTitle}>{todayQuest.title}</Text>
          {todayQuest.encouragement && (
            <Text style={styles.questDescription}>
              {todayQuest.encouragement}
            </Text>
          )}
        </View>
      </View>

      {/* 설명 텍스트 */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          퀘스트를 완수하고 사진을 업로드해주세요!
        </Text>
      </View>

      {/* 사진 업로드 영역 */}
      <View style={styles.uploadContainer}>
        <View style={styles.uploadBox}>
          {selectedImage ? (
            <View style={styles.selectedFileContainer}>
              <Text style={styles.selectedFileIcon}>📁</Text>
              <Text style={styles.selectedFileName}>{fileName}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>
                사진을 업로드하려면{"\n"}아래 버튼을 눌러주세요
              </Text>
            </>
          )}
        </View>

        <Pressable style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>
            {selectedImage ? "다른 사진 선택" : "사진 업로드"}
          </Text>
        </Pressable>
      </View>

      {/* 완료 버튼 */}
      <View style={styles.completeButtonContainer}>
        <Pressable
          style={[
            styles.completeButton,
            completeMutation.isPending && { opacity: 0.6 },
          ]}
          onPress={handleComplete}
          disabled={completeMutation.isPending}
        >
          <Text style={styles.completeButtonText}>
            {completeMutation.isPending ? "완료 처리 중..." : "완료하기"}
          </Text>
        </Pressable>
      </View>

      {/* 하단 네비게이션 영역 */}
      <View style={styles.bottomNavArea} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "PretendardRegular",
    color: "#6B6B6B",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "PretendardRegular",
    color: "#FF6B6B",
    marginBottom: 24,
    textAlign: "center",
  },
  completedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  completedTitle: {
    fontSize: 20,
    fontFamily: "PretendardBold",
    color: "#9B9FEE",
    marginBottom: 12,
  },
  completedText: {
    fontSize: 16,
    fontFamily: "PretendardRegular",
    color: "#6B6B6B",
    marginBottom: 24,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#9B9FEE",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: "PretendardSemiBold",
    color: "#FFFFFF",
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginTop: 44,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#3A3A3A",
  },
  questInfoContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
  },
  questInfoBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#9B9FEE",
  },
  questTitle: {
    fontSize: 18,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#3A3A3A",
    marginBottom: 8,
  },
  questDescription: {
    fontSize: 14,
    fontFamily: "PretendardRegular",
    color: "#6B6B6B",
    lineHeight: 20,
  },
  instructionContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: "PretendardRegular",
    color: "#3A3A3A",
    textAlign: "center",
    lineHeight: 24,
  },
  uploadContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    marginBottom: 40,
  },
  uploadBox: {
    height: 200,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E4E4E4",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 14,
    fontFamily: "PretendardRegular",
    color: "#6B6B6B",
    textAlign: "center",
    lineHeight: 20,
  },
  selectedFileContainer: {
    alignItems: "center",
  },
  selectedFileIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  selectedFileName: {
    fontSize: 14,
    fontFamily: "PretendardSemiBold",
    color: "#3A3A3A",
    textAlign: "center",
  },
  uploadButton: {
    backgroundColor: "#ECEDFE",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: "PretendardSemiBold",
    fontWeight: "600",
    color: "#9B9FEE",
  },
  completeButtonContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  completeButton: {
    backgroundColor: "#9B9FEE",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: "PretendardBold",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bottomNavArea: {
    height: 80,
    backgroundColor: "#FFFFFF",
  },
});

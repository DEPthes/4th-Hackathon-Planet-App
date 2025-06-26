import { getCachedQuestSuggestions } from "@/api/api";
import { approveQuestSuggestion } from "@/api/questApi";
import { QUERY_KEYS } from "@/lib/queryClient";
import { getToken } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface QuestOption {
  uuid: string;
  title: string;
}

export default function QuestSelection() {
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null); // 기본값으로 2번 선택
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useQuery({
    queryKey: QUERY_KEYS.QUEST_SUGGESTIONS,
    queryFn: async () => {
      setIsLoading(true);
      const token = await getToken();
      if (!token) {
        return;
      }
      return getCachedQuestSuggestions(token);
    },
  });

  const handleQuestSelect = (questId: string) => {
    console.log("test");
    console.log(questId);
    setSelectedQuestId(questId);
  };

  const handleCompleteSelection = async () => {
    if (selectedQuestId) {
      // 퀘스트 진행 화면으로 이동
      const token = await getToken();
      if (!token) {
        return;
      }
      await approveQuestSuggestion(selectedQuestId);
      console.log("선택된 퀘스트:", selectedQuestId);
      router.push("/(app)/(tabs)/(home)/questProgress");
    }
  };

  const handleRegenerateQuest = () => {
    // 퀘스트 재생성 로직
    console.log("퀘스트 재생성");
    // TODO: API 호출하여 새로운 퀘스트 옵션들 가져오기
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerText}>추천 행성 퀘스트</Text>
        </View>

        {/* 퀘스트 옵션들 */}
        <View style={styles.questContainer}>
          {data?.map((quest) => (
            <Pressable
              key={quest.uuid}
              style={[
                styles.questOption,
                selectedQuestId === quest.uuid
                  ? styles.selectedOption
                  : styles.unselectedOption,
              ]}
              onPress={() => handleQuestSelect(quest.uuid)}
            >
              <Text
                style={[
                  styles.questText,
                  selectedQuestId === quest.uuid
                    ? styles.selectedText
                    : styles.unselectedText,
                ]}
              >
                {quest.title}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 하단 버튼들 */}
        <View style={styles.buttonContainer}>
          {/* 선택 완료 버튼 */}
          <Pressable
            style={[
              styles.completeButton,
              !selectedQuestId && styles.disabledButton,
            ]}
            onPress={handleCompleteSelection}
            disabled={!selectedQuestId}
          >
            <LinearGradient
              colors={
                selectedQuestId
                  ? ["#9B9FEE", "#9B9FEE"]
                  : ["#E4E4E4", "#E4E4E4"]
              }
              style={styles.completeButtonGradient}
            >
              <Text style={styles.completeButtonText}>선택 완료</Text>
            </LinearGradient>
          </Pressable>

          {/* 퀘스트 재생성 버튼 */}
          <Pressable
            style={styles.regenerateButton}
            onPress={handleRegenerateQuest}
          >
            <View style={styles.regenerateContent}>
              <Text style={styles.regenerateIcon}>↻</Text>
              <Text style={styles.regenerateText}>퀘스트 재생성하기</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
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
    paddingVertical: 16,
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
  questContainer: {
    gap: 16,
    marginBottom: 40,
  },
  questOption: {
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  selectedOption: {
    backgroundColor: "#ECEDFE",
    borderColor: "#9B9FEE",
  },
  unselectedOption: {
    backgroundColor: "#E4E4E4",
    borderColor: "#E4E4E4",
  },
  questText: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "PretendardRegular",
  },
  selectedText: {
    color: "#9B9FEE",
    fontFamily: "PretendardBold",
    fontWeight: "700",
  },
  unselectedText: {
    color: "#3A3A3A",
    fontFamily: "PretendardRegular",
    fontWeight: "400",
  },
  buttonContainer: {
    gap: 16,
    paddingBottom: 24,
  },
  completeButton: {
    borderRadius: 100,
    overflow: "hidden",
  },
  completeButtonGradient: {
    paddingVertical: 20,
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: "PretendardSemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
  },
  disabledButton: {
    opacity: 0.5,
  },
  regenerateButton: {
    backgroundColor: "#ECEDFE",
    borderRadius: 100,
    paddingVertical: 20,
    alignItems: "center",
  },
  regenerateContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  regenerateIcon: {
    fontSize: 16,
    color: "#9B9FEE",
  },
  regenerateText: {
    fontSize: 16,
    fontFamily: "PretendardSemiBold",
    fontWeight: "600",
    color: "#9B9FEE",
  },
});

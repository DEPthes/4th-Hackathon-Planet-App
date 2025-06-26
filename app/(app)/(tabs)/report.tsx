import { getQuestSuggestionsByDate } from "@/api/api";
import { CalendarDetailModal } from "@/components/Modal";
import { getToken } from "@/lib/storage";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface QuestSuggestionByDateResponse {
  id: number;
  title: string;
  encouragement: string;
  isCompleted: boolean;
  completedAt: string;
  createdAt: string;
  lastModifiedAt: string;
  evidenceImage?: {
    id: string;
    fileName: string;
    size: number;
  };
  feedback?: string;
}

const Report = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 26)); // 2025년 6월 26일
  const [completedDates, setCompletedDates] = useState<number[]>([]);

  // 모달 관련 state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [questData, setQuestData] = useState<any>(undefined);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["report", currentDate.getFullYear(), currentDate.getMonth()],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        return null;
      }
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      return getQuestSuggestionsByDate(
        token,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );
    },
  });

  // API 데이터에서 완료된 날짜들 추출
  useEffect(() => {
    if (data) {
      const completed = data
        .filter(
          (quest: QuestSuggestionByDateResponse) =>
            quest.isCompleted && quest.completedAt
        )
        .map((quest: QuestSuggestionByDateResponse) => {
          const completedDate = new Date(quest.completedAt);
          return completedDate.getDate();
        })
        .filter(
          (date: number, index: number, arr: number[]) =>
            arr.indexOf(date) === index
        ); // 중복 제거

      setCompletedDates(completed);
    }
  }, [data]);

  const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  // 캘린더 날짜 생성
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date(); // 실제 오늘 날짜 사용

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const hasQuest =
        isCurrentMonth && completedDates.includes(date.getDate());

      days.push({
        date: date.getDate(),
        isCurrentMonth,
        isToday,
        hasQuest,
        fullDate: new Date(date),
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // 월 변경
  const changeMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  // 날짜 클릭 핸들러
  const handleDatePress = (day: any) => {
    if (!day.isCurrentMonth) return;

    // 해당 날짜의 퀘스트 데이터 찾기
    const questForDate = data?.find((quest: QuestSuggestionByDateResponse) => {
      if (!quest.completedAt) return false;
      const questDate = new Date(quest.completedAt);
      return (
        questDate.getDate() === day.date &&
        questDate.getMonth() === currentDate.getMonth() &&
        questDate.getFullYear() === currentDate.getFullYear()
      );
    });

    setSelectedDate(day.fullDate);
    setQuestData(questForDate);
    setModalVisible(true);
  };

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedDate(undefined);
    setQuestData(undefined);
  };

  const renderCalendarDay = (day: any, index: number) => {
    return (
      <View key={index} style={styles.dayContainer}>
        <TouchableOpacity
          style={[
            styles.dayButton,
            day.isToday && styles.selectedDay,
            !day.isCurrentMonth && styles.inactiveDay,
          ]}
          onPress={() => handleDatePress(day)}
          disabled={!day.isCurrentMonth}
        >
          <Text
            style={[
              styles.dayText,
              day.isToday && styles.selectedDayText,
              !day.isCurrentMonth && styles.inactiveDayText,
            ]}
          >
            {day.date}
          </Text>
        </TouchableOpacity>
        {day.hasQuest && <View style={styles.questDot} />}
      </View>
    );
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={[styles.calendarContainer, styles.loadingContainer]}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* 캘린더 컨테이너 */}
      <View style={styles.calendarContainer}>
        {/* 월 네비게이션 */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={() => changeMonth("prev")}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{formatMonth(currentDate)}</Text>
          <TouchableOpacity onPress={() => changeMonth("next")}>
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* 요일 헤더 */}
        <View style={styles.weekHeader}>
          {weekDays.map((day, index) => (
            <Text
              key={day}
              style={[
                styles.weekDayText,
                index === 0 && styles.sundayText,
                index === 6 && styles.saturdayText,
              ]}
            >
              {day}
            </Text>
          ))}
        </View>

        {/* 캘린더 그리드 */}
        <View style={styles.calendarGrid}>
          {Array.from({ length: 6 }, (_, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {calendarDays
                .slice(weekIndex * 7, (weekIndex + 1) * 7)
                .map((day, dayIndex) =>
                  renderCalendarDay(day, weekIndex * 7 + dayIndex)
                )}
            </View>
          ))}
        </View>
      </View>

      {/* 캘린더 세부정보 모달 */}
      <CalendarDetailModal
        visible={modalVisible}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        questData={questData}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Pretendard",
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    marginTop: 50,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
    fontFamily: "Pretendard",
  },
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 44,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Pretendard",
    marginHorizontal: 20,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000000",
    fontFamily: "Pretendard",
    textAlign: "center",
    width: 40,
  },
  sundayText: {
    color: "#ea3a3a",
  },
  saturdayText: {
    color: "#9b9fee",
  },
  calendarGrid: {
    flex: 1,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  dayContainer: {
    width: 51,
    height: 80,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 12,
  },
  dayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  selectedDay: {
    backgroundColor: "#9b9fee",
  },
  inactiveDay: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000000",
    fontFamily: "Pretendard",
  },
  selectedDayText: {
    color: "#ffffff",
  },
  inactiveDayText: {
    color: "#999999",
  },
  questDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#9b9fee",
    marginTop: 6,
  },
});

export default Report;

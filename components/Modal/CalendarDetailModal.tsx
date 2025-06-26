import React from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CalendarDetailModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate?: Date;
  questData?: {
    title: string;
    isCompleted: boolean;
    evidenceImage?: {
      id: string;
      fileName: string;
      size: number;
    };
    experience?: number;
  };
}

const { width } = Dimensions.get("window");

const CalendarDetailModal: React.FC<CalendarDetailModalProps> = ({
  visible,
  onClose,
  selectedDate,
  questData,
}) => {
  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekDay = weekDays[date.getDay()];
    return `${month}월 ${day}일 (${weekDay})`;
  };

  const formatDateStatus = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return "오늘";
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isYesterday) {
      return "어제";
    }

    return `${Math.abs(
      Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    )}일 전`;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            {/* 헤더 섹션 */}
            <View style={styles.headerSection}>
              <View style={styles.headerTop}>
                <Text style={styles.dateTitle}>
                  {selectedDate ? formatDate(selectedDate) : "날짜 선택"}
                </Text>
                {questData && (
                  <Text style={styles.experienceText}>
                    경험치 +{questData.experience || 10}
                  </Text>
                )}
              </View>
              <Text style={styles.dateStatus}>
                {selectedDate ? formatDateStatus(selectedDate) : ""}
              </Text>
            </View>

            {/* 퀘스트 섹션 */}
            <View style={styles.questSection}>
              <View style={styles.questHeader}>
                <Text style={styles.questLabel}>퀘스트</Text>
              </View>
              {questData ? (
                <View style={styles.questContent}>
                  <View style={styles.questIndicator} />
                  <Text style={styles.questTitle}>{questData.title}</Text>
                </View>
              ) : (
                <View style={styles.noQuestContent}>
                  <Text style={styles.noQuestText}>
                    이 날에는 퀘스트가 없습니다.
                  </Text>
                </View>
              )}
            </View>

            {/* 인증 섹션 - 퀘스트가 있을 때만 표시 */}
            {questData && (
              <View style={styles.evidenceSection}>
                <View style={styles.evidenceHeader}>
                  <Text style={styles.evidenceLabel}>나의 퀘스트 인증</Text>
                </View>
                <View style={styles.evidenceImageContainer}>
                  {questData.evidenceImage ? (
                    <Image
                      source={{ uri: questData.evidenceImage.id }}
                      style={styles.evidenceImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeholderImage} />
                  )}
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width - 48, // 좌우 24px 여백
    maxWidth: 342,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 24,
    width: "100%",
  },
  headerSection: {
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Pretendard",
  },
  experienceText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#000000",
    fontFamily: "Pretendard",
  },
  dateStatus: {
    fontSize: 12,
    fontWeight: "400",
    color: "#929498",
    fontFamily: "Pretendard",
  },
  questSection: {
    marginBottom: 16,
  },
  questHeader: {
    marginBottom: 16,
  },
  questLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Pretendard",
  },
  questContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  questIndicator: {
    width: 4,
    height: 17,
    backgroundColor: "#9b9fee",
    marginRight: 10,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000000",
    fontFamily: "Pretendard",
    flex: 1,
  },
  evidenceSection: {
    marginBottom: 0,
  },
  evidenceHeader: {
    marginBottom: 16,
  },
  evidenceLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Pretendard",
  },
  evidenceImageContainer: {
    width: "100%",
    height: 294,
    borderRadius: 6,
    overflow: "hidden",
  },
  evidenceImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e4e4e4",
  },
  noQuestContent: {
    paddingVertical: 20,
    alignItems: "center",
  },
  noQuestText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#929498",
    fontFamily: "Pretendard",
  },
});

export default CalendarDetailModal;

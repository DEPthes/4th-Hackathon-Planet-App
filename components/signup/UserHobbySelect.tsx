import { FONT_STYLE } from "@/constants/Fonts";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

const HOBBY_OPTIONS = [
  "독서",
  "음악 감상",
  "사진 찍기",
  "글쓰기",
  "카페 가기",
  "요리/베이킹",
  "영화/드라마 감상",
  "식물 키우기",
  "일기 쓰기",
  "그림 그리기",
];

const HOBBT_OPTIONS_ACTIVE = [
  "산책하기",
  "러닝",
  "헬스/요가",
  "등산하기",
  "여행",
  "캠핑",
  "친구만나기",
  "자전거 타기",
  "게임하기",
  "보드게임/퍼즐",
  "봉사활동",
];

type UserHobbySelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

const UserHobbySelect = ({ value, onChange }: UserHobbySelectProps) => {
  const [hobbies, setHobbies] = useState<string[]>([]);
  const handleToggle = (hobby: string) => {
    if (value.includes(hobby)) {
      setHobbies(value.filter((v) => v !== hobby));
      onChange(value.filter((v) => v !== hobby));
    } else {
      setHobbies([...value, hobby]);
      onChange([...value, hobby]);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>감성형 / 창작형</Text>
      <View style={styles.hobbyContainer}>
        {HOBBY_OPTIONS.map((hobby) => {
          const selected = value.includes(hobby);
          return (
            <TouchableOpacity
              key={hobby}
              style={[
                styles.button,
                selected ? styles.selected : styles.unselected,
              ]}
              onPress={() => handleToggle(hobby)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.text,
                  selected ? styles.selectedText : styles.unselectedText,
                ]}
              >
                {hobby}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* 활동형 */}
      <Text style={styles.label}>활동형</Text>
      <View style={styles.hobbyContainer}>
        {HOBBT_OPTIONS_ACTIVE.map((hobby) => {
          const selected = value.includes(hobby);
          return (
            <TouchableOpacity
              key={hobby}
              style={[
                styles.button,
                selected ? styles.selected : styles.unselected,
              ]}
              onPress={() => handleToggle(hobby)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.text,
                  selected ? styles.selectedText : styles.unselectedText,
                ]}
              >
                {hobby}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
    marginVertical: 8,
  },
  label: {
    ...(FONT_STYLE.titleL as TextStyle),
    color: "black",
    marginBottom: 8,
    marginTop: 24,
  },
  hobbyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
  },
  button: {
    paddingHorizontal: 16,
    height: 41,
    borderRadius: 100,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  selected: {
    backgroundColor: "#9b9fee",
    borderColor: "#9b9fee",
  },
  unselected: {
    backgroundColor: "#fff",
    borderColor: "#929498",
  },
  text: {
    fontSize: 14,
    fontWeight: "400",
  },
  selectedText: {
    color: "#fff",
  },
  unselectedText: {
    color: "#929498",
  },
});

export default UserHobbySelect;

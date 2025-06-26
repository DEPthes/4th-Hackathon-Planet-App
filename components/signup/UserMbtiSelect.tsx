import { MAIN_COLOR2, SUB_COLOR } from "@/constants/Colors";
import { FONT_STYLE } from "@/constants/Fonts";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

const MBTI_PAIRS = [
  [
    { label: "E (외향)", value: "E" },
    { label: "I (내향)", value: "I" },
  ],
  [
    { label: "S (감각)", value: "S" },
    { label: "N (직관)", value: "N" },
  ],
  [
    { label: "T (사고)", value: "T" },
    { label: "F (감정)", value: "F" },
  ],
  [
    { label: "J (판단)", value: "J" },
    { label: "P (인식)", value: "P" },
  ],
];

type UserMbtiSelectProps = {
  value: string; // e.g. "ENTJ"
  onChange: (value: string) => void;
};

const UserMbtiSelect = ({ value, onChange }: UserMbtiSelectProps) => {
  // value는 항상 4글자
  const handleSelect = (pairIdx: number, selected: string) => {
    const chars = value.split("");
    chars[pairIdx] = selected;
    onChange(chars.join(""));
  };
  return (
    <View style={styles.container}>
      {MBTI_PAIRS.map((pair, idx) => (
        <View style={styles.pairRow} key={idx}>
          {pair.map((option) => {
            const selected = value[idx] === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.button,
                  selected ? styles.selected : styles.unselected,
                ]}
                onPress={() => handleSelect(idx, option.value)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.text,
                    selected ? styles.selectedText : styles.unselectedText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 24,
    gap: 54,
  },
  pairRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
    gap: 50,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: 82,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  selected: {
    backgroundColor: MAIN_COLOR2,
    borderColor: "#9b9fee",
  },
  unselected: {
    backgroundColor: "#fff",
    borderColor: "#929498",
  },
  text: {
    ...(FONT_STYLE.buttonM as TextStyle),
  },
  selectedText: {
    color: SUB_COLOR,
  },
  unselectedText: {
    color: "#929498",
  },
});

export default UserMbtiSelect;

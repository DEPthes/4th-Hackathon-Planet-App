import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GENDER_OPTIONS = [
  { label: "남자", value: "male" },
  { label: "여자", value: "female" },
];

type UserGenderSelectProps = {
  value: "male" | "female" | null;
  onChange: (value: "male" | "female") => void;
};

const UserGenderSelect = ({ value, onChange }: UserGenderSelectProps) => {
  return (
    <View style={styles.container}>
      {GENDER_OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.button,
              selected ? styles.selected : styles.unselected,
            ]}
            onPress={() => onChange(option.value as "male" | "female")}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 20,
    width: "100%",
    marginTop: 24,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 100,
    marginHorizontal: 8,
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
    fontSize: 16,
    fontWeight: "600",
  },
  selectedText: {
    color: "#fff",
  },
  unselectedText: {
    color: "#929498",
  },
});

export default UserGenderSelect;

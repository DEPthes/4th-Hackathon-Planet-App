import { MAIN_COLOR2, SUB_COLOR } from "@/constants/Colors";
import { FONT_STYLE } from "@/constants/Fonts";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type AgeValue = "10대" | "20대" | "30대" | "40대 이상" | null;

const AGE_OPTIONS: AgeValue[] = ["10대", "20대", "30대", "40대 이상"];

type UserAgeSelectProps = {
  value: AgeValue;
  onChange: (value: AgeValue) => void;
};

const UserAgeSelect = ({ value, onChange }: UserAgeSelectProps) => {
  return (
    <View style={styles.container}>
      {AGE_OPTIONS.map((option) => {
        const selected = value === option;
        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.button,
              selected ? styles.selected : styles.unselected,
            ]}
            onPress={() => onChange(option)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.text,
                selected ? styles.selectedText : styles.unselectedText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 8,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 100,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  selected: {
    backgroundColor: MAIN_COLOR2,
    borderColor: SUB_COLOR,
  },
  unselected: {
    backgroundColor: "#fff",
    borderColor: "#929498",
  },
  text: {
    ...FONT_STYLE.buttonM,
  },
  selectedText: {
    color: SUB_COLOR,
  },
  unselectedText: {
    color: "#929498",
  },
});

export default UserAgeSelect;

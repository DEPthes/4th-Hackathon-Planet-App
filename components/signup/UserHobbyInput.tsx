import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type UserHobbyInputProps = {
  onAdd: (hobby: string) => void;
};

const UserHobbyInput = ({ onAdd }: UserHobbyInputProps) => {
  const [input, setInput] = useState("");
  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="직접 입력"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  input: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#E4E4E4",
    width: 100,
    marginRight: 8,
    fontSize: 14,
    color: "#3A3A3A",
  },
});

export default UserHobbyInput;

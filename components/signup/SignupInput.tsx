import React from "react";
import { StyleSheet, TextInput } from "react-native";

type SignupInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
};

const SignupInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
}: SignupInputProps) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 2,
    fontSize: 16,
  },
});

export default SignupInput;

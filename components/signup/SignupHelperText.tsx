import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

type SignupHelperTextProps = {
  text: string;
  style?: TextStyle;
};

const SignupHelperText = ({ text, style }: SignupHelperTextProps) => {
  return <Text style={[styles.helper, style]}>{text}</Text>;
};

const styles = StyleSheet.create({
  helper: {
    width: "80%",
    color: "#929498",
    fontSize: 13,
    marginBottom: 4,
  },
});

export default SignupHelperText;

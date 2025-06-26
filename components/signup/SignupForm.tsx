import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import SignupHelperText from "./SignupHelperText";
import SignupInput from "./SignupInput";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  return (
    <View style={styles.form}>
      <SignupInput value={email} onChangeText={setEmail} placeholder="이메일" />
      <SignupHelperText text="이메일을 입력해주세요." />
      <SignupInput
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호"
        secureTextEntry
      />
      <SignupHelperText text="비밀번호를 입력해주세요." />
      <SignupInput
        value={passwordCheck}
        onChangeText={setPasswordCheck}
        placeholder="비밀번호 확인"
        secureTextEntry
      />
      <SignupHelperText text="비밀번호를 다시 입력해주세요." />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: "100%",
    alignItems: "center",
  },
  helper: {
    width: "80%",
    color: "#929498",
    fontSize: 13,
    marginBottom: 4,
  },
});

export default SignupForm;

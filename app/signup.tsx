import SignupForm from "@/components/signup/SignupForm";
import UserInfoForm from "@/components/signup/UserInfoForm";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

const Signup = () => {
  return (
    <SafeAreaView style={styles.form}>
      <ScrollView>
        <SignupForm />
        <UserInfoForm />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  form: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  helper: {
    width: "80%",
    color: "#929498",
    fontSize: 13,
    marginBottom: 4,
  },
});

export default Signup;

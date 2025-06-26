import React from "react";
import { View } from "react-native";
import SignupHelperText from "./SignupHelperText";
import SignupInput from "./SignupInput";
import UserAgeSelect, { AgeValue } from "./UserAgeSelect";

type SignupBasicInfoFormProps = {
  email: string;
  onChangeEmail: (v: string) => void;
  password: string;
  onChangePassword: (v: string) => void;
  passwordCheck: string;
  onChangePasswordCheck: (v: string) => void;
  name: string;
  onChangeName: (v: string) => void;
  nickname: string;
  onChangeNickname: (v: string) => void;
  age: AgeValue;
  onChangeAge: (v: AgeValue) => void;
};

const SignupBasicInfoForm = ({
  email,
  onChangeEmail,
  password,
  onChangePassword,
  passwordCheck,
  onChangePasswordCheck,
  name,
  onChangeName,
  nickname,
  onChangeNickname,
  age,
  onChangeAge,
}: SignupBasicInfoFormProps) => {
  return (
    <View>
      <SignupInput
        value={email}
        onChangeText={onChangeEmail}
        placeholder="이메일"
      />
      <SignupHelperText text="이메일을 입력해주세요." />
      <SignupInput
        value={password}
        onChangeText={onChangePassword}
        placeholder="비밀번호"
        secureTextEntry
      />
      <SignupHelperText text="비밀번호를 입력해주세요." />
      <SignupInput
        value={passwordCheck}
        onChangeText={onChangePasswordCheck}
        placeholder="비밀번호 확인"
        secureTextEntry
      />
      <SignupHelperText text="비밀번호를 다시 입력해주세요." />
      <SignupInput
        value={name}
        onChangeText={onChangeName}
        placeholder="이름"
      />
      <SignupHelperText text="이름을 입력해주세요." />
      <SignupInput
        value={nickname}
        onChangeText={onChangeNickname}
        placeholder="닉네임"
      />
      <SignupHelperText text="닉네임을 입력해주세요." />
      <UserAgeSelect value={age} onChange={onChangeAge} />
      <SignupHelperText text="연령대를 선택해주세요." />
    </View>
  );
};

export default SignupBasicInfoForm;

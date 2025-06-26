import { FONT_STYLE } from "@/constants/Fonts";
import React, { useState } from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import UserGenderSelect from "./UserGenderSelect";
import UserHobbyInput from "./UserHobbyInput";
import UserHobbySelect from "./UserHobbySelect";
import UserMbtiSelect from "./UserMbtiSelect";

const DEFAULT_MBTI = "ESTJ";

const UserInfoForm = () => {
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [mbti, setMbti] = useState(DEFAULT_MBTI);
  const [hobbies, setHobbies] = useState<string[]>([]);

  const handleAddHobby = (hobby: string) => {
    if (!hobbies.includes(hobby)) {
      setHobbies([...hobbies, hobby]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>나의 성별을 선택하세요.</Text>
      <UserGenderSelect value={gender} onChange={setGender} />
      <Text style={[styles.label, { marginTop: 64 }]}>
        나의 MBTI 성격 유형을 선택하세요.
      </Text>
      <UserMbtiSelect value={mbti} onChange={setMbti} />
      <Text style={styles.label}>
        평소 좋아하는 취미 키워드를 선택하세요.{"\n"}입력하신 정보는 언제든 바꿀
        수 있습니다.
      </Text>
      <UserHobbySelect value={hobbies} onChange={setHobbies} />
      <Text style={styles.label}>기타</Text>
      <UserHobbyInput onAdd={handleAddHobby} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  label: {
    ...(FONT_STYLE.bodyM as TextStyle),
    color: "#929498",
    marginTop: 16,
    marginBottom: 8,
  },
});

export default UserInfoForm;

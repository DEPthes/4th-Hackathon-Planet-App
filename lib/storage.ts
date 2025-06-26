import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER_INFO: "user_info",
} as const;

// 토큰 저장
export async function saveToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  } catch (error) {
    console.error("토큰 저장 실패:", error);
    throw error;
  }
}

// 토큰 가져오기
export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error("토큰 가져오기 실패:", error);
    return null;
  }
}

// 토큰 삭제
export async function removeToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error("토큰 삭제 실패:", error);
    throw error;
  }
}

// 사용자 정보 저장
export async function saveUserInfo(userInfo: any): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_INFO,
      JSON.stringify(userInfo)
    );
  } catch (error) {
    console.error("사용자 정보 저장 실패:", error);
    throw error;
  }
}

// 사용자 정보 가져오기
export async function getUserInfo(): Promise<any | null> {
  try {
    const userInfoStr = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error);
    return null;
  }
}

// 사용자 정보 삭제
export async function removeUserInfo(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO);
  } catch (error) {
    console.error("사용자 정보 삭제 실패:", error);
    throw error;
  }
}

// 모든 데이터 삭제 (로그아웃 시 사용)
export async function clearAll(): Promise<void> {
  try {
    await Promise.all([removeToken(), removeUserInfo()]);
  } catch (error) {
    console.error("데이터 삭제 실패:", error);
    throw error;
  }
}

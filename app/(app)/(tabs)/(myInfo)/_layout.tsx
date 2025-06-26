import { Stack } from "expo-router";

export default function MyInfoLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="fixInfo"
        options={{
          headerShown: false,
          headerTransparent: true,
          headerBackVisible: false,
          headerTitle: "",
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}

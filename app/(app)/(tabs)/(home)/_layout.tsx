import { Stack } from "expo-router";

export default function IndexLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="questSelection"
        options={{
          headerShown: false,
          headerTransparent: true,
          headerBackVisible: false,
          headerTitle: "",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="questProgress"
        options={{
          headerShown: false,
          headerTransparent: true,
          headerBackVisible: false,
          headerTitle: "",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="generateQuest"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

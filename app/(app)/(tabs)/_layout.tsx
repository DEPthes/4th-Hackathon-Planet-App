import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Tabs, usePathname } from "expo-router";
import React from "react";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Image, Pressable } from "react-native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  // fixInfo 페이지인지 확인
  const isFixInfoPage = pathname.includes("fixInfo");
  const isHomePage = pathname.includes("home");

  return (
    <Tabs
      initialRouteName="(home)"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].sub,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown:
          useClientOnlyValue(false, true) && !isFixInfoPage && !isHomePage,
        headerShadowVisible: false,
        headerTransparent: true,
        headerTitleStyle: {
          fontSize: 20,
          fontFamily: "PretendardBold",
          fontWeight: "700",
          color: "#000000",
        },
        tabBarStyle: isFixInfoPage
          ? { display: "none" }
          : {
              backgroundColor: "#fff",
              borderTopWidth: 1,
              borderRadius: 10,
              borderTopColor: "#E4E4E4",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 1.84,
              elevation: 1,
            },
      }}
    >
      <Tabs.Screen
        name="report"
        options={{
          title: "기록",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("@/assets/images/icon/activeNote.png")
                  : require("@/assets/images/icon/note.png")
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(home)"
        options={{
          title: "HOME",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("@/assets/images/icon/activeHome.png")
                  : require("@/assets/images/icon/home.png")
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(myInfo)"
        options={{
          title: "내정보",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("@/assets/images/icon/activeProfile.png")
                  : require("@/assets/images/icon/profile.png")
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                router.push("/(app)/(tabs)/(myInfo)/fixInfo");
              }}
            >
              <Image
                source={require("@/assets/images/icon/lucide_square-pen.png")}
                style={{ width: 24, height: 24, marginRight: 16 }}
                resizeMode="contain"
              />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}

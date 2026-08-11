import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="paper-plane" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="components-demo"
        options={{
          title: "Components",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="grid" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="demo-home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="demo-login"
        options={{
          headerShown: false,
          title: "Login",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

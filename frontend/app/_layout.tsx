import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "../components/navbar"; // Updated path

export default function Layout() {
  return (
    <>
      {/* Custom Navbar */}
      <Navbar />

      {/* Tabs */}
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "index") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "profile") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "about") {
              iconName = focused ? "information-circle" : "information-circle-outline";
            } else if (route.name === "contact") {
              iconName = focused ? "call" : "call-outline";
            }

            return <Ionicons Name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen name="about" options={{ title: "About" }} />
        <Tabs.Screen name="contact" options={{ title: "Contact" }} />
      </Tabs>
    </>
  );
}

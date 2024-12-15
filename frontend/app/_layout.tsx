import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";
import Navbar from "../components/navbar"; // Updated path

export default function Layout() {
  return (
    <View style={styles.container}>
      {/* Upper Navbar */}
      <Navbar isUpperNavbar />

      {/* Main Content (Slot) */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* Lower Navbar */}
      <Navbar isLowerNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Background color for the layout
  },
  content: {
    flex: 1, // Occupy remaining space
    padding: 10, // Adjust padding around the content
  },
});

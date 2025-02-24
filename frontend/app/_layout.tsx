import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Slot } from "expo-router";
import Navbar from "../components/navbar";
import { UserProvider } from "../context/UserContext";

export default function Layout() {
  return (
    <UserProvider>
      <View style={styles.container}>
        <Navbar isUpperNavbar />

        <View style={styles.content}>
          <Slot />
        </View>

        <Navbar isLowerNavbar />
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 10,
  },
});

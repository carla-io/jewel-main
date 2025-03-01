import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";
import Navbar from "../components/navbar";
import { UserProvider } from "../context/UserContext";
import { CartProvider } from "../context/CartContext";
import Toast from "react-native-toast-message"; // ✅ Import Toast

export default function Layout() {
  return (
    <UserProvider>
      <CartProvider>
        <View style={styles.container}>
          <Navbar isUpperNavbar />

          <View style={styles.content}>
            <Slot />
          </View>

          <Navbar isLowerNavbar />
        </View>
        <Toast /> {/* ✅ Ensure Toast is at the root level */}
      </CartProvider>
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

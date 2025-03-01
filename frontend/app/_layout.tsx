import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";
import Navbar from "../components/navbar";
import { UserProvider } from "../context/UserContext";
import { CartProvider } from "../context/CartContext";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <UserProvider>
      <CartProvider>
        <View style={styles.container}>
          <Navbar isUpperNavbar />
          <View style={styles.content}>
            <Slot /> {/* Expo Router automatically handles navigation */}
          </View>
          <Navbar isLowerNavbar />
        </View>
        <Toast />
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

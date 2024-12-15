import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Navbar() {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      {/* Logo and Brand Name */}
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: "https://example.com/logo.png" }} // Replace with your logo URL
          style={styles.logo}
        />
        <Text style={styles.logoText}>Jewel</Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navItems}>
        {/* Home */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/")}
        >
          <Ionicons name="home-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/pages/profile")}
        >
          <Ionicons name="person-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>

        {/* About */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/pages/about")}
        >
          <Ionicons name="information-circle-outline" size={24} color="#fff" />
          <Text style={styles.navText}>About</Text>
        </TouchableOpacity>

        {/* Contact */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/pages/contact")}
        >
          <Ionicons name="call-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Contact</Text>
        </TouchableOpacity>
      </View>

      {/* Signup/Login Button */}
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => router.push("/pages/signup")}
      >
        <Text style={styles.signupText}>Signup/Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  logoText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  navItems: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  navText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  signupButton: {
    backgroundColor: "#ff6347",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  signupText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

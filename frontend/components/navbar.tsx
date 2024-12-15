import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Navbar({ isUpperNavbar = false, isLowerNavbar = false }) {
  const router = useRouter();

  const navigateTo = (path: string) => {
    if (router && router.push) {
      router.push(path);
    } else {
      console.warn("Navigation attempted before the router was ready");
    }
  };

  if (isUpperNavbar) {
    return (
      <View style={styles.topNavbar}>
        {/* Logo and Logo Name */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/favicon.png")} // Replace with the path to your logo image
            style={styles.logo}
          />
          <Text style={styles.logoName}>MyApp</Text> {/* Replace "MyApp" with your app name */}
        </View>

        {/* Search Input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
        />

        {/* Cart Icon */}
        <TouchableOpacity
          style={styles.cartContainer}
          onPress={() => navigateTo("/pages/Cart")}
        >
          <Ionicons name="cart" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  if (isLowerNavbar) {
    return (
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo("/")}>
          <Ionicons name="home-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateTo("/pages/profile")}
        >
          <Ionicons name="person-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateTo("/pages/Orders")}
        >
          <Ionicons name="clipboard-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null; // Return nothing if neither upper nor lower navbar is specified
}

const styles = StyleSheet.create({
  topNavbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  logoName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#444",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  cartContainer: {
    marginLeft: 15,
  },
  bottomNavbar: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
  },
  navItem: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  navText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
});

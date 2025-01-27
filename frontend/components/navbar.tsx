import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
      <LinearGradient
        colors={["#ffffff", "#ffffff"]} // White background for the top navbar
        style={styles.topNavbar}
      >
        {/* Logo and Logo Name */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo.png")} // Replace with the path to your logo
            style={styles.logo}
          />
          <Text style={styles.logoName}>Jewel</Text> {/* Replace "MyApp" with your app name */}
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Cart Icon */}
        <TouchableOpacity
          style={styles.cartContainer}
          onPress={() => navigateTo("/pages/Cart")}
        >
          <Ionicons name="cart-outline" size={28} color="#000" />
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (isLowerNavbar) {
    return (
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo("/")}>
          <Ionicons name="home-outline" size={24} color="#000" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateTo("/pages/UserProfile")}
        >
          <Ionicons name="person-outline" size={24} color="#000" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateTo("/pages/Orders")}
        >
          <Ionicons name="clipboard-outline" size={24} color="#000" />
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#ffffff", // White background
    borderBottomWidth: 1,
    borderBottomColor: "#ddd", // Light grey border for separation
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
    borderRadius: 15, // Makes the logo circular if it's square
  },
  logoName: {
    color: "#000", // Black text for the logo name
    fontSize: 20,
    fontWeight: "bold",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4", // Light grey background for search input
    borderRadius: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    color: "#000", // Black text for search input
    fontSize: 16,
  },
  cartContainer: {
    marginLeft: 15,
  },
  bottomNavbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff", // White background for bottom navbar
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd", // Light grey border for separation
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "#000", // Black text for nav items
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
});

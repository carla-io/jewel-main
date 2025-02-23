import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Navbar({ isUpperNavbar = false, isLowerNavbar = false }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);

  const navigateTo = (path: string) => {
    if (router && router.push) {
      router.push(path);
    } else {
      console.warn("Navigation attempted before the router was ready");
    }
  };

  if (isUpperNavbar) {
    return (
      <LinearGradient colors={["#ffffff", "#ffffff"]} style={styles.topNavbar}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/logo.png")} style={styles.logo} />
          <Text style={styles.logoName}>Jewel</Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#888" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#aaa" />
        </View>

        {/* Cart Icon */}
        <TouchableOpacity style={styles.cartContainer} onPress={() => navigateTo("/pages/Cart")}>
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

        {/* Show Login/Signup if no user, else show Profile */}
        {user ? (
          <TouchableOpacity style={styles.navItem} onPress={() => navigateTo("/pages/UserProfile")}>
            <Ionicons name="person-outline" size={24} color="#000" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navItem} onPress={() => navigateTo("/pages/SignUpScreen")}>
            <Ionicons name="log-in-outline" size={24} color="#000" />
            <Text style={styles.navText}>Login</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo("/pages/Orders")}>
          <Ionicons name="clipboard-outline" size={24} color="#000" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  topNavbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
    borderRadius: 15,
  },
  logoName: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    color: "#000",
    fontSize: 16,
  },
  cartContainer: {
    marginLeft: 15,
  },
  bottomNavbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
});

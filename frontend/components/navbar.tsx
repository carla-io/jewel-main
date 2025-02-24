import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { UserContext } from "../context/UserContext";

export default function Navbar({ isUpperNavbar = false, isLowerNavbar = false }) {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Ensure user.role updates dynamically
    if (user) {
      setIsAdmin(user.role === "admin");
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const navigateTo = (path) => {
    if (router?.push) {
      router.push(path);
    } else {
      console.warn("Navigation attempted before the router was ready");
    }
  };

  if (isUpperNavbar) {
    return (
      <LinearGradient colors={["#ffffff", "#ffffff"]} style={styles.topNavbar}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/logo.png")} style={styles.logo} />
          <Text style={styles.logoName}>Jewel</Text>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#888" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#aaa" />
        </View>
        <TouchableOpacity style={styles.cartContainer} onPress={() => navigateTo("/pages/Cart")}>
          <Ionicons name="cart-outline" size={28} color="#000" />
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (isLowerNavbar) {
    return (
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo(isAdmin ? "/pages/admin/Dashboard" : "/")}>
          <Ionicons name="home-outline" size={24} color="#000" />
          <Text style={styles.navText}>{isAdmin ? "Dashboard" : "Home"}</Text>
        </TouchableOpacity>

        {/* Admin Only Items */}
        {isAdmin ? (
          <>
            <TouchableOpacity style={styles.navItem} onPress={() => navigateTo("/pages/Products")}>
              <Ionicons name="cube-outline" size={24} color="#000" />
              <Text style={styles.navText}>Products</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => navigateTo("/pages/Users")}>
              <Ionicons name="people-outline" size={24} color="#000" />
              <Text style={styles.navText}>Users</Text>
            </TouchableOpacity>
          </>
        ) : null}

        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo("/pages/Orders")}>
          <Ionicons name="clipboard-outline" size={24} color="#000" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo("/pages/UserProfile")}>
          <Ionicons name="person-outline" size={24} color="#000" />
          <Text style={styles.navText}>Profile</Text>
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


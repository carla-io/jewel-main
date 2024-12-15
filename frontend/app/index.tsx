import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const navigateTo = (path: string) => {
    if (router && router.push) {
      router.push(path);
    } else {
      console.warn("Navigation attempted before the router was ready");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Banner */}
      <LinearGradient colors={["#f5c6cb", "#fad1e1"]} style={styles.heroBanner}>
        <Text style={styles.heroTitle}>Exclusive Jewelry Collection</Text>
        <TouchableOpacity style={styles.shopNowBtn} onPress={() => navigateTo("/pages/Cart")}>
          <Text style={styles.shopNowText}>Shop Now</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Shop by Category Section */}
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}></Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigateTo("/shop/rings")}>
            <Text style={styles.categoryText}>Rings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("/shop/necklaces")}>
            <Text style={styles.categoryText}>Necklaces</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("/shop/bracelets")}>
            <Text style={styles.categoryText}>Bracelets</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Featured Products Section */}
      <View style={styles.productSection}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Product Item 1 */}
          <View style={styles.productCard}>
            <Image source={require("../assets/images/jewel1.png")} style={styles.productImage} />
            <Text style={styles.productName}>Gold Necklace</Text>
            <Text style={styles.productPrice}>$249.99</Text>
            <TouchableOpacity style={styles.productBtn} onPress={() => navigateTo("/product/1")}>
              <Ionicons name="cart-outline" size={20} color="#fff" />
              <Text style={styles.productBtnText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>

          {/* Product Item 2 */}
          <View style={styles.productCard}>
            <Image source={require("../assets/images/jewel1.png")} style={styles.productImage} />
            <Text style={styles.productName}>Diamond Ring</Text>
            <Text style={styles.productPrice}>$499.99</Text>
            <TouchableOpacity style={styles.productBtn} onPress={() => navigateTo("/product/2")}>
              <Ionicons name="cart-outline" size={20} color="#fff" />
              <Text style={styles.productBtnText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* About the Brand Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.aboutText}>
          At JewelryStore, we offer the finest collection of handcrafted jewelry. Our pieces are designed to stand the test of time and bring elegance to your life.
        </Text>
      </View>

      {/* Newsletter Signup */}
      <View style={styles.newsletter}>
        <Text style={styles.newsletterTitle}>Stay Updated</Text>
        <Text style={styles.newsletterText}>Sign up for our newsletter to get the latest offers and new arrivals!</Text>
        <TouchableOpacity style={styles.newsletterBtn}>
          <Text style={styles.newsletterBtnText}>Subscribe</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 JewelryStore. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heroBanner: {
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  shopNowBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#f56a79",
    borderRadius: 25,
  },
  shopNowText: {
    color: "#fff",
    fontSize: 18,
  },
  productSection: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  productCard: {
    marginRight: 15,
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 8,
    width: 180,
    elevation: 5,
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  productPrice: {
    fontSize: 14,
    color: "#f56a79",
  },
  productBtn: {
    marginTop: 10,
    backgroundColor: "#f56a79",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  productBtnText: {
    color: "#fff",
    marginLeft: 5,
  },
  categorySection: {
    marginVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center", // Center the category section
  },
  
  categoryText: {
    fontSize: 24,
    color: "#000",
    textAlign: "center",
    marginHorizontal: 15,
    // Center text within the card
  },
  aboutSection: {
    paddingHorizontal: 15,
    marginVertical: 20,
  },
  aboutText: {
    fontSize: 16,
    color: "#555",
  },
  newsletter: {
    padding: 20,
    backgroundColor: "#f6f6f6",
    alignItems: "center",
  },
  newsletterTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  newsletterText: {
    fontSize: 16,
    marginVertical: 10,
    color: "#555",
  },
  newsletterBtn: {
    backgroundColor: "#f56a79",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  newsletterBtnText: {
    color: "#fff",
    fontSize: 18,
  },
  footer: {
    backgroundColor: "#333",
    padding: 10,
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
  },
});

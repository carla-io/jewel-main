import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface Product {
  _id: string;
  name: string;
  images: { public_id: string; url: string }[];
  category: string;
  price: number;
  description: string;
  createdAt: string;
}

export default function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://192.168.175.237:4000/api/product/get");
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f56a79" />
      </View>
    );
  }

  // Group products by category
  const groupedProducts = products.reduce((acc: { [key: string]: Product[] }, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <ScrollView style={styles.container}>
      {/* Hero Banner */}
      <LinearGradient colors={["#f5c6cb", "#fad1e1"]} style={styles.heroBanner}>
        <Text style={styles.heroTitle}>Discover Our Latest Products</Text>
        <TouchableOpacity style={styles.shopNowBtn}>
          <Text style={styles.shopNowText}>Shop Now</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Products by Category */}
      {Object.keys(groupedProducts).map((category) => (
        <View key={category} style={styles.categorySection}>
          <Text style={styles.sectionTitle}>{category}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {groupedProducts[category].map((product) => (
              <View key={product._id} style={styles.productCard}>
                <Image source={{ uri: product.images[0]?.url }} style={styles.productImage} />
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                <TouchableOpacity style={styles.productBtn}>
                  <Ionicons name="cart-outline" size={20} color="#fff" />
                  <Text style={styles.productBtnText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    textAlign: "center",
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
  categorySection: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
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
    textAlign: "center",
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
});

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Product {
  _id: string;
  name: string;
  images: { public_id: string; url: string }[];
  category: string;
  price: number;
  description: string;
  createdAt: string;
}

interface ProductDisplayProps {
  product: Product;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ product }) => {
  return (
    <View style={styles.productDetailContainer}>
      <Image source={{ uri: product.images[0]?.url }} style={styles.productDetailImage} />
      <Text style={styles.productDetailName}>{product.name}</Text>
      <Text style={styles.productDetailPrice}>${product.price.toFixed(2)}</Text>
      <Text style={styles.productDetailDescription}>{product.description}</Text>
      <TouchableOpacity style={styles.productBtn}>
        <Ionicons name="cart-outline" size={20} color="#fff" />
        <Text style={styles.productBtnText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productDetailContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    marginHorizontal: 15,
  },
  productDetailImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  productDetailName: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  productDetailPrice: {
    fontSize: 18,
    color: "#f56a79",
  },
  productDetailDescription: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
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

export default ProductDisplay;

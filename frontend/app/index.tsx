import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Necklaces", "Earrings", "Bracelets"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://192.168.85.237:4000/api/product/get"
        );

        console.log("Fetched products:", response.data);

        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setProducts([]);
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
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Category Selection */}
      <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.categoryScrollView} // ✅ Apply styles here
>
  {categories.map((category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.selectedCategoryButton,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category && styles.selectedCategoryText,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>



      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productCategory}>{item.category}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <TouchableOpacity style={styles.addToCartButton}>
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  categoryContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryButton: {
    width: 100, // Ensures uniform button width
    height: 40, // Controls button height
    borderRadius: 20, // Keeps a smooth round shape
    backgroundColor: "#e0e0e0",
    marginHorizontal: 5, // Proper spacing between buttons
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCategoryButton: {
    backgroundColor: "#f56a79",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    flex: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  productCategory: {
    fontSize: 14,
    color: "gray",
  },
  productPrice: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "bold",
    marginVertical: 5,
  },
  addToCartButton: {
    backgroundColor: "#f56a79",
    padding: 8,
    borderRadius: 5,
  },
  addToCartText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Toast from "react-native-toast-message";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const handleSubmit = async () => {
    if (!productName || !category || !price || !description) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill all fields.",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("description", description);

    images.forEach((image, index) => {
      formData.append("images", {
        uri: image,
        name: `image${index}.jpg`,
        type: "image/jpeg",
      });
    });

    try {
      const response = await axios.post(
        "http://192.168.175.237:4000/api/auth/product/new",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Toast.show({ type: "success", text1: "Success", text2: "Product added successfully!" });
        setProductName("");
        setCategory("");
        setPrice("");
        setDescription("");
        setImages([]);
      } else {
        Toast.show({ type: "error", text1: "Error", text2: "Failed to add product." });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Product Name</Text>
      <TextInput style={styles.input} value={productName} onChangeText={setProductName} />

      <Text style={styles.label}>Category</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} />

      <Text style={styles.label}>Price</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
        <Text style={styles.buttonText}>Pick Images</Text>
      </TouchableOpacity>

      <ScrollView horizontal>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.imagePreview} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add Product</Text>}
      </TouchableOpacity>

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  uploadButton: { backgroundColor: "#f56a79", padding: 10, marginBottom: 10, alignItems: "center", borderRadius: 5 },
  submitButton: { backgroundColor: "#28a745", padding: 15, alignItems: "center", borderRadius: 5 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  imagePreview: { width: 80, height: 80, marginRight: 10, borderRadius: 5 },
});

export default AddProduct;

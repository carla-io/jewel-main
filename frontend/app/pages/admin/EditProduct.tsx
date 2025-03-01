import React, { useEffect, useState } from "react";
import { 
  View, Text, TextInput, Button, Image, ActivityIndicator, 
  StyleSheet, Alert, TouchableOpacity 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const EditProductScreen = () => {
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://192.168.85.237:4000/api/product/${productId}`);
      const productData = response.data.product;
  
      console.log("Fetched Product:", productData);
  
      setProduct(productData);
      setName(productData.name);
      setPrice(productData.price.toString());
      setDescription(productData.description);
      setCategory(productData.category || ""); // ✅ Set category
      setImage(productData.images?.[0]?.url || productData.image || "https://via.placeholder.com/150");
    } catch (error) {
      console.error("Error fetching product:", error);
      Alert.alert("Error", "Failed to fetch product.");
    } finally {
      setLoading(false);
    }
  };
  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: false,
    });
  
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      console.log("Selected Image URI:", imageUri); // ✅ Debugging line
  
      setNewImage({ uri: imageUri, name: "product.jpg", type: "image/jpeg" });
  
      // ✅ Update image preview
      setImage(imageUri);
    }
  };
  
  

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", parseFloat(price));
    formData.append("description", description);
    formData.append("category", category);
  
    if (newImage) {
        formData.append("images", {
          uri: newImage.uri,
          name: newImage.name, // ✅ Fix image name
          type: newImage.type, // ✅ Fix image type
        });
      }
      
  
    // ✅ Log FormData contents
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      const response = await axios.put(
        `http://192.168.85.237:4000/api/product/update/${productId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      console.log("Update Response:", response.data);
      setImage(`${response.data.product.images[0]?.url}?t=${Date.now()}`); // Ensure image refresh
  
      Alert.alert("Success", "Product updated successfully.");
      router.replace("/pages/admin/Products");
  
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to update product.");
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>

      {/* Image Picker */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        <Ionicons name="camera-outline" size={30} color="#fff" style={styles.cameraIcon} />
      </TouchableOpacity>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Product Name" />
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="Price" />
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Description" />
     


<Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
  <Picker.Item label="Select Category" value="" />
  <Picker.Item label="Necklaces" value="Necklaces" />
  <Picker.Item label="Earrings" value="Earrings" />
  <Picker.Item label="Bracelets" value="Bracelets" />
</Picker>



      <Button title="Update Product" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  imageContainer: { position: "relative", width: 150, height: 150, marginBottom: 20, borderRadius: 10 },
  image: { width: 150, height: 150, borderRadius: 10 },
  cameraIcon: { position: "absolute", bottom: 5, right: 5, backgroundColor: "#000", padding: 5, borderRadius: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5, backgroundColor: "#fff" },
});

export default EditProductScreen;

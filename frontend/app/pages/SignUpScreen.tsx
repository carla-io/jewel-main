import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function SignUpScreen() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Camera roll permissions are required!");
      }
    };
    requestPermissions();
  }, []);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image selection error:", error);
    }
  };

  const handleSubmit = async () => {
    console.log("Sending data:", user.email, user.password); // Debugging
  
    try {
      const url = isRegistering
        ? "http://192.168.100.171:4000/api/auth/register"
        : "http://192.168.100.171:4000/api/auth/login";
  
      const requestData = isRegistering
        ? { username: user.username, email: user.email, password: user.password }
        : { email: user.email, password: user.password };
  
      const response = await axios.post(url, requestData, {
        headers: { "Content-Type": "application/json" }, // Send JSON instead of FormData
      });
  
      console.log("Response:", response.data);
  
      // ✅ Save user data to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      await AsyncStorage.setItem("token", response.data.token);
  
      Alert.alert("Success", isRegistering ? "Registration successful!" : "Login successful!");
  
      if (!isRegistering) {
        router.push("/pages/UserProfile");
      }
    } catch (error) {
      console.error("Error:", error.response?.data);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };
  
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
  
      if (userData) {
        console.log("User Data:", JSON.parse(userData));
      }
  
      if (token) {
        console.log("User Token:", token);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };
  
  // Call loadUserData when the component mounts
  useEffect(() => {
    loadUserData();
  }, []);
  

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      Alert.alert("Logged out", "You have been successfully logged out!");
      router.push("/pages/SignUpScreen"); // Redirect to login screen
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? "Sign Up" : "Login"}</Text>
      {isRegistering && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={user.username}
            onChangeText={(text) => setUser({ ...user, username: text })}
          />
          <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Text style={styles.imagePlaceholder}>Choose Profile Picture</Text>
            )}
          </TouchableOpacity>
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={user.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={user.password}
        onChangeText={(text) => setUser({ ...user, password: text })}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isRegistering ? "Sign Up" : "Login"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.toggleText}>
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  imagePicker: {
    alignItems: "center",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f56a79",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  toggleText: {
    fontSize: 16,
    color: "#f56a79",
    textAlign: "center",
    marginTop: 15,
  },
});

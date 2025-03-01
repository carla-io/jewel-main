import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useCallback } from "react";

export default function UserProfile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // Set loading state
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          navigation.reset({ index: 0, routes: [{ name: "SignupScreen" }] });
          return;
        }
  
        // Set a timeout to prevent infinite waiting
        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
          source.cancel("Request timed out.");
        }, 5000); // 5-second timeout
  
        const response = await axios.post(
          "http://192.168.100.171:4000/api/auth/user",
          { token },
          { cancelToken: source.token }
        );
  
        clearTimeout(timeout); // Clear timeout when request succeeds
  
        setUserName(response.data.user.username);
        setUserEmail(response.data.user.email);
        setProfileImage(response.data.user.profilePicture?.url || null);
        setUserId(response.data.user._id);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.error("Request cancelled:", err.message);
        } else {
          Toast.show({ type: "error", text1: "Error", text2: "Failed to fetch user data" });
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);

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
      setProfileImage(imageUri); 
      setNewProfilePicture({ uri: imageUri, name: "profile.jpg", type: "image/jpeg" }); 
    }
  };

  const handleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Toast.show({ type: "error", text1: "Error", text2: "No authentication token found." });
      return;
    }

    if (!userId) {
      Toast.show({ type: "error", text1: "Error", text2: "User ID not found." });
      return;
    }

    const formData = new FormData();
    formData.append("username", userName);
    formData.append("email", userEmail);
    if (newProfilePicture) {
      formData.append("profilePicture", newProfilePicture);
    }

    try {
      const response = await axios.put(
        `http://192.168.175.237:4000/api/auth/update-profile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfileImage(`${response.data.user.profilePicture?.url}?t=${Date.now()}`);
      Toast.show({ type: "success", text1: "Success", text2: "Profile updated successfully!" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to update profile." });
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    router.push("/pages/SignUpScreen");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f56a79" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: profileImage || "https://www.example.com/default-avatar.png",
            }}
            style={styles.profileImage}
          />
          <Ionicons name="camera-outline" size={28} color="#fff" style={styles.cameraIcon} />
        </View>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
        placeholder="Enter your name"
      />

      <TextInput
        style={styles.input}
        value={userEmail}
        onChangeText={setUserEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Toast Notification Component */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imageContainer: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#f56a79",
    marginBottom: 20,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#f56a79",
    borderRadius: 20,
    padding: 5,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: "#f56a79",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});
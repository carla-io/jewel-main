import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../redux/slices/orderSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CheckoutScreen() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.order);

  const [userId, setUserId] = useState(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState("COD");

  // Fetch user ID
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserId(parsedUser._id || parsedUser.id);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserId();
  }, []);

  const handlePlaceOrder = () => {
    if (!userId || !address || !city || !phoneNo || !postalCode || !country) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const orderData = {
      userId,
      shippingInfo: { address, city, phoneNo, postalCode, country },
      modeOfPayment,
    };

    dispatch(createOrder(orderData));
  };

  useEffect(() => {
    if (status === "succeeded") {
      Alert.alert("Success", "Order placed successfully!");
    } else if (status === "failed") {
      Alert.alert("Error", error || "Failed to place order.");
    }
  }, [status, error]);

  return (
    <ScrollView>
      <Text>Checkout</Text>
      <TextInput placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput placeholder="City" value={city} onChangeText={setCity} />
      <TextInput placeholder="Phone Number" value={phoneNo} onChangeText={setPhoneNo} />
      <TextInput placeholder="Postal Code" value={postalCode} onChangeText={setPostalCode} />
      <TextInput placeholder="Country" value={country} onChangeText={setCountry} />
      <TouchableOpacity onPress={handlePlaceOrder}>
        <Text>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

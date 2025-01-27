import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

const ordersData = [
  { id: "1", title: "Order #1234", status: "To Ship" },
  { id: "2", title: "Order #1235", status: "Shipped" },
  { id: "3", title: "Order #1236", status: "Delivered" },
  { id: "4", title: "Order #1237", status: "To Ship" },
  { id: "5", title: "Order #1238", status: "Delivered" },
];

export default function OrdersScreen() {
  const [selectedTab, setSelectedTab] = useState("To Ship");

  const filteredOrders = ordersData.filter((order) => order.status === selectedTab);

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderTitle}>{item.title}</Text>
      <Text style={styles.orderStatus}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "To Ship" && styles.activeTab]}
          onPress={() => setSelectedTab("To Ship")}
        >
          <Text style={[styles.tabText, selectedTab === "To Ship" && styles.activeTabText]}>
            To Ship
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "Shipped" && styles.activeTab]}
          onPress={() => setSelectedTab("Shipped")}
        >
          <Text style={[styles.tabText, selectedTab === "Shipped" && styles.activeTabText]}>
            Shipped
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "Delivered" && styles.activeTab]}
          onPress={() => setSelectedTab("Delivered")}
        >
          <Text style={[styles.tabText, selectedTab === "Delivered" && styles.activeTabText]}>
            Delivered
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#f56a79",
  },
  tabText: {
    fontSize: 16,
    color: "#333",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orderItem: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 16,
    color: "#333",
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  emptyText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base URL
const API_URL = "http://192.168.100.171:4000/api/order";

// 🔹 Fetch Orders (GET)
export const fetchOrders = createAsyncThunk("order/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/get`);
    return response.data.orders; // Ensure this matches backend response structure
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// 🔹 Create Order (POST)
export const createOrder = createAsyncThunk("order/createOrder", async (orderData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/new`, orderData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState: { orders: [], status: "idle", error: null },
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders Cases
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create Order Cases
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;

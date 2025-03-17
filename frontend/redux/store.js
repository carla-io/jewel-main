import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./slices/orderSlice";
// import productReducer from "./slices/productSlice";
// import reviewReducer from "./slices/reviewSlice";

export const store = configureStore({
  reducer: {
    order: orderReducer
    // product: productReducer,
    // review: reviewReducer,
  },
});

export default store;

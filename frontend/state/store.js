import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
import { createStoreHook } from "react-redux";
import { createSlice as createRTKSlice } from "@reduxjs/toolkit";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const response = await axios.get("http://localhost:9009/api/pizza/history");
  return response.data;
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.map((order) => ({
          ...order,
          fullName: order.customer,
        }));
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

const filterSlice = createRTKSlice({
  name: "filter",
  initialState: "All",
  reducers: {
    setFilter: (state, action) => action.payload,
  },
});

export const { setFilter } = filterSlice.actions;

const exampleReducer = (state = { count: 0 }) => {
  return state;
};

export const resetStore = () =>
  configureStore({
    reducer: {
      example: exampleReducer,
      orders: ordersSlice.reducer,
      filter: filterSlice.reducer,
      // add your reducer(s) here
    },
    middleware: (getDefault) =>
      getDefault()
        .concat
        // if using RTK Query for your networking: add your middleware here
        // if using Redux Thunk for your networking: you can ignore this
        (),
  });

export const store = resetStore();

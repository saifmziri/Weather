import { configureStore } from "@reduxjs/toolkit";
import weatherApiReducer from "../features/weathers/weatherApiSlice";

export const store = configureStore({
  reducer: {
    weather: weatherApiReducer,
  },
});

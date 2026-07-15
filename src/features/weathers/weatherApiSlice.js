import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = "2dee2f1b3f3da94aef27fd53e421c98d";

// نستقبل المدينة (object فيه lat/lon/nameAr/nameEn) واللغة كـ argument واحد
export const fetchWeather = createAsyncThunk(
  "weatherApi/fetchWeather",
  async ({ city, lang }, { signal, rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&lang=${lang}`,
        { signal },
      );

      return {
        city: lang === "ar" ? city.nameAr : city.nameEn,
        temp: response.data.main.temp - 273.15,
        desc: response.data.weather[0].description,
        min: response.data.main.temp_min - 273.15,
        max: response.data.main.temp_max - 273.15,
        humidity: response.data.main.humidity,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const weatherApiSlice = createSlice({
  name: "weatherApi",
  initialState: {
    weather: {},
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weather = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        // إذا الطلب انلغى (AbortController) ما نظهر خطأ، هذا سلوك متوقع
        if (action.error.name === "CanceledError" || action.meta.aborted) {
          state.isLoading = false;
          return;
        }
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default weatherApiSlice.reducer;

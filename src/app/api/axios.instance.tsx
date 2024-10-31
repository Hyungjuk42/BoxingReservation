import axios from "axios";
import {
  STATUS_401_UNAUTHORIZED,
  STATUS_403_FORBIDDEN,
} from "@/app/constants/status_code";

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
axios.defaults.withCredentials = true;

export const instance = axios.create({
  // baseURL: supabaseUrl,
  headers: {
    Authorization: `Bearer ${supabaseAnonKey}`,
    apikey: supabaseAnonKey,
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response?.status === STATUS_401_UNAUTHORIZED ||
      error.response?.status === STATUS_403_FORBIDDEN
    ) {
    }
    return Promise.reject(error);
  }
);

// export const holidayInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_HOLIDAY_API_URL,
//   withCredentials: true,
// });

// instance.interceptors.request.use(async (config) => {
//   return config;
// });

holidayInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response?.status === STATUS_401_UNAUTHORIZED ||
      error.response?.status === STATUS_403_FORBIDDEN
    ) {
    }
    return Promise.reject(error);
  }
);

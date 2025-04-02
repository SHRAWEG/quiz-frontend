import { COOKIE_KEYS } from "@/constants/local-storage-keys";
import axios from "axios";
import { getCookie } from "cookies-next/client";

export const instance = axios.create({
  baseURL: "http://localhost:4000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
    const token = getCookie(COOKIE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    return Promise.reject(error);
  }
);

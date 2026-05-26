import axios from "axios";
import { API_BASE } from "../config";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export const fetchDataFromApi = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("GET Error:", url, error.response?.data || error.message);
    return null;
  }
};

export const postData = async (url, formData) => {
  try {
    if (!url.startsWith("/")) url = "/" + url;
    const response = await api.post(url, formData);
    return response.data;
  } catch (error) {
    console.error("POST Error:", url, error.response?.data || error.message);

    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: false,
      msg: error.message || "Unable to reach the server. Check your connection.",
    };
  }
};

export const editData = async (url, updatedData) => {
  try {
    const response = await api.put(url, updatedData);
    return response.data;
  } catch (error) {
    console.error("PUT Error:", url, error.response?.data || error.message);
    return null;
  }
};

export const deleteData = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error("DELETE Error:", url, error.response?.data || error.message);
    return null;
  }
};

export const fetchHomeBootstrap = async (perPage = 16) => {
  return fetchDataFromApi(`/api/bootstrap/home?perPage=${perPage}`);
};

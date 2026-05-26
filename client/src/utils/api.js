import axios from "axios";
import { API_BASE } from "../config";

export const fetchDataFromApi = async (url) => {
  try {
    const response = await axios.get(API_BASE + url);
    return response.data;
  } catch (error) {
    console.log("GET Error:", error);
    return error;
  }
};

export const postData = async (url, formData) => {
  try {
    if (!url.startsWith("/")) url = "/" + url;
    const response = await axios.post(API_BASE + url, formData);
    return response.data;
  } catch (error) {
    console.log("POST Error:", error);

    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      status: false,
      msg: "Unexpected error",
    };
  }
};

export const editData = async (url, updatedData) => {
  const response = await axios.put(`${API_BASE}${url}`, updatedData);
  return response.data;
};

export const deleteData = async (url) => {
  const { res } = await axios.delete(`${API_BASE}${url}`);
  return res;
};

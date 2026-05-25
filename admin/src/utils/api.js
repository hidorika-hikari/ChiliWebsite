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
  try {
    const response = await axios.put(`${API_BASE}${url}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("editData error:", error.message);
    return {
      success: false,
      message:
        error.response?.data?.message || "Unknown error while updating",
    };
  }
};

export const patchData = async (url, updatedData) => {
  try {
    const response = await axios.patch(`${API_BASE}${url}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("patchData error:", error.message);
    return {
      success: false,
      message:
        error.response?.data?.message || "Unknown error while updating",
    };
  }
};

export const deleteData = async (url) => {
  try {
    const response = await axios.delete(`${API_BASE}${url}`);
    return response.data;
  } catch (error) {
    console.error("deleteData error:", error.message);
    return {
      success: false,
      message:
        error.response?.data?.message || "Unknown error while deleting",
    };
  }
};

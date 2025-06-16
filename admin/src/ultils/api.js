import axios from 'axios';

export const fetchDataFromApi = async (url) => {
    try {
        const response = await axios.get("http://localhost:4000" + url);
        return response.data;
    } catch (error) {
        console.log("GET Error:", error);
        return error;
    }
}

export const postData = async (url, formData) => {
    try {
        if (!url.startsWith("/")) url = "/" + url;
        const response = await axios.post("http://localhost:4000" + url, formData);
        return response.data;
    } catch (error) {
        console.log("POST Error:", error);
        return error;
    }
}

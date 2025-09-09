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
        if (error.response && error.response.data) {
            return error.response.data;
        }
        return {
            status: false,
            msg: "Unexpected error"
        };
    }
};

export const editData = async (url, updatedData) => {
    try {
        const response = await axios.put(`http://localhost:4000${url}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('editData error:', error.message);
        return {
            success: false,
            message: error.response?.data?.message || 'Unknown error while updating',
        };
    }
};

export const patchData = async (url, updatedData) => {
    try {
        const response = await axios.patch(`http://localhost:4000${url}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('patchData error:', error.message);
        return {
            success: false,
            message: error.response?.data?.message || 'Unknown error while updating',
        };
    }
};

export const deleteData = async (url) => {
    try {
        const response = await axios.delete(`http://localhost:4000${url}`);
        return response.data;
    } catch (error) {
        console.error('deleteData error:', error.message);
        return {
            success: false,
            message: error.response?.data?.message || 'Unknown error while deleting',
        };
    }
}
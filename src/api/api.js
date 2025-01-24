import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// request gönderilmeden önce yapılacaklar
apiClient.interceptors.request.use(
    (config) => {
        // token eklemek olabilir
        console.log('İstek gönderildi:', config);
        return config;
    },
    (error) => {
        console.error('İstek hatası:', error);
        return Promise.reject(error);
    }
);

// response aldıktan sonra
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('response hatası:', error.response);

        if (!error.response) {
            alert('Connection Error!');
        } else {
            switch (error.response.status) {
                case 400:
                    alert('Bad Request');
                    break;
                case 401:
                    alert('Unauthorized');
                    break;
                case 404:
                    alert('Not Found');
                    break;
                case 500:
                    alert('Internal Server Error ');
                    break;
                default:
                    alert(`Error: ${error.response.status}`);
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export const getAlbums = async () => {
    try {
        const response = await apiClient.get('/albums');
        return response.data;
    } catch (error) {
        console.error("error:", error);
        throw error;
    }
};

export const createAlbum = async (album) => {
    try {
        const response = await apiClient.post('/albums', album);
        return response.data;
    } catch (error) {
        console.error("error:", error);
        throw error;
    }
};

export const updateAlbum = async (id, album) => {
    try {
        const response = await apiClient.put(`/albums/${id}`, album);
        return response.data;
    } catch (error) {
        console.error("error:", error);
        throw error;
    }
};

export const deleteAlbum = async (id) => {
    try {
        const response = await apiClient.delete(`/albums/${id}`);
        return response.data;
    } catch (error) {
        console.error("error:", error);
        throw error;
    }
};

export const getAlbumPhotos = async (id) => {
    try {
        const response = await apiClient.get(`/albums/${id}/photos`);
        return response.data;
    } catch (error) {
        console.error("error:", error);
        throw error;
    }
};

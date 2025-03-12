import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://172.28.64.1:3000/', // Change this to your own ip address
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const register = async (data) => {
    return await api.post('/user/new', data);
};

export const login = async (email, password) => {
    return await api.post('/user/login', { email, password });
};

export const getProfile = async () => {
    return await api.get('/user/monprofil');
};

export const getAllUsers = async () => {
    return await api.get('/user/all');
};

export const addPost = async (title, content) => {
    return await api.post('/post/new', { title, content });
};

export const getPostById = async (id) => {
    return await api.get(`/post/${id}`);
};

export const updatePost = async (id, title, content) => {
    return await api.put(`/post/update/${id}`, { title, content });
};

export const deletePost = async (id) => {
    return await api.delete(`/post/delete/${id}`);
};

export const updateOwnPost = async (id, title, content) => {
    return await api.put(`/post/updateOwnPost/${id}`, { title, content });
};

export const deleteOwnPost = async (id) => {
    return await api.delete(`/post/deleteOwnPost/${id}`);
};

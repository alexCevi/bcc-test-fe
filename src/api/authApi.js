import axiosInstance from "./axiosInstance";

export const login = async (credentials) => {
    return await axiosInstance.post(`/auth/login`, credentials);
};

export const logout = async () => {
    return await axiosInstance.post(`/auth/logout`);
};

export const registerUser = async (data) => {
    return await axiosInstance.post(`/auth/register`, data);
};

export const validate = async () => {
    return await axiosInstance.get(`/auth/validate`);
};
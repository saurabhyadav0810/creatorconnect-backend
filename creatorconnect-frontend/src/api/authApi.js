import axiosInstance from './axiosInstance';


export const initiateSignup = async (email) => {
    const res = await axiosInstance.post('/auth/signup/initiate', { email });
    return res.data;
};

export const verifySignupOtp = async (data) => {
    const res = await axiosInstance.post('/auth/signup/verify', data);
    return res.data;
};


export const loginUser = async (data) => {
    const res = await axiosInstance.post('/auth/login', data);
    return res.data;
};

export const getCurrentUser = async () => {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
};


export const logoutUser = async () => {
    await axiosInstance.post('/auth/logout');
};   
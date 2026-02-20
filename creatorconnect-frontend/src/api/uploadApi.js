import axiosInstance from './axiosInstance';

// Upload single image or video
export const uploadSingleMedia = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axiosInstance.post('/upload/single', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
};

// Upload multiple images or videos
export const uploadMultipleMedia = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    const res = await axiosInstance.post('/upload/multiple', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
};

import axiosInstance from "./axiosInstance";

export const getConversations = async () => {
    const res = await axiosInstance.get("/chats");
    return res.data;
};

export const getMessages = async (conversationId) => {
    const res = await axiosInstance.get(`/chats/${conversationId}`);
    return res.data;
};

export const createConversation = async (receiverId) => {
    const res = await axiosInstance.post("/chats/conversation", { receiverId });
    return res.data;
};

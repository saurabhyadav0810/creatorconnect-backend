import Conversation from "../models/conversation.js";
import Message from "../models/Message.js";
import { getOrCreateConversation } from "../services/chat.services.js";

export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.user.id }).populate("participants", "name email");
        res.status(200).json({
            success: true,
            conversations
        });
    } catch (error) {
        res.status(400).json({
            success: false, 
            message: error.message
        });
    }
};

export const getMessages = async (req, res) => {
    try {
       const messages = await Message.find({ conversation: req.params.conversationId }).sort({ createdAt: 1 });
         res.json({ success: true, messages });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }   
};

export const createConversation = async (req, res) => {
    try {
        const { receiverId } = req.body;
        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required"
            });
        }
        const conversation = await getOrCreateConversation(req.user.id, receiverId);
        await conversation.populate("participants", "name email");
        res.status(200).json({
            success: true,
            conversation
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }   
};
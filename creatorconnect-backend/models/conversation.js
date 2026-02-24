import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null
        }
    },
    { timestamps: true }
);


conversationSchema.path('participants').validate(function(value) {
    return value.length >= 2;
}, 'A conversation must have at least 2 participants');

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;


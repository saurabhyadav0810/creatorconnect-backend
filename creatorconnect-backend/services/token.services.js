import User from "../models/users.js";

export const deductTokens = async (userId, amount=1) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (user.tokens < amount) {
        throw new Error("Insufficient tokens");
    }
    user.tokens -= amount;
    await user.save();
    return user.tokens;
};
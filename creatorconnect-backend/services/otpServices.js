import OTP from "../models/otp.js";

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const saveOtp = async (email, otp) => {
    await OTP.deleteMany({ email }); 

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    const newOtp = new OTP({
        email,
        otp,
        expiresAt
    });

    console.log("Generated OTP:", otp);
};
export const verifyOtp = async (email, otp) => {
    const record = await OTP.findOne({ email });

    if (!record) {
        throw new Error("OTP not found");
    }       
    if (record.otp !== otp) {
        throw new Error("Invalid OTP");
    }
    if (record.expiresAt < new Date()) {
        throw new Error("OTP expired");
    }
    await OTP.deleteOne({ email });
    return true;
};
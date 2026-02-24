import mongoose from "mongoose";
import bcrypt from "bcrypt"
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  }
);

otpSchema.pre("save", async function () {
  
  if (!this.isModified("otp")) return;

  const saltRounds = 10;
  console.log("[OTP Model] Plain OTP before hashing:", this.otp);
  this.otp = await bcrypt.hash(this.otp, saltRounds);
  console.log("[OTP Model] Hashed OTP:", this.otp);
});
export default mongoose.model("OTP", otpSchema);

import bcrypt from "bcryptjs";
import User from "../models/users.js";
import OTP from "../models/otp.js";
import { sendEmail } from "../sendEmail.js";
import generateToken from "../utils/generateToken.js";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });
  const token = generateToken(user._id);
  return { user, token };
};

export const initiateSignupService = async (email) => {
  const otp = generateOtp();
  await OTP.deleteMany({ email });

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  const otpRecord = new OTP({
    email,
    otp,
    expiresAt
  });

  await otpRecord.save();
  await sendEmail(
    email,
    "Your OTP Code",
    `Your OTP is ${otp}. It expires in 5 minutes.`
  );

  return { email, expiresAt };
};

export const verifySignupOtpService = async ({
  email,
  otp,
  name,
  password,
  role
}) => {
  const record = await OTP.findOne({ email });

  if (!record) {
    throw new Error("OTP not found");
  }

  const isMatch = await bcrypt.compare(otp, record.otp);
  if (!isMatch) {
    throw new Error("Invalid OTP");
  }

  if (record.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  await OTP.deleteOne({ email });

  let user = await User.findOne({ email });
  if (!user) {
    if (!name || !password) {
      throw new Error("Name and password are required for signup");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });
  }

  const token = generateToken(user._id);
  return { user, token };
};

export const loginService = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);
  return { user, token };
};

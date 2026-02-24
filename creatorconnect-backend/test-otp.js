import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Simple OTP schema without pre-save hook
const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date
});

// Add pre-save hook like in your model
otpSchema.pre("save", async function () {
  if (!this.isModified("otp")) return;
  
  const saltRounds = 10;
  console.log("Plain OTP before hashing:", this.otp);
  this.otp = await bcrypt.hash(this.otp, saltRounds);
  console.log("Hashed OTP:", this.otp);
});

const TestOTP = mongoose.model("TestOTP", otpSchema);

async function testOTP() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://yadavsaurabhrajepur_db_user:asdfghjkl@cluster0.fx5rtfq.mongodb.net/MERN?retryWrites=true&w=majority");
    console.log("Connected to MongoDB\n");

    const testEmail = "test@example.com";
    const plainOtp = "123456";

    // Clean up any existing test data
    await TestOTP.deleteMany({ email: testEmail });

    // Create and save OTP (will be hashed by pre-save hook)
    console.log("=== SAVING OTP ===");
    const otpRecord = new TestOTP({
      email: testEmail,
      otp: plainOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });
    await otpRecord.save();
    console.log("OTP saved successfully\n");

    // Retrieve and verify
    console.log("=== VERIFYING OTP ===");
    const record = await TestOTP.findOne({ email: testEmail });
    console.log("Retrieved hashed OTP from DB:", record.otp);
    console.log("Comparing with plain OTP:", plainOtp);
    
    const isMatch = await bcrypt.compare(plainOtp, record.otp);
    console.log("Comparison result:", isMatch);

    if (isMatch) {
      console.log("\n✅ SUCCESS: OTP verification works correctly!");
    } else {
      console.log("\n❌ FAILED: OTP verification not working!");
    }

    // Cleanup
    await TestOTP.deleteMany({ email: testEmail });
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testOTP();

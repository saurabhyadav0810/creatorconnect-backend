import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: "photography"
    },
    mediaUrl: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      default: ""
    },
    resourceType: {
      type: String,
      default: "auto"
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private"
    },
    likes: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Asset", assetSchema);

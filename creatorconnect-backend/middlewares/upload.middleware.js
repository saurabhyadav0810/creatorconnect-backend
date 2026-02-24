import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
  
    let resourceType = "auto";
    let folder = "creatorconnect/uploads";

    if (file.mimetype.startsWith("image/")) {
      resourceType = "image";
      folder = "creatorconnect/images";
    } else if (file.mimetype.startsWith("video/")) {
      resourceType = "video";
      folder = "creatorconnect/videos";
    }

    return {
      folder: folder,
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
      allowed_formats: [
        "jpg", "jpeg", "png", "gif", "webp",  // images
        "mp4", "avi", "mov", "mkv", "webm"    // videos
      ]
    };
  }
});


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {

    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed"));
    }
  }
});

export default upload;

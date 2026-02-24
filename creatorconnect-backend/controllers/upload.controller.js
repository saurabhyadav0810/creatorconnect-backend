// Upload controller for handling image and video uploads to Cloudinary

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // File has been uploaded to Cloudinary by the middleware
    const fileData = {
      url: req.file.path,
      publicId: req.file.filename,
      resourceType: req.file.resource_type || "auto",
      mimeType: req.file.mimetype,
      size: req.file.size,
      originalName: req.file.originalname
    };

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: fileData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const uploadMultipleMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded"
      });
    }

    // Process multiple files uploaded to Cloudinary
    const filesData = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      resourceType: file.resource_type || "auto",
      mimeType: file.mimetype,
      size: file.size,
      originalName: file.originalname
    }));

    res.status(200).json({
      success: true,
      message: `${filesData.length} file(s) uploaded successfully`,
      data: filesData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

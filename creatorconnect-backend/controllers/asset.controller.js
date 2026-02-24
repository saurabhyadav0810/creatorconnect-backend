import Asset from "../models/asset.js";

export const createAsset = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      mediaUrl,
      publicId,
      resourceType,
      visibility
    } = req.body;

    if (!title || !mediaUrl) {
      return res.status(400).json({
        success: false,
        message: "Title and mediaUrl are required"
      });
    }

    if (visibility && !["public", "private"].includes(visibility)) {
      return res.status(400).json({
        success: false,
        message: "Visibility must be public or private"
      });
    }

    const asset = await Asset.create({
      title,
      description,
      category,
      mediaUrl,
      publicId,
      resourceType,
      visibility: visibility || "private",
      owner: req.user.id
    });

    const populated = await asset.populate("owner", "name");

    res.status(201).json({
      success: true,
      message: "Asset created successfully",
      data: populated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ owner: req.user.id })
      .sort({ createdAt: -1 })
      .populate("owner", "name");

    res.status(200).json({
      success: true,
      data: assets
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getPublicAssets = async (_req, res) => {
  try {
    const assets = await Asset.find({ visibility: "public" })
      .sort({ createdAt: -1 })
      .populate("owner", "name");

    res.status(200).json({
      success: true,
      data: assets
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

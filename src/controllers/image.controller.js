import sendResponse from "../utils/sendResponse.js";
import sendError from "../utils/sendError.js";

export const uploadImage = async (req, res) => {
  try {
    // Check if image is uploaded
    if (!req.file || req.files.length === 0) {
      return res.status(400).json({
        message: "Please upload an image",
      });
    }

    // Create image URLs for all uploaded images
    const images = req.files.map((file) => {

    const imagePath = `/public/${req.file.filename}`;
    const imageUrl = `${req.protocol}://${req.get("host")}${imagePath}`;
    console.log(imageUrl);
    return {
       filename: file.filename,
        path: imagePath,
        url: imageUrl,
      };
    });
    // Send response
    return sendResponse(
      res,
      200,
      "Image uploaded successfully",
      images
    );

  } catch (error) {

    return sendError(res, error.message);

  }
};
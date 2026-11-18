
import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({

  // Destination folder
  destination: (req, file, cb) => {
    cb(null, "public/");
  },

  // File name
  filename: (req, file, cb) => {

    const uniqueName = Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  }

});

// Initialize multer
const upload = multer({
  storage: storage
});

export default upload;

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",          // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg", "avif"],
  },
});

const upload = multer({ storage });

module.exports = upload;

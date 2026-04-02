const path = require("path");
const multer = require("multer");
const os = require("os"); // مكتبة مدمجة في Node.js

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // نستخدم os.tmpdir() أو "/tmp" مباشرة
    // ده بيضمن إن الكود يشتغل على جهازك (لوكال) وفي فيرسيل برضه
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname.replace(/\s/g, "-");
    cb(null, fileName);
  },
});
const photoUpload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});

module.exports = photoUpload;

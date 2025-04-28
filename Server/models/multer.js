const multer = require('multer');
const { storage } = require('../Services/cloudinary'); 

const upload = multer({ storage });

module.exports = upload;

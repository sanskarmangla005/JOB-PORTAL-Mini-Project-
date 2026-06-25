const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Extract original extension correctly
    const ext = file.originalname.split('.').pop().toLowerCase();
    
    let params = {
      folder: 'job-portal-resumes',
      resource_type: 'auto'
    };

    // If it's a PDF, Cloudinary requires format: 'pdf' to render properly 
    // and keep the .pdf extension in the URL.
    if (ext === 'pdf') {
      params.format = 'pdf';
      params.resource_type = 'raw'; // Must use 'raw' for PDFs due to modern Cloudinary HTTP restrictions
    } 
    // For other documents, use raw to prevent image conversion attempts
    else if (['doc', 'docx', 'txt'].includes(ext)) {
      params.resource_type = 'raw';
      params.format = ext;
    }
    
    return params;
  },
});

const upload = multer({ storage: storage });

module.exports = {
  cloudinary,
  upload
};

const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, upload.single('resumeFile'), updateUserProfile);

module.exports = router;

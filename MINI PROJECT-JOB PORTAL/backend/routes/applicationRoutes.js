const express = require('express');
const router = express.Router({ mergeParams: true });
const { applyForJob, getJobApplicants, getAppliedJobs, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

// For routes like /api/jobs/:jobId/apply
router.post('/apply', protect, authorize('seeker'), upload.single('resumeFile'), applyForJob);

// For routes like /api/jobs/:jobId/applicants
router.get('/applicants', protect, authorize('recruiter'), getJobApplicants);

// For /api/applications (no jobId parameter)
router.get('/', protect, authorize('seeker'), getAppliedJobs);

// For updating application status
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;

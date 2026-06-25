const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getJobs)
    .post(protect, authorize('recruiter'), createJob);

router.route('/:id')
    .get(getJob)
    .put(protect, authorize('recruiter'), updateJob)
    .delete(protect, authorize('recruiter'), deleteJob);

module.exports = router;

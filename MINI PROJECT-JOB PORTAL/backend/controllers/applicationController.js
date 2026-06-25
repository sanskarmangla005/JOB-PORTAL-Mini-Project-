const Application = require('../models/Application');
const Job = require('../models/Job');
const sendDecisionEmail = require('../utils/sendEmail');

// @desc    Apply for a job
// @route   POST /api/jobs/:jobId/apply
// @access  Private (Seeker only)
const applyForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // First try to use the uploaded file URL from Cloudinary (req.file.path)
        let finalResumeUrl = req.user.profile?.resumeUrl || req.body.resumeUrl || 'Not Provided';
        if (req.file && req.file.path) {
            finalResumeUrl = req.file.path;
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user.id,
            resumeUrl: finalResumeUrl
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applicants for a job
// @route   GET /api/jobs/:jobId/applicants
// @access  Private (Recruiter owner only)
const getJobApplicants = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if recruiter owns the job
        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to view these applicants' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email profile.skills profile.resumeUrl');

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applied jobs for a user
// @route   GET /api/applications
// @access  Private (Seeker only)
const getAppliedJobs = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate({
                path: 'job',
                select: 'title companyName location salary'
            });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter owner only)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id)
            .populate('job')
            .populate('applicant', 'name email');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if user is the recruiter of the job
        if (application.job.recruiter.toString() !== req.user.id) {
             return res.status(403).json({ message: 'Not authorized to update this status' });
        }

        if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
             return res.status(400).json({ message: 'Invalid status' });
        }

        application.status = status;
        await application.save();

        // Send Email Notification (non-blocking)
        if ((status === 'accepted' || status === 'rejected') && application.applicant?.email) {
            sendDecisionEmail({
                to: application.applicant.email,
                name: application.applicant.name,
                jobTitle: application.job.title,
                companyName: application.job.companyName,
                status: status
            });
        }

        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyForJob,
    getJobApplicants,
    getAppliedJobs,
    updateApplicationStatus
};

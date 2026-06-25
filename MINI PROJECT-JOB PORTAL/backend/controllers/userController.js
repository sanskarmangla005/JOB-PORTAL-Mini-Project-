const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            
            // Allow email updates if no conflict
            if (req.body.email && req.body.email !== user.email) {
                const emailExists = await User.findOne({ email: req.body.email });
                if (emailExists) {
                    return res.status(400).json({ message: 'Email already in use' });
                }
                user.email = req.body.email;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            // Update profile fields based on role
            if (user.role === 'seeker') {
                user.profile.skills = req.body.skills ? req.body.skills.split(',').map(skill => skill.trim()) : user.profile.skills;
                
                if (req.file && req.file.path) {
                    user.profile.resumeUrl = req.file.path;
                } else if (req.body.resumeUrl) {
                    user.profile.resumeUrl = req.body.resumeUrl;
                }
            } else if (user.role === 'recruiter') {
                user.profile.companyName = req.body.companyName || user.profile.companyName;
                user.profile.companyDescription = req.body.companyDescription || user.profile.companyDescription;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profile: updatedUser.profile
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile
};

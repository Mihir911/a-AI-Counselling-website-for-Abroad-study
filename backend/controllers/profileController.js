const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Create or update profile (onboarding)
// @route   POST /api/profile
exports.createProfile = async (req, res) => {
    try {
        const profileData = { ...req.body, userId: req.user._id };

        let profile = await Profile.findOne({ userId: req.user._id });

        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { userId: req.user._id },
                profileData,
                { new: true, runValidators: true }
            );
        } else {
            profile = await Profile.create(profileData);
        }

        // Mark onboarding as complete
        await User.findByIdAndUpdate(req.user._id, {
            onboardingComplete: true,
            currentStage: 2
        });

        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/profile
exports.getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found. Please complete onboarding.' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update profile
// @route   PUT /api/profile
exports.updateProfile = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get profile strength analysis
// @route   GET /api/profile/strength
exports.getProfileStrength = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Calculate strengths
        const strength = {
            academics: 'average',
            exams: 'not_started',
            sop: profile.sopStatus,
            overall: 0
        };

        // Academic strength
        if (profile.gpa >= 8) strength.academics = 'strong';
        else if (profile.gpa >= 6) strength.academics = 'average';
        else strength.academics = 'weak';

        // Exam readiness
        const examStatuses = [profile.ieltsStatus, profile.greStatus];
        if (examStatuses.every(s => s === 'completed')) strength.exams = 'completed';
        else if (examStatuses.some(s => s === 'preparing' || s === 'scheduled')) strength.exams = 'in_progress';
        else strength.exams = 'not_started';

        // Overall score (0-100)
        let score = 0;
        if (strength.academics === 'strong') score += 40;
        else if (strength.academics === 'average') score += 25;
        else score += 10;

        if (strength.exams === 'completed') score += 30;
        else if (strength.exams === 'in_progress') score += 15;

        if (profile.sopStatus === 'ready') score += 30;
        else if (profile.sopStatus === 'draft') score += 15;

        strength.overall = score;

        res.json(strength);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

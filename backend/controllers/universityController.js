const University = require('../models/University');
const Profile = require('../models/Profile');

// @desc    Get all universities
// @route   GET /api/universities
exports.getUniversities = async (req, res) => {
    try {
        const { country, program, maxTuition } = req.query;
        let query = {};

        if (country) query.country = country;
        if (program) query.programs = { $in: [program] };
        if (maxTuition) query.tuitionPerYear = { $lte: parseInt(maxTuition) };

        const universities = await University.find(query).sort({ ranking: 1 });
        res.json(universities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single university
// @route   GET /api/universities/:id
exports.getUniversity = async (req, res) => {
    try {
        const university = await University.findById(req.params.id);
        if (!university) {
            return res.status(404).json({ message: 'University not found' });
        }
        res.json(university);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recommended universities based on profile
// @route   GET /api/universities/recommend
exports.getRecommendations = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });
        if (!profile) {
            return res.status(400).json({ message: 'Complete your profile first' });
        }

        // Get budget range in numbers
        const budgetMap = {
            'below_20k': 20000,
            '20k_40k': 40000,
            '40k_60k': 60000,
            'above_60k': 100000
        };
        const maxBudget = budgetMap[profile.budgetRange] || 50000;

        // Find matching universities
        let universities = await University.find({
            country: { $in: profile.preferredCountries },
            programs: { $in: [profile.fieldOfStudy] },
            tuitionPerYear: { $lte: maxBudget }
        });

        // Categorize universities
        const categorized = {
            dream: [],
            target: [],
            safe: []
        };

        universities.forEach(uni => {
            const gpaMatch = !uni.requirements?.minGPA || profile.gpa >= uni.requirements.minGPA;
            const acceptanceRate = uni.acceptanceRate || 50;

            // Determine category based on acceptance rate and requirements
            if (acceptanceRate < 20 || (uni.requirements?.minGPA && profile.gpa < uni.requirements.minGPA + 0.5)) {
                if (categorized.dream.length < 3) {
                    categorized.dream.push({
                        ...uni.toObject(),
                        fitReason: 'Competitive admission, but your profile shows potential',
                        riskLevel: 'high'
                    });
                }
            } else if (acceptanceRate < 50 || gpaMatch) {
                if (categorized.target.length < 4) {
                    categorized.target.push({
                        ...uni.toObject(),
                        fitReason: 'Good match for your academic profile and budget',
                        riskLevel: 'medium'
                    });
                }
            } else {
                if (categorized.safe.length < 3) {
                    categorized.safe.push({
                        ...uni.toObject(),
                        fitReason: 'High acceptance rate with good program quality',
                        riskLevel: 'low'
                    });
                }
            }
        });

        res.json(categorized);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

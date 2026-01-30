const Shortlist = require('../models/Shortlist');
const University = require('../models/University');
const User = require('../models/User');
const Todo = require('../models/Todo');

// @desc    Add university to shortlist
// @route   POST /api/shortlist
exports.addToShortlist = async (req, res) => {
    try {
        const { universityId, category, aiReason, riskLevel } = req.body;

        // Check if already shortlisted
        const existing = await Shortlist.findOne({
            userId: req.user._id,
            universityId
        });

        if (existing) {
            return res.status(400).json({ message: 'University already in shortlist' });
        }

        const shortlist = await Shortlist.create({
            userId: req.user._id,
            universityId,
            category,
            aiReason,
            riskLevel
        });

        const populated = await Shortlist.findById(shortlist._id).populate('universityId');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's shortlist
// @route   GET /api/shortlist
exports.getShortlist = async (req, res) => {
    try {
        const shortlist = await Shortlist.find({ userId: req.user._id })
            .populate('universityId')
            .sort({ category: 1, createdAt: -1 });
        res.json(shortlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove from shortlist
// @route   DELETE /api/shortlist/:id
exports.removeFromShortlist = async (req, res) => {
    try {
        const shortlist = await Shortlist.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!shortlist) {
            return res.status(404).json({ message: 'Not found in shortlist' });
        }

        if (shortlist.locked) {
            return res.status(400).json({ message: 'Cannot remove locked university. Unlock first.' });
        }

        await shortlist.deleteOne();
        res.json({ message: 'Removed from shortlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lock university
// @route   PUT /api/shortlist/:id/lock
exports.lockUniversity = async (req, res) => {
    try {
        const shortlist = await Shortlist.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!shortlist) {
            return res.status(404).json({ message: 'Not found in shortlist' });
        }

        shortlist.locked = true;
        shortlist.lockedAt = new Date();
        await shortlist.save();

        // Update user stage
        await User.findByIdAndUpdate(req.user._id, { currentStage: 4 });

        // Generate initial todos for this university
        const university = await University.findById(shortlist.universityId);
        const todos = [
            { task: `Research ${university.name} admission requirements`, category: 'general', priority: 'high' },
            { task: `Prepare SOP for ${university.name}`, category: 'document', priority: 'high' },
            { task: 'Complete IELTS/TOEFL if not done', category: 'exam', priority: 'high' },
            { task: 'Gather academic transcripts', category: 'document', priority: 'medium' },
            { task: 'Get letters of recommendation', category: 'document', priority: 'medium' },
            { task: `Check application deadline for ${university.name}`, category: 'application', priority: 'high' }
        ];

        for (const todo of todos) {
            await Todo.create({
                userId: req.user._id,
                universityId: shortlist.universityId,
                ...todo
            });
        }

        const populated = await Shortlist.findById(shortlist._id).populate('universityId');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unlock university
// @route   PUT /api/shortlist/:id/unlock
exports.unlockUniversity = async (req, res) => {
    try {
        const shortlist = await Shortlist.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!shortlist) {
            return res.status(404).json({ message: 'Not found in shortlist' });
        }

        shortlist.locked = false;
        shortlist.lockedAt = null;
        await shortlist.save();

        // Check if any other universities are locked
        const lockedCount = await Shortlist.countDocuments({
            userId: req.user._id,
            locked: true
        });

        if (lockedCount === 0) {
            await User.findByIdAndUpdate(req.user._id, { currentStage: 3 });
        }

        const populated = await Shortlist.findById(shortlist._id).populate('universityId');
        res.json({
            shortlist: populated,
            warning: 'University unlocked. Your application guidance and todos for this university remain but may become outdated.'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check if user has locked universities
// @route   GET /api/shortlist/locked
exports.getLockedUniversities = async (req, res) => {
    try {
        const locked = await Shortlist.find({
            userId: req.user._id,
            locked: true
        }).populate('universityId');
        res.json(locked);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

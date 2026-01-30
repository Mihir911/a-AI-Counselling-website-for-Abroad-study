const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Academic Background
    educationLevel: {
        type: String,
        enum: ['high_school', 'bachelors', 'masters', 'phd'],
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    graduationYear: {
        type: Number,
        required: true
    },
    gpa: {
        type: Number,
        min: 0,
        max: 10
    },
    // Study Goals
    intendedDegree: {
        type: String,
        enum: ['bachelors', 'masters', 'mba', 'phd'],
        required: true
    },
    fieldOfStudy: {
        type: String,
        required: true
    },
    targetIntake: {
        type: String,
        required: true
    },
    preferredCountries: [{
        type: String
    }],
    // Budget
    budgetRange: {
        type: String,
        enum: ['below_20k', '20k_40k', '40k_60k', 'above_60k'],
        required: true
    },
    fundingPlan: {
        type: String,
        enum: ['self_funded', 'scholarship', 'loan', 'mixed'],
        required: true
    },
    // Exams & Readiness
    ieltsStatus: {
        type: String,
        enum: ['not_started', 'preparing', 'scheduled', 'completed'],
        default: 'not_started'
    },
    ieltsScore: {
        type: Number,
        min: 0,
        max: 9
    },
    greStatus: {
        type: String,
        enum: ['not_required', 'not_started', 'preparing', 'scheduled', 'completed'],
        default: 'not_started'
    },
    greScore: {
        type: Number,
        min: 260,
        max: 340
    },
    sopStatus: {
        type: String,
        enum: ['not_started', 'draft', 'ready'],
        default: 'not_started'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);

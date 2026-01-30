const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    universityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: true
    },
    category: {
        type: String,
        enum: ['dream', 'target', 'safe'],
        required: true
    },
    locked: {
        type: Boolean,
        default: false
    },
    lockedAt: {
        type: Date
    },
    aiReason: {
        type: String
    },
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high']
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate entries
shortlistSchema.index({ userId: 1, universityId: 1 }, { unique: true });

module.exports = mongoose.model('Shortlist', shortlistSchema);

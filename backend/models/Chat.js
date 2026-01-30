const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        actions: [{
            type: {
                type: String,
                enum: ['shortlist', 'lock', 'todo', 'unlock']
            },
            data: mongoose.Schema.Types.Mixed
        }]
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);

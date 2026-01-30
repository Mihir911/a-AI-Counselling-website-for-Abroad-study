const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String
    },
    ranking: {
        type: Number
    },
    tuitionPerYear: {
        type: Number,
        required: true
    },
    acceptanceRate: {
        type: Number,
        min: 0,
        max: 100
    },
    programs: [{
        type: String
    }],
    requirements: {
        minGPA: Number,
        minIELTS: Number,
        minGRE: Number,
        requiresGRE: Boolean
    },
    description: String,
    website: String
}, {
    timestamps: true
});

module.exports = mongoose.model('University', universitySchema);

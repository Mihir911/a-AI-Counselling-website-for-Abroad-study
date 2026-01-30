require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const University = require('./models/University');
const universities = require('./data/universities.json');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/universities', require('./routes/universities'));
app.use('/api/shortlist', require('./routes/shortlist'));
app.use('/api/todos', require('./routes/todos'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Seed universities if empty
const seedUniversities = async () => {
    try {
        const count = await University.countDocuments();
        if (count === 0) {
            await University.insertMany(universities);
            console.log('Universities seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding universities:', error);
    }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    seedUniversities();
});

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () { return !this.googleId; }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Progress Tracking
    stats: {
        lettersLearned: [{
            letter: String,
            date: { type: Date, default: Date.now }
        }],
        practiceSessions: { type: Number, default: 0 },
        quizScores: [{
            score: Number,
            total: Number,
            date: { type: Date, default: Date.now }
        }]
    },
    achievements: [{
        id: String,
        date: { type: Date, default: Date.now }
    }],
    recentActivity: [{
        type: { type: String, enum: ['learn', 'practice', 'quiz'] },
        description: String,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('User', UserSchema);

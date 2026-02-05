const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/progress/learn
// @desc    Log a learned letter
// @access  Private
router.post('/learn', auth, async (req, res) => {
    const { letter } = req.body;
    try {
        const user = await User.findById(req.user.id);

        // Check if already learned
        const alreadyLearned = user.stats.lettersLearned.some(l => l.letter === letter);

        if (!alreadyLearned) {
            user.stats.lettersLearned.push({ letter });
            user.recentActivity.unshift({
                type: 'learn',
                description: `Learned letter ${letter}`
            });
            // Keep recent activity limited to last 10
            if (user.recentActivity.length > 10) user.recentActivity.pop();

            await user.save();
        }

        // Update Streak
        await user.updateStreak();

        res.json(user.stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/progress/practice
// @desc    Log a practice session
// @access  Private
router.post('/practice', auth, async (req, res) => {
    const { letter } = req.body; // Optional: track which letter was practiced
    try {
        const user = await User.findById(req.user.id);

        user.stats.practiceSessions += 1;
        user.recentActivity.unshift({
            type: 'practice',
            description: letter ? `Practiced writing ${letter}` : 'Completed a practice session'
        });
        if (user.recentActivity.length > 10) user.recentActivity.pop();

        await user.save();

        // Update Streak
        await user.updateStreak();

        res.json(user.stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/progress/quiz
// @desc    Log a quiz score
// @access  Private
router.post('/quiz', auth, async (req, res) => {
    const { score, total } = req.body;
    try {
        const user = await User.findById(req.user.id);

        user.stats.quizScores.push({ score, total });
        user.recentActivity.unshift({
            type: 'quiz',
            description: `Scored ${score}/${total} on a quiz`
        });
        if (user.recentActivity.length > 10) user.recentActivity.pop();

        await user.save();

        // Update Streak
        await user.updateStreak();

        res.json(user.stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/progress/stats
// @desc    Get user stats
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json({
            stats: user.stats,
            achievements: user.achievements,
            recentActivity: user.recentActivity,
            // Calculate derived stats
            totalLetters: user.stats.lettersLearned.length,
            averageQuizScore: user.stats.quizScores.length > 0
                ? Math.round(user.stats.quizScores.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / user.stats.quizScores.length)
                : 0
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

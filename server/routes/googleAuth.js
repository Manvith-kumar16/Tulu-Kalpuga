const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ msg: "No token provided" });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email, sub: googleId, picture } = ticket.getPayload();
        console.log("Google Auth Payload:", { name, email, googleId });

        let user = await User.findOne({ email });

        if (user) {
            // If user exists but no googleId, link it (optional, logic depends on policy)
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                fullName: name,
                email,
                googleId,
                password: crypto.randomBytes(16).toString("hex")
            });
            await user.save();
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email } });
            }
        );

    } catch (err) {
        console.error("Google Auth Error:", err.message);
        if (err.response) {
            console.error("Error Response:", err.response.data);
        }
        res.status(500).json({ msg: "Google Sign-In Failed", error: err.message });
    }
});

module.exports = router;

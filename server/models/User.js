const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    googleId: {
      type: String,
      default: null,
    },

    // 🏆 Progress & Gamification
    stats: {
      lettersLearned: [
        {
          letter: String,
          date: { type: Date, default: Date.now }
        }
      ],
      practiceSessions: { type: Number, default: 0 },
      quizScores: [
        {
          score: Number,
          total: Number,
          date: { type: Date, default: Date.now }
        }
      ]
    },

    achievements: [
      {
        id: String,
        date: { type: Date, default: Date.now }
      }
    ],

    recentActivity: [
      {
        type: { type: String, enum: ['learn', 'quiz', 'practice'] },
        description: String,
        date: { type: Date, default: Date.now }
      }
    ],

    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


// 🔐 Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// 🔐 Compare password during login
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔥 Update Streak Method
UserSchema.methods.updateStreak = async function () {
  const now = new Date();
  const lastActive = new Date(this.lastActive);

  // Reset time to midnight for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const lastDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate()).getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (today === lastDate) {
    // Already active today, do nothing
  } else if (today - lastDate === oneDay) {
    // Consecutive day
    this.streak += 1;
  } else {
    // Streak broken
    this.streak = 1;
  }

  this.lastActive = now;
  await this.save();
};


module.exports = mongoose.model("User", UserSchema);

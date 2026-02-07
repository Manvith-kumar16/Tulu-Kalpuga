const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

/* ================= DATABASE CONNECTION ================= */

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

/* ================= ROUTES ================= */

app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/googleAuth'));
app.use('/api/progress', require('./routes/progress'));

app.get('/', (req, res) => {
  res.send('🚀 Tulu Kalpuga Backend Running');
});

/* ================= ML PROXY ================= */

app.post('/predict', async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5001/predict",
      req.body,
      { headers: { "Content-Type": "application/json" } }
    );

    res.json(response.data);

  } catch (error) {
    console.error("❌ ML Proxy Error:", error.message);
    if (error.response) {
      console.error("ML Response Data:", error.response.data);
    }

    res.status(500).json({
      success: false,
      message: "ML Service unavailable. Start Python ML server."
    });
  }
});

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

/* ================= START SERVER ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

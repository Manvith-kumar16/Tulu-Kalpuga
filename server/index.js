const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/googleAuth')); // Mounts on /api/auth/google

app.use('/api/progress', require('./routes/progress'));


app.get('/', (req, res) => {
  res.send('Tulu Kalpuga Backend Running');
});

// Proxy to Python ML Service
app.post('/predict', async (req, res) => {
  try {
    // Assuming Node 18+ has native fetch. If not, use axios or node-fetch.
    // Since this is a modern project, fetch is likely available.
    const response = await fetch("http://127.0.0.1:5001/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).send(errText);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("ML Proxy Error:", error);
    res.status(500).json({
      error: "ML Service unavailable. Please ensure the Python backend is running."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server error"
  });
});


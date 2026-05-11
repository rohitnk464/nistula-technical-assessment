const express = require('express');
const cors = require('cors');
const messageRoutes = require('./routes/messageRoutes');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Deployment settings: Trust the reverse proxy (e.g., Render, Heroku, AWS ELB)
app.set('trust proxy', 1);

// Production Middleware
app.use(helmet()); // Secure HTTP headers
app.use(morgan('combined')); // HTTP request logging

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// API Key Middleware for webhook
const apiKeyMiddleware = (req, res, next) => {
  if (req.headers["x-api-key"] !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use('/webhook', apiKeyMiddleware, messageRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;

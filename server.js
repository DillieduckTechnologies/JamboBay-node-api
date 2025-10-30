// server.js
const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const API_PREFIX = '/api/v1';

// Built-in middlewares
app.use(express.json());


// API routes
app.use(`${API_PREFIX}/users`, userRoutes);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`JamboBay API running on port ${PORT}`);
});

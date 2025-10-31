const express = require('express');
const dotenv = require('dotenv');

const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerDocs = require('./docs/swagger');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const API_PREFIX = '/api/v1';

// Built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/clients`, clientRoutes);

// Global error handler
app.use(errorHandler);

// ✅ Swagger Docs route
swaggerDocs(app);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`JamboBay API running on port ${PORT}`);
});

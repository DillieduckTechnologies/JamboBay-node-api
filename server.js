const express = require('express');
const dotenv = require('dotenv');

const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const companyRoutes = require('./routes/companyRoutes');
const agentRoutes = require('./routes/agentRoutes');
const AgentReferenceRoutes = require('./routes/agentReferenceRoutes');
const companyMembershipRoutes = require('./routes/companyMembershipRoutes');
const residentialPropertyRoutes = require('./routes/residentiaPropertyRoutes');
const commercialPropertyRoutes = require('./routes/commercialPropertyRoutes');
const leaseRoutes = require('./routes/leaseRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const propertyViewingRoutes = require('./routes/propertyViewingRoutes');
const purchaseApplicationRoutes = require('./routes/purchaseApplicationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const mortgageProviderRoutes = require('./routes/mortgageProviderRoutes');
const mortgageApplicationRoutes = require('./routes/mortgageApplicationRoutes');

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
app.use(`${API_PREFIX}/companies`, companyRoutes);
app.use(`${API_PREFIX}/agents`, agentRoutes);
app.use(`${API_PREFIX}/agent-references`, AgentReferenceRoutes);
app.use(`${API_PREFIX}/company-memberships`, companyMembershipRoutes);
app.use(`${API_PREFIX}/residential-properties`, residentialPropertyRoutes);
app.use(`${API_PREFIX}/leases`, leaseRoutes);
app.use(`${API_PREFIX}/commercial-properties`, commercialPropertyRoutes);
app.use(`${API_PREFIX}/appointments`, appointmentRoutes);
app.use(`${API_PREFIX}/property-viewings`, propertyViewingRoutes);
app.use(`${API_PREFIX}/purchase-applications`, purchaseApplicationRoutes);
app.use(`${API_PREFIX}/chats`, chatRoutes);
app.use(`${API_PREFIX}/mortgage/providers`, mortgageProviderRoutes);
app.use(`${API_PREFIX}/mortgage/applications`, mortgageApplicationRoutes);

// Global error handler
app.use(errorHandler);

// ✅ Swagger Docs route
swaggerDocs(app);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`JamboBay API running on port ${PORT}`);
});

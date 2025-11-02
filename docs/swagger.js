const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JamboBay Node API',
      version: '1.0.0',
      description: 'API documentation for JamboBay built with Express and PostgreSQL',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
      },
    ],
  },

  apis: ['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
}

module.exports = swaggerDocs;

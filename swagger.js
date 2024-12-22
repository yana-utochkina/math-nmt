const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OpenAPI',
      version: '1.0.0',
      description: 'API documentation for OpenAPI',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // базовий URL для API
      },
    ],
  },
  apis: ['./app/api/*.js'], // Шлях до файлів із ендпоїнтами
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
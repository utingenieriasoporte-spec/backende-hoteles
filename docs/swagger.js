const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Hotel API",
    version: "1.0.0",
    description:
      "API para gestion de habitaciones, check-in y servicios de hotel",
  },
  servers: [
    {
      url: "https://backend-hoteles-8k6y.onrender.com/",
      description: "Servidor local",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "./docsRoutes/*.js"),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

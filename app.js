const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/spec.json');

const logger = require('./src/logger');
const expressPino = require('express-pino-logger');

const expressLogger = expressPino({ logger });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressLogger);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require('./src/routes/checkout')(app);
require('./src/routes/healthCheck')(app);

module.exports = app;
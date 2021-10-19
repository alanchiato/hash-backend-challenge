// require('dotenv/config');
const logger = require('./src/logger');
const app = require('./app');
const port = process.env.PORT || 8082;

app.listen(port, ()=> logger.info({ msg: 'hash-challenge-microservice upped', port: port, host: process.env.HOST}));

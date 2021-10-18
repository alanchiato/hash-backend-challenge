const express = require('express');

const routes = express.Router();

routes.get('/', async (req, res) => {
    res.send({ message: 'Service Up' });
})

module.exports = (app) => app.use(routes);
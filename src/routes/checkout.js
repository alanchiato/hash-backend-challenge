const express = require('express');
const { check, validationResult } = require('express-validator');

const routes = express.Router();
const controller = require('../controllers/checkout');

routes.post('/', [
    check('products').isArray().not().isEmpty(),
    check('products.*.id').isInt().not().isEmpty(),
    check('products.*.quantity').isInt({ min: 1 }).not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Invalid payload. Get instructions on /docs' });
    }
    await controller.consolidateCart(req, res);
});

module.exports = (app) => app.use('/checkout', routes);
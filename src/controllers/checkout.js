const services = require('../services/checkout');
const logger = require('../logger');
const _ = require('lodash');


async function consolidateCart(req, res) {
    try {
        const body = _.cloneDeep(req.body);
        const products = body.products;
        const outOfStock = services.isOutOfStock(products);

        if (outOfStock.length > 0) {
            logger.warn({ msg: 'product(s) out of stock', info: outOfStock });
            return res.status(400).send({ message: 'product(s) out off stock', outOfStock: outOfStock });
        }

        const checkout = await services.composeCheckout(products);
        res.status(200).send(checkout);
    }
    catch (e) {
        logger.error({ msg: 'something is wrong', info: e.message });
        res.status(500).send({ message: 'something is wrong' });
    }
}

module.exports = { consolidateCart };

const logger = require('../logger');
const productsDatabase = require('../database/products.json');
const { myClient } = require('../grcp/discount');

function isOutOfStock(products) {
    let productsOff = [];

    for (let i = 0; i < products.length; i++) {
        if (productsDatabase.find(productDatabase => productDatabase.id === products[i].id) === undefined) {
            productsOff.push(products[i]);
        }
    }
    return productsOff;
}

async function composeCheckout(products) {
    const checkout = {};
    const productsList = await composeProductList(products);

    let total_amount = 0;
    let total_amount_with_discount = 0; 
    let total_discount = 0;

    for (let i = 0; i < productsList.length; i++) {
        total_amount += productsList[i].total_amount;
        total_discount += productsList[i].discount;
        total_amount_with_discount += productsList[i].total_amount - productsList[i].discount;
    }

    checkout.total_amount = total_amount
    checkout.total_amount_with_discount = total_amount_with_discount;
    checkout.total_discount = total_discount;
    checkout.products = productsList;

    return checkout;
}

async function composeProductList(products) {
    
    const _products = [];
    const specialDay = isBlackFriday();

    if (specialDay) {
        const gift = productsDatabase.find(productDatabase => productDatabase.is_gift === true);
        if (!gift) {
            logger.warn({ msg: 'gifts is out of stock' });
        } else {
            products.push({ id: gift.id, quantity: 1, special: true });
        }
    }

    for (let i = 0; i < products.length; i++) {
        const discount = products[i].special ? 0 : await getDiscount(products[i].id, myClient).then(percentage => {
            return percentage.toFixed(2);
        });

        const productData = productsDatabase.find(productDatabase => productDatabase.id === products[i].id);
        const _product = {};
        _product.id = products[i].id;
        _product.quantity = products[i].special ? 0 : products[i].quantity;
        _product.unit_amount = products[i].special ? 0 : productData.amount;
        _product.total_amount = products[i].special ? 0 : products[i].quantity * productData.amount;
        _product.discount = discount != null ? Math.round(_product.total_amount * discount) : 0;
        _product.is_gift = products[i].special ? true : false;

        _products.push(_product);
    }
    return _products;
}

async function getDiscount(product) {
    
    try {
        const { percentage } = await myClient.getDiscountSync({ productID: product.id }, { Deadline: 20000 });
        return percentage;
    } catch(e) {
        logger.warn({msg: 'discount service is out', info: e.message});
        return parseFloat(0);
    }
}

function isBlackFriday() {
    const today = new Date().toLocaleDateString();

    const isBlackFriday = today === process.env.BF_DAY ? true : false;

    return isBlackFriday;
}

module.exports = { isOutOfStock, composeCheckout }

require('dotenv/config');
const request = require('supertest');
const app = require('../app');

describe('health check', () => {
    it('testing health check endpoint', async () => {
        const res = await request(app).get('/')
        expect(res.statusCode).toEqual(200);
    })
})

describe('checkout route', () => {
    it('testing post /checkout on success', async () => {
        const payload = {
            products: [{
                id: 1,
                quantity: 2
            },
            {
                id: 2,
                quantity: 2
            },
            {
                id: 3,
                quantity: 2
            }]
        }
        const res = await request(app)
            .post('/checkout')
            .send(payload)
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("total_amount");
        expect(res.body).toHaveProperty("total_amount_with_discount");
        expect(res.body).toHaveProperty("total_discount");
        expect(res.body).toHaveProperty("products");
        expect(res.body.products.length).toEqual(payload.products.length);
    })

    it('testing post /checkout products out of stock error', async () => {
        const res = await request(app)
            .post('/checkout')
            .send({
                products: [{
                    id: 1,
                    quantity: 2
                },
                {
                    id: 2,
                    quantity: 2
                },
                {
                    id: -56,
                    quantity: 2
                }]
            })
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("outOfStock");
        expect(res.body.outOfStock.length).toBeGreaterThan(0);
    })

    it('testing post /checkout with entity error', async () => {
        const res = await request(app)
            .post('/checkout')
            .send({
                products: [{
                    id: 1
                },
                {
                    id: 2,
                    quantity: 2
                },
                {
                    id: 3,
                    quantity: 2
                }]
            })
        expect(res.statusCode).toEqual(422);
        expect(res.body).toHaveProperty("message");
    })

    it('testing post /checkout on black friday', async () => {
        const today = new Date().toLocaleDateString();
        process.env.BF_DAY = today;

        const payload = {
            products: [{
                id: 1,
                quantity: 2
            },
            {
                id: 2,
                quantity: 2
            },
            {
                id: 3,
                quantity: 2
            }]
        }
        const res = await request(app)
            .post('/checkout')
            .send(payload);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("total_amount");
        expect(res.body).toHaveProperty("total_amount_with_discount");
        expect(res.body).toHaveProperty("total_discount");
        expect(res.body).toHaveProperty("products");
        expect(res.body.products.length).toEqual(payload.products.length + 1);
    })
})
const express = require('express');
const router = express.Router();
const { getStripe } = require('../helper/stripe');

router.post('/create-payment-intent', async (req, res) => {
    const stripe = getStripe();
    if (!stripe) {
        return res.status(503).json({
            error: 'Stripe is not configured. Set STRIPE_SECRET_KEY on the server.',
        });
    }

    const { amount, currency = 'thb' } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/balance', async (req, res) => {
    const stripe = getStripe();
    if (!stripe) {
        return res.status(503).json({
            error: 'Stripe is not configured. Set STRIPE_SECRET_KEY on the server.',
        });
    }

    try {
        const balance = await stripe.balance.retrieve();
        res.json(balance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

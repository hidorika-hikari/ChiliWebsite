const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
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
    try {
        const balance = await stripe.balance.retrieve();
        res.json(balance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
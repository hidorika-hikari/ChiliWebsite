const Stripe = require('stripe');

function getStripeSecret() {
  return (
    process.env.STRIPE_SECRET_KEY || process.env.REACT_APP_STRIPE_SECRET_KEY
  );
}

function getStripe() {
  const secret = getStripeSecret();
  if (!secret) return null;
  return new Stripe(secret);
}

module.exports = { getStripe, getStripeSecret };

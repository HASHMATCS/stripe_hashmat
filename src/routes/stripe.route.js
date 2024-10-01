const express = require('express');
const { createCheckoutSession ,webhookController} = require('../controller/stripe.controller'); // Import controller

const router = express.Router();

// POST route for creating checkout session
router.post('/create-checkout-session', createCheckoutSession);
router.post('/webhook', webhookController);

module.exports = router;
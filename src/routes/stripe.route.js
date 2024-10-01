const router = express.Router();
const { createCheckoutSession, webhookController } = require('../controller/stripe.controller');
const bodyParser = require('body-parser');

// Create checkout session route
router.post('/create-checkout-session', createCheckoutSession);

// Webhook route with raw body parsing for Stripe signature verification
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), webhookController);

module.exports = router;

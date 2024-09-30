const stripe = require('stripe')('stripekey');


const createCheckoutSession = async (amount, currency, origin) => {
  try {

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency,
          product_data: {
            name: 'Test Product',
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });
  
    return { id: session.id };
  } catch (error) {
    throw new Error(error.message);
  }
};


const handleWebhook = async (req) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        throw new Error(`Webhook Error: ${err.message}`);
    }

    const eventHandlers = {
        'checkout.session.completed': async (session) => {
            // Handle successful payment here (e.g., update database)
            console.log('Payment was successful!', session);
        },
        // Add more event handlers as needed
    };

    const handler = eventHandlers[event.type];

    if (handler) {
        await handler(event.data.object);
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
};
module.exports = { createCheckoutSession,handleWebhook };

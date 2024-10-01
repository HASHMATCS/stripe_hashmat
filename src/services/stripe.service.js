const stripe = require('stripe')('sk_test_51Q4mm4D5VW5CurvPr1QJUAZBunK6sbGwl74Zez7g62eEg6Wi80NyNSEqEqDw8z7I0a0Qig2A8k9j7MHYLJis8n4M00fc2tyCuo');

const createCheckoutSession = async (amount, currency, origin) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency,
          product_data: { name: 'Test Product' },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    console.log('Checkout session created:', session); // Add this line for debugging
    return { id: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error.message); // Add error logging
    throw new Error(error.message);
  }
};

const handleWebhook = async (req) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('Received event:', event.type); // Add this line to log the event type
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  const eventHandlers = {
    'checkout.session.completed': async (session) => {
      console.log('Payment was successful:', session); // Handle successful payment
    },
  };

  const handler = eventHandlers[event.type];
  if (handler) {
    await handler(event.data.object);
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  return { received: true };
};


module.exports = { createCheckoutSession, handleWebhook };
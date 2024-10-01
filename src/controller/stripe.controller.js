const { createCheckoutSession } = require('../services/stripe.service'); // Import the service

exports.createCheckoutSession = async (req, res) => {
  const { amount, currency } = req.body;

  try {
 
    const session = await createCheckoutSession(amount, currency, 'https://stripe-hashmat.vercel.app/');

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.webhookController = async (req, res) => {
  try {
    const response = await handleWebhook(req);
    res.json(response);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

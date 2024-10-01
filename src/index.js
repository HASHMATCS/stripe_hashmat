// Only use body-parser for non-webhook routes
const express = require('express');
const bodyParser = require('body-parser');
const stripeRoutes = require('./routes/stripe.route');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://stripe-hashmat.vercel.app', // Frontend URL
}));

// Use body-parser for all non-webhook routes
app.use((req, res, next) => {
    if (req.originalUrl === '/stripe/webhook') {
        next(); // Skip body-parser for webhook
    } else {
        bodyParser.json()(req, res, next);
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/stripe', stripeRoutes);

// Success and cancel routes
app.get('/success', (req, res) => {
    res.send('<h1>Payment Successful!</h1><p>Thank you for your purchase!</p>');
});

app.get('/cancel', (req, res) => {
    res.send('<h1>Payment Canceled</h1><p>Your payment was not completed.</p>');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

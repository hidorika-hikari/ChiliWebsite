require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
console.log('CORS middleware loaded');

//const authJwt = require('./helper/jwt');
//app.use(authJwt());
//console.log('authJwt loaded');

app.use(express.json());
console.log('JSON middleware loaded');

// Routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const subCatSchema = require('./routes/subCat');
const productWeightRoutes = require('./routes/productWeight');
const productRamsRoutes = require('./routes/productRams');
const productSizeRoutes = require('./routes/productSize');
const userRoutes = require('./routes/user');
const cart = require('./routes/cart');
const productReviews = require('./routes/productReviews');
const myListSchema = require('./routes/myList');
const ordersSchema = require('./routes/orders');
const paymentRoutes = require('./routes/payment');

app.use('/api/payment', paymentRoutes);
app.use('/api/orders', ordersSchema);
app.use('/api/my-list', myListSchema);
app.use('/api/productReviews', productReviews);
app.use('/api/user', userRoutes);
app.use('/api/cart', cart);
app.use('/api/subCat', subCatSchema);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/productWeight', productWeightRoutes);
app.use('/api/productRams', productRamsRoutes);
app.use('/api/productSize', productSizeRoutes);

app.post('/api/payment/create-payment-intent', async (req, res) => {
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


app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});
console.log('Basic route registered');

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Database connected');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database error:', err);
    });
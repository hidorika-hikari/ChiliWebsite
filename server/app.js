require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const allowedOrigins = (process.env.CORS_ORIGINS ||
    'http://localhost:3000,http://localhost:3001,https://darling-daffodil-678558.netlify.app')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
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
const homeBannerSchema = require('./routes/homeBanner');
const searchRoute = require('./routes/search');
const contactRoutes = require('./routes/contact');

app.use('/api/search', searchRoute);
app.use('/api/homeBanner', homeBannerSchema);
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
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});
console.log('Basic Route Registered');

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

if (!process.env.CONNECTION_STRING) {
    console.error(
        'CONNECTION_STRING is not set. See DEPLOY.md'
    );
} else {
    mongoose
        .connect(process.env.CONNECTION_STRING)
        .then(() => console.log('Database connected'))
        .catch((err) => {
            console.error('Database error:', err.message);
            console.error(
                'Check CONNECTION_STRING and MongoDB Atlas Network Access (allow 0.0.0.0/0).'
            );
        });
}
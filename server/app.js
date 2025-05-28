const express = require('express');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config();

// Basic middleware first
app.use(express.json());
console.log('JSON middleware loaded');

// Routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products')

app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);

// Basic test route to see if Express works at all
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});
console.log('Basic route registered');

// Remove these deprecated options:
mongoose.connect(process.env.CONNECTION_STRING ,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})  // Clean connection
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
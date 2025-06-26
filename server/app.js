const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

require('dotenv').config();


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // Only if you're using cookies or auth headers
}));
console.log('CORS middleware loaded');

// Basic middleware first
app.use(express.json());
console.log('JSON middleware loaded');

// Routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const subCatSchema = require('./routes/subCat')

app.use('/api/subCat', subCatSchema);
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
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
console.log('CORS middleware loaded');

app.use(express.json());
console.log('JSON middleware loaded');

// Routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const subCatSchema = require('./routes/subCat');
const productWeightRoutes = require('./routes/productWeight');
const productRamsRoutes = require('./routes/productRams')
const productSizeRoutes = require('./routes/productSize')

app.use('/api/subCat', subCatSchema);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/productWeight',productWeightRoutes);
app.use('/api/productRams',productRamsRoutes);
app.use('/api/productSize',productSizeRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});
console.log('Basic route registered');

mongoose.connect(process.env.CONNECTION_STRING ,{
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
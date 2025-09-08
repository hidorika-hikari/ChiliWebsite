const express = require('express');
const router = express.Router();
const { Product } = require('../models/products');

router.get('/', async (req, res) => {
    try {
        const query = req.query.q?.trim();
        if (!query) {
            return res.status(400).json({ msg: 'Query is required' });
        }

        const items = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } },
            ]
        }).populate('category');

        const filteredItems = items.filter(item =>
            item.category?.name?.toLowerCase().includes(query.toLowerCase()) ||
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.brand.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredItems.length === 0) {
            return res.status(404).json({ msg: 'No products found matching your search' });
        }

        res.json(filteredItems);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({
            msg: 'Database error',
            error: err.message
        });
    }
});

module.exports = router;
const { Product } = require('../models/products.js');
const { Category } = require('../models/category.js');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const productList = await Product.find().populate("category");

    if (!productList) {
        return res.status(500).json({ success: false });
    }
    res.send(productList);
});

module.exports = router;
const { Product } = require('../models/products.js');
const { Category } = require('../models/category.js');
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');

router.get('/', async (req, res) => {
    const productList = await Product.find().populate("category");

    if (!productList) {
        return res.status(500).json({ success: false });
    }
    res.send(productList);
});

router.post('/create', async (req, res) => {
    if (!Array.isArray(req.body.images)) {
        return res.status(400).json({
            error: "'images' must be an array",
            status: false
        });
    }

    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(404).send("Invalid Category");
    }

    const limit = pLimit(2);

    const imagesToUpload = req.body.images.map((image) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(image);
            return result;
        });
    });

    const uploadStatus = await Promise.all(imagesToUpload);
    const imgurl = uploadStatus.map((item) => item.secure_url);

    if (!uploadStatus) {
        return res.status(500).json({
            error: "Images couldn't be uploaded",
            status: false
        });
    }

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        image: imgurl, // <-- fix: use `imgurl` not req.body.images
        brands: req.body.brands,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    product = await product.save();
    if (!product) {
        return res.status(500).json({ error: "Product creation failed", success: false });
    }

    res.status(201).json(product);
});

module.exports = router;
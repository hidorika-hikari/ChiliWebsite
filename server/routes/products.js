const { Product } = require('../models/products.js');
const { Category } = require('../models/category.js');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');

// GET all products with pagination
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const totalPosts = await Product.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
        return res.status(404).json({ message: "Page not found" });
    }

    const productList = await Product.find()
        .populate('category', 'name')
        .populate('subCat')
        .populate('productSize')
        .populate('productWeight')
        .populate('productRams')
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();

    if (!productList) {
        return res.status(500).json({ success: false });
    }

    return res.status(200).json({
        products: productList,
        totalPages,
        page
    });
});

// GET featured products
router.get('/featured', async (req, res) => {
    const productList = await Product.find({ isFeatured: false });
    if (!productList) {
        return res.status(500).json({ success: false });
    }
    return res.status(200).json(productList);
});

// POST create a new product
router.post('/create', async (req, res) => {
    if (!Array.isArray(req.body.images)) {
        return res.status(400).jsown({
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
        subCat: req.body.subCat || null,
        description: req.body.description,
        images: imgurl,
        brand: req.body.brand,
        price: req.body.price,
        oldPrice: req.body.oldPrice,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        //numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        discount: req.body.discount,
        productRams: req.body.productRams,
        productSize: req.body.productSize,
        productWeight: req.body.productWeight
    });

    product = await product.save();
    if (!product) {
        return res.status(500).json({ error: "Product creation failed", success: false });
    }
    res.status(201).json(product);
});

// GET product by ID
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json(product);
});

// PUT update product by ID
router.put('/:id', async (req, res) => {
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

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            subCat: req.body.subCat || null,
            description: req.body.description,
            images: imgurl,
            brand: req.body.brand,
            price: req.body.price,
            oldPrice: req.body.oldPrice,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            // numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
            discount: req.body.discount,
            productRams: req.body.productRams,
            productSize: req.body.productSize,
            productWeight: req.body.productWeight
        },
        { new: true }
    );

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product cant be updated"
        });
    }
    res.status(200).json({
        message: "Product updated successfully",
        success: true,
    });
});

// DELETE product by ID
router.delete('/:id', async (req, res) => {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deleteProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
});

module.exports = router;
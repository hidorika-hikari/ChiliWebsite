const { Product } = require('../models/products.js');
const { Category } = require('../models/category.js');
const { RecentlyView } = require('../models/recentlyView.js')
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const { category, subCat, minPrice, maxPrice, rating } = req.query;

        let filter = {};
        if (category && category !== 'null' && category !== 'undefined') {
            filter.category = category;
        }
        if (subCat && subCat !== 'null' && subCat !== 'undefined') {
            filter.subCat = subCat;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseInt(minPrice);
            if (maxPrice) filter.price.$lte = parseInt(maxPrice);
        }
        if (rating) {
            const r = parseInt(rating);
            filter.rating = { $gte: r, $lt: r + 1 };
        }
        const totalPosts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages && totalPages > 0) {
            return res.status(404).json({ message: "Page not found" });
        }

        const productList = await Product.find(filter)
            .populate('category', 'name')
            .populate('subCat')
            .populate('productSize')
            .populate('productWeight')
            .populate('productRams')
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        return res.status(200).json({
            products: productList,
            totalPages,
            page
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: "Failed to fetch products" });
    }
});

router.get('/featured', async (req, res) => {
    const productList = await Product.find({ isFeatured: false });
    if (!productList) {
        return res.status(500).json({ success: false });
    }
    return res.status(200).json(productList);
});

router.get('/recentlyViewed', async (req, res) => {
    let productList = [];
    productList = await RecentlyView.find(req.query)
        .populate('category', 'name')
        .populate('subCat')
        .populate('productSize')
        .populate('productWeight')
        .populate('productRams')
        
    if (!productList) {
        return res.status(500).json({
            success: false,
            message: "Product cant be updated"
        });
    }
    return res.status(200).json(productList);
});

router.post('/recentlyViewed', async (req, res) => {
    if (!Array.isArray(req.body.images)) {
        return res.status(400).json({
            error: "Images must be an Array",
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

    let findProduct = await RecentlyView.find({ prodId: req.body.id });
    var product;
    if(findProduct.length === 0) {
        product = new RecentlyView({
            prodId: req.body.id,
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
    }
});

router.post('/create', async (req, res) => {
    if (!Array.isArray(req.body.images)) {
        return res.status(400).json({
            error: "Images must be an Array",
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

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .populate('subCat')
            .populate('productSize')
            .populate('productWeight')
            .populate('productRams');

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return res.status(500).json({ message: "Failed to fetch product" });
    }
});

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

router.delete('/:id', async (req, res) => {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deleteProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
});

module.exports = router;
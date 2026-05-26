const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Category } = require('../models/category');
const { SubCategory } = require('../models/subCat');
const { Product } = require('../models/products');
const { HomeBanner } = require('../models/homeBanner');

/** Home page + layout: load all MongoDB data the storefront needs in one request */
router.get('/home', async (req, res) => {
    try {
        const perPage = parseInt(req.query.perPage, 10) || 16;

        const [
            categoryList,
            subCategoryList,
            featuredProducts,
            homeBanners,
            totalPosts,
            productList,
        ] = await Promise.all([
            Category.find().sort({ name: 1 }).exec(),
            SubCategory.find().populate('category').exec(),
            Product.find({ isFeatured: true }).exec(),
            HomeBanner.find().exec(),
            Product.countDocuments(),
            Product.find()
                .populate('category', 'name')
                .populate('subCat')
                .populate('productSize')
                .populate('productWeight')
                .populate('productRams')
                .sort({ _id: -1 })
                .limit(perPage)
                .exec(),
        ]);

        const totalPages = Math.ceil(totalPosts / perPage) || 1;

        res.status(200).json({
            categoryList,
            subCategoryList,
            featuredProducts,
            homeBanners,
            products: {
                products: productList,
                totalPages,
                page: 1,
            },
        });
    } catch (err) {
        console.error('bootstrap/home error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

/** Check MongoDB connection and document counts (for deploy debugging) */
router.get('/status', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        if (!db) {
            return res.status(503).json({
                connected: false,
                message: 'Database not connected',
            });
        }

        const collections = await db.listCollections().toArray();
        const counts = {};
        for (const { name } of collections) {
            counts[name] = await db.collection(name).countDocuments();
        }

        res.status(200).json({
            connected: mongoose.connection.readyState === 1,
            database: db.databaseName,
            counts,
        });
    } catch (err) {
        res.status(500).json({ connected: false, message: err.message });
    }
});

module.exports = router;

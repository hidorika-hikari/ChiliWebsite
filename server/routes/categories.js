const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');
const mongoose = require('mongoose');

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 20;
        const totalPosts = await Category.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages && totalPages > 0) {
            return res.status(404).json({ message: "Page not found" });
        }

        const categoryList = await Category.find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        return res.status(200).json({
            categoryList,
            totalPages,
            page
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        if (!req.body || !Array.isArray(req.body.images)) {
            return res.status(400).json({
                error: "Images must be an array in the request body",
                status: false
            });
        }

        const limit = pLimit(2);
        const imagesToUpload = req.body.images.map((image) =>
            limit(async () => await cloudinary.uploader.upload(image))
        );

        const uploadStatus = await Promise.all(imagesToUpload);
        const imgurl = uploadStatus.map((item) => item.secure_url);

        let category = new Category({
            name: req.body.name,
            images: imgurl,
            color: req.body.color
        });

        category = await category.save();
        res.status(201).json(category);

    } catch (err) {
        res.status(500).json({ error: err.message, success: false });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).send(category);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
    }

    const deleteUser = await Category.findByIdAndDelete(id);
    if (!deleteUser) {
        return res.status(404).json({
            message: 'Category not found.',
            success: false
        });
    }
    res.status(200).json({
        success: true,
        message: 'Category deleted!'
    });
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
    }

    try {
        const limit = pLimit(2);
        const imagesToUpload = req.body.images.map((image) =>
            limit(async () => await cloudinary.uploader.upload(image))
        );

        const uploadStatus = await Promise.all(imagesToUpload);
        const imgurl = uploadStatus.map((item) => item.secure_url);

        const category = await Category.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                images: imgurl,
                color: req.body.color
            },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                success: false
            });
        }

        res.json(category);

    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
});

module.exports = router;
const { HomeBanner } = require('../models/homeBanner');
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
});

router.get('/', async (req, res) => {
    try {
        const bannerImagesList = await HomeBanner.find();
        if (!bannerImagesList) {
            return res.status(500).json({ success: false });
        }
        res.status(200).json(bannerImagesList);
    } catch (err) {
        res.status(500).json({ error: err.message, success: false });
    }
});

router.post('/create', async (req, res) => {
    if (!req.body || !Array.isArray(req.body.images)) {
        return res.status(400).json({
            error: "Images must be an array in the request body",
            status: false
        });
    }

    try {
        const limit = pLimit(2);
        const imagesToUpload = req.body.images.map((image) =>
            limit(async () => {
                const result = await cloudinary.uploader.upload(image);
                return result;
            })
        );

        const uploadStatus = await Promise.all(imagesToUpload);
        const imgurl = uploadStatus.map(item => item.secure_url);

        let newEntry = new HomeBanner({ images: imgurl });

        if (!newEntry) {
            return res.status(500).json({
                error: "Failed to create new banner entry",
                success: false
            });
        }

        newEntry = await newEntry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        res.status(500).json({
            error: err.message,
            success: false
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const homeBanner = await HomeBanner.findById(req.params.id);
        if (!homeBanner) {
            return res.status(404).json({ success: false, message: "Not found" });
        }
        res.status(200).json(homeBanner);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const homeBanner = await HomeBanner.findByIdAndDelete(req.params.id);
        if (!homeBanner) {
            return res.status(404).json({
                message: "Home banner not found",
                success: false
            });
        }
        res.status(200).json({
            message: "Home banner deleted successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting banner",
            error: error.message,
            success: false
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!req.body || !Array.isArray(req.body.images)) {
            return res.status(400).json({
                error: "Images must be an array in the request body",
                status: false
            });
        }

        let imgurl = [];
        const areAllUrls = req.body.images.every(img => typeof img === 'string' && img.startsWith('http'));

        if (areAllUrls) {
            imgurl = req.body.images;
        } else {
            const limit = pLimit(2);
            const imagesToUpload = req.body.images.map((image) =>
                limit(async () => {
                    const result = await cloudinary.uploader.upload(image);
                    return result;
                })
            );

            const uploadStatus = await Promise.all(imagesToUpload);
            imgurl = uploadStatus.map(item => item.secure_url);
        }

        const homeBannerSlideItem = await HomeBanner.findByIdAndUpdate(
            req.params.id,
            { images: imgurl },
            { new: true }
        );

        if (!homeBannerSlideItem) {
            return res.status(500).json({
                message: "Slide can't be updated",
                success: false
            });
        }

        res.status(200).json(homeBannerSlideItem);
    } catch (err) {
        res.status(500).json({
            message: "Server error while updating banner",
            error: err.message,
            success: false
        });
    }
});

module.exports = router;
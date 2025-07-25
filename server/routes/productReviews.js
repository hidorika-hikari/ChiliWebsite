const express = require('express');
const router = express.Router();
const { ProductReviews } = require('../models/productReviews');

router.get('/', async (req, res) => {
    try {
        let reviews;
        if (req.query.productId) {
            reviews = await ProductReviews.find({ productId: req.query.productId });
        } else {
            reviews = await ProductReviews.find();
        }

        if (!reviews) {
            return res.status(404).json({ success: false, message: "No reviews found." });
        }

        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const review = await ProductReviews.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        return res.status(200).send(review);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post('/add', async (req, res) => {
    try {
        let review = new ProductReviews({
            customerId: req.body.customerId,
            customerName: req.body.customerName,
            review: req.body.review,
            customerRating: req.body.customerRating,
            productId: req.body.productId
        });

        review = await review.save();

        return res.status(201).json(review);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;
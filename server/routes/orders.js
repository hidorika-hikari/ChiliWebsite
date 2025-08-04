const { Orders } = require('../models/orders')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 20;
    const totalPosts = await Orders.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
        return res.status(404).json({ message: "Page not found" })
    }

    const ordersList = await Orders.find()
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();

    if (!ordersList) {
        return res.status(500).json({ success: false });
    }

    return res.status(200).json({
        "ordersList": ordersList,
        "totalPages": totalPages,
        "page": page
    })
});

router.post('/create', async (req, res) => {
    try {
        const {
            user,
            billingDetails,
            cartItems,
            totalAmount,
            paymentDetails,
            createdAt
        } = req.body;

        if (!user || !billingDetails || !cartItems || cartItems.length === 0 || !paymentDetails) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const order = new Orders({
            user,
            billingDetails,
            cartItems,
            totalAmount,
            paymentDetails,
            createdAt
        });
        const savedOrder = await order.save();
        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: savedOrder
        });

    } catch (error) {
        console.error('Order create error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating order'
        });
    }
});

router.get('/:id', async (req, res) => {
    const order = await Orders.findById(req.params.id);
    if (!order) {
        return res.status(500).json({
            message: "Order with the given ID wasn't found"
        });
    }
    return res.status(200).send(order);
});

router.delete('/:id', async (req, res) => {
    const deleteOrder = await Orders.findByIdAndDelete(req.params.id);
    if (!deleteOrder) {
        return res.status(404).json({
            message: 'Order not found.',
            success: false
        });
    }
    res.status(200).json({
        success: true,
        message: 'Order deleted!'
    });
});

module.exports = router;
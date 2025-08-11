const { Orders } = require('../models/orders')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 20;
    const userId = req.query.userId;

    // Only count/filter orders for this user
    const filter = userId ? { "user.userId": userId } : {};

    const totalPosts = await Orders.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
        return res.status(404).json({ message: "Page not found" })
    }

    const ordersList = await Orders.find(filter)
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

router.put('/:id', async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    try {
        const order = await Orders.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }
        order.paymentDetails.status = status;
        const updatedOrder = await order.save();

        return res.status(200).json({
            success: true,
            message: 'Order status updated successfully.',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Error updating status:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error while updating order status.'
        });
    }
});

module.exports = router;
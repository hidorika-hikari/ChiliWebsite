const { Cart } = require('../models/cart')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }
        const cartList = await Cart.find({ userId });
        return res.status(200).json(cartList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.post('/add', async (req, res) => {
    const cartItem = await Cart.find({ productId: req.body.productId, userId: req.body.userId });
    if (cartItem.length === 0){
        let cartList = new Cart({
            productTitle: req.body.productTitle,
            images: req.body.images,
            rating: req.body.rating,
            price: req.body.price,
            quantity: req.body.quantity,
            subTotal: req.body.subTotal,
            productId: req.body.productId,
            userId: req.body.userId
        });
        if (!cartList) {
            res.status(500).json({
                error: err,
                success: false
            })
        }
        cartList = await cartList.save();
        res.status(201).json(cartList);
    } else {
        res.status(401).json({ status: false ,msg: 'Product already added in the cart' })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ 
                success: false,
                msg: "Cart item given ID wasn't found" 
            });
        }

        const deleteItem = await Cart.findByIdAndDelete(req.params.id);
        if (!deleteItem) {
            return res.status(404).json({
                success: false,
                msg: "Cart item not found or could not be deleted"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Cart item deleted!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Database error",
            error: err.message
        });
    }
});

router.get('/:id', async (req, res) => {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) {
        return res.status(500).json({ message: "Cart item with the given ID wasn't found" })
    }
    return res.status(200).send(cartItem);
})

router.put('/:id', async (req, res) => {
    const cartList = await Cart.findByIdAndUpdate(
        req.params.id,
        {
            productTitle: req.body.productTitle,
            images: req.body.images,
            rating: req.body.rating,
            price: req.body.price,
            quantity: req.body.quantity,
            subTotal: req.body.subTotal,
            productId: req.body.productId,
            userId: req.body.userId
        },
        { new: true }
    )
    if (!cartList) {
        return res.status(500).json({
            message: "Cart item can't be updated",
            success: false
        })
    }
    res.send(cartList);
})

module.exports = router;
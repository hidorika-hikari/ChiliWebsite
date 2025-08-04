const { MyList } = require('../models/myList')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const myList = await MyList.find(req.query);
        if (!myList) {
            return res.status(500).json({ success: false });
        }
        return res.status(200).json(myList);
    } catch (error) {
        res.status(500).json({ success: false })
    }
});

router.post('/check', async (req, res) => {
    try {
        const item = await MyList.findOne({ productId: req.body.productId, userId: req.body.userId });
        if (item) {
            res.status(200).json({ status: true, isAdded: true });
        } else {
            res.status(200).json({ status: true, isAdded: false });
        }
    } catch (err) {
        res.status(500).json({ status: false, msg: "Server error", error: err });
    }
});

router.post('/add', async (req, res) => {
    const item = await MyList.find({ productId: req.body.productId, userId: req.body.userId });
    if (item.length === 0){
        let list = new MyList({
            productTitle: req.body.productTitle,
            images: req.body.images,
            rating: req.body.rating,
            price: req.body.price,
            productId: req.body.productId,
            userId: req.body.userId
        });
        if (!list) {
            res.status(500).json({
                error: err,
                success: false
            })
        }
        list = await list.save();
        res.status(201).json(list);
    } else {
        res.status(401).json({ status: false ,msg: 'Product already added in my list' })
    }
});

router.delete('/:id', async (req, res) => {
    const item = await MyList.findById(req.params.id);
    if(!item) {
        res.status(404).json({ msg: "Item with the given ID wasn't found" })
    }
    const deleteItem = await MyList.findByIdAndDelete(req.params.id);
    if (!deleteItem) {
        return res.status(404).json({
            message: 'Item not found.',
            success: false
        });
    }
    res.status(200).json({
        success: true,
        message: 'Item deleted!'
    });
});

router.get('/:id', async (req, res) => {
    const item = await MyList.findById(req.params.id);
    if (!item) {
        return res.status(500).json({ message: "Item with the given ID wasn't found" })
    }
    return res.status(200).send(item);
})

module.exports = router;
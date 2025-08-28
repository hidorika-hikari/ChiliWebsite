const {ProductSize} = require('../models/productSize');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const productSizeList = await ProductSize.find();
        if (!productSizeList) {
            res.status(500).json({ success: false })
        }
        return res.status(200).json(productSizeList);
    }
    catch(error) {
        res.status(500).json({ success: false })
    }
});

router.get('/:id', async (req, res) => {
    const item = await ProductSize.findById(req.params.id);
    if(!item) {
        res.status(500).json({ message: "ProductSize with the given ID wasn't found" })
    }
    return res.status(200).send(item);
})

router.post('/create', async (req,res) => {
    let productSize = new ProductSize({
        productSize: req.body.productSize
    });
    if (!productSize) {
        res.status(500).json({
            error: err,
            success: false
        })
    }
    productSize = await productSize.save();
    res.status(201).json(productSize);
});

router.delete('/:id', async (req,res) => {
    const deleteItem = await ProductSize.findByIdAndDelete(req.params.id);
    if (!deleteItem){
        res.status(404).json({
            message: 'Item not Found',
            success: false
        })
    }
    res.status(200).json({
        success: true,
        message: 'Item deleted'
    })
});

router.put('/:id',async (req, res) => {
    const item = await ProductSize.findByIdAndUpdate(
        req.params.id,
        {
            productSize: req.body.productSize,
        },
        { new: true }
    )
    if (!item) {
        return res.status(500).json({
            message: "Item can't be updated",
            success: false
        })
    }
    return res.status(200).json(item);
});

module.exports = router;
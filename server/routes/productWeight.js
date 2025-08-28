const {ProductWeight} = require('../models/productWeight');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const productWeightList = await ProductWeight.find();
        if (!productWeightList) {
            return res.status(500).json({ success: false })
        }
        return res.status(200).json(productWeightList);
    }
    catch(error) {
        console.error('Error fetching product weights:', error);
        return res.status(500).json({ success: false, message: error.message })
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await ProductWeight.findById(req.params.id);
        if(!item) {
            return res.status(404).json({ message: "ProductWeight with the given ID wasn't found" })
        }
        return res.status(200).json(item);
    } catch(error) {
        console.error('Error fetching product weight:', error);
        return res.status(500).json({ message: error.message })
    }
})

router.post('/create', async (req,res) => {
    try {
        let productWeight = new ProductWeight({
            productWeight: req.body.productWeight
        });
        
        productWeight = await productWeight.save();
        return res.status(201).json(productWeight);
    } catch(error) {
        console.error('Error creating product weight:', error);
        return res.status(500).json({
            error: error.message,
            success: false
        })
    }
});

router.delete('/:id', async (req,res) => {
    try {
        const deleteItem = await ProductWeight.findByIdAndDelete(req.params.id);
        if (!deleteItem){
            return res.status(404).json({
                message: 'Item not Found',
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Item deleted'
        })
    } catch(error) {
        console.error('Error deleting product weight:', error);
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
});

router.put('/:id', async (req, res) => {
    try {
        const item = await ProductWeight.findByIdAndUpdate(
            req.params.id,
            {
                productWeight: req.body.productWeight,
            },
            { new: true }
        )
        
        if (!item) {
            return res.status(404).json({
                message: "Item not found or can't be updated",
                success: false
            })
        }

        return res.status(200).json(item);
        
    } catch(error) {
        console.error('Error updating product weight:', error);
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
});

module.exports = router;
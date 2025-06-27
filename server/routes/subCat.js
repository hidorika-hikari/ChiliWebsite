const { SubCategory } = require('../models/subCat');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const subCat = await SubCategory.find().populate("category");
        return res.status(200).json(subCat);
    } catch (error) {
        console.error('Error fetching sub categories:', error);
        res.status(500).json({ success: false });
    }
});

router.get('/:id', async (req, res) => {
    const subCat = await SubCategory.findById(req.params.id).populate("category");

    if (!subCat) {
        return res.status(500).json({
            message: 'The Sub category with the given ID was not found.'
        });
    }
    return res.status(200).send(subCat);
});

router.post('/create', async (req, res) => {

    let subCat = new SubCategory({
        category: req.body.category,
        subCat: req.body.subCat
    });

    if(!subCat){
        res.status(500).json({
            error: err,
            success: false
        })
    }

    subCat = await subCat.save();
    res.status(201).json(subCat);
});

router.delete('/:id', async (req, res) => {
    const deleteSubCat = await SubCategory.findByIdAndDelete(req.params.id);

    if (!deleteSubCat) {
        return res.status(404).json({
            message: 'Sub Category not found.',
            success: false
        });
    }

    res.status(200).json({
        success: true,
        message: 'Sub Category Deleted!'
    });
});

router.put('/:id', async (req, res) =>{

    const subCat = await SubCategory.findByIdAndUpdate(
        req.params.id,
        {
            category: req.body.category,
            subCat: req.body.subCat,
        },
        {new:true}
    )

    if(!subCat){
        return res.status(500).json({
            message:'Sub Category cant be updated',
            success: false
        })
    }
    res.send(subCat);
})

module.exports = router;
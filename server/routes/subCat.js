const { SubCategory } = require('../models/subCat');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 20;

        const totalPosts = await SubCategory.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        const subCategoryList = await SubCategory.find()
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            subCategoryList,
            totalPages,
            page
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

router.get('/all', async (req, res) => {
    try {
        const subCategoryList = await SubCategory.find().populate("category").exec();
        res.status(200).json(subCategoryList);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch subcategories" });
    }
});

router.get('/:id', async (req, res) => {
    const subCat = await SubCategory.findById(req.params.id).populate("category");
    if (!subCat) {
        return res.status(500).json({
            message: "Subcategory with the given ID wasn't found"
        });
    }
    return res.status(200).send(subCat);
});

router.post('/create', async (req, res) => {
    let subCat = new SubCategory({
        category: req.body.category,
        subCat: req.body.subCat
    });
    if (!subCat) {
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
            message: 'Subcategory not found.',
            success: false
        });
    }
    res.status(200).json({
        success: true,
        message: 'Subcategory deleted!'
    });
});

router.put('/:id', async (req, res) => {
    const subCat = await SubCategory.findByIdAndUpdate(
        req.params.id,
        {
            category: req.body.category,
            subCat: req.body.subCat,
        },
        { new: true }
    )

    if (!subCat) {
        return res.status(500).json({
            message: "Subcategory can't be updated",
            success: false
        })
    }
    res.send(subCat);
})

module.exports = router;
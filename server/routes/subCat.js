const { SubCategory } = require('../models/subCat');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 20;
    const totalPosts = await SubCategory.countDocuments();
    const totalPages = Math.ceil(totalPosts/perPage);

    if(page > totalPages) {
        return res.status(404).json({ message: "Page not found" })
    }

    const SubCategoryList = await SubCategory.find().populate("category")
        .skip((page-1) * perPage)
        .limit(perPage)
        .exec();

    if (!SubCategoryList) {
        return res.status(500).json({ success: false });
    }

    return res.status(200).json({
        "subCategoryList": SubCategoryList,
        "totalPages": totalPages,
        "page": page
    })
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
            message: 'Subcategory not found.',
            success: false
        });
    }
    res.status(200).json({
        success: true,
        message: 'Subcategory deleted!'
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
            message: "Subcategory can't be updated",
            success: false
        })
    }
    res.send(subCat);
})

module.exports = router;
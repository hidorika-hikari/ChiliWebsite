const { Product } = require('../models/products.js');
const { Category } = require('../models/category.js');
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');
// const multer = require('multer'); DISABLE IT WHEN USE URL UPLOAD

// ---------- DISABLE IT WHEN USE URL UPLOAD ----------------
/* var imagesArr = [];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (res, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

router.post('/upload', upload.array("images"), async (req, res) => {
    var imagesArr = [];
    const files = req.files;

    for (let i = 0; i < files.length; i++) {
        imagesArr.push(files[i].filename);
    }
    console.log(imagesArr);
    res.json(images:imageArr);
}); */
//------------ DISABLE IT WHEN USE URL UPLOAD -----------------

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const totalPosts = await Product.countDocuments();
    const totalPages = Math.ceil(totalPosts/perPage);

    if(page > totalPages) {
        return res.status(404).json({ message:"Page not found"})
    }

    const productList = await Product.find().populate("category")
        .skip((page-1) * perPage)
        .limit(perPage)
        .exec();

    if (!productList) {
        return res.status(500).json({ success: false });
    }
    return res.status(200).json({
        "products":productList,
        "totalPages":totalPages,
        "page":page
    })
});

router.post('/create', async (req, res) => {
    if (!Array.isArray(req.body.images)) {
        return res.status(400).json({
            error: "'images' must be an array",
            status: false
        });
    }

    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(404).send("Invalid Category");
    }
    // DISABLE IT WHEN USE LOCAL UPLOAD
    const limit = pLimit(2);
    const imagesToUpload = req.body.images.map((image) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(image);
            return result;
        });
    });

    const uploadStatus = await Promise.all(imagesToUpload);
    const imgurl = uploadStatus.map((item) => item.secure_url);

    if (!uploadStatus) {
        return res.status(500).json({
            error: "Images couldn't be uploaded",
            status: false
        });
    }
    // DISABLE IT WHEN USE LOCAL UPLOAD

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        images: imgurl, //imageArr,
        brand: req.body.brand,
        price: req.body.price,
        oldPrice: req.body.oldPrice,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        //numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    product = await product.save();
    if (!product) {
        return res.status(500).json({ error: "Product creation failed", success: false });
    }
    res.status(201).json(product);
});


router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json(product);
});

router.delete('/:id', async (req, res) => {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deleteProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
});

router.put('/:id', async (req, res) => {

    const limit = pLimit(2);

    const imagesToUpload = req.body.images.map((image) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(image);
            return result;
        });
    });

    const uploadStatus = await Promise.all(imagesToUpload);
    const imgurl = uploadStatus.map((item) => item.secure_url);

    if (!uploadStatus) {
        return res.status(500).json({
            error: "Images couldn't be uploaded",
            status: false
        });
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            images: imgurl,
            brand: req.body.brand,
            price: req.body.price,
            oldPrice: req.body.oldPrice,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            // numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        { new: true }
    );

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product cant be updated"
        });
    }

    res.status(200).json({
        message: "Product updated successfully",
        success: true,
    });
});

module.exports = router;
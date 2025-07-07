const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            default: ''
        }
    ],
    brand:{
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    oldPrice: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: false,
        default: null
    },
    countInStock: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        default: false
    },
    productRams:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductRams',
        default: null
    },
    productSize:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductSize',
        default: null
    },
    productWeight:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductWeight',
        default: null
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
})

productSchema.virtual('id').get(function (){
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

exports.Product = mongoose.model('Product', productSchema);
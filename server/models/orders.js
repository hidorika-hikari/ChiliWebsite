const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    user: {
        userId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    billingDetails: {
        fullName: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        streetAddressLine1: {
            type: String,
            required: true
        },
        streetAddressLine2: {
            type: String
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    cartItems: [
        {
            productId: {
                type: String,
                required: true
            },
            productTitle: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            images:[
                {
                    type:String,
                    required:true
                }
            ]
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentDetails: {
        paymentIntentId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        created: {
            type: Number,
            required: true
        }
    },
    createdAt: {
        type: String,
        required: true
    }
});

ordersSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ordersSchema.set('toJSON', {
    virtuals: true,
});

ordersSchema.index({ "user.userId": 1 });

exports.Orders = mongoose.model('Orders', ordersSchema)
exports.ordersSchema = ordersSchema;
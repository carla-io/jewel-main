const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String },
            price: { type: Number, required: true },
        }
    ],
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        phoneNo: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    modeOfPayment: {
        type: String,
        required: [true, 'Mode of payment is required'],
        enum: {
            values: ['COD', 'Online Payment'],
            message: 'Mode of payment must be either COD or Online Payment'
        }
    },
    status: {
        type: String,
        default: 'Processing',
        enum: {
            values: ['Processing', 'Completed', 'Canceled'],
            message: 'Status must be either Processing, Completed, or Canceled'
        }
    },
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    items: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        default: ''
    },
    paymentMethod: {
        type: String,
        default: 'Cash on Delivery'
    },
    paymentScreenshot: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Pickup Assigned', 'Picked Up', 'Washing', 'Ironing', 'Packing', 'Out For Delivery', 'Delivered', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);

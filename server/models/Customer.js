const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    alternateNumber: {
        type: String,
        default: ''
    },
    address: {
        fullAddress: { type: String, default: '' },
        landmark: { type: String, default: '' },
        city: { type: String, default: 'Vidisha' },
        pincode: { type: String, default: '' },
        googleMapLocation: { type: String, default: '' }
    },
    preferences: {
        regularWash: { type: Boolean, default: true },
        dryClean: { type: Boolean, default: false },
        steamIron: { type: Boolean, default: false },
        premiumCare: { type: Boolean, default: false },
        separateWhite: { type: Boolean, default: false },
        perfume: { type: Boolean, default: false }
    },
    adminNotes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Active', 'Blocked', 'VIP', 'Regular'],
        default: 'Active'
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiresAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Customer', customerSchema);

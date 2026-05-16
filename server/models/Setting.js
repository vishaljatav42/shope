const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    // General Settings
    businessName: { type: String, default: 'Clean & Care Laundry' },
    tagline: { type: String, default: 'Premium Laundry Services in Vidisha' },
    address: { type: String, default: 'BTI Road, Near CM House,\nSherpura, Vidisha (M.P.)' },
    
    // Contact Settings
    phone: { type: String, default: '9406585448' },
    whatsapp: { type: String, default: '8871702059' },
    email: { type: String, default: 'contact@cleancare.com' },
    mapLocation: { type: String, default: '' },

    // Booking Settings
    homeDelivery: { type: Boolean, default: true },
    minimumOrderAmount: { type: Number, default: 0 },
    pickupCharges: { type: Number, default: 0 },
    expressDeliveryCharges: { type: Number, default: 100 },

    // Payment Settings
    cashOnDelivery: { type: Boolean, default: true },
    upiPaymentEnabled: { type: Boolean, default: true },
    upiId: { type: String, default: '' },
    qrCodeImage: { type: String, default: '' },
    
    // Notification Settings
    whatsappAlerts: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: false },
    emailAlerts: { type: Boolean, default: false },

    // Theme Settings
    darkMode: { type: Boolean, default: false },
    primaryColor: { type: String, default: '#6366f1' },

    // Security Settings (Admin Login)
    adminUsername: { type: String, default: 'admin' },
    adminPassword: { type: String, default: 'admin123' },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Setting', settingSchema);

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

    // Advanced Business Details
    gstNumber: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },

    // Operational Settings
    openingTime: { type: String, default: '09:00 AM' },
    closingTime: { type: String, default: '08:00 PM' },
    workingDays: { type: String, default: 'Monday - Saturday' },

    // Theme Settings
    darkMode: { type: Boolean, default: false },
    primaryColor: { type: String, default: '#6366f1' },

    // Security & Auth Settings
    adminUsername: { type: String, default: 'admin' },
    adminPassword: { type: String, default: 'admin123' },
    requireOtpLogin: { type: Boolean, default: false },

    // Advanced Email Settings (SMTP)
    smtpUser: { type: String, default: '' },
    smtpPassword: { type: String, default: '' },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Setting', settingSchema);

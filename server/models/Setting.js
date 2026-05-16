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
    
    // Notification Templates
    templatePickupConfirmed: { type: String, default: 'Hi [CustomerName], your laundry order #[OrderID] has been picked up successfully! We will start washing it soon.' },
    templateWashingStarted: { type: String, default: 'Hi [CustomerName], great news! Your clothes for order #[OrderID] are now being washed with premium care.' },
    templateOutForDelivery: { type: String, default: 'Hi [CustomerName], your fresh and clean laundry (Order #[OrderID]) is out for delivery and will reach you shortly!' },
    templateDelivered: { type: String, default: 'Hi [CustomerName], your laundry order #[OrderID] has been delivered. Thank you for choosing Clean & Care!' },

    // Advanced Business Details
    gstNumber: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },

    // Operational Settings
    openingTime: { type: String, default: '08:00 AM' },
    closingTime: { type: String, default: '10:00 PM' },
    
    // Pickup & Delivery Timings
    pickupStartTime: { type: String, default: '09:00 AM' },
    pickupEndTime: { type: String, default: '07:00 PM' },
    deliveryStartTime: { type: String, default: '11:00 AM' },
    deliveryEndTime: { type: String, default: '09:00 PM' },
    
    // Express & Emergency Services
    expressDeliveryEnabled: { type: Boolean, default: false },
    sameDayDeliveryEnabled: { type: Boolean, default: false },
    
    // Closed Days & Holiday Mode
    closedDays: { type: [String], default: ['Sunday'] },
    holidayMode: { type: Boolean, default: false },
    
    // Booking Rules
    slotDuration: { type: String, default: '1 hour' },
    lastBookingTime: { type: String, default: '08:00 PM' },
    autoAcceptOrders: { type: Boolean, default: true },
    minimumNoticeHours: { type: Number, default: 2 },
    
    // Service Areas
    serviceAreas: { type: [String], default: [] },

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

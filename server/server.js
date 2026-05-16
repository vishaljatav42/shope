require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Booking = require('./models/Booking');
const Service = require('./models/Service');
const Setting = require('./models/Setting');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cleancare';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 }); // Newest first
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();
        
        // Update customer profile data if missing
        if (req.body.email) {
            await Customer.findOneAndUpdate(
                { email: req.body.email },
                { 
                    $set: { 
                        phone: req.body.phone,
                        'address.fullAddress': req.body.address
                    }
                }
            );
        }
        
        console.log('New booking saved:', savedBooking);
        res.status(201).json({ success: true, message: 'Booking saved successfully!', data: savedBooking });
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).json({ success: false, message: 'Failed to save booking', error: error.message });
    }
});

app.put('/api/bookings/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedBooking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});

// Service Routes
app.get('/api/services', async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

app.post('/api/services', async (req, res) => {
    try {
        const newService = new Service(req.body);
        const savedService = await newService.save();
        res.status(201).json({ success: true, message: 'Service added successfully!', data: savedService });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add service', error: error.message });
    }
});

app.delete('/api/services/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Service.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Service deleted successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete service', error: error.message });
    }
});

// Admin Auth Route
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        let settings = await Setting.findOne();
        
        // If settings don't exist yet, check against defaults
        if (!settings) {
            if (username === 'admin' && password === 'admin123') {
                return res.status(200).json({ success: true });
            }
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (settings.adminUsername === username && settings.adminPassword === password) {
            return res.status(200).json({ success: true });
        }
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Settings Routes
app.get('/api/settings', async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

app.put('/api/settings', async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = new Setting(req.body);
        } else {
            Object.assign(settings, req.body);
            settings.updatedAt = Date.now();
        }
        await settings.save();
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error('Settings update error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

const Customer = require('./models/Customer');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'laundry_super_secret_key';

// Nodemailer transporter helper (Fetches credentials from DB)
async function getTransporter() {
    const settings = await Setting.findOne();
    const user = settings?.smtpUser || process.env.EMAIL_USER;
    const pass = settings?.smtpPassword || process.env.EMAIL_PASS;
    
    if (!user || !pass) return null;
    
    return nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
    });
}

// --- AUTHENTICATION ROUTES ---

// 1. Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Find or create customer
        let customer = await Customer.findOne({ email });
        if (!customer) {
            customer = new Customer({ email });
        }
        
        customer.otp = otp;
        customer.otpExpiresAt = otpExpiresAt;
        await customer.save();

        const transporter = await getTransporter();
        const settings = await Setting.findOne();
        const emailUser = settings?.smtpUser || process.env.EMAIL_USER;

        if (transporter && emailUser) {
            await transporter.sendMail({
                from: `"Clean & Care" <${emailUser}>`,
                to: email,
                subject: 'Your Login OTP',
                html: `<p>Your One-Time Password (OTP) for Clean & Care Laundry is: <strong>${otp}</strong>.</p><p>It is valid for 10 minutes.</p>`
            });
            console.log(`OTP sent to ${email}`);
        } else {
            console.log(`[DEVELOPMENT MODE] Email not configured. The OTP for ${email} is: ${otp}`);
        }

        res.status(200).json({ success: true, message: 'OTP sent to email.' });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// 2. Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        // For rapid testing, if no EMAIL_USER is configured, allow 1234
        const customer = await Customer.findOne({ email });
        
        if (!customer) return res.status(404).json({ error: 'User not found' });
        
        const settings = await Setting.findOne();
        const hasEmailConfig = settings?.smtpUser || process.env.EMAIL_USER;
        
        if (!hasEmailConfig && otp === '1234') {
            // Bypass for testing
        } else {
            if (customer.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
            if (customer.otpExpiresAt < new Date()) return res.status(400).json({ error: 'OTP has expired' });
        }

        // Clear OTP
        customer.otp = null;
        customer.otpExpiresAt = null;
        await customer.save();

        // Generate Token
        const token = jwt.sign({ id: customer._id, email: customer.email }, JWT_SECRET, { expiresIn: '7d' });

        // Check if this is their first order
        const bookingCount = await Booking.countDocuments({ email: customer.email });
        const isFirstOrder = bookingCount === 0;

        res.status(200).json({ 
            success: true, 
            token, 
            customer: { 
                id: customer._id, 
                email: customer.email, 
                name: customer.name, 
                phone: customer.phone,
                isFirstOrder
            } 
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});

// --- CUSTOMER CRM ROUTES ---

// 1. Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        // Fetch all customers, lean to improve performance
        const customers = await Customer.find().lean().sort({ createdAt: -1 });
        
        // For each customer, maybe calculate total orders/spent if not saved in model?
        // Since that's heavy, let's just return customers. We can aggregate later or in the dashboard.
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get single customer by ID + their bookings
app.get('/api/customers/:id', async (req, res) => {
    try {
        let customer;
        if (req.params.id.includes('@')) {
            customer = await Customer.findOne({ email: req.params.id }).lean();
        } else {
            customer = await Customer.findById(req.params.id).lean();
        }
        
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        // Fetch all bookings for this customer email
        const bookings = await Booking.find({ email: customer.email }).sort({ createdAt: -1 }).lean();
        
        // Calculate aggregations
        const totalOrders = bookings.length;
        const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        const activeOrders = bookings.filter(b => ['Pending', 'Confirmed'].includes(b.status)).length;
        const cancelledOrders = bookings.filter(b => b.status === 'Cancelled').length;
        const completedOrders = bookings.filter(b => b.status === 'Completed').length;
        
        res.status(200).json({
            ...customer,
            bookings,
            stats: {
                totalOrders,
                totalSpent,
                activeOrders,
                cancelledOrders,
                completedOrders
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Update customer (Admin)
app.put('/api/customers/:id', async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCustomer) return res.status(404).json({ error: 'Customer not found' });
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

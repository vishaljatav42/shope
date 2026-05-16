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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
        const { status } = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
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
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

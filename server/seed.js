const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Service = require('./models/Service');

const MONGO_URI = 'mongodb://127.0.0.1:27017/cleancare';

const servicesData = [
  {
    name: 'Premium Dry Cleaning',
    description: 'Expert dry cleaning for delicate fabrics like silk, wool, and suits. Removes stubborn stains without damaging the material.',
    price: 250
  },
  {
    name: 'Wash & Fold',
    description: 'Everyday laundry service. Your clothes are washed, dried, and neatly folded, ready to go into your closet.',
    price: 80
  },
  {
    name: 'Steam Ironing',
    description: 'Professional steam pressing to remove all wrinkles and give your clothes a crisp, brand-new look.',
    price: 30
  },
  {
    name: 'Shoe Cleaning',
    description: 'Deep cleaning for sneakers and formal shoes. Includes sole whitening, deodorizing, and polishing.',
    price: 150
  }
];

const bookingsData = [
  {
    name: 'Rahul Sharma',
    phone: '+91 9876543210',
    service: 'Premium Dry Cleaning',
    date: '2026-05-18',
    time: '10:00 AM - 12:00 PM',
    address: '102, Shanti Nagar, Vidisha',
    instructions: 'Please be careful with the silk saree.',
    createdAt: new Date()
  },
  {
    name: 'Priya Patel',
    phone: '+91 8765432109',
    service: 'Wash & Fold',
    date: '2026-05-17',
    time: '02:00 PM - 04:00 PM',
    address: 'Flat 405, Green Valley Apartments, Vidisha',
    instructions: 'Use mild detergent if possible.',
    createdAt: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    name: 'Amit Kumar',
    phone: '+91 7654321098',
    service: 'Shoe Cleaning',
    date: '2026-05-19',
    time: '04:00 PM - 06:00 PM',
    address: 'Shop 12, Main Market, Vidisha',
    instructions: 'Call before arriving.',
    createdAt: new Date(Date.now() - 172800000) // 2 days ago
  },
  {
    name: 'Sneha Gupta',
    phone: '+91 6543210987',
    service: 'Steam Ironing',
    date: '2026-05-16',
    time: '09:00 AM - 11:00 AM',
    address: 'B-Block, Civil Lines, Vidisha',
    instructions: 'I need them urgently for a wedding.',
    createdAt: new Date(Date.now() - 3600000) // 1 hour ago
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    console.log('Clearing old data...');
    await Booking.deleteMany({});
    await Service.deleteMany({});

    console.log('Inserting sample services...');
    await Service.insertMany(servicesData);

    console.log('Inserting sample bookings...');
    await Booking.insertMany(bookingsData);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();

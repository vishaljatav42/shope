import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Sparkles, Sofa, Footprints, Phone, MessageCircle, MapPin, Droplets, ArrowRight, CheckCircle2, Clock, X, Users, Settings, CalendarCheck } from 'lucide-react';

import { Routes, Route } from 'react-router-dom';
import AdminApp from './AdminApp';

const MainWebsite = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showAllGallery, setShowAllGallery] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        items: [],
        date: '',
        time: '',
        address: '',
        instructions: '',
        paymentMethod: 'Cash on Delivery',
        paymentScreenshot: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(true);
    const [paymentScreenshot, setPaymentScreenshot] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [dbServices, setDbServices] = useState([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    
    // Auth State
    const [customer, setCustomer] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    
    // Customer Profile Portal State
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [customerProfileData, setCustomerProfileData] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    
    // Promo State
    const [showPromoPopup, setShowPromoPopup] = useState(true);

    const loadCustomerProfile = async () => {
        if (!customer) return;
        setLoadingProfile(true);
        try {
            const identifier = customer.id || customer.email;
            const res = await fetch(`http://localhost:8000/api/customers/${identifier}`);
            if (res.ok) {
                const data = await res.json();
                setCustomerProfileData(data);
                setShowProfileModal(true);
            }
        } catch (error) {
            console.error("Failed to load profile", error);
            alert("Failed to load profile data.");
        } finally {
            setLoadingProfile(false);
        }
    };

    const [settings, setSettings] = useState({
        businessName: 'Clean & Care Laundry',
        tagline: 'Premium Laundry Services in Vidisha',
        phone: '9406585448',
        whatsapp: '8871702059',
        address: 'BTI Road, Near CM House,\nSherpura, Vidisha (M.P.)',
        mapLocation: '',
        cashOnDelivery: true,
        upiPaymentEnabled: true,
        upiId: 'Q28290294@ybl' // Default placeholder UPI ID
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setSettings(data);
                        setFormData(prev => {
                            if (!data.cashOnDelivery && data.upiPaymentEnabled) {
                                return { ...prev, paymentMethod: 'UPI' };
                            }
                            if (!data.upiPaymentEnabled && data.cashOnDelivery) {
                                return { ...prev, paymentMethod: 'Cash on Delivery' };
                            }
                            return prev;
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/services');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setDbServices(data);
                    } else {
                        // Fallback if database is empty
                        const defaultServices = [
                            { name: 'Dry Cleaning', description: 'Premium dry cleaning for delicate fabrics and special garments.', price: 150 },
                            { name: 'Wash & Fold', description: 'Standard washing and folding service for everyday clothes.', price: 60 },
                            { name: 'Steam Ironing', description: 'Professional steam ironing for crisp, wrinkle-free clothes.', price: 20 },
                            { name: 'Deep Cleaning', description: 'Thorough deep cleaning for heavy items like blankets and curtains.', price: 300 }
                        ];
                        setDbServices(defaultServices);
                    }
                }
            } catch (error) {
                console.error('Failed to load services:', error);
                // Fallback on error
                const defaultServices = [
                    { name: 'Dry Cleaning', description: 'Premium dry cleaning for delicate fabrics and special garments.', price: 150 },
                    { name: 'Wash & Fold', description: 'Standard washing and folding service for everyday clothes.', price: 60 },
                    { name: 'Steam Ironing', description: 'Professional steam ironing for crisp, wrinkle-free clothes.', price: 20 },
                    { name: 'Deep Cleaning', description: 'Thorough deep cleaning for heavy items like blankets and curtains.', price: 300 }
                ];
                setDbServices(defaultServices);
            } finally {
                setIsLoadingServices(false);
            }
        };
        fetchServices();
        
        // Load customer from local storage
        const storedCustomer = localStorage.getItem('shope_customer');
        if (storedCustomer) {
            setCustomer(JSON.parse(storedCustomer));
        }
    }, []);

    const galleryImages = [
        "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583845112239-99ef1345b71c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584814349141-863a35b1d4bb?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1582686115712-a74da4121ea2?q=80&w=800&auto=format&fit=crop"
    ];

    const heroImages = [
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?q=80&w=1000&auto=format&fit=crop"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (formData.items.length === 0) {
            alert('Please select at least one service by adding quantities.');
            setIsServicesOpen(true);
            return;
        }
        
        if (!customer) {
            setShowLoginModal(true);
            return;
        }
        
        setIsSubmitting(true);
        
        const baseTotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const isEligibleForDiscount = formData.paymentMethod === 'UPI';
        const finalTotal = isEligibleForDiscount ? Math.round(baseTotal * 0.9) : baseTotal;

        const payload = {
            ...formData,
            email: customer.email,
            totalAmount: finalTotal
        };
        
        try {
            const response = await fetch('http://localhost:8000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...payload, paymentScreenshot }),
            });
            
            if (response.ok) {
                setBookingSuccess(true);
                
                // Reset form
                setFormData({ name: '', phone: '', items: [], date: '', time: '', address: '', instructions: '', paymentMethod: 'Cash on Delivery' });
                setPaymentScreenshot('');
                setTimeout(() => setBookingSuccess(false), 5000);
            } else {
                alert('Failed to save booking. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Server connection failed. Make sure the backend is running.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size too large. Please upload an image under 5MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentScreenshot(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQuantityChange = (service, change) => {
        setFormData(prev => {
            const items = [...prev.items];
            const index = items.findIndex(item => item.name === service.name);
            
            if (index >= 0) {
                const newQuantity = items[index].quantity + change;
                if (newQuantity <= 0) {
                    items.splice(index, 1);
                } else {
                    items[index].quantity = newQuantity;
                }
            } else if (change > 0) {
                items.push({ name: service.name, price: service.price, quantity: 1 });
            }
            
            return { ...prev, items };
        });
    };

    const handleSendOtp = async () => {
        setAuthLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail })
            });
            const data = await res.json();
            if (res.ok) {
                setOtpSent(true);
            } else {
                alert(data.error || 'Failed to send OTP');
            }
        } catch (error) {
            alert('Server error while sending OTP');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setAuthLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, otp })
            });
            const data = await res.json();
            if (res.ok) {
                setCustomer(data.customer);
                localStorage.setItem('shope_customer', JSON.stringify(data.customer));
                localStorage.setItem('shope_token', data.token);
                setShowLoginModal(false);
                setOtpSent(false);
                setOtp('');
                
                // If they have items in cart, they might want to continue booking
                if (formData.items.length > 0) {
                    // We don't auto-submit to let them review, or we could.
                    // Leaving it manual is safer.
                }
            } else {
                alert(data.error || 'Invalid OTP');
            }
        } catch (error) {
            alert('Server error while verifying OTP');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = () => {
        setCustomer(null);
        localStorage.removeItem('shope_customer');
        localStorage.removeItem('shope_token');
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Removed hardcoded services and pricing arrays

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <div className="font-sans bg-slate-50 overflow-hidden selection:bg-brand-500 selection:text-white">
            {/* Top Bar */}
            <div className="bg-brand-900 text-white text-xs md:text-sm py-2 px-4 relative z-50">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
                    <span className="font-semibold tracking-widest text-brand-200">|| Jai Maa Harsiddhi ||</span>
                    <div className="flex items-center gap-6">
                        <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-brand-300 transition-colors">
                            <Phone size={14} /> {settings.phone}
                        </a>
                        <a href={`https://wa.me/91${settings.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-water-100 hover:text-white transition-colors font-medium">
                            <MessageCircle size={14} /> {settings.whatsapp}
                        </a>
                    </div>
                </div>
            </div>

            {/* Navbar */}
            <nav 
                className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] py-4' : 'bg-transparent py-6'}`}
                style={{ top: scrolled ? '0' : 'auto' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
                                <Droplets size={24} />
                            </div>
                            <div>
                                <h1 className="font-extrabold text-2xl tracking-tight text-slate-900 leading-none">
                                    {settings.businessName}
                                </h1>
                                <span className="text-xs font-bold tracking-[0.2em] text-brand-600 uppercase">Laundry</span>
                            </div>
                        </div>
                        <div className="hidden lg:flex space-x-6 items-center bg-white/50 backdrop-blur-md px-8 py-3 rounded-full border border-white shadow-sm">
                            <a href="#services" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">Services</a>
                            <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">Pricing</a>
                            <a href="#gallery" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">Gallery</a>
                            <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">Contact</a>
                            <div className="w-px h-4 bg-slate-300 mx-2"></div>
                            {customer ? (
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={loadCustomerProfile}
                                        disabled={loadingProfile}
                                        className="text-brand-600 font-bold bg-white/80 border border-brand-100 px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-white hover:shadow-sm transition-all"
                                    >
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        {loadingProfile ? 'Loading...' : 'My Profile'}
                                    </button>
                                    <button onClick={handleLogout} className="text-slate-500 hover:text-rose-500 text-sm font-bold transition-colors">Logout</button>
                                </div>
                            ) : (
                                <button onClick={() => setShowLoginModal(true)} className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">Login</button>
                            )}
                        </div>
                        <div className="hidden sm:flex items-center gap-3">
                            <a href={`https://wa.me/91${settings.whatsapp}`} target="_blank" rel="noreferrer" className="flex bg-green-500 text-white px-5 py-3 rounded-full font-bold hover:bg-green-600 transition-all shadow-xl hover:shadow-green-500/25 hover:-translate-y-0.5 items-center gap-2">
                                <MessageCircle size={18} /> WhatsApp
                            </a>
                            <a href="#booking" className="flex bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-brand-600 transition-all shadow-xl hover:shadow-brand-500/25 hover:-translate-y-0.5 items-center gap-2">
                                Book Now <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-water-100 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Hero Content */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-brand-100 text-brand-600 font-bold text-sm backdrop-blur-md">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
                                </span>
                                Home Delivery Available!
                            </div>
                            
                            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                                Complete Care For <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-water-500">
                                    Your Clothes
                                </span>
                            </h2>
                            
                            <p className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
                                {settings.tagline}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <a href={`tel:${settings.phone}`} className="px-8 py-4 rounded-full bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all shadow-xl hover:shadow-brand-600/40 text-center flex items-center justify-center gap-2 hover:-translate-y-1 group">
                                    <Phone size={20} className="group-hover:rotate-12 transition-transform" />
                                    Call Now
                                </a>
                                <a href={`https://wa.me/91${settings.whatsapp}`} target="_blank" rel="noreferrer" className="px-8 py-4 rounded-full bg-white text-slate-800 border border-slate-200 font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-1 group">
                                    <MessageCircle size={20} className="text-green-500 group-hover:scale-110 transition-transform" />
                                    WhatsApp Us
                                </a>
                            </div>
                            
                            <div className="pt-8 flex items-center gap-6 text-sm font-semibold text-slate-500">
                                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-500"/> Premium Quality</div>
                                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-500"/> On-time Delivery</div>
                            </div>
                        </motion.div>
                        
                        {/* Hero Image Showcase */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative lg:h-[600px] w-full"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-transparent rounded-[3rem] transform rotate-3 scale-105"></div>
                            <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100">
                                {heroImages.map((src, index) => (
                                    <img 
                                        key={index}
                                        src={src} 
                                        alt={`Clean Laundry ${index + 1}`} 
                                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                                            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                        }`} 
                                    />
                                ))}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-8 sm:p-12">
                                    <div className="animate-fade-in-up">
                                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg inline-block text-white font-bold text-sm mb-3 border border-white/30">
                                            Trusted Service
                                        </div>
                                        <p className="text-white font-bold text-2xl sm:text-3xl leading-snug drop-shadow-md">
                                            We undertake all types of home cleaning works.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute top-10 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-float flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-bold">Experienced Staff</p>
                                    <p className="text-lg font-extrabold text-slate-900">100% Satisfaction</p>
                                </div>
                            </div>
                        </motion.div>
                        
                    </div>
                </div>
            </main>

            {/* Services Section */}
            <section id="services" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-2 block">Our Expertise</span>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Our Primary Services</h3>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">We provide you with the best laundry and dry cleaning facilities using modern machines.</p>
                    </div>
                    
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {isLoadingServices ? (
                            <div className="col-span-full text-center py-10 text-brand-600 font-bold">Loading services...</div>
                        ) : dbServices.map((service, idx) => (
                            <motion.div key={idx} variants={itemVariants} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 group flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-md text-brand-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                                    <Sparkles size={32} />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-3">{service.name}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed text-sm">{service.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600 rounded-full blur-[120px] opacity-20"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-brand-400 font-bold tracking-wider uppercase text-sm mb-2 block">Affordable Rates</span>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Our Pricing List</h3>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">Excellent services at affordable prices</p>
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6">
                            {isLoadingServices ? (
                                <div className="col-span-full text-center py-10 text-brand-400 font-bold">Loading pricing...</div>
                            ) : dbServices.map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 flex justify-between items-center hover:bg-slate-800 hover:border-brand-500/50 transition-all group"
                                >
                                    <div>
                                        <h4 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">{item.name}</h4>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-extrabold text-brand-400">₹{item.price}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-8 text-center text-sm font-medium text-slate-500 bg-slate-800/30 rounded-xl py-4 border border-slate-800">
                            * Prices may vary depending on the type of cloth and work.
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-2 block">Our Work</span>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Our Gallery</h3>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">A few glimpses of our excellent work.</p>
                    </div>
                    <div className="columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
                        {galleryImages.slice(0, showAllGallery ? galleryImages.length : 6).map((src, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: (idx % 3) * 0.15 }}
                                onClick={() => setSelectedImage(src)}
                                className="rounded-3xl overflow-hidden shadow-lg group relative cursor-pointer break-inside-avoid relative"
                            >
                                <img src={src} alt="Gallery item" className="w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                            </motion.div>
                        ))}
                    </div>
                    {galleryImages.length > 6 && (
                        <div className="mt-12 text-center">
                            <button 
                                onClick={() => setShowAllGallery(!showAllGallery)}
                                className="bg-white border-2 border-brand-600 text-brand-600 px-8 py-3 rounded-full font-bold hover:bg-brand-600 hover:text-white transition-all shadow-md hover:shadow-brand-500/25"
                            >
                                {showAllGallery ? "Show Less" : "View More"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4 sm:p-8"
                            onClick={() => setSelectedImage(null)}
                        >
                            <button 
                                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                                onClick={() => setSelectedImage(null)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <motion.img 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                src={selectedImage} 
                                alt="Enlarged view" 
                                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Booking Section */}
            <section id="booking" className="py-24 bg-brand-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-300 rounded-full blur-[100px] opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <span className="text-brand-600 font-bold tracking-wider uppercase text-sm block">Fast & Easy</span>
                            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">Confirm Your <span className="text-brand-600">Booking</span> Now</h3>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                Send your booking by filling out the form below. Our team will contact you shortly and your clothes will be picked up from your home.
                            </p>
                            <ul className="space-y-4 pt-4">
                                <li className="flex items-center gap-3 text-slate-700 font-bold">
                                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center"><CheckCircle2 size={16} /></div>
                                    Free Pick-up & Delivery
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-bold">
                                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center"><CheckCircle2 size={16} /></div>
                                    Premium Washing Quality
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-bold">
                                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center"><CheckCircle2 size={16} /></div>
                                    Timely & Safe Return
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-brand-500/10 border border-slate-100 relative"
                        >
                            <div className="absolute top-0 right-10 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-brand-500 to-water-400 rounded-2xl rotate-12 flex items-center justify-center shadow-lg">
                                <Shirt size={32} className="text-white -rotate-12" />
                            </div>
                            
                            <form onSubmit={handleBooking} className="space-y-6 mt-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium text-slate-900"
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                                        <input 
                                            type="tel" 
                                            required 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium text-slate-900"
                                            placeholder="10-digit number"
                                        />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setIsServicesOpen(!isServicesOpen)}
                                            className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 text-left focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all hover:bg-slate-50 shadow-sm"
                                        >
                                            <div>
                                                <span className="block text-sm font-bold text-slate-800">Select Services & Quantity</span>
                                                <span className="text-xs text-brand-600 font-bold mt-1 inline-block">{formData.items.reduce((acc, item) => acc + item.quantity, 0)} items selected</span>
                                            </div>
                                            <svg className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        
                                        {isServicesOpen && (
                                            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-2 sm:p-4 max-h-60 overflow-y-auto space-y-2">
                                                {isLoadingServices ? (
                                                    <div className="p-4 text-center text-sm font-bold text-slate-500">Loading...</div>
                                                ) : dbServices.length === 0 ? (
                                                    <div className="p-4 text-center text-sm font-bold text-slate-500">No services available</div>
                                                ) : (
                                                    dbServices.map((service, idx) => {
                                                        const cartItem = formData.items.find(item => item.name === service.name);
                                                        const qty = cartItem ? cartItem.quantity : 0;
                                                        return (
                                                            <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:border-brand-200 transition-colors">
                                                                <div>
                                                                    <div className="font-bold text-slate-800 text-sm">{service.name}</div>
                                                                    <div className="text-xs text-brand-600 font-semibold">₹{service.price}</div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <button type="button" onClick={() => handleQuantityChange(service, -1)} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${qty > 0 ? 'bg-brand-100 text-brand-600 hover:bg-brand-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`} disabled={qty === 0}>-</button>
                                                                    <span className="w-4 text-center font-bold text-slate-800">{qty}</span>
                                                                    <button type="button" onClick={() => handleQuantityChange(service, 1)} className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 hover:bg-brand-200 flex items-center justify-center font-bold text-lg transition-colors">+</button>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Pick-up Date</label>
                                        <input 
                                            type="date" 
                                            required 
                                            value={formData.date}
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Pick-up Time</label>
                                        <select 
                                            required
                                            value={formData.time}
                                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium text-slate-900 appearance-none"
                                        >
                                            <option value="" disabled>Select Time</option>
                                            <option>Morning 9:00 AM - 11:00 AM</option>
                                            <option>Noon 11:00 AM - 2:00 PM</option>
                                            <option>Afternoon 2:00 PM - 5:00 PM</option>
                                            <option>Evening 5:00 PM - 8:00 PM</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Address (For Pick-up)</label>
                                    <textarea 
                                        required 
                                        rows="2"
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium text-slate-900 resize-none"
                                        placeholder="House Number, Street, Area..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Special Instructions (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={formData.instructions}
                                        onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium text-slate-900"
                                        placeholder="e.g. regarding stains on clothes..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Payment Method</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {settings.cashOnDelivery && (
                                            <label className={`border rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer transition-all ${formData.paymentMethod === 'Cash on Delivery' ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600 font-medium hover:bg-slate-100'}`}>
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    value="Cash on Delivery" 
                                                    className="hidden"
                                                    checked={formData.paymentMethod === 'Cash on Delivery'}
                                                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                                                />
                                                Cash on Delivery
                                            </label>
                                        )}
                                        {settings.upiPaymentEnabled && (
                                            <label className={`border rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer transition-all ${formData.paymentMethod === 'UPI' ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600 font-medium hover:bg-slate-100'}`}>
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    value="UPI" 
                                                    className="hidden"
                                                    checked={formData.paymentMethod === 'UPI'}
                                                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                                                />
                                                UPI Payment
                                            </label>
                                        )}
                                    </div>
                                    
                                    {formData.items.length > 0 && (
                                        <div className="mt-6 bg-brand-50 border border-brand-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
                                            <div className="font-bold text-brand-800 flex items-center gap-2">
                                                <span className="bg-brand-200 text-brand-700 px-2 py-0.5 rounded-full text-xs">{formData.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                                                Total Amount:
                                            </div>
                                            <div className="text-right">
                                                {(() => {
                                                    const baseTotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                                    const isEligibleForDiscount = formData.paymentMethod === 'UPI';
                                                    if (isEligibleForDiscount) {
                                                        const finalTotal = Math.round(baseTotal * 0.9);
                                                        return (
                                                            <>
                                                                <div className="text-sm text-slate-400 line-through">₹{baseTotal}</div>
                                                                <div className="text-2xl font-extrabold text-emerald-600 flex items-center gap-2">
                                                                    ₹{finalTotal} <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full whitespace-nowrap">10% OFF</span>
                                                                </div>
                                                            </>
                                                        );
                                                    }
                                                    return <div className="text-2xl font-extrabold text-brand-600">₹{baseTotal}</div>;
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    {formData.paymentMethod === 'UPI' && (
                                        <div className="mt-4 p-5 rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-center">
                                            {settings.qrCodeImage && (
                                                <div className="w-40 h-40 bg-white p-2 rounded-xl shadow-sm border border-blue-200 mb-4">
                                                    <img src={settings.qrCodeImage} alt="Pay via UPI" className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                            <p className="text-sm font-medium text-blue-800 mb-2">Please pay to the following UPI ID:</p>
                                            <div className="bg-white px-4 py-2 rounded-lg font-bold text-lg text-slate-800 shadow-sm border border-slate-200 mb-2 select-all">
                                                {settings.upiId || 'Not Setup Yet'}
                                            </div>
                                            <p className="text-xs text-blue-600 mt-2">Scan the QR code or copy the UPI ID above. Our delivery boy will verify the payment at pickup.</p>
                                            
                                            <div className="mt-6 w-full text-left">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Upload Payment Screenshot *</label>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={handleFileChange}
                                                    required={formData.paymentMethod === 'UPI'}
                                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer border border-blue-200 rounded-xl bg-white focus:outline-none"
                                                />
                                                {paymentScreenshot && (
                                                    <div className="mt-3 text-xs font-bold text-emerald-600 flex items-center gap-1">
                                                        <CheckCircle2 size={14} /> Screenshot attached successfully
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full bg-brand-600 text-white font-extrabold rounded-xl px-6 py-4 flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-xl hover:shadow-brand-500/30 group disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                                            Confirm Booking
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
                
                {/* Success Popup Modal */}
                <AnimatePresence>
                    {bookingSuccess && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-slate-100"
                            >
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={40} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-900 mb-8">Booking Confirmed!</h3>
                                <button 
                                    onClick={() => setBookingSuccess(false)}
                                    className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/25"
                                >
                                    OK, Thanks!
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </section>

            {/* Footer / Contact */}
            <footer id="contact" className="bg-slate-950 text-slate-300 pt-24 pb-10 border-t border-slate-900 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-900 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                        {/* Brand & About */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
                                    <Droplets size={24} />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-2xl tracking-tight text-white">{settings.businessName}</h4>
                                    <span className="text-xs font-bold tracking-[0.2em] text-brand-400 uppercase">Laundry</span>
                                </div>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {settings.tagline}
                            </p>
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl inline-block mt-2">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Proprietor</p>
                                <p className="text-white font-bold text-lg">Prop. Dinesh Barentha</p>
                            </div>
                            
                            <div className="flex items-center gap-4 pt-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 transition-all border border-slate-800 hover:border-brand-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 transition-all border border-slate-800 hover:border-pink-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="lg:pl-8">
                            <h5 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
                                <span className="w-8 h-1 bg-brand-500 rounded-full"></span>
                                Quick Links
                            </h5>
                            <ul className="space-y-3">
                                <li><a href="#services" className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2 text-sm"><ArrowRight size={14} className="text-brand-600" /> Our Services</a></li>
                                <li><a href="#pricing" className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2 text-sm"><ArrowRight size={14} className="text-brand-600" /> Pricing List</a></li>
                                <li><a href="#gallery" className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2 text-sm"><ArrowRight size={14} className="text-brand-600" /> Work Gallery</a></li>
                                <li><a href="#booking" className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2 text-sm"><ArrowRight size={14} className="text-brand-600" /> Online Booking</a></li>
                            </ul>
                        </div>
                        
                        {/* Contact Info */}
                        <div>
                            <h5 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
                                <span className="w-8 h-1 bg-brand-500 rounded-full"></span>
                                Contact Us
                            </h5>
                            <div className="space-y-4">
                                <a href={`tel:${settings.phone}`} className="flex items-start gap-4 text-slate-400 hover:text-brand-400 transition-colors group">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-brand-900/50 transition-colors flex-shrink-0 border border-slate-800 group-hover:border-brand-500/50">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium mb-0.5">Call Us</p>
                                        <span className="font-semibold text-sm">{settings.phone}</span>
                                    </div>
                                </a>
                                <a href={`https://wa.me/91${settings.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-start gap-4 text-slate-400 hover:text-green-400 transition-colors group">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-green-900/30 transition-colors flex-shrink-0 border border-slate-800 group-hover:border-green-500/50">
                                        <MessageCircle size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium mb-0.5">WhatsApp</p>
                                        <span className="font-semibold text-sm">{settings.whatsapp}</span>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Address & Hours */}
                        <div>
                            <h5 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
                                <span className="w-8 h-1 bg-brand-500 rounded-full"></span>
                                Our Address
                            </h5>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 text-slate-400">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 text-brand-400 border border-slate-800">
                                        <MapPin size={18} />
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed pt-1" style={{ whiteSpace: 'pre-line' }}>
                                        {settings.address}
                                    </p>
                                </div>
                                
                                <div className="flex items-start gap-4 text-slate-400">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 text-amber-400 border border-slate-800">
                                        <Clock size={18} />
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-sm font-bold text-slate-300">Working Hours</p>
                                        <p className="text-xs font-medium text-slate-500 mt-1">Monday - Sunday</p>
                                        <p className="text-sm font-medium text-amber-400">9:00 AM - 9:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-slate-500 text-sm font-medium">
                            &copy; {new Date().getFullYear()} {settings.businessName}. All rights reserved.
                        </div>
                        <div className="flex gap-6 text-sm font-semibold text-slate-500">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        {showPromoPopup && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-1 w-full max-w-sm shadow-2xl relative animate-fade-in">
                    <div className="bg-white rounded-[22px] p-8 text-center relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full blur-2xl opacity-50"></div>
                        <button onClick={() => setShowPromoPopup(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full p-1 z-10">
                            <X size={20} />
                        </button>
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600 shadow-inner">
                            <Shirt size={32} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight mb-4">Clean <span className="text-emerald-600">&</span> Care</h2>
                        <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">10% OFF</h3>
                        <p className="text-slate-700 font-bold text-lg mb-2">On All Prepaid Orders!</p>
                        <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">Select <span className="font-bold text-slate-700">UPI</span> as your payment method at checkout to automatically get a flat 10% discount on your entire bill.</p>
                        <button onClick={() => setShowPromoPopup(false)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all text-lg tracking-wide">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        )}
        {showLoginModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl relative animate-fade-in">
                    <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 rounded-full p-1">
                        <X size={20} />
                    </button>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Login Required</h3>
                    <p className="text-slate-500 mb-6 text-sm leading-relaxed">Please log in with your email to complete your booking securely.</p>
                    
                    {!otpSent ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="form-input w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-medium" placeholder="you@example.com" />
                            </div>
                            <button onClick={handleSendOtp} disabled={authLoading || !loginEmail} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {authLoading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Enter OTP</label>
                                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} className="form-input w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/20 transition-all tracking-[0.5em] text-center font-bold text-xl" placeholder="1234" maxLength="4" />
                                <p className="text-xs text-center text-slate-500 mt-3 font-medium">Default test OTP is <strong>1234</strong> if email is not configured in backend.</p>
                            </div>
                            <button onClick={handleVerifyOtp} disabled={authLoading || otp.length < 4} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                                {authLoading ? 'Verifying...' : 'Verify & Login'}
                            </button>
                            <button onClick={() => setOtpSent(false)} className="w-full text-sm text-brand-600 font-bold mt-3 hover:underline">Change Email Address</button>
                        </div>
                    )}
                </div>
            </div>
        )}
        {showProfileModal && customerProfileData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl relative animate-fade-in my-8 overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="bg-brand-600 p-6 sm:p-8 text-white relative shrink-0">
                        <button onClick={() => setShowProfileModal(false)} className="absolute top-6 right-6 text-brand-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2">
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-extrabold border-2 border-white/40">
                                {customerProfileData.email[0].toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-bold">{customerProfileData.name || 'Welcome Back!'}</h3>
                                    {customerProfileData.membership && customerProfileData.membership !== 'Regular' && (
                                        <span className={`text-xs font-bold px-2 py-1 rounded border ${
                                            customerProfileData.membership === 'VIP' ? 'bg-amber-400 text-amber-900 border-amber-300' : 'bg-blue-400 text-blue-900 border-blue-300'
                                        }`}>
                                            {customerProfileData.membership}
                                        </span>
                                    )}
                                </div>
                                <p className="text-brand-100">{customerProfileData.email}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 sm:p-8 overflow-y-auto bg-slate-50 flex-1">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 space-y-6">
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                        <Users size={14} /> Basic Details
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Phone</p>
                                            <p className="text-sm font-bold text-slate-800">{customerProfileData.phone || 'Not added'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Default Address</p>
                                            <p className="text-sm font-bold text-slate-800 break-words">{customerProfileData.address?.fullAddress || 'Not added'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                        <Clock size={14} /> Payment Summary
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Total Paid</p>
                                            <p className="text-lg font-bold text-emerald-600">
                                                ₹{customerProfileData.bookings?.filter(b => b.paymentStatus === 'Paid' && b.status !== 'Cancelled').reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Pending</p>
                                            <p className="text-lg font-bold text-rose-600">
                                                ₹{customerProfileData.bookings?.filter(b => b.paymentStatus === 'Pending' && b.status !== 'Cancelled').reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                        <Settings size={14} /> My Preferences
                                    </h4>
                                    {customerProfileData.preferences ? (
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(customerProfileData.preferences).filter(([k,v]) => v).map(([key]) => (
                                                <span key={key} className="bg-brand-50 text-brand-600 text-xs font-bold px-2 py-1 rounded-md capitalize border border-brand-100">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500">No preferences saved.</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="md:col-span-2">
                                <h4 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                                    <CalendarCheck size={20} className="text-brand-500" /> Order History
                                </h4>
                                
                                <div className="space-y-4">
                                    {customerProfileData.bookings && customerProfileData.bookings.length > 0 ? (
                                        customerProfileData.bookings.map((booking, idx) => (
                                            <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-brand-300 transition-all group">
                                                <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-4">
                                                    <div>
                                                        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md">Order #{booking._id.slice(-6).toUpperCase()}</span>
                                                        <p className="text-xs font-medium text-slate-500 mt-2">{booking.date} at {booking.time}</p>
                                                    </div>
                                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                                                        booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                        booking.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                                                        'bg-brand-100 text-brand-700'
                                                    }`}>{booking.status}</span>
                                                </div>
                                                
                                                {!['Completed', 'Cancelled'].includes(booking.status) && (
                                                    <div className="mb-6 relative">
                                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100">
                                                            <div style={{ width: `${
                                                                booking.status === 'Pending' ? '15%' :
                                                                booking.status === 'Confirmed' ? '30%' :
                                                                booking.status === 'Picked Up' ? '50%' :
                                                                booking.status === 'Washing' ? '65%' :
                                                                booking.status === 'Ironing' ? '80%' :
                                                                booking.status === 'Out For Delivery' ? '95%' : '0%'
                                                            }` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-500 transition-all duration-500"></div>
                                                        </div>
                                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                            <span className={['Pending', 'Confirmed', 'Picked Up', 'Washing', 'Ironing', 'Out For Delivery'].includes(booking.status) ? 'text-brand-600' : ''}>Picked Up</span>
                                                            <span className={['Washing', 'Ironing', 'Out For Delivery'].includes(booking.status) ? 'text-brand-600' : ''}>Washing</span>
                                                            <span className={['Out For Delivery'].includes(booking.status) ? 'text-brand-600' : ''}>Out For Delivery</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {booking.items?.map((item, i) => (
                                                        <span key={i} className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                                                            {item.name} <span className="font-extrabold text-slate-800 ml-1">x{item.quantity}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Amount</span>
                                                    <span className="text-lg font-black text-slate-900">₹{booking.totalAmount}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                                <CalendarCheck size={24} />
                                            </div>
                                            <h5 className="font-bold text-slate-700">No Orders Yet</h5>
                                            <p className="text-sm text-slate-500 mt-1">You haven't placed any laundry orders with us.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
};

const App = () => {
  return (
    <Routes>
      <Route path="/*" element={<MainWebsite />} />
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Building2, Phone, CalendarClock, CreditCard, Bell, Palette, Shield, Mail, MapPin, MessageCircle } from 'lucide-react';

const SettingsManager = ({ onThemeChange }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    businessName: '', tagline: '', address: '',
    gstNumber: '', instagram: '', facebook: '',
    openingTime: '08:00 AM', closingTime: '10:00 PM',
    pickupStartTime: '09:00 AM', pickupEndTime: '07:00 PM',
    deliveryStartTime: '11:00 AM', deliveryEndTime: '09:00 PM',
    expressDeliveryEnabled: false, sameDayDeliveryEnabled: false,
    closedDays: ['Sunday'], holidayMode: false,
    slotDuration: '1 hour', lastBookingTime: '08:00 PM', autoAcceptOrders: true, minimumNoticeHours: 2,
    serviceAreas: [],
    phone: '', whatsapp: '', email: '', mapLocation: '',
    homeDelivery: true, minimumOrderAmount: 0, pickupCharges: 0, expressDeliveryCharges: 100,
    cashOnDelivery: true, upiPaymentEnabled: true, upiId: '',
    whatsappAlerts: true, smsAlerts: false, emailAlerts: false,
    smtpUser: '', smtpPassword: '',
    darkMode: false, primaryColor: '#6366f1',
    adminUsername: '', adminPassword: '', requireOtpLogin: false
  });
  
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/settings');
        if (response.data) {
          const { qrCodeImage: fetchedQr, ...restSettings } = response.data;
          setSettings(prev => ({ 
            ...prev, 
            ...restSettings,
            serviceAreasRaw: restSettings.serviceAreas ? restSettings.serviceAreas.join(', ') : ''
          }));
          if (fetchedQr) setQrCodeImage(fetchedQr);
          if (onThemeChange && typeof restSettings.darkMode !== 'undefined') {
            onThemeChange(restSettings.darkMode);
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    
    setSettings(prev => ({
      ...prev,
      [name]: finalValue
    }));

    if (name === 'darkMode' && onThemeChange) {
      onThemeChange(finalValue);
    }
  };

  const toggleClosedDay = (day) => {
    setSettings(prev => ({
      ...prev,
      closedDays: prev.closedDays.includes(day)
        ? prev.closedDays.filter(d => d !== day)
        : [...prev.closedDays, day]
    }));
  };

  const handleAreasChange = (e) => {
    // Keep it as a string for the input value, but convert to array on save/change.
    // We'll actually just use a simple string input and parse it.
    const val = e.target.value;
    setSettings(prev => ({ ...prev, serviceAreasRaw: val }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        setMessage({ text: 'Image size should be less than 1MB', type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodeImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const payload = {
        ...settings,
        serviceAreas: settings.serviceAreasRaw 
          ? settings.serviceAreasRaw.split(',').map(a => a.trim()).filter(a => a)
          : [],
        qrCodeImage 
      };
      
      await axios.put('http://localhost:8000/api/settings', payload);
      setMessage({ text: 'Settings saved successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } catch (err) {
      console.error('Failed to update settings:', err);
      setMessage({ text: 'Failed to update settings.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'operations', label: 'Operations', icon: CalendarClock },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'booking', label: 'Booking', icon: CalendarClock },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  if (loading) return <div className="p-8 ">Loading settings...</div>;

  return (
    <div className="animate-fade-in pb-12">
      <div className="header flex justify-between items-center mb-8">
        <div>
          <h1 className="header-title text-3xl font-bold  mb-2">Platform Settings</h1>
          <p className="text-[var(--text-secondary)]">Manage all aspects of your laundry business platform</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary px-6 py-3 flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700  font-semibold transition-all shadow-lg hover:shadow-brand-500/25">
          {saving ? <div className="loader w-5 h-5 border-2"></div> : <Save size={20} />}
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-xl font-medium border flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Vertical Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[var(--bg-tertiary)] text-brand-500 shadow-md border border-[var(--border-color)]' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon size={20} className={activeTab === tab.id ? 'text-brand-500' : ''} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 glass-panel p-8 rounded-2xl border   backdrop-blur-xl">
          <form className="space-y-8">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold  mb-6 flex items-center gap-3">
                  <Building2 className="text-brand-400" /> General Info
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Business Name</label>
                    <input type="text" name="businessName" value={settings.businessName} onChange={handleChange} className="form-input w-full   focus:border-brand-500 rounded-lg px-4 py-3 " />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Tagline</label>
                    <input type="text" name="tagline" value={settings.tagline} onChange={handleChange} className="form-input w-full   focus:border-brand-500 rounded-lg px-4 py-3 " />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Shop Address</label>
                    <textarea name="address" value={settings.address} onChange={handleChange} rows="3" className="form-input w-full focus:border-brand-500 rounded-lg px-4 py-3 resize-y"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">GST Number</label>
                    <input type="text" name="gstNumber" value={settings.gstNumber} onChange={handleChange} className="form-input w-full focus:border-brand-500 rounded-lg px-4 py-3" placeholder="Optional" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Instagram Link</label>
                    <input type="text" name="instagram" value={settings.instagram} onChange={handleChange} className="form-input w-full focus:border-brand-500 rounded-lg px-4 py-3" placeholder="https://instagram.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Facebook Link</label>
                    <input type="text" name="facebook" value={settings.facebook} onChange={handleChange} className="form-input w-full focus:border-brand-500 rounded-lg px-4 py-3" placeholder="https://facebook.com/..." />
                  </div>
                </div>
              </div>
            )}

            {/* OPERATIONS TAB */}
            {activeTab === 'operations' && (
              <div className="space-y-10 animate-fade-in">
                
                {/* Section 1: Shop & Service Timings */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-3 border-b border-brand-500/20 pb-2">
                    <CalendarClock className="text-brand-400" /> Shop & Service Timings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-5 rounded-xl border border-[var(--border-color)] bg-slate-900/20">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-sm uppercase tracking-wider">Shop Hours</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Opening Time</label>
                          <input type="time" name="openingTime" value={settings.openingTime} onChange={handleChange} className="form-input w-full focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Closing Time</label>
                          <input type="time" name="closingTime" value={settings.closingTime} onChange={handleChange} className="form-input w-full focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-2" />
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-[var(--border-color)] bg-slate-900/20">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-sm uppercase tracking-wider">Pickup Window</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Start Time</label>
                          <input type="time" name="pickupStartTime" value={settings.pickupStartTime} onChange={handleChange} className="form-input w-full focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">End Time</label>
                          <input type="time" name="pickupEndTime" value={settings.pickupEndTime} onChange={handleChange} className="form-input w-full focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-2" />
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-[var(--border-color)] bg-slate-900/20">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-sm uppercase tracking-wider">Delivery Window</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Start Time</label>
                          <input type="time" name="deliveryStartTime" value={settings.deliveryStartTime} onChange={handleChange} className="form-input w-full focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">End Time</label>
                          <input type="time" name="deliveryEndTime" value={settings.deliveryEndTime} onChange={handleChange} className="form-input w-full focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-2" />
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-[var(--border-color)] bg-slate-900/20">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-sm uppercase tracking-wider">Booking Restrictions</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Minimum Notice (Hours)</label>
                          <input type="number" name="minimumNoticeHours" value={settings.minimumNoticeHours} onChange={handleChange} className="form-input w-full focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Last Booking Time</label>
                          <input type="time" name="lastBookingTime" value={settings.lastBookingTime} onChange={handleChange} className="form-input w-full focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Working Days & Holiday */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-3 border-b border-brand-500/20 pb-2">
                    <CalendarClock className="text-brand-400" /> Working Days & Holidays
                  </h2>
                  
                  <div className="p-5 rounded-xl border border-[var(--border-color)]">
                    <h3 className="font-semibold text-[var(--text-primary)] mb-4">Closed Days (Select to mark as closed)</h3>
                    <div className="flex flex-wrap gap-3">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                        const isClosed = settings.closedDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleClosedDay(day)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                              isClosed 
                                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-xl border border-[var(--border-color)]">
                    <div>
                      <h3 className="font-semibold text-lg">Holiday Mode (Temporarily Closed)</h3>
                      <p className="text-sm text-[var(--text-secondary)]">Pause all incoming orders immediately</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="holidayMode" checked={settings.holidayMode} onChange={handleChange} className="sr-only peer" />
                      <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-rose-500"></div>
                    </label>
                  </div>
                </div>

                {/* Section 3: Logistics & Express */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-3 border-b border-brand-500/20 pb-2">
                    <Building2 className="text-brand-400" /> Logistics & Express Services
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl border border-[var(--border-color)]">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-2">Service Areas</h3>
                      <p className="text-xs text-[var(--text-secondary)] mb-4">Comma separated list (e.g. Shanti Nagar, Civil Line)</p>
                      <input type="text" name="serviceAreasRaw" value={settings.serviceAreasRaw || ''} onChange={handleAreasChange} placeholder="Area 1, Area 2..." className="form-input w-full focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-3" />
                    </div>
                    <div className="p-5 rounded-xl border border-[var(--border-color)]">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-2">Slot Duration</h3>
                      <p className="text-xs text-[var(--text-secondary)] mb-4">Duration of each pickup/delivery slot</p>
                      <select name="slotDuration" value={settings.slotDuration} onChange={handleChange} className="form-input w-full focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-3 appearance-none">
                        <option value="30 mins">30 mins</option>
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-5 rounded-xl border border-[var(--border-color)]">
                      <div>
                        <h3 className="font-semibold text-[var(--text-primary)]">Express Delivery</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Enable express processing</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="expressDeliveryEnabled" checked={settings.expressDeliveryEnabled} onChange={handleChange} className="sr-only peer" />
                        <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-5 rounded-xl border border-[var(--border-color)]">
                      <div>
                        <h3 className="font-semibold text-[var(--text-primary)]">Same Day Delivery</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Enable same-day rush orders</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="sameDayDeliveryEnabled" checked={settings.sameDayDeliveryEnabled} onChange={handleChange} className="sr-only peer" />
                        <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT TAB */}
            {activeTab === 'contact' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold  mb-6 flex items-center gap-3">
                  <Phone className="text-brand-400" /> Contact Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 text-slate-500" size={18} />
                      <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="form-input w-full pl-10   focus:border-brand-500 rounded-lg py-3 " />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">WhatsApp Number</label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-3.5 text-emerald-500" size={18} />
                      <input type="text" name="whatsapp" value={settings.whatsapp} onChange={handleChange} className="form-input w-full pl-10   focus:border-emerald-500 rounded-lg py-3 " />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
                      <input type="email" name="email" value={settings.email} onChange={handleChange} className="form-input w-full pl-10   focus:border-brand-500 rounded-lg py-3 " />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Google Map Link</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 text-rose-500" size={18} />
                      <input type="text" name="mapLocation" value={settings.mapLocation} onChange={handleChange} placeholder="Paste Google Maps URL here" className="form-input w-full pl-10   focus:border-brand-500 rounded-lg py-3 " />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BOOKING TAB */}
            {activeTab === 'booking' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold  mb-6 flex items-center gap-3">
                  <CalendarClock className="text-brand-400" /> Booking Settings
                </h2>
                
                <div className="flex items-center justify-between p-5 rounded-xl border  /50">
                  <div>
                    <h3 className="font-semibold  text-lg">Home Delivery</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Enable or disable home delivery option for customers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="homeDelivery" checked={settings.homeDelivery} onChange={handleChange} className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-500"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Min. Order Amount (₹)</label>
                    <input type="number" name="minimumOrderAmount" value={settings.minimumOrderAmount} onChange={handleChange} className="form-input w-full   focus:border-brand-500 rounded-lg px-4 py-3 " />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Pickup Charges (₹)</label>
                    <input type="number" name="pickupCharges" value={settings.pickupCharges} onChange={handleChange} className="form-input w-full   focus:border-brand-500 rounded-lg px-4 py-3 " />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Express Delivery Extra (₹)</label>
                    <input type="number" name="expressDeliveryCharges" value={settings.expressDeliveryCharges} onChange={handleChange} className="form-input w-full   focus:border-brand-500 rounded-lg px-4 py-3 " />
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold  mb-6 flex items-center gap-3">
                  <CreditCard className="text-brand-400" /> Payment Methods
                </h2>
                
                <div className="flex items-center justify-between p-5 rounded-xl border  /50">
                  <div>
                    <h3 className="font-semibold  text-lg">Cash on Delivery (COD)</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Allow customers to pay when clothes are delivered</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="cashOnDelivery" checked={settings.cashOnDelivery} onChange={handleChange} className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-5 rounded-xl border  /50">
                  <div>
                    <h3 className="font-semibold  text-lg">UPI Payment (QR)</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Enable direct bank transfers via UPI</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="upiPaymentEnabled" checked={settings.upiPaymentEnabled} onChange={handleChange} className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-500"></div>
                  </label>
                </div>

                {settings.upiPaymentEnabled && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">UPI ID (For QR Payments)</label>
                      <input type="text" name="upiId" value={settings.upiId} onChange={handleChange} placeholder="e.g. 9406585448@ybl" className="form-input w-full   focus:border-brand-500 rounded-lg px-4 py-3 " />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Upload UPI QR Code (Optional)</label>
                      <div className="flex items-center gap-6">
                        <div className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center /50 overflow-hidden relative">
                          {qrCodeImage ? (
                            <img src={qrCodeImage} alt="UPI QR Code" className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-xs text-slate-500 text-center px-4">No QR Uploaded</span>
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          <p className="mb-1">Upload a screenshot of your PhonePe/Paytm QR code.</p>
                          <p className="text-xs">Max size: 1MB. Recommended format: JPG, PNG.</p>
                          {qrCodeImage && (
                            <button 
                              type="button" 
                              onClick={() => setQrCodeImage('')}
                              className="text-rose-500 hover:text-rose-400 mt-2 text-xs font-bold"
                            >
                              Remove QR Code
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl border border-brand-500/20 bg-brand-500/5 text-sm text-slate-300">
                  <span className="font-bold text-brand-400">Note:</span> Full Razorpay/Stripe payment gateway integration requires a merchant account. This UI is ready to be linked when you purchase the API.
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Bell className="text-brand-400" /> Notifications & Alerts
                </h2>
                
                {['whatsappAlerts', 'smsAlerts', 'emailAlerts'].map(alert => (
                  <div key={alert} className="flex items-center justify-between p-5 rounded-xl border border-[var(--border-color)]">
                    <div>
                      <h3 className="font-semibold text-lg capitalize">{alert.replace('Alerts', '')} Alerts</h3>
                      <p className="text-sm text-[var(--text-secondary)]">Send automated messages to customers via {alert.replace('Alerts', '')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name={alert} checked={settings[alert]} onChange={handleChange} className="sr-only peer" />
                      <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                ))}

                <div className="p-6 rounded-2xl border border-brand-500/20 bg-brand-500/5 mt-8">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Mail className="text-brand-400" size={20} /> Advanced Email (SMTP) Settings
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">Configure your Gmail App Password here to send OTPs and booking confirmations automatically. Leave blank to use .env defaults.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">SMTP User (Gmail)</label>
                      <input type="email" name="smtpUser" value={settings.smtpUser} onChange={handleChange} className="form-input w-full focus:border-brand-500 rounded-lg px-4 py-3" placeholder="yourstore@gmail.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">SMTP App Password</label>
                      <input type="password" name="smtpPassword" value={settings.smtpPassword} onChange={handleChange} className="form-input w-full focus:border-brand-500 rounded-lg px-4 py-3" placeholder="16-digit app password" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Shield className="text-brand-400" /> Security & Authentication
                </h2>

                <div className="flex items-center justify-between p-5 rounded-xl border border-[var(--border-color)]">
                  <div>
                    <h3 className="font-semibold text-lg">Require OTP Login</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Customers must verify their email with an OTP before booking.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="requireOtpLogin" checked={settings.requireOtpLogin} onChange={handleChange} className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                
                <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5">
                  <h3 className="text-lg font-bold mb-4">Change Admin Credentials</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Admin Username</label>
                      <input type="text" name="adminUsername" value={settings.adminUsername} onChange={handleChange} className="form-input w-full max-w-md focus:border-rose-500 rounded-lg px-4 py-3" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Admin Password</label>
                      <input type="password" name="adminPassword" value={settings.adminPassword} onChange={handleChange} className="form-input w-full max-w-md focus:border-rose-500 rounded-lg px-4 py-3" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* THEME TAB */}
            {activeTab === 'theme' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold  mb-6 flex items-center gap-3">
                  <Palette className="text-brand-400" /> Appearance
                </h2>
                
                <div className="flex items-center justify-between p-5 rounded-xl border  /50">
                  <div>
                    <h3 className="font-semibold  text-lg">Dark Mode</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Toggle dark mode for the admin panel</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="darkMode" checked={settings.darkMode} onChange={handleChange} className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-500"></div>
                  </label>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;

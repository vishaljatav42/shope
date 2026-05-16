import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, MessageCircle, Mail, MessageSquare, Save, CheckCircle2, AlertCircle } from 'lucide-react';

const NotificationsManager = () => {
  const [settings, setSettings] = useState({
    whatsappAlerts: true,
    smsAlerts: false,
    emailAlerts: false,
    templatePickupConfirmed: '',
    templateWashingStarted: '',
    templateOutForDelivery: '',
    templateDelivered: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/settings');
      if (response.data) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('http://localhost:8000/api/settings', settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save notification settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-3">
            <Bell className="text-brand-500" size={28} />
            Notifications & Alerts
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Manage automated customer messaging templates and alert channels</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn btn-primary flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-brand-500/30 transition-all font-bold"
        >
          {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Save size={20} />}
          {saveSuccess ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Global Toggles */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <AlertCircle className="text-slate-400" size={20} />
              Active Channels
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><MessageCircle size={20} /></div>
                  <div>
                    <h3 className="font-bold text-slate-800">WhatsApp</h3>
                    <p className="text-xs text-slate-500">Primary alerts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="whatsappAlerts" checked={settings.whatsappAlerts} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><MessageSquare size={20} /></div>
                  <div>
                    <h3 className="font-bold text-slate-800">SMS Alerts</h3>
                    <p className="text-xs text-slate-500">Fallback alerts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="smsAlerts" checked={settings.smsAlerts} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Mail size={20} /></div>
                  <div>
                    <h3 className="font-bold text-slate-800">Email Alerts</h3>
                    <p className="text-xs text-slate-500">Invoices & Receipts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="emailAlerts" checked={settings.emailAlerts} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl shadow-sm text-slate-100">
            <h3 className="font-bold mb-2 flex items-center gap-2"><CheckCircle2 size={18} className="text-brand-400" /> Smart Tags</h3>
            <p className="text-sm text-slate-400 mb-4">Use these variables in your templates. They will be automatically replaced with real order data.</p>
            <ul className="space-y-2 text-sm font-mono bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <li><span className="text-brand-400 font-bold">[CustomerName]</span></li>
              <li><span className="text-brand-400 font-bold">[OrderID]</span></li>
            </ul>
          </div>
        </div>

        {/* Right Column: Templates */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MessageCircle className="text-slate-400" size={20} />
              Workflow Message Templates
            </h2>
            
            <div className="space-y-6">
              
              <div className="group">
                <label className="flex justify-between items-end mb-2">
                  <span className="font-bold text-slate-700">1. Pickup Confirmed</span>
                  <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-md">Status: Picked Up</span>
                </label>
                <textarea 
                  name="templatePickupConfirmed" 
                  value={settings.templatePickupConfirmed} 
                  onChange={handleChange} 
                  rows="3"
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                  placeholder="Enter message for when clothes are picked up..."
                />
              </div>

              <div className="group">
                <label className="flex justify-between items-end mb-2">
                  <span className="font-bold text-slate-700">2. Washing Started</span>
                  <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-md">Status: Washing</span>
                </label>
                <textarea 
                  name="templateWashingStarted" 
                  value={settings.templateWashingStarted} 
                  onChange={handleChange} 
                  rows="3"
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                  placeholder="Enter message for when washing begins..."
                />
              </div>

              <div className="group">
                <label className="flex justify-between items-end mb-2">
                  <span className="font-bold text-slate-700">3. Out For Delivery</span>
                  <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">Status: Out For Delivery</span>
                </label>
                <textarea 
                  name="templateOutForDelivery" 
                  value={settings.templateOutForDelivery} 
                  onChange={handleChange} 
                  rows="3"
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                  placeholder="Enter message for out for delivery..."
                />
              </div>

              <div className="group">
                <label className="flex justify-between items-end mb-2">
                  <span className="font-bold text-slate-700">4. Order Delivered</span>
                  <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">Status: Completed</span>
                </label>
                <textarea 
                  name="templateDelivered" 
                  value={settings.templateDelivered} 
                  onChange={handleChange} 
                  rows="3"
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                  placeholder="Enter message for successful delivery..."
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsManager;

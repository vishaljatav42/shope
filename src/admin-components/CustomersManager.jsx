import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Search, ChevronRight, MessageCircle, RefreshCw, Calendar, Edit, X } from 'lucide-react';

const CustomersManager = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/customers');
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadCustomerProfile = async (id) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/customers/${id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedCustomer(data);
                setActiveTab('orders');
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateCustomerField = async (field, value) => {
        try {
            const res = await fetch(`http://localhost:8000/api/customers/${selectedCustomer._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value })
            });
            if (res.ok) {
                setSelectedCustomer(prev => ({ ...prev, [field]: value }));
            } else {
                alert('Failed to update');
            }
        } catch (error) {
            alert('Server error while updating');
        }
    };

    if (selectedCustomer) {
        return (
            <div className="animate-fade-in pb-12">
                <button onClick={() => setSelectedCustomer(null)} className="flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-6 font-semibold transition-colors">
                    <ChevronRight size={18} className="rotate-180" /> Back to Customers
                </button>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Sidebar Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-brand-100 to-brand-50 rounded-full flex items-center justify-center text-brand-600 font-bold text-3xl shadow-inner mb-4">
                                    {selectedCustomer.email ? selectedCustomer.email[0].toUpperCase() : 'C'}
                                </div>
                                <h3 className="text-xl font-extrabold text-slate-900">{selectedCustomer.name || 'No Name Set'}</h3>
                                <p className="text-slate-500 text-sm font-medium">{selectedCustomer.email}</p>
                                
                                <div className="flex gap-2 mt-3">
                                    <select 
                                        value={selectedCustomer.status || 'Active'}
                                        onChange={(e) => updateCustomerField('status', e.target.value)}
                                        className={`text-xs font-bold px-3 py-1 rounded-full border outline-none ${
                                            selectedCustomer.status === 'VIP' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                            selectedCustomer.status === 'Blocked' ? 'bg-red-50 text-red-600 border-red-200' :
                                            'bg-emerald-50 text-emerald-600 border-emerald-200'
                                        }`}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Regular">Regular</option>
                                        <option value="VIP">VIP</option>
                                        <option value="Blocked">Blocked</option>
                                    </select>
                                    <select 
                                        value={selectedCustomer.membership || 'Regular'}
                                        onChange={(e) => updateCustomerField('membership', e.target.value)}
                                        className={`text-xs font-bold px-3 py-1 rounded-full border outline-none ${
                                            selectedCustomer.membership === 'VIP' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                            selectedCustomer.membership === 'Monthly Package' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                            'bg-slate-50 text-slate-600 border-slate-200'
                                        }`}
                                    >
                                        <option value="Regular">Regular</option>
                                        <option value="Monthly Package">Monthly Package</option>
                                        <option value="VIP">VIP</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                                        <Phone size={16} /> <span className="font-medium">{selectedCustomer.phone || 'N/A'}</span>
                                    </div>
                                    {selectedCustomer.phone && (
                                        <a href={`https://wa.me/91${selectedCustomer.phone}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                                            <MessageCircle size={14} />
                                        </a>
                                    )}
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                                        <Phone size={16} className="opacity-50" /> <span className="font-medium text-slate-400">Alt: {selectedCustomer.alternateNumber || 'Not provided'}</span>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Financial Stats</p>
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-center">
                                            <div className="text-2xl font-extrabold text-emerald-600">
                                                ₹{selectedCustomer.bookings?.filter(b => b.paymentStatus === 'Paid' && b.status !== 'Cancelled').reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0}
                                            </div>
                                            <div className="text-xs font-medium text-emerald-700">Total Paid</div>
                                        </div>
                                        <div className="bg-rose-50 rounded-xl p-3 border border-rose-100 text-center">
                                            <div className="text-2xl font-extrabold text-rose-600">
                                                ₹{selectedCustomer.bookings?.filter(b => b.paymentStatus === 'Pending' && b.status !== 'Cancelled').reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0}
                                            </div>
                                            <div className="text-xs font-medium text-rose-700">Pending Amount</div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                                        <div className="text-xl font-bold text-slate-700">{selectedCustomer.stats?.totalOrders || 0} Total Orders</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="flex border-b border-slate-100 bg-slate-50/50">
                                <button onClick={() => setActiveTab('orders')} className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'orders' ? 'text-brand-600 border-b-2 border-brand-500 bg-white' : 'text-slate-500 hover:bg-slate-50'}`}>Order History</button>
                                <button onClick={() => setActiveTab('address')} className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'address' ? 'text-brand-600 border-b-2 border-brand-500 bg-white' : 'text-slate-500 hover:bg-slate-50'}`}>Address & Preferences</button>
                                <button onClick={() => setActiveTab('notes')} className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'notes' ? 'text-brand-600 border-b-2 border-brand-500 bg-white' : 'text-slate-500 hover:bg-slate-50'}`}>Admin Notes</button>
                            </div>

                            <div className="p-6">
                                {activeTab === 'orders' && (
                                    <div className="space-y-4">
                                        {selectedCustomer.bookings && selectedCustomer.bookings.length > 0 ? (
                                            selectedCustomer.bookings.map((booking, idx) => (
                                                <div key={idx} className="border border-slate-100 rounded-xl p-4 hover:border-brand-200 transition-colors bg-slate-50/30">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <div className="font-bold text-slate-800 text-lg">Order #{booking._id.slice(-6).toUpperCase()}</div>
                                                            <div className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                                                                <Calendar size={12} /> {booking.date} at {booking.time}
                                                            </div>
                                                        </div>
                                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                                            booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                            booking.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>{booking.status}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {booking.items?.map((item, i) => (
                                                            <span key={i} className="bg-white border border-slate-200 text-slate-600 text-xs px-2 py-1 rounded-md font-medium">
                                                                {item.name} <span className="text-brand-600 ml-1">x{item.quantity}</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                                                        <span className="text-sm font-bold text-slate-600">{booking.paymentMethod}</span>
                                                        <span className="font-extrabold text-slate-900">₹{booking.totalAmount}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-slate-400">
                                                <RefreshCw size={32} className="mx-auto mb-3 opacity-20" />
                                                <p className="font-medium">No orders found for this customer.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'address' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><MapPin size={18} className="text-brand-500" /> Default Address</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 mb-1">Full Address</label>
                                                    <textarea 
                                                        value={selectedCustomer.address?.fullAddress || ''}
                                                        onChange={(e) => updateCustomerField('address', {...selectedCustomer.address, fullAddress: e.target.value})}
                                                        className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-brand-500 outline-none"
                                                        rows="3"
                                                        placeholder="e.g. House No 42, ABC Society..."
                                                    ></textarea>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1">Landmark</label>
                                                        <input 
                                                            type="text"
                                                            value={selectedCustomer.address?.landmark || ''}
                                                            onChange={(e) => updateCustomerField('address', {...selectedCustomer.address, landmark: e.target.value})}
                                                            className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-brand-500 outline-none"
                                                            placeholder="Near temple..."
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-bold text-slate-500 mb-1">City</label>
                                                            <input type="text" value={selectedCustomer.address?.city || 'Vidisha'} onChange={(e) => updateCustomerField('address', {...selectedCustomer.address, city: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-slate-500 mb-1">Pincode</label>
                                                            <input type="text" value={selectedCustomer.address?.pincode || ''} onChange={(e) => updateCustomerField('address', {...selectedCustomer.address, pincode: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-slate-100">
                                            <h4 className="font-bold text-slate-800 mb-4">Washing Preferences</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {['regularWash', 'dryClean', 'steamIron', 'premiumCare', 'separateWhite', 'perfume'].map((prefKey) => (
                                                    <label key={prefKey} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedCustomer.preferences?.[prefKey] || false}
                                                            onChange={(e) => updateCustomerField('preferences', {...selectedCustomer.preferences, [prefKey]: e.target.checked})}
                                                            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                                                        />
                                                        <span className="text-sm font-medium text-slate-700 capitalize">{prefKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'notes' && (
                                    <div>
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                                            <p className="text-xs font-bold text-amber-800">Private Notes</p>
                                            <p className="text-xs text-amber-600 mt-1">These notes are only visible to admins. Use this to track special requirements or customer behavior.</p>
                                        </div>
                                        <textarea
                                            value={selectedCustomer.adminNotes || ''}
                                            onChange={(e) => updateCustomerField('adminNotes', e.target.value)}
                                            placeholder="e.g. Customer urgent delivery mangta hai. Kapde alag pack karne hain."
                                            className="w-full min-h-[200px] border border-slate-200 rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none leading-relaxed resize-y"
                                        ></textarea>
                                        <div className="text-right mt-2">
                                            <span className="text-xs font-medium text-slate-400">Changes are saved automatically when typing.</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in pb-12">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Customers CRM</h2>
                <p className="text-slate-500 mt-2 font-medium">Manage your registered customers, view their order history, and save important notes.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search customers..." className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                    </div>
                    <button onClick={fetchCustomers} className="p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">
                        <RefreshCw size={18} className={loading ? "animate-spin text-brand-500" : ""} />
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                                <th className="p-4">Customer</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && customers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-12 text-slate-400 font-medium">Loading customers...</td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-12 text-slate-400 font-medium">No customers found.</td>
                                </tr>
                            ) : (
                                customers.map((c, i) => (
                                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => loadCustomerProfile(c._id)}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">
                                                    {c.email ? c.email[0].toUpperCase() : 'C'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{c.name || 'Unknown'}</div>
                                                    <div className="text-xs font-medium text-slate-500">{c.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-slate-700">{c.phone || 'N/A'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                c.status === 'VIP' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                c.status === 'Blocked' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            }`}>
                                                {c.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors flex items-center justify-end gap-1 w-full">
                                                View Profile <ChevronRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomersManager;

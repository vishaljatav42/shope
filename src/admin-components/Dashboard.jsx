import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { CalendarCheck, Users, TrendingUp, RefreshCw, ArchiveRestore, X } from 'lucide-react'

const Dashboard = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  const fetchBookings = async () => {
    try {
      setIsRefreshing(true)
      const response = await axios.get('http://localhost:8000/api/bookings')
      setBookings(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to load bookings. Make sure the backend server is running.')
    } finally {
      setLoading(false)
      setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/bookings/${id}/status`, { status: newStatus })
      // Update local state to reflect change without full refresh
      setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b))
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update booking status')
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const totalBookings = bookings.length
  const todayBookings = bookings.filter(b => {
    const today = new Date().toISOString().split('T')[0]
    if (b.createdAt) {
      return b.createdAt.startsWith(today)
    }
    return false
  }).length

  const handlePaymentStatusChange = async (id, newPaymentStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newPaymentStatus })
      })
      if (res.ok) {
        setBookings(bookings.map(b => b._id === id ? { ...b, paymentStatus: newPaymentStatus } : b))
      }
    } catch (error) {
      console.error('Failed to update payment status', error)
    }
  }

  return (
    <div className="animate-fade-in relative">
      <div className="header">
        <h1 className="header-title">Dashboard Overview</h1>
        <div className="header-actions">
          <button 
            className="btn btn-outline" 
            onClick={fetchBookings}
            disabled={isRefreshing}
          >
            <RefreshCw size={18} className={isRefreshing ? 'loader' : ''} />
            Refresh
          </button>
          <button className="btn btn-primary">
            Export Data
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrapper blue">
            <CalendarCheck size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-label">Total Bookings</div>
            <div className="metric-value">{loading ? '-' : totalBookings}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrapper green">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-label">New Today</div>
            <div className="metric-value">{loading ? '-' : todayBookings}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrapper orange">
            <Users size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-label">Active Customers</div>
            <div className="metric-value">{loading ? '-' : new Set(bookings.map(b => b.phone)).size}</div>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <div className="panel-header">
          <h2 className="panel-title">Recent Bookings</h2>
        </div>
        
        {loading ? (
          <div className="empty-state">
            <div className="loader" style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', width: '32px', height: '32px', marginBottom: '16px' }}></div>
            <p>Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p style={{ color: 'var(--danger)' }}>{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <ArchiveRestore className="empty-icon" />
            <h3>No Bookings Found</h3>
            <p>Waiting for new customers to book services.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Address</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr 
                    key={booking._id} 
                    style={{ 
                      animation: `fadeIn 0.5s ease forwards`,
                      animationDelay: `${index * 0.1}s`,
                      opacity: 0 
                    }}
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>{booking.name}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{booking.phone}</div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1 max-w-[200px]">
                        {booking.items && booking.items.length > 0 ? (
                          booking.items.map((item, i) => (
                            <span key={i} className="text-xs bg-brand-50 text-brand-700 font-medium px-2 py-1 rounded-md border border-brand-100 whitespace-nowrap overflow-hidden text-ellipsis">
                              {item.name} <span className="font-bold opacity-75">x{item.quantity}</span>
                            </span>
                          ))
                        ) : (
                          <span className="badge service">{booking.service || 'Legacy Data'}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 500 }}>{booking.date}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{booking.time}</div>
                    </td>
                    <td style={{ maxWidth: '250px', whiteSpace: 'normal', wordWrap: 'break-word', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {booking.address}
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full w-max ${
                          booking.paymentMethod === 'UPI' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {booking.paymentMethod || 'Cash on Delivery'}
                        </span>
                        {booking.totalAmount > 0 && (
                          <span className="text-sm font-bold text-[var(--text-primary)] mt-1">₹{booking.totalAmount}</span>
                        )}
                        <select 
                          value={booking.paymentStatus || 'Pending'}
                          onChange={(e) => handlePaymentStatusChange(booking._id, e.target.value)}
                          className={`mt-1 text-xs font-bold px-2 py-1 rounded border outline-none ${
                            booking.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                          }`}
                        >
                          <option value="Pending">Payment Pending</option>
                          <option value="Paid">Payment Paid</option>
                        </select>
                        {booking.paymentScreenshot && (
                          <button 
                            onClick={() => setSelectedReceipt(booking.paymentScreenshot)}
                            className="text-xs text-blue-500 hover:text-blue-400 font-bold text-left mt-1 underline cursor-pointer"
                          >
                            View Receipt
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <select 
                        value={booking.status || 'Pending'} 
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className={`badge status-select ${
                          booking.status === 'Completed' ? 'status-completed' : 
                          booking.status === 'Cancelled' ? 'status-cancelled' : 
                          ['Confirmed', 'Pickup Assigned', 'Picked Up', 'Washing', 'Ironing', 'Packing', 'Out For Delivery'].includes(booking.status) ? 'status-confirmed' : 'status-pending'
                        }`}
                        style={{ outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pickup Assigned">Pickup Assigned</option>
                        <option value="Picked Up">Picked Up</option>
                        <option value="Washing">Washing</option>
                        <option value="Ironing">Ironing</option>
                        <option value="Packing">Packing</option>
                        <option value="Out For Delivery">Out For Delivery</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedReceipt(null)}>
          <div className="relative max-w-2xl w-full max-h-[90vh] bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-2 shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-800">
              <h3 className="text-[var(--text-primary)] font-bold text-lg">Payment Receipt</h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-tertiary)] p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex justify-center items-center">
              <img src={selectedReceipt} alt="Payment Receipt" className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

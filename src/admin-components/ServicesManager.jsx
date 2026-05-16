import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Trash2, Tag, Info, DollarSign } from 'lucide-react'

const ServicesManager = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Form State
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8000/api/services')
      setServices(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching services:', err)
      setError('Failed to load services.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !description || !price) return

    try {
      setSubmitting(true)
      const response = await axios.post('http://localhost:8000/api/services', {
        name,
        description,
        price: Number(price)
      })
      if (response.data.success) {
        setServices([response.data.data, ...services])
        setName('')
        setDescription('')
        setPrice('')
      }
    } catch (err) {
      console.error('Error adding service:', err)
      alert('Failed to add service.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await axios.delete(`http://localhost:8000/api/services/${id}`)
      if (response.data.success) {
        setServices(services.filter(s => s._id !== id))
      }
    } catch (err) {
      console.error('Error deleting service:', err)
      alert('Failed to delete service.')
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="header">
        <h1 className="header-title">Services Management</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', alignItems: 'start' }}>
        
        {/* Add Service Form */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px' }}>Add New Service</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Tag size={16} /> Service Name
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dry Cleaning"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <DollarSign size={16} /> Base Price (₹)
              </label>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 50"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Info size={16} /> Description
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the service..."
                className="form-input"
                rows="4"
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: '10px' }}>
              {submitting ? <div className="loader" style={{ width: '16px', height: '16px' }}></div> : <Plus size={18} />}
              Add Service
            </button>
          </form>
        </div>

        {/* Existing Services List */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px' }}>Active Services</h2>
          {loading ? (
            <div className="loader"></div>
          ) : error ? (
            <div style={{ color: 'var(--danger)' }}>{error}</div>
          ) : services.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No services found. Add one to get started!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {services.map((service, index) => (
                <div 
                  key={service._id} 
                  className="glass-panel service-card"
                  style={{ 
                    padding: '24px', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    animation: `fadeIn 0.4s ease forwards`,
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {service.name}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                      {service.description}
                    </p>
                    <span className="badge service" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)' }}>
                      ₹{service.price}
                    </span>
                  </div>
                  <button 
                    className="btn-icon" 
                    onClick={() => handleDelete(service._id)}
                    style={{ color: 'var(--danger)', background: 'rgba(244, 63, 94, 0.1)' }}
                    title="Delete Service"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ServicesManager

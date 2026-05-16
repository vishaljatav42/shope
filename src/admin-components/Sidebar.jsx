import React from 'react'
import { LayoutDashboard, Users, Settings, CalendarCheck, Droplets, Tag } from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'All Bookings', icon: CalendarCheck },
    { id: 'services', label: 'Services', icon: Tag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Droplets className="sidebar-brand-icon" size={28} />
        Clean & Care
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <div 
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </div>
          )
        })}
      </nav>
      
      <div style={{ marginTop: 'auto', padding: '20px' }}>
        <div 
          className="nav-item"
          onClick={onLogout}
          style={{ color: 'var(--danger)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>Logout</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

import './adminSidebar.css'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../logo/logo.png'

// Icons
function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 5a2 2 0 0 1 2-2h6l2 2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
    </svg>
  )
}

function SignOutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14 4h5v16h-5" />
      <path d="M10 12h9" />
      <path d="m16 8 4 4-4 4" />
      <path d="M4 4h6" />
      <path d="M4 20h6" />
    </svg>
  )
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m0 0H3m2 0v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9m0 0h2m-2 0V5a2 2 0 0 0-2-2h-4" />
    </svg>
  )
}

function AdminSidebar({ onNavigate }) {
  const navigate = useNavigate()
  const location = useLocation()

  const pathname = location.pathname || ''
  const isOrdersActive = pathname === '/admin/dashboard' || pathname.startsWith('/orders')
  const isMenuActive = pathname === '/admin/menu'
  const isSettingsActive = pathname === '/admin/settings'

  const handleMenuItemClick = (path) => {
    navigate(path)
    if (onNavigate) onNavigate()
  }

  const handleLogout = () => {
    localStorage.removeItem('grabngoUser')
    navigate('/login', { replace: true })
  }

  return (
    <aside className="admin-sidebar">
      {/* Logo Section */}
      <div className="admin-sidebar-logo-section">
        <img src={logo} alt="GrabNGo Logo" className="admin-sidebar-logo" />
      </div>

      {/* Menu Section */}
      <nav className="admin-sidebar-nav">
        <ul className="admin-sidebar-menu-list">
          <li>
            <button
              onClick={() => handleMenuItemClick('/admin/dashboard')}
              className={`admin-sidebar-menu-item ${isOrdersActive ? 'active' : ''}`}
              aria-current={isOrdersActive ? 'page' : undefined}
            >
              <OrdersIcon />
              <span>Orders</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleMenuItemClick('/admin/menu')}
              className={`admin-sidebar-menu-item ${isMenuActive ? 'active' : ''}`}
              aria-current={isMenuActive ? 'page' : undefined}
            >
              <FolderIcon />
              <span>Menu</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleMenuItemClick('/admin/settings')}
              className={`admin-sidebar-menu-item ${isSettingsActive ? 'active' : ''}`}
              aria-current={isSettingsActive ? 'page' : undefined}
            >
              <SettingsIcon />
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="admin-sidebar-logout">
        <button type="button" className="admin-sidebar-logout-button" onClick={handleLogout}>
          <SignOutIcon />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar

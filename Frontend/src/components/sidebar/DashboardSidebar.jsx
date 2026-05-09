import './dashboardSidebar.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import logoOrange from '../logo/logo.png'
import { getCurrentUser } from '../../utils/cartUtils'

// Icons
function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 5a2 2 0 0 1 2-2h6l2 2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 5v14h4V5m0 0l8-1v15l-8 1V5z" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 19a8 8 0 0 1 16 0" />
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

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 17v.01" />
      <path d="M9.59 9a3 3 0 0 1 5.84 1c0 2-3 3-3 3" />
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

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 5h2l2.2 10.2a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 8H7" />
      <circle cx="10" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  )
}

function DashboardSidebar({ onNavigate }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useMemo(() => getCurrentUser(), [])

  const pathname = location.pathname || ''

  const isBrowseActive = pathname === '/dashboard' || pathname.startsWith('/meal')
  const isCartActive = pathname === '/cart' || pathname.startsWith('/cart')
  const isOrdersActive = pathname === '/orders' || pathname.startsWith('/orders')
  const isProfileActive = pathname === '/profile' || pathname.startsWith('/profile')
  const isSettingsActive = pathname === '/settings' || pathname.startsWith('/settings')
  const isHelpActive = pathname === '/help' || pathname.startsWith('/help')

  const handleMenuItemClick = (path) => {
    navigate(path)
    if (onNavigate) onNavigate()
  }

  return (
    <>
      <aside className="dashboard-sidebar">
        {/* Logo Section */}
        <div className="sidebar-logo-section">
          <img src={logoOrange} alt="GrabNGo Logo" className="sidebar-logo" />
        </div>

        {/* Menu Section */}
        <nav className="sidebar-nav">
          <p className="sidebar-section-label">MENU</p>
          <ul className="sidebar-menu-list">
            <li>
              <button
                onClick={() => handleMenuItemClick('/dashboard')}
                className={`sidebar-menu-item ${isBrowseActive ? 'active' : ''}`}
                aria-current={isBrowseActive ? 'page' : undefined}
              >
                <MenuIcon />
                <span>Browse Meals</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleMenuItemClick('/cart')}
                className={`sidebar-menu-item ${isCartActive ? 'active' : ''}`}
                aria-current={isCartActive ? 'page' : undefined}
              >
                <CartIcon />
                <span>Shopping Cart</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleMenuItemClick('/orders')}
                className={`sidebar-menu-item ${isOrdersActive ? 'active' : ''}`}
                aria-current={isOrdersActive ? 'page' : undefined}
              >
                <FlagIcon />
                <span>My Orders</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Account Section */}
        <nav className="sidebar-nav sidebar-account">
          <p className="sidebar-section-label">ACCOUNT</p>
          <ul className="sidebar-menu-list">
            <li>
              <button
                onClick={() => handleMenuItemClick('/profile')}
                className={`sidebar-menu-item ${isProfileActive ? 'active' : ''}`}
                aria-current={isProfileActive ? 'page' : undefined}
              >
                <PersonIcon />
                <span>My Profile</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleMenuItemClick('/settings')}
                className={`sidebar-menu-item ${isSettingsActive ? 'active' : ''}`}
                aria-current={isSettingsActive ? 'page' : undefined}
              >
                <SettingsIcon />
                <span>Settings</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleMenuItemClick('/help')}
                className={`sidebar-menu-item ${isHelpActive ? 'active' : ''}`}
                aria-current={isHelpActive ? 'page' : undefined}
              >
                <HelpIcon />
                <span>Help & Support</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* User Account Footer */}
        <div className="sidebar-user-footer">
          <button
            type="button"
            className="sidebar-user-button"
            onClick={() => handleMenuItemClick('/profile')}
            aria-label={`Logged in as ${user.fullName}`}
          >
            <div className="user-avatar">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info">
              <p className="user-name">{user.fullName || 'User'}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </button>
        </div>
    </aside>
    </>
  )
}

export default DashboardSidebar

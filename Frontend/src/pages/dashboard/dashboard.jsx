import './dashboard.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoOrange from '../../components/logo/logoorange.png'

const demoMeals = [
  { id: 1, name: 'Chicken Teriyaki Bowl', price: 'P145.00' },
  { id: 2, name: 'Beef Tapa Rice', price: 'P165.00' },
  { id: 3, name: 'Spicy Tuna Pasta', price: 'P155.00' },
  { id: 4, name: 'Garlic Butter Shrimp', price: 'P189.00' },
  { id: 5, name: 'Classic Burger Combo', price: 'P175.00' },
  { id: 6, name: 'Baked Mac & Cheese', price: 'P150.00' },
  { id: 7, name: 'Sisig Rice Bowl', price: 'P140.00' },
  { id: 8, name: 'Creamy Carbonara', price: 'P160.00' },
]

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 5h2l2.2 10.2a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 8H7" />
      <circle cx="10" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 19a8 8 0 0 1 16 0" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function LogoutIcon() {
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

function Dashboard() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false)
  const menuRef = useRef(null)

  const user = useMemo(() => {
    const stored = localStorage.getItem('grabngoUser')
    if (!stored) {
      return { fullName: 'GrabNGo User' }
    }

    try {
      const parsed = JSON.parse(stored)
      return { fullName: parsed.fullName || 'GrabNGo User' }
    } catch {
      return { fullName: 'GrabNGo User' }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleProfileClick = () => {
    setMenuOpen(false)
    navigate('/profile')
  }

  const handleSignOut = () => {
    localStorage.removeItem('grabngoUser')
    setMenuOpen(false)
    navigate('/login')
  }

  const handleLogoutClick = () => {
    setMenuOpen(false)
    setShowLogoutConfirmModal(true)
  }

  const handleConfirmLogout = () => {
    setShowLogoutConfirmModal(false)
    handleSignOut()
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <button
          type="button"
          className="logo-button"
          onClick={() => navigate('/dashboard')}
          aria-label="Go to dashboard"
        >
          <img src={logoOrange} alt="GrabNGo" className="dashboard-logo" />
        </button>

        <div className="header-actions" aria-label="Header actions">
          <button type="button" className="icon-button" aria-label="Shopping cart">
            <CartIcon />
          </button>

          <div className="profile-menu" ref={menuRef}>
            <button
              type="button"
              className="profile-chip"
              aria-label="Profile menu"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="profile-chip-icon">
                <ProfileIcon />
              </span>
              <span className="profile-chip-name">{user.fullName}</span>
              <span className="profile-chip-caret">
                <ChevronDownIcon />
              </span>
            </button>

            {menuOpen && (
              <div className="profile-dropdown" role="menu" aria-label="Profile options">
                <button type="button" className="dropdown-item" role="menuitem" onClick={handleProfileClick}>
                  <ProfileIcon />
                  Profile
                </button>
                <button type="button" className="dropdown-item signout-item" role="menuitem" onClick={handleLogoutClick}>
                  <LogoutIcon />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="toolbar" aria-label="Meal search and filter">
          <label htmlFor="meal-search" className="search-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.2-4.2" />
            </svg>
            <input id="meal-search" type="search" placeholder="Search a meal" />
          </label>

          <button type="button" className="filter-button">
            Meal Filter
          </button>
        </section>

        <h1>Available Meals</h1>

        <section className="meal-grid" aria-label="Available meals">
          {demoMeals.map((meal) => (
            <article className="meal-card" key={meal.id}>
              <div className="meal-image" aria-hidden="true">
                <span>Meal Image</span>
              </div>

              <div className="meal-info">
                <p className="meal-name">{meal.name}</p>
                <p className="meal-price">{meal.price}</p>
                <button type="button" className="add-cart-button">
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {showLogoutConfirmModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Logout confirmation">
          <div className="confirm-modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to sign out?</p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-button"
                onClick={() => setShowLogoutConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-confirm-button"
                onClick={handleConfirmLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

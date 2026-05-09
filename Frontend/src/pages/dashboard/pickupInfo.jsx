import './pickupInfo.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoOrange from '../../components/logo/logoorange.png'
import DashboardSidebar from '../../components/sidebar/DashboardSidebar'
import ClockDial from '../../components/ClockDial/ClockDial'
import CalendarDial from '../../components/CalendarDial/CalendarDial'
import { createOrder } from '../../api/orderApi'
import {
  getCartCount,
  getCartTotal,
  getCurrentUser,
  loadCart,
  saveCart,
} from '../../utils/cartUtils'

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

const PICKUP_TIMES = ['11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM']
const PAYMENT_METHODS = ['Cash', 'G-Cash', 'GoTyme', 'PayMaya']

function generateOrderId() {
  const randomPart = Math.floor(100000 + Math.random() * 900000)
  return `#GNG${randomPart}`
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

function PickupInfoPage() {
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState(() => loadCart(getCurrentUser().email))
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState(PICKUP_TIMES[1])
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0])
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const user = useMemo(() => getCurrentUser(), [])

  useEffect(() => {
    saveCart(user.email, cartItems)
  }, [cartItems, user.email])

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

  const formatPrice = (value) => `P${Number(value || 0).toFixed(2)}`
  const cartTotal = getCartTotal(cartItems)
  const cartCount = getCartCount(cartItems)

  const handleProfileClick = () => {
    setMenuOpen(false)
    navigate('/profile')
  }

  const handleLogoutClick = () => {
    setMenuOpen(false)
    localStorage.removeItem('grabngoUser')
    navigate('/login')
  }

  const handleCheckout = async () => {
    setStatusMessage('')
    setErrorMessage('')

    if (!cartItems.length) {
      setErrorMessage('Your cart is empty.')
      return
    }

    if (!pickupDate) {
      setErrorMessage('Please select a pickup date.')
      return
    }

    setIsCheckingOut(true)
    let checkoutSucceeded = false
    const generatedOrderId = generateOrderId()
    try {
      for (const item of cartItems) {
        for (let i = 0; i < item.quantity; i += 1) {
          await createOrder({
            orderId: generatedOrderId,
            mealId: item.id,
            customerEmail: user.email,
            customerName: user.fullName || user.email,
            pickupDate,
            pickupTime,
          })
        }
      }

      checkoutSucceeded = true
      const orderDetails = {
        orderId: generatedOrderId,
        pickupDate,
        pickupTime,
        paymentMethod,
        total: cartTotal,
      }

      localStorage.setItem('grabngoLastOrder', JSON.stringify(orderDetails))
      saveCart(user.email, [])
      setCartItems([])
      navigate('/order-confirmed', { state: orderDetails })
    } catch (err) {
      setErrorMessage(err.response?.data || 'Checkout failed. Please try again.')
    } finally {
      if (!checkoutSucceeded) {
        setIsCheckingOut(false)
      }
    }
  }

  return (
    <div className="pickup-layout">
      <DashboardSidebar user={user} onLogout={() => { localStorage.removeItem('grabngoUser'); navigate('/login'); }} />
      <div className="pickup-page">
        <header className="pickup-page-header">
        <button type="button" className="logo-button" onClick={() => navigate('/dashboard')}>
          <img src={logoOrange} alt="GrabNGo" className="pickup-page-logo" />
        </button>

        <div className="pickup-header-actions">
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

      <div className="pickup-back-container">
        <button type="button" className="pickup-back-btn" onClick={() => navigate('/cart')}>
          ← Back to Cart
        </button>
      </div>

      <main className="pickup-main">
        <div className="pickup-stepper" aria-label="Checkout steps">
          <div className="pickup-step completed">
            <span className="pickup-step-bubble">✓</span>
            <span>Cart</span>
          </div>
          <span className="pickup-step-line active" aria-hidden="true" />
          <div className="pickup-step current">
            <span className="pickup-step-bubble">2</span>
            <span>Pickup & Payment</span>
          </div>
          <span className="pickup-step-line" aria-hidden="true" />
          <div className="pickup-step">
            <span className="pickup-step-bubble">3</span>
            <span>Confirm</span>
          </div>
        </div>

        <h1>Pickup Information</h1>
        <p className="pickup-subtitle">Choose when you want to collect your order and select how you would like to pay.</p>

        {statusMessage && <p className="pickup-notice success">{statusMessage}</p>}
        {errorMessage && <p className="pickup-notice error">{errorMessage}</p>}

        <section className="pickup-layout">
          <div className="pickup-form-column">
            <article className="pickup-card">
              <h2>Pickup Information</h2>
              <div className="pickup-field-group">
                <label>Pickup Date *</label>
                <CalendarDial value={pickupDate} onChange={(val) => setPickupDate(val)} />
              </div>
              <div className="pickup-field-group">
                <label htmlFor="pickup-time">Pickup Time *</label>
                <ClockDial value={pickupTime} onChange={(val) => setPickupTime(val)} />
              </div>
            </article>

            <article className="pickup-card">
              <h2>Payment Method</h2>
              <div className="pickup-field-group">
                <label htmlFor="payment-method">Choose payment method</label>
                <select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              <p className="pickup-help-text">
                {paymentMethod === 'Cash'
                  ? 'Pay with cash when you pick up your order.'
                  : `Pay using ${paymentMethod} when you pick up your order.`}
              </p>
            </article>
          </div>

          <aside className="pickup-summary pickup-card">
            <h2>Order Review</h2>

            <div className="pickup-review-items">
              {!cartItems.length && <p className="pickup-empty">Your cart is empty. Add a meal from dashboard.</p>}

              {cartItems.map((item) => (
                <div className="pickup-review-item" key={item.id}>
                  <div>
                    <p className="pickup-review-name">{item.quantity}x {item.name}</p>
                    <p className="pickup-review-meta">Pickup: {pickupDate} at {pickupTime}</p>
                  </div>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            <div className="pickup-summary-row">
              <span>Subtotal</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
            <div className="pickup-summary-row">
              <span>Total Items</span>
              <strong>{cartCount}</strong>
            </div>

            <div className="pickup-divider" />

            <div className="pickup-summary-row total-row">
              <span>Total</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>

            <button
              type="button"
              className="pickup-submit-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut || !cartItems.length}
            >
              {isCheckingOut ? 'Processing...' : 'Place Order'}
            </button>
          </aside>
        </section>
      </main>
      </div>
    </div>
  )
}

export default PickupInfoPage
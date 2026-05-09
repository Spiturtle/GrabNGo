import './orderConfirmed.css'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.4 2.6L16 9" />
    </svg>
  )
}

function parseStoredOrder() {
  try {
    const raw = localStorage.getItem('grabngoLastOrder')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function formatPrice(value) {
  return `P${Number(value || 0).toFixed(2)}`
}

function OrderConfirmedPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const orderInfo = useMemo(() => {
    const fromState = location.state
    if (fromState && fromState.orderId) return fromState
    return parseStoredOrder()
  }, [location.state])

  const orderId = orderInfo?.orderId || '#GNG----'
  const pickupDate = orderInfo?.pickupDate || 'Not set'
  const pickupTime = orderInfo?.pickupTime || 'Not set'
  const paymentMethod = orderInfo?.paymentMethod || 'Not set'
  const totalAmount = orderInfo?.total || 0

  return (
    <div className="order-confirm-page">
      <main className="order-confirm-card">
        <div className="order-confirm-icon-wrap" aria-hidden="true">
          <div className="order-confirm-icon-ring">
            <CheckIcon />
          </div>
        </div>

        <h1>Order Confirmed!</h1>
        <p className="order-confirm-subtitle">
          Your order has been placed successfully. Show this order ID to the cafeteria admin to claim your ordered meal.
        </p>

        <div className="order-confirm-grid">
          <div className="order-confirm-row">
            <span>Order Number</span>
            <strong>{orderId}</strong>
          </div>

          <div className="order-confirm-row">
            <span>Pickup Date</span>
            <strong>{pickupDate}</strong>
          </div>

          <div className="order-confirm-row">
            <span>Pickup Time</span>
            <strong>{pickupTime}</strong>
          </div>

          <div className="order-confirm-row">
            <span>Payment Method</span>
            <strong>{paymentMethod}</strong>
          </div>

          <div className="order-confirm-row amount-row">
            <span>Total Amount</span>
            <strong className="amount-highlight">{formatPrice(totalAmount)}</strong>
          </div>
        </div>

        <button type="button" className="order-confirm-btn" onClick={() => navigate('/dashboard')}>
          Back to Home
        </button>
      </main>
    </div>
  )
}

export default OrderConfirmedPage

import './myOrderMealDetails.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardSidebar from '../../components/sidebar/DashboardSidebar'
import { getOrdersByCustomerEmail } from '../../api/orderApi'
import { getCartCount, getCurrentUser, loadCart } from '../../utils/cartUtils'

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 5h2l2.2 10.2a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 8H7" />
      <circle cx="10" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  )
}

const formatPlacedAt = (orderedAt) => {
  if (!orderedAt) return 'Unknown date'
  const date = new Date(orderedAt)
  if (Number.isNaN(date.getTime())) return 'Unknown date'

  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const mapApiStatusToUiStatus = (status) => {
  const normalized = String(status || '').toUpperCase()
  if (normalized === 'PENDING') return 'pending'
  if (normalized === 'PREPARING') return 'preparing'
  if (normalized === 'READY') return 'ready'
  if (normalized === 'DELIVERED') return 'delivered'
  if (normalized === 'CANCELLED') return 'cancelled'
  return 'pending'
}

const getStatusLabel = (status) => {
  if (status === 'pending') return 'Pending'
  if (status === 'preparing') return 'Preparing'
  if (status === 'ready') return 'Ready'
  if (status === 'delivered') return 'Delivered'
  if (status === 'cancelled') return 'Cancelled'
  return ''
}

function MyOrderMealDetails() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const user = useMemo(() => getCurrentUser(), [])
  const cartItems = useMemo(() => loadCart(user.email), [user.email])
  const cartCount = getCartCount(cartItems)

  useEffect(() => {
    const loadOrder = async () => {
      if (!user.email) {
        setError('Please sign in to view your orders.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const response = await getOrdersByCustomerEmail(user.email)
        const rows = (response.data || []).filter((item) => String(item.orderId || `ORDER-${item.id}`) === String(orderId))

        if (!rows.length) {
          setError('Order not found.')
          setOrder(null)
          return
        }

        setOrder({
          id: rows[0].orderId || `ORDER-${rows[0].id}`,
          status: mapApiStatusToUiStatus(rows[0].status),
          placedAt: formatPlacedAt(rows[0].orderedAt),
          pickupDate: rows[0].pickupDate || 'Not set',
          pickupTime: rows[0].pickupTime || 'Not set',
          items: rows.map((item) => ({
            id: item.id,
            name: item.mealName || 'Meal',
            price: Number(item.mealPrice || 0),
            qty: 1,
          })),
        })
      } catch (err) {
        setError(err.response?.data || 'Failed to load order details.')
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId, user.email])

  const total = order ? order.items.reduce((sum, item) => sum + item.price * item.qty, 0) : 0

  const handleSignOut = () => {
    localStorage.removeItem('grabngoUser')
    navigate('/login')
  }

  return (
    <div className="order-details-layout">
      <DashboardSidebar user={user} onLogout={handleSignOut} />

      <div className="order-details-page">
        <header className="browse-header order-details-header">
          <h1>My Order Details</h1>

          <div className="browse-header-actions" aria-label="Order detail actions">
            <button
              type="button"
              className="icon-button cart-open-button order-details-cart-button"
              aria-label="Open shopping cart"
              onClick={() => navigate('/cart')}
            >
              <span className="cart-button-icon" aria-hidden="true">
                <CartIcon />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </span>
            </button>
          </div>
        </header>

        <main className="order-details-main">
          {loading ? (
            <p className="order-details-notice">Loading order details...</p>
          ) : error ? (
            <p className="order-details-notice error">{error}</p>
          ) : order ? (
            <section className="order-details-card">
              <div className="order-details-top">
                <div>
                  <p className="order-details-label">Order ID</p>
                  <h2>#{order.id}</h2>
                  <p className="order-details-meta">Placed on {order.placedAt}</p>
                  <p className="order-details-meta">Pickup: {order.pickupDate} at {order.pickupTime}</p>
                </div>
                <span className={`order-details-status status-${order.status}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="order-details-items">
                {order.items.map((item) => (
                  <article key={item.id} className="order-details-item">
                    <div>
                      <h3>{item.name}</h3>
                      <p>Quantity: {item.qty}</p>
                    </div>
                    <strong>₱{item.price.toFixed(2)}</strong>
                  </article>
                ))}
              </div>

              <div className="order-details-total">
                <span>Total</span>
                <strong>₱{total.toFixed(2)}</strong>
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  )
}

export default MyOrderMealDetails

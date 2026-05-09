import './myOrders.css'
import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '../../components/sidebar/DashboardSidebar'
import { getCartCount, getCurrentUser, loadCart } from '../../utils/cartUtils'
import { getOrdersByCustomerEmail } from '../../api/orderApi'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.2-4.2" />
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

function MyOrders() {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [allOrders, setAllOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const user = useMemo(() => getCurrentUser(), [])
  const cartItems = useMemo(() => loadCart(user.email), [user.email])
  const cartCount = getCartCount(cartItems)

  const handleSignOut = () => {
    localStorage.removeItem('grabngoUser')
    navigate('/login')
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

  const getStatusPriority = (status) => {
    if (status === 'cancelled') return 0
    if (status === 'pending') return 1
    if (status === 'preparing') return 2
    if (status === 'ready') return 3
    if (status === 'delivered') return 4
    return 1
  }

  useEffect(() => {
    const loadOrders = async () => {
      if (!user.email) {
        setAllOrders([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setLoadError('')

        const response = await getOrdersByCustomerEmail(user.email)
        const groupedOrders = Object.values(
          (response.data || []).reduce((accumulator, order) => {
            const orderKey = order.orderId || `ORDER-${order.id}`
            const nextStatus = mapApiStatusToUiStatus(order.status)

            if (!accumulator[orderKey]) {
              accumulator[orderKey] = {
                id: orderKey,
                items: [],
                status: nextStatus,
                total: 0,
                placedAt: formatPlacedAt(order.orderedAt),
                pickupDate: order.pickupDate || 'Not set',
                pickupTime: order.pickupTime || 'Not set',
              }
            }

            accumulator[orderKey].items.push({
              id: order.id,
              name: order.mealName || 'Meal',
              qty: 1,
              price: Number(order.mealPrice || 0),
            })
            accumulator[orderKey].total += Number(order.mealPrice || 0)

            if (getStatusPriority(nextStatus) > getStatusPriority(accumulator[orderKey].status)) {
              accumulator[orderKey].status = nextStatus
            }

            if (order.orderedAt) {
              accumulator[orderKey].placedAt = formatPlacedAt(order.orderedAt)
            }

            return accumulator
          }, {})
        )

        groupedOrders.sort((leftOrder, rightOrder) => rightOrder.id.localeCompare(leftOrder.id))
        setAllOrders(groupedOrders)
      } catch (err) {
        setLoadError(err.response?.data || 'Failed to load your orders.')
        setAllOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [user.email])

  // Filter orders based on active filter
  const filteredOrders = useMemo(() => {
    const filtered =
      activeFilter === 'all'
        ? allOrders
        : allOrders.filter((order) => {
            if (activeFilter === 'preparing')
              return ['pending', 'preparing', 'ready'].includes(order.status)
            if (activeFilter === 'delivered')
              return order.status === 'delivered'
            if (activeFilter === 'cancelled')
              return order.status === 'cancelled'
            return true
          })

    return filtered.filter((order) =>
      order.id.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [allOrders, searchValue, activeFilter])

  const getStatusBadgeClass = (status) => {
    if (status === 'pending') return 'badge-pending'
    if (status === 'preparing') return 'badge-preparing'
    if (status === 'ready') return 'badge-ready'
    if (status === 'delivered') return 'badge-delivered'
    if (status === 'cancelled') return 'badge-cancelled'
    return ''
  }

  const getStatusLabel = (status) => {
    if (status === 'pending') return 'Pending'
    if (status === 'preparing') return 'Preparing'
    if (status === 'ready') return 'Ready'
    if (status === 'delivered') return 'Delivered'
    if (status === 'cancelled') return 'Cancelled'
    return ''
  }

  const handleOpenOrder = (orderId) => {
    navigate(`/orders/${orderId}`)
  }

  return (
    <div className="orders-layout">
      <DashboardSidebar user={user} onLogout={handleSignOut} />

      {/* Header */}
      <header className="browse-header orders-header">
        <h1>My Orders</h1>

        <div className="browse-header-actions" aria-label="My Orders actions">
          <label htmlFor="orders-search" className="browse-search orders-search">
            <SearchIcon />
            <input
              id="orders-search"
              type="search"
              placeholder="Search orders..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </label>

          <button
            type="button"
            className="icon-button cart-open-button orders-cart-button"
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

      {/* Main Content */}
      <main className="orders-main">
        {/* Filter Tabs */}
        <section className="filter-tabs">
          <div className="tabs-container">
            <button
              className={`tab ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Orders
            </button>
            <button
              className={`tab ${activeFilter === 'preparing' ? 'active' : ''}`}
              onClick={() => setActiveFilter('preparing')}
            >
              Preparing
            </button>
            <button
              className={`tab ${activeFilter === 'delivered' ? 'active' : ''}`}
              onClick={() => setActiveFilter('delivered')}
            >
              Delivered
            </button>
            <button
              className={`tab ${activeFilter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>

          <select className="sort-dropdown">
            <option>Newest first</option>
            <option>Oldest first</option>
            <option>Highest price</option>
            <option>Lowest price</option>
          </select>
        </section>

        {/* Orders List */}
        <section className="orders-list">
          {isLoading ? (
            <p className="empty-state">Loading your orders...</p>
          ) : loadError ? (
            <p className="empty-state">{loadError}</p>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                className="order-item order-item-button"
                onClick={() => handleOpenOrder(order.id)}
              >
                <div className="order-header">
                  <h4 className="order-id">#{order.id}</h4>
                  <span className={`order-badge ${getStatusBadgeClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <p className="order-items">
                  {order.items.map((item) => item.name).join(' • ')}
                </p>
                <p className="order-time">Pickup: {order.pickupDate} at {order.pickupTime}</p>
                <p className="order-time" style={{fontSize: '0.85rem', color: '#999'}}>{order.placedAt}</p>

                <div className="order-items-pills">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="item-pill">
                      {item.name} <span className="qty">×{item.qty}</span>
                    </span>
                  ))}
                </div>

                <div className="order-footer">
                  <div>
                    <span className="order-total-label">Order total</span>
                    <span className="order-total">₱{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className="empty-state">No orders found.</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default MyOrders

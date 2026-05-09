import './adminDashboard.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoAdmin from '../../../components/logo/logoadmin.png'
import AdminSidebar from '../../../components/sidebar/AdminSidebar'
import {
  createMeal,
  deleteMeal,
  getAdminMeals,
  getAdminOrders,
  updateMeal,
  updateOrderStatus,
} from '../../../api/adminApi'

const ORDER_STATUSES = ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']

const STATUS_PRIORITY = {
  CANCELLED: 0,
  PENDING: 1,
  PREPARING: 2,
  READY: 3,
  DELIVERED: 4,
}

const formatOrderPlacedAt = (orderedAt) => {
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

const groupAdminOrders = (rows = []) => {
  const grouped = rows.reduce((accumulator, row) => {
    const groupId = row.orderId || `ORDER-${row.id}`
    const currentStatus = String(row.status || 'PENDING').toUpperCase()

    if (!accumulator[groupId]) {
      accumulator[groupId] = {
        id: groupId,
        customerName: row.customerName || 'Guest',
        orderedAt: row.orderedAt,
        pickupDate: row.pickupDate || 'Not set',
        pickupTime: row.pickupTime || 'Not set',
        status: currentStatus,
        items: [],
        total: 0,
        primaryRowId: row.id,
      }
    }

    const group = accumulator[groupId]
    group.items.push({
      id: row.id,
      name: row.mealName || 'Meal',
      price: Number(row.mealPrice || 0),
    })
    group.total += Number(row.mealPrice || 0)

    if (!group.orderedAt || new Date(row.orderedAt) > new Date(group.orderedAt)) {
      group.orderedAt = row.orderedAt
    }

    if (STATUS_PRIORITY[currentStatus] > STATUS_PRIORITY[group.status]) {
      group.status = currentStatus
    }

    if (row.id < group.primaryRowId) {
      group.primaryRowId = row.id
    }

    return accumulator
  }, {})

  return Object.values(grouped).sort((leftOrder, rightOrder) => {
    const leftTime = leftOrder.orderedAt ? new Date(leftOrder.orderedAt).getTime() : 0
    const rightTime = rightOrder.orderedAt ? new Date(rightOrder.orderedAt).getTime() : 0
    return rightTime - leftTime
  })
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [meals, setMeals] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [statusSavingId, setStatusSavingId] = useState(null)
  const [editingMealId, setEditingMealId] = useState(null)
  const [mealForm, setMealForm] = useState({
    name: '',
    description: '',
    price: '',
    available: true,
  })

  const admin = useMemo(() => {
    const stored = localStorage.getItem('grabngoUser')
    if (!stored) return null

    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    if (!admin || admin.role !== 'ADMIN') {
      navigate('/login', { replace: true })
      return
    }

    const loadDashboardData = async () => {
      setLoading(true)
      setError('')
      try {
        const [mealsResponse, ordersResponse] = await Promise.all([
          getAdminMeals(),
          getAdminOrders(),
        ])
        setMeals(mealsResponse.data)
        setOrders(groupAdminOrders(ordersResponse.data))
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [admin, navigate])

  const handleLogout = () => {
    localStorage.removeItem('grabngoUser')
    navigate('/login', { replace: true })
  }

  const formatPrice = (value) => `P${Number(value || 0).toFixed(2)}`

  const resetMealForm = () => {
    setEditingMealId(null)
    setMealForm({
      name: '',
      description: '',
      price: '',
      available: true,
    })
  }

  const handleMealSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      const payload = {
        name: mealForm.name,
        description: mealForm.description,
        price: Number(mealForm.price),
        available: mealForm.available,
      }

      if (editingMealId) {
        await updateMeal(editingMealId, payload)
        setMessage('Meal updated successfully.')
      } else {
        await createMeal(payload)
        setMessage('Meal created successfully.')
      }

      const mealsResponse = await getAdminMeals()
      setMeals(mealsResponse.data)
      resetMealForm()
    } catch (err) {
      setError(err.response?.data || 'Failed to save meal.')
    }
  }

  const handleEditMeal = (meal) => {
    setEditingMealId(meal.id)
    setMealForm({
      name: meal.name || '',
      description: meal.description || '',
      price: meal.price ?? '',
      available: Boolean(meal.available),
    })
  }

  const handleDeleteMeal = async (mealId) => {
    setMessage('')
    setError('')
    try {
      await deleteMeal(mealId)
      setMeals((prev) => prev.filter((meal) => meal.id !== mealId))
      setMessage('Meal deleted successfully.')
      if (editingMealId === mealId) {
        resetMealForm()
      }
    } catch (err) {
      setError(err.response?.data || 'Failed to delete meal.')
    }
  }

  const handleOrderStatusUpdate = async (orderId, status) => {
    setError('')
    setMessage('')
    setStatusSavingId(orderId)
    try {
      await updateOrderStatus(orderId, status)
      const ordersResponse = await getAdminOrders()
      setOrders(groupAdminOrders(ordersResponse.data))
      setMessage('Order status updated.')
    } catch (err) {
      setError(err.response?.data || 'Failed to update order status.')
    } finally {
      setStatusSavingId(null)
    }
  }

  return (
    <div className="admin-dashboard-layout">
      <AdminSidebar />
      <div className="admin-dashboard-page">
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-header-content">
            <h1>Orders Management</h1>
            <p>View and manage all meal orders</p>
          </div>
        </header>

        <main className="admin-dashboard-main">
          {message && <p className="admin-message success">{message}</p>}
          {error && <p className="admin-message error">{error}</p>}
          {loading && <p className="admin-message">Loading dashboard data...</p>}

          <section className="admin-dashboard-panels" aria-label="Admin dashboard details">
            <article className="admin-panel">
              <h3>Ordered Items</h3>
              <div className="admin-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Meals</th>
                      <th>Total</th>
                      <th>Placed At</th>
                      <th>Pickup Date</th>
                      <th>Pickup Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.customerName}</td>
                        <td>
                          {order.items.map((item) => item.name).join(' • ')}
                          <div className="order-item-count">{order.items.length} meal{order.items.length > 1 ? 's' : ''}</div>
                        </td>
                        <td>{formatPrice(order.total)}</td>
                        <td>{formatOrderPlacedAt(order.orderedAt)}</td>
                        <td>{order.pickupDate}</td>
                        <td>{order.pickupTime}</td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(event) => handleOrderStatusUpdate(order.primaryRowId, event.target.value)}
                            disabled={statusSavingId === order.primaryRowId}
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {!orders.length && (
                      <tr>
                        <td colSpan="8" className="empty-table-row">No orders yet from users.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard

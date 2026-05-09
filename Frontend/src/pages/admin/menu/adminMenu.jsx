import './adminMenu.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../../components/sidebar/AdminSidebar'
import {
  createMeal,
  deleteMeal,
  getAdminMeals,
  updateMeal,
} from '../../../api/adminApi'

function AdminMenu() {
  const navigate = useNavigate()
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingMealId, setEditingMealId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [mealForm, setMealForm] = useState({
    name: '',
    description: '',
    price: '',
    available: true,
  })

  const admin = useState(() => {
    const stored = localStorage.getItem('grabngoUser')
    if (!stored) return null
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  })[0]

  useEffect(() => {
    if (!admin || admin.role !== 'ADMIN') {
      navigate('/login', { replace: true })
      return
    }

    const loadMeals = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getAdminMeals()
        setMeals(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load meals.')
      } finally {
        setLoading(false)
      }
    }

    loadMeals()
  }, [admin, navigate])

  const resetMealForm = () => {
    setEditingMealId(null)
    setShowForm(false)
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
    setShowForm(true)
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

  const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`

  return (
    <div className="admin-menu-layout">
      <AdminSidebar />
      <div className="admin-menu-page">
        <header className="admin-menu-header">
          <div className="admin-menu-header-content">
            <h1>Menu Management</h1>
            <p>Add, edit, and manage cafeteria menu items</p>
          </div>
          <button
            type="button"
            className="admin-menu-add-button"
            onClick={() => {
              setShowForm(true)
              setEditingMealId(null)
              setMealForm({
                name: '',
                description: '',
                price: '',
                available: true,
              })
            }}
          >
            <span>+</span> Add Item
          </button>
        </header>

        <main className="admin-menu-main">
          {message && <p className="admin-message success">{message}</p>}
          {error && <p className="admin-message error">{error}</p>}
          {loading && <p className="admin-message">Loading meals...</p>}

          {showForm && (
            <div className="admin-menu-form-container">
              <div className="admin-menu-form-panel">
                <h2>{editingMealId ? 'Edit Meal' : 'Add New Meal'}</h2>
                <form className="admin-menu-form" onSubmit={handleMealSubmit}>
                  <div className="form-group">
                    <label htmlFor="meal-name">Meal Name</label>
                    <input
                      id="meal-name"
                      type="text"
                      value={mealForm.name}
                      onChange={(event) =>
                        setMealForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      placeholder="Enter meal name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="meal-description">Description</label>
                    <textarea
                      id="meal-description"
                      value={mealForm.description}
                      onChange={(event) =>
                        setMealForm((prev) => ({ ...prev, description: event.target.value }))
                      }
                      placeholder="Enter meal description"
                      rows="3"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="meal-price">Price</label>
                      <input
                        id="meal-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={mealForm.price}
                        onChange={(event) =>
                          setMealForm((prev) => ({ ...prev, price: event.target.value }))
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="form-group checkbox-group">
                      <label htmlFor="meal-available">
                        <input
                          id="meal-available"
                          type="checkbox"
                          checked={mealForm.available}
                          onChange={(event) =>
                            setMealForm((prev) => ({
                              ...prev,
                              available: event.target.checked,
                            }))
                          }
                        />
                        Available
                      </label>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="button-primary">
                      {editingMealId ? 'Update Meal' : 'Add Meal'}
                    </button>
                    <button type="button" className="button-secondary" onClick={resetMealForm}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="admin-menu-grid">
            {meals.length > 0 ? (
              meals.map((meal) => (
                <div key={meal.id} className="admin-menu-card">
                  <div className="card-header">
                    <div className="card-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div className="card-actions">
                      <button
                        type="button"
                        className="card-action-btn edit"
                        onClick={() => handleEditMeal(meal)}
                        title="Edit meal"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="card-action-btn delete"
                        onClick={() => handleDeleteMeal(meal.id)}
                        title="Delete meal"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3H4v2h16V7h-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <h3 className="card-title">{meal.name}</h3>
                  <p className="card-description">{meal.description || 'No description'}</p>

                  <div className="card-price">{formatPrice(meal.price)}</div>

                  <div
                    className={`card-availability ${meal.available ? 'available' : 'unavailable'}`}
                  >
                    {meal.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No meals added yet. Click "Add Item" to get started.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminMenu

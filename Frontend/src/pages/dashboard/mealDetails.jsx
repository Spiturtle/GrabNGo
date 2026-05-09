import './mealDetails.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// header reuses dashboard browse styles; no local logo needed
import DashboardSidebar from '../../components/sidebar/DashboardSidebar'
import { getAvailableMeals } from '../../api/mealApi'
import { createOrder } from '../../api/orderApi'
import { addMealToCart, getCurrentUser, loadCart, saveCart } from '../../utils/cartUtils'

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {filled ? (
        <path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6l-3-3c-1.6-1.6-4.2-1.6-5.8 0-1.6 1.6-1.6 4.2 0 5.8l8.8 8.8 8.8-8.8c1.6-1.6 1.6-4.2 0-5.8Z" fill="currentColor" />
      ) : (
        <path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6l-3-3c-1.6-1.6-4.2-1.6-5.8 0-1.6 1.6-1.6 4.2 0 5.8l8.8 8.8 8.8-8.8c1.6-1.6 1.6-4.2 0-5.8Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      )}
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

const INGREDIENT_LIST = {
  'Beef Tapa Rice': ['Marinated Beef', 'Jasmine Rice', 'Garlic Sauce', 'Fresh Vegetables'],
  'Chicken Teriyaki Bowl': ['Chicken Breast', 'Teriyaki Sauce', 'Steamed Rice', 'Sesame Seeds'],
  'Sisig Rice Bowl': ['Pork Sisig', 'Garlic Rice', 'Onions', 'Chili Peppers'],
  'Creamy Carbonara': ['Pasta', 'Bacon', 'Cream Sauce', 'Parmesan Cheese'],
}

function MealDetails() {
  const navigate = useNavigate()
  const { mealId } = useParams()
  const [meal, setMeal] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isOrdering, setIsOrdering] = useState(false)
  const [relatedMeals, setRelatedMeals] = useState([])

  const user = useMemo(() => getCurrentUser(), [])

  useEffect(() => {
    const loadMeal = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getAvailableMeals()
        const targetMeal = response.data.find((item) => String(item.id) === String(mealId))
        if (!targetMeal) {
          setError('Meal not found.')
        } else {
          setMeal(targetMeal)
          // build a small related list (same category, excluding current)
          const related = response.data.filter((m) => m.category === targetMeal.category && String(m.id) !== String(targetMeal.id)).slice(0, 6)
          setRelatedMeals(related)
        }
      } catch (err) {
        setError(err.response?.data || 'Unable to load meal details.')
      } finally {
        setLoading(false)
      }
    }

    loadMeal()
  }, [mealId])

  const formatPrice = (value) => `P${Number(value || 0).toFixed(2)}`

  const handleAddToCart = () => {
    if (!meal) return
    const currentCart = loadCart(user.email)
    const nextCart = addMealToCart(currentCart, meal, quantity)
    saveCart(user.email, nextCart)
    setMessage(`${meal.name} added to cart.`)
    setError('')
  }

  const handleOrderNow = async () => {
    if (!meal) return

    setMessage('')
    setError('')
    setIsOrdering(true)

    try {
      for (let i = 0; i < quantity; i += 1) {
        await createOrder({
          mealId: meal.id,
          customerEmail: user.email,
          customerName: user.fullName || user.email,
        })
      }
      setMessage('Order placed successfully.')
    } catch (err) {
      setError(err.response?.data || 'Failed to place order.')
    } finally {
      setIsOrdering(false)
    }
  }

  return (
    <div className="meal-details-layout">
      <DashboardSidebar user={user} onLogout={() => { localStorage.removeItem('grabngoUser'); navigate('/login'); }} />
      <div className="meal-details-page">
        <header className="browse-header meal-details-header">
          <h1>{meal ? meal.name : 'Meal Details'}</h1>

          <div className="browse-header-actions" aria-label="Meal actions">
            <button
              type="button"
              className="icon-button cart-open-button"
              aria-label="Open shopping cart"
              onClick={() => navigate('/cart')}
            >
              <span className="cart-button-icon" aria-hidden="true">
                <CartIcon />
              </span>
            </button>
          </div>
        </header>

      <main className="meal-details-main">
        {loading && <p className="meal-notice">Loading meal details...</p>}
        {error && <p className="meal-notice error">{error}</p>}
        {message && <p className="meal-notice success">{message}</p>}

        {meal && (
          <section className="meal-highlight-card">
            <div className="meal-photo-wrap">
              <span className="meal-emoji">🍚</span>
            </div>

            <div className="meal-highlight-info">
              <h1 className="meal-title">{meal.name}</h1>
              <p className="meal-highlight-price">{formatPrice(meal.price)}</p>
              <p className="meal-highlight-desc">{meal.description || 'Chef special meal prepared fresh for you.'}</p>

              <div className="meal-whats-included">
                <h3 className="whats-included-title">What's Included</h3>
                <div className="ingredients-grid">
                  {(INGREDIENT_LIST[meal.name] || INGREDIENT_LIST['Beef Tapa Rice']).map((ingredient) => (
                    <div key={ingredient} className="ingredient-item">
                      <span className="ingredient-icon">🍽</span>
                      <span className="ingredient-name">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="quantity-section">
                <label className="quantity-label">Quantity</label>
                <div className="quantity-control">
                  <button type="button" className="qty-btn" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>−</button>
                  <span className="qty-value">{quantity}</span>
                  <button type="button" className="qty-btn" onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                </div>
              </div>

              <div className="meal-highlight-actions">
                <button type="button" className="btn-secondary" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleOrderNow}
                  disabled={isOrdering}
                >
                  {isOrdering ? 'Ordering...' : 'Order Now'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Related meals */}
        {relatedMeals.length > 0 && (
          <section className="related-section">
            <h2 className="related-title">You might also like</h2>
            <div className="related-grid">
              {relatedMeals.map((r) => (
                <div
                  key={r.id}
                  className="related-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/meal/${r.id}`)}
                >
                  <div className="related-img">{r.emoji || '🍽'}</div>
                  <div className="related-body">
                    <div className="related-name">{r.name}</div>
                    <div className="related-meta">
                      <span className="related-price">{formatPrice(r.price)}</span>
                      <span className="related-rating">{r.rating ? `★ ${r.rating}` : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      </div>
    </div>
  )
}

export default MealDetails

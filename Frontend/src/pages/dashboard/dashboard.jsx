import './dashboard.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAvailableMeals } from '../../api/mealApi'
import DashboardSidebar from '../../components/sidebar/DashboardSidebar'
import {
  addMealToCart,
  getCartCount,
  getCurrentUser,
  loadCart,
  saveCart,
} from '../../utils/cartUtils'

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 5h2l2.2 10.2a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 8H7" />
      <circle cx="10" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 7h14" />
      <path d="M5 12h14" />
      <path d="M5 17h14" />
    </svg>
  )
}

const CATEGORY_CHIPS = ['All', 'Filipino', 'Rice Bowls', 'Pasta', 'Noodles', 'Snacks', 'Drinks']

const CATEGORY_EMOJI = {
  Filipino: '🍢',
  'Rice Bowls': '🍚',
  Pasta: '🍝',
  Noodles: '🍜',
  Snacks: '🍟',
  Drinks: '🥤',
}

const inferMealCategory = (meal) => {
  const source = `${meal.name || ''} ${meal.description || ''}`.toLowerCase()

  if (/rice|sisig|silog|bowl/.test(source)) {
    return 'Rice Bowls'
  }

  if (/pasta|spag|carbonara|mac/.test(source)) {
    return 'Pasta'
  }

  if (/noodle|ramen|pancit|mami/.test(source)) {
    return 'Noodles'
  }

  if (/drink|shake|juice|tea|coffee|halo|milk/.test(source)) {
    return 'Drinks'
  }

  if (/snack|fries|bread|lumpia|siopao|wings/.test(source)) {
    return 'Snacks'
  }

  return 'Filipino'
}

const buildMealMeta = (meal) => {
  const seed = Number(meal.id || 0) + (meal.name || '').length
  const rating = Math.min(5, 4.6 + (seed % 5) * 0.1).toFixed(1)
  const reviews = 120 + (seed % 14) * 23
  const waitStart = 5 + (seed % 7)
  const waitEnd = waitStart + 2 + (seed % 5)
  const calories = 420 + (seed % 8) * 35
  const labelText = `${meal.name || ''} ${meal.description || ''}`.toLowerCase()

  const labels = []
  if (seed % 2 === 0) {
    labels.push('BESTSELLER')
  }
  if (/spicy|sisig|chili|hot/.test(labelText)) {
    labels.push('SPICY')
  }
  if (/sweet|halo|dessert/.test(labelText)) {
    labels.push('SWEET')
  }

  return {
    rating,
    reviews,
    waitText: `${waitStart}-${waitEnd} min`,
    calories,
    labels,
  }
}

function Dashboard() {
  const navigate = useNavigate()
  const [meals, setMeals] = useState([])
  const [cartItems, setCartItems] = useState(() => loadCart(getCurrentUser().email))
  const [searchValue, setSearchValue] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState('grid')
  const [loadingMeals, setLoadingMeals] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const user = useMemo(() => getCurrentUser(), [])

  useEffect(() => {
    const loadMeals = async () => {
      setLoadingMeals(true)
      setErrorMessage('')
      try {
        const response = await getAvailableMeals()
        setMeals(response.data)
      } catch (err) {
        setErrorMessage(err.response?.data || 'Unable to load meals right now.')
      } finally {
        setLoadingMeals(false)
      }
    }

    loadMeals()
  }, [])

  useEffect(() => {
    saveCart(user.email, cartItems)
  }, [cartItems, user.email])

  const handleSignOut = () => {
    localStorage.removeItem('grabngoUser')
    navigate('/login')
  }

  const formatPrice = (value) => `P${Number(value || 0).toFixed(2)}`

  const mealsWithCategory = useMemo(
    () => meals.map((meal) => ({ ...meal, category: inferMealCategory(meal) })),
    [meals]
  )

  const filteredMeals = useMemo(
    () =>
      mealsWithCategory.filter((meal) => {
        const matchesSearch =
          meal.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          meal.description?.toLowerCase().includes(searchValue.toLowerCase())
        const matchesCategory = activeCategory === 'All' || meal.category === activeCategory

        return matchesSearch && matchesCategory
      }),
    [mealsWithCategory, searchValue, activeCategory]
  )

  const visibleMeals = useMemo(() => {
    const nextMeals = [...filteredMeals]

    if (sortBy === 'price-low') {
      nextMeals.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
    } else if (sortBy === 'price-high') {
      nextMeals.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
    } else if (sortBy === 'name') {
      nextMeals.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }

    return nextMeals
  }, [filteredMeals, sortBy])

  const handleAddToCart = (meal, event) => {
    event.stopPropagation()
    setStatusMessage('')
    setErrorMessage('')
    setCartItems((prev) => addMealToCart(prev, meal, 1))
    setStatusMessage(`${meal.name} added to cart.`)
  }

  const cartCount = getCartCount(cartItems)

  return (
    <div className="dashboard-layout">
      <DashboardSidebar
        user={user}
        onLogout={handleSignOut}
        onNavigate={() => undefined}
      />

      <div className="dashboard-page">
        <header className="browse-header">
          <h1>Browse Meals</h1>

          <div className="browse-header-actions" aria-label="Browse actions">
            <label htmlFor="meal-search" className="browse-search">
              <SearchIcon />
              <input
                id="meal-search"
                type="search"
                placeholder="Search meals..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </label>

            <button
              type="button"
              className="icon-button cart-open-button cart-header-button"
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

        <main className="dashboard-content">
          <section className="browse-controls" aria-label="Meal filter and sort">
            <div className="category-pills">
              {CATEGORY_CHIPS.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-pill ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="browse-view-controls">
              <label className="sort-wrap" htmlFor="sort-meals">
                <select
                  id="sort-meals"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </label>

              <div className="view-toggle" role="group" aria-label="Card view">
                <button
                  type="button"
                  className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <GridIcon />
                </button>
                <button
                  type="button"
                  className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <ListIcon />
                </button>
              </div>
            </div>
          </section>

          <p className="meal-count">Showing {visibleMeals.length} of {meals.length} meals</p>

          {statusMessage && <p className="dashboard-message success">{statusMessage}</p>}
          {errorMessage && <p className="dashboard-message error">{errorMessage}</p>}
          {loadingMeals && <p className="dashboard-message">Loading meals...</p>}

          <section className={`meal-results ${viewMode === 'list' ? 'list-mode' : 'grid-mode'}`} aria-label="Available meals">
            {visibleMeals.map((meal) => {
              const meta = buildMealMeta(meal)
              const emoji = CATEGORY_EMOJI[meal.category] || '🍽'

              return (
                <article
                  className={`meal-card clickable ${viewMode}`}
                  key={meal.id}
                  onClick={() => navigate(`/meal/${meal.id}`)}
                >
                  <div className="meal-image" aria-hidden="true">
                    <span>{emoji}</span>
                  </div>

                  <div className="meal-info">
                    <p className="meal-name">{meal.name}</p>
                    <p className="meal-description">{meal.description || 'Chef special meal.'}</p>
                  </div>

                  <div className="meal-cta-wrap">
                    <p className="meal-price">{formatPrice(meal.price)}</p>
                    <button
                      type="button"
                      className="add-cart-button"
                      aria-label={`Add ${meal.name} to cart`}
                      onClick={(event) => handleAddToCart(meal, event)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              )
            })}

            {!loadingMeals && !visibleMeals.length && (
              <p className="empty-state">No meals found.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard

import './cart.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '../../components/sidebar/DashboardSidebar'
import {
  getCartCount,
  getCartTotal,
  getCurrentUser,
  loadCart,
  saveCart,
} from '../../utils/cartUtils'

// Header icons not needed on cart page header

function CartPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(() => loadCart(getCurrentUser().email))

  const user = useMemo(() => getCurrentUser(), [])

  useEffect(() => {
    saveCart(user.email, cartItems)
  }, [cartItems, user.email])

  const formatPrice = (value) => `P${Number(value || 0).toFixed(2)}`

  const handleQuantityChange = (mealId, nextQuantity) => {
    setCartItems((prev) => {
      if (nextQuantity <= 0) {
        return prev.filter((item) => item.id !== mealId)
      }

      return prev.map((item) =>
        item.id === mealId ? { ...item, quantity: nextQuantity } : item
      )
    })
  }

  const handleRemoveMeal = (mealId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== mealId))
  }

  const cartTotal = getCartTotal(cartItems)
  const cartCount = getCartCount(cartItems)

  return (
    <div className="cart-layout">
      <DashboardSidebar user={user} onLogout={() => { localStorage.removeItem('grabngoUser'); navigate('/login'); }} />
      <div className="cart-page">
        <header className="cart-page-header">
          <h1>Shopping Cart</h1>
        </header>

      <main className="cart-main">
        <div className="cart-stepper" aria-label="Checkout steps">
          <div className="cart-step current">
            <span className="cart-step-bubble">1</span>
            <span>Cart</span>
          </div>
          <span className="cart-step-line active" aria-hidden="true" />
          <div className="cart-step">
            <span className="cart-step-bubble">2</span>
            <span>Pickup & Payment</span>
          </div>
          <span className="cart-step-line" aria-hidden="true" />
          <div className="cart-step">
            <span className="cart-step-bubble">3</span>
            <span>Confirm</span>
          </div>
        </div>

        <div className="cart-page-hero">
          <div>
            <p className="cart-eyebrow">Shopping Cart</p>
            <h1>Your order basket</h1>
            <p className="cart-subtitle">Review the items you added before choosing pickup details.</p>
          </div>
          <div className="cart-summary-chip">
            <span>{cartCount}</span>
            <small>items</small>
          </div>
        </div>

        <section className="cart-layout">
          <div className="cart-items-list">
            {!cartItems.length && <p className="cart-empty">Your cart is empty. Add a meal from dashboard.</p>}

            {cartItems.map((item) => (
              <article className="cart-line-item" key={item.id}>
                <div className="line-item-image">Meal</div>

                <div className="line-item-info">
                  <div className="line-item-top">
                    <div>
                      <p className="line-item-name">{item.name}</p>
                      <p className="line-item-price">{formatPrice(item.price)}</p>
                    </div>
                    <p className="line-item-total">{formatPrice(item.price * item.quantity)}</p>
                  </div>

                  <div className="line-item-controls">
                    <div className="quantity-controls" aria-label={`Adjust quantity for ${item.name}`}>
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleRemoveMeal(item.id)}
                      aria-label={`Remove ${item.name} from cart`}  
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="order-summary">
            <h2>Cart Summary</h2>
            <div className="summary-items">
              {!cartItems.length && <p className="summary-empty">No meals in cart yet.</p>}

              {cartItems.map((item) => (
                <div className="summary-item" key={item.id}>
                  <div>
                    <p className="summary-item-name">{item.name}</p>
                    <p className="summary-item-meta">{item.quantity} x {formatPrice(item.price)}</p>
                  </div>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
            <p className="summary-meta">{cartCount} item(s) in your cart</p>

            <button
              type="button"
              className="checkout-btn"
              onClick={() => navigate('/pickup-info')}
              disabled={!cartItems.length}
            >
              Proceed to Checkout
            </button>

            <button type="button" className="continue-btn" onClick={() => navigate('/dashboard')}>
              Continue Shopping
            </button>
          </aside>
        </section>
      </main>
      </div>
    </div>
  )
}

export default CartPage

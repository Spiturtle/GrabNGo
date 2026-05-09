export const getCurrentUser = () => {
  const stored = localStorage.getItem('grabngoUser')
  if (!stored) {
    return { fullName: 'GrabNGo User', email: 'guest@grabngo.local' }
  }

  try {
    const parsed = JSON.parse(stored)
    return {
      fullName: parsed.fullName || 'GrabNGo User',
      email: parsed.email || 'guest@grabngo.local',
    }
  } catch {
    return { fullName: 'GrabNGo User', email: 'guest@grabngo.local' }
  }
}

export const getCartStorageKey = (email) =>
  `grabngoCart:${(email || 'guest@grabngo.local').toLowerCase()}`

export const loadCart = (email) => {
  try {
    const stored = localStorage.getItem(getCartStorageKey(email))
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const saveCart = (email, items) => {
  localStorage.setItem(getCartStorageKey(email), JSON.stringify(items))
}

export const addMealToCart = (items, meal, quantity = 1) => {
  const existing = items.find((item) => item.id === meal.id)
  if (existing) {
    return items.map((item) =>
      item.id === meal.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    )
  }

  return [
    ...items,
    {
      id: meal.id,
      name: meal.name,
      price: Number(meal.price || 0),
      description: meal.description || '',
      quantity,
    },
  ]
}

export const getCartCount = (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)

export const getCartTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

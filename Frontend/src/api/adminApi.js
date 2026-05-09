import axios from 'axios'

const API_ROOT = import.meta.env.VITE_API_URL || 'https://grabngo-rkkn.onrender.com'
const BASE_URL = `${API_ROOT}/api/admin`

export const adminLogin = (email, password) =>
  axios.post(`${BASE_URL}/login`, {
    email,
    password,
  })

export const getAdminMeals = () => axios.get(`${BASE_URL}/meals`)

export const createMeal = (meal) => axios.post(`${BASE_URL}/meals`, meal)

export const updateMeal = (id, meal) => axios.put(`${BASE_URL}/meals/${id}`, meal)

export const deleteMeal = (id) => axios.delete(`${BASE_URL}/meals/${id}`)

export const getAdminOrders = () => axios.get(`${BASE_URL}/orders`)

export const updateOrderStatus = (id, status) =>
  axios.put(`${BASE_URL}/orders/${id}/status`, { status })

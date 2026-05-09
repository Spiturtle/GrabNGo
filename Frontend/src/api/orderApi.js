import axios from 'axios'

const API_ROOT = import.meta.env.VITE_API_URL || 'https://grabngo-rkkn.onrender.com'
const BASE_URL = `${API_ROOT}/api/orders`

export const createOrder = ({ orderId, mealId, customerEmail, customerName, pickupDate, pickupTime }) =>
  axios.post(BASE_URL, {
    orderId,
    mealId,
    customerEmail,
    customerName,
    pickupDate,
    pickupTime,
  })

export const getOrdersByCustomerEmail = (customerEmail) =>
  axios.get(BASE_URL, {
    params: { customerEmail },
  })

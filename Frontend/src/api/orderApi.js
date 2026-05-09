import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api/orders'

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

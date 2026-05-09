import axios from 'axios'

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const BASE_URL = `${API_ROOT}/api/meals`

export const getAvailableMeals = () => axios.get(BASE_URL)

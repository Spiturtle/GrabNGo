import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api/meals'

export const getAvailableMeals = () => axios.get(BASE_URL)

import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api/auth'

export const loginUser = (email, password) =>
  axios.post(`${BASE_URL}/login`, {
    institutionalEmail: email,
    password,
  })

export const registerUser = (formData) =>
  axios.post(`${BASE_URL}/register`, {
    studentId: formData.studentId,
    institutionalEmail: formData.email,
    fullName: formData.fullName,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  })

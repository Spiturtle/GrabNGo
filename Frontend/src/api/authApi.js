import axios from 'axios'

// Use Vite env variable when available, otherwise default to local backend
const API_ROOT = import.meta.env.VITE_API_URL || 'https://grabngo-rkkn.onrender.com'
const BASE_URL = `${API_ROOT}/api/auth`

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

export const changePassword = ({ email, currentPassword, newPassword, confirmPassword }) =>
  axios.post(`${BASE_URL}/change-password`, {
    institutionalEmail: email,
    currentPassword,
    newPassword,
    confirmPassword,
  })

export const updateProfileName = ({ email, fullName }) =>
  axios.post(`${BASE_URL}/update-profile`, {
    institutionalEmail: email,
    fullName,
  })

export const fetchUserProfile = (email) =>
  axios.get(`${BASE_URL}/profile`, {
    params: { institutionalEmail: email },
  })

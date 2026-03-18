import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/auth/register'
import Login from './pages/auth/login'
import AdminLogin from './pages/admin/adminLogin'
import Dashboard from './pages/dashboard/dashboard'
import Profile from './pages/profile/profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

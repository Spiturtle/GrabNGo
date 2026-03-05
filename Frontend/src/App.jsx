import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/auth/register'
import Login from './pages/auth/login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

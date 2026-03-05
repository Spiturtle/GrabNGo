import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './login.css'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        institutionalEmail: formData.email,
        password: formData.password,
      })
      alert(`Welcome, ${response.data.fullName}!`)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    }
  }

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <span className="navbar-brand">GrabNGo</span>
        <div className="navbar-actions">
          <button className="nav-btn" onClick={() => navigate('/')}>Sign up</button>
          <button className="nav-btn active" onClick={() => navigate('/login')}>Login</button>
        </div>
      </nav>

      <main className="main-content">
        <div className="auth-card">
          <h2 className="auth-title">Sign In</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Institutional Email</label>
              <input
                type="email"
                name="email"
                placeholder=""
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder=""
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn-primary">Sign In</button>
          </form>
          {error && <p className="auth-error">{error}</p>}
          <p className="auth-switch">
            Don't have an account?{' '}
            <span className="auth-switch-link" onClick={() => navigate('/')}>SIGN UP</span>
          </p>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 GrabNGo. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Login

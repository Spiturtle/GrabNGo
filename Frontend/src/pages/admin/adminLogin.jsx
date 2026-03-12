import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './adminLogin.css'
import { adminLogin } from '../../api/adminApi'
import logoImg from '../../components/logo/logoadmin.png'
import bgImg from '../../components/background/Sisig.jpg'

function AdminLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await adminLogin(formData.email, formData.password)
      alert(`Welcome, Admin!`)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    }
  }

  return (
    <div className="admin-page-wrapper">
      <nav className="admin-navbar">
        <img src={logoImg} alt="GrabNGo Admin" className="admin-navbar-logo" />
      </nav>

      <main
        className="admin-main-content"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="admin-card">
          <h2 className="admin-title">Admin Sign in</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder=""
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder=""
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="admin-btn-primary">Sign In</button>
          </form>
          {error && <p className="admin-error">{error}</p>}
        </div>
      </main>

      <footer className="admin-footer">
        <p>© 2026 GrabNGo. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default AdminLogin

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'
import { loginUser } from '../../api/authApi'
import logoImg from '../../components/logo/logo.png'
import bgImg from '../../components/background/Sisig.jpg'

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
      const response = await loginUser(formData.email, formData.password)
      const role = (response.data.role || 'STUDENT').toUpperCase()
      const responseStudentId =
        response.data.studentId || response.data.studentID || response.data.student_id || ''
      const userData = {
        role,
        email: response.data.institutionalEmail || formData.email,
        fullName: response.data.fullName || '',
        studentId: responseStudentId,
      }
      localStorage.setItem('grabngoUser', JSON.stringify(userData))
      alert(`Welcome, ${response.data.fullName}!`)
      navigate(role === 'ADMIN' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    }
  }

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <img src={logoImg} alt="GrabNGo" className="navbar-logo" />
        <div className="navbar-actions">
          <button className="nav-btn" onClick={() => navigate('/')}>Sign up</button>
          <button className="nav-btn active" onClick={() => navigate('/login')}>Sign In</button>
        </div>
      </nav>

      <main className="main-content" style={{ backgroundImage: `url(${bgImg})` }}>
        <div className="auth-card">
          <h2 className="auth-title">Sign In</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
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

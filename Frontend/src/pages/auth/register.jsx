import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './register.css'

function Register() {
const navigate = useNavigate()
const [formData, setFormData] = useState({
    studentId: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
})

const [errors, setErrors] = useState({})
const [serverError, setServerError] = useState('')

const passwordRules = [
  { key: 'length',    label: 'At least 8 characters',              test: (p) => p.length >= 8 },
  { key: 'upper',     label: 'At least 1 uppercase letter',   test: (p) => /[A-Z]/.test(p) },
  { key: 'lower',     label: 'At least 1 lowercase letter',   test: (p) => /[a-z]/.test(p) },
  { key: 'number',    label: 'At least 1 number',             test: (p) => /[0-9]/.test(p) },
  { key: 'special',   label: 'At least 1 special character',  test: (p) => /[^A-Za-z0-9]/.test(p) },
]

const validate = () => {
  const newErrors = {}
  if (!formData.studentId.trim())
    newErrors.studentId = 'Student ID is required.'
  else if (!/^\d{2}-\d{4}-\d{3}$/.test(formData.studentId) && !/^\d{4}-\d{4}$/.test(formData.studentId))
    newErrors.studentId = 'Student ID must be in the format XX-XXXX-XXX or XXXX-XXXX (e.g. 20-2345-654 or 2005-1325)'
  if (!formData.email.trim())
    newErrors.email = 'Institutional email is required.'
  else if (!formData.email.endsWith('@cit.edu'))
    newErrors.email = 'Email must end with @cit.edu.'
  if (!formData.fullName.trim())
    newErrors.fullName = 'Full name is required.'
  if (!formData.password)
    newErrors.password = 'Password is required.'
  else if (passwordRules.some(r => !r.test(formData.password)))
    newErrors.password = 'Password does not meet all requirements.'
  if (!formData.confirmPassword)
    newErrors.confirmPassword = 'Please confirm your password.'
  else if (formData.password !== formData.confirmPassword)
    newErrors.confirmPassword = 'Passwords do not match.'
  return newErrors
}

const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'studentId') {
      // Only allow digits and dashes
      if (!/^[\d-]*$/.test(value)) return
      setFormData({ ...formData, [name]: value })
      setErrors({ ...errors, [name]: '' })
      return
    }
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' })
}

const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        studentId: formData.studentId,
        institutionalEmail: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
      alert(response.data)
      navigate('/login')
    } catch (err) {
      if (err.response) {
        setServerError(err.response.data || 'Registration failed.')
      } else {
        setServerError('Cannot reach the server. Make sure the backend is running.')
      }
    }
}

return (
    <div className="page-wrapper">
    <nav className="navbar">
        <span className="navbar-brand">GrabNGo</span>
        <div className="navbar-actions">
        <button className="nav-btn active" onClick={() => navigate('/')}>Sign up</button>
        <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
        </div>
    </nav>

    <main className="main-content">
        <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
            <label>Student ID</label>
            <input
                type="text"
                name="studentId"
                placeholder="20-2345-654"
                value={formData.studentId}
                onChange={handleChange}
                className={errors.studentId ? 'input-error' : ''}
            />
            {errors.studentId && <span className="field-error">{errors.studentId}</span>}
            </div>
            <div className="form-group">
            <label>Institutional Email</label>
            <input
                type="text"
                name="email"
                placeholder="juan.delacruz@cit.edu"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="form-group">
            <label>Full Name</label>
            <input
                type="text"
                name="fullName"
                placeholder="Juan Dela Cruz"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'input-error' : ''}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </div>
            <div className="form-group">
            <label>Password</label>
            <input
                type="password"
                name="password"
                placeholder="••••••••••"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'input-error' : ''}
            />
            {formData.password && (
              <ul className="password-rules">
                {passwordRules.map(rule => (
                  <li key={rule.key} className={rule.test(formData.password) ? 'rule-pass' : 'rule-fail'}>
                    <span className="rule-icon">{rule.test(formData.password) ? '✓' : '✗'}</span>
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}
            {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="form-group">
            <label>Confirm Password</label>
            <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
            <button type="submit" className="btn-primary">Create Account</button>
          </form>
          {serverError && <p className="auth-error">{serverError}</p>}
        <p className="auth-switch">
            Already have an account?{' '}
            <span className="auth-switch-link" onClick={() => navigate('/login')}>SIGN IN</span>
          </p>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 GrabNGo. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Register

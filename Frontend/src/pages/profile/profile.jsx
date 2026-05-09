import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './profile.css'
import logoOrange from '../../components/logo/logoorange.png'
import DashboardSidebar from '../../components/sidebar/DashboardSidebar'
import { changePassword, updateProfileName } from '../../api/authApi'

const passwordRules = [
  { key: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { key: 'upper', label: 'At least 1 uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { key: 'lower', label: 'At least 1 lowercase letter', test: (p) => /[a-z]/.test(p) },
  { key: 'number', label: 'At least 1 number', test: (p) => /[0-9]/.test(p) },
  { key: 'special', label: 'At least 1 special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
]

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 5h2l2.2 10.2a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 8H7" />
      <circle cx="10" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 19a8 8 0 0 1 16 0" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function UserSmallIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 19a8 8 0 0 1 16 0" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 6h18v12H3z" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14 4h5v16h-5" />
      <path d="M10 12h9" />
      <path d="m16 8 4 4-4 4" />
      <path d="M4 4h6" />
      <path d="M4 20h6" />
    </svg>
  )
}

function Profile() {
  const navigate = useNavigate()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] = useState(false)
  const [showProfileSuccessModal, setShowProfileSuccessModal] = useState(false)
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('grabngoUser')
    if (!stored) {
      return { email: 'Not available', studentId: 'Not available', fullName: 'GrabNGo User' }
    }

    try {
      const parsed = JSON.parse(stored)
      return {
        email: parsed.email || 'Not available',
        studentId: parsed.studentId || 'Not available',
        fullName: parsed.fullName || 'GrabNGo User',
      }
    } catch {
      return { email: 'Not available', studentId: 'Not available', fullName: 'GrabNGo User' }
    }
  })
  const [editFullName, setEditFullName] = useState(user.fullName)

  const handleSignOut = () => {
    localStorage.removeItem('grabngoUser')
    navigate('/login')
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirmModal(true)
  }

  const handleConfirmLogout = () => {
    setShowLogoutConfirmModal(false)
    handleSignOut()
  }

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
    setPasswordError('')
    setPasswordMessage('')
  }

  const handleEditProfileClick = () => {
    setEditFullName(user.fullName)
    setProfileError('')
    setProfileMessage('')
    setShowEditProfile((prev) => !prev)
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileMessage('')

    if (!user.email || user.email === 'Not available') {
      setProfileError('Missing user email. Please sign in again.')
      return
    }
    if (!editFullName.trim()) {
      setProfileError('Full name is required.')
      return
    }

    try {
      setIsSubmittingProfile(true)
      const response = await updateProfileName({
        email: user.email,
        fullName: editFullName.trim(),
      })

      const nextUser = { ...user, fullName: editFullName.trim() }
      setUser(nextUser)
      localStorage.setItem('grabngoUser', JSON.stringify(nextUser))
      setProfileMessage(response.data || 'Profile updated successfully.')
      setShowEditProfile(false)
      setShowProfileSuccessModal(true)
    } catch (err) {
      setProfileError(err.response?.data || 'Failed to update profile.')
    } finally {
      setIsSubmittingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordMessage('')

    if (!user.email || user.email === 'Not available') {
      setPasswordError('Missing user email. Please sign in again.')
      return
    }
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All password fields are required.')
      return
    }
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError('New password must be different from your current password.')
      return
    }
    if (passwordRules.some((rule) => !rule.test(passwordForm.newPassword))) {
      setPasswordError('New password does not meet all strength requirements.')
      return
    }

    try {
      setIsSubmittingPassword(true)
      await changePassword({
        email: user.email,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      })
      setPasswordMessage('')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowChangePassword(false)
      setShowPasswordSuccessModal(true)
    } catch (err) {
      setPasswordError(err.response?.data || 'Failed to change password.')
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  return (
    <div className="profile-layout">
      <DashboardSidebar user={user} onLogout={handleSignOut} />
      <div className="profile-page">
        <header className="profile-header">
        <button
          type="button"
          className="logo-button"
          onClick={() => navigate('/dashboard')}
          aria-label="Go to dashboard"
        >
          <img src={logoOrange} alt="GrabNGo" className="profile-logo" />
        </button>

        <div className="header-actions" aria-label="Header actions">
          <button type="button" className="icon-button" aria-label="Shopping cart">
            <CartIcon />
          </button>
          <div className="profile-chip" aria-label="Profile summary">
            <span className="profile-chip-icon">
              <ProfileIcon />
            </span>
            <span className="profile-chip-name">{user.fullName}</span>
            <span className="profile-chip-caret">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
      </header>

      <main className="profile-content">
        <h1 className="profile-title">My Profile</h1>

        <section className="profile-banner" aria-label="Profile banner">
          <span className="profile-avatar" aria-hidden="true">
            <ProfileIcon />
          </span>
          <p>{user.fullName}</p>
        </section>

        <section className="profile-panels" aria-label="Profile information">
          <article className="panel-card">
            <h2>Personal Information</h2>

            <div className="panel-line">
              <span className="line-icon">
                <UserSmallIcon />
              </span>
              <div>
                <p className="line-label">Full Name</p>
                <p className="line-value">{user.fullName}</p>
              </div>
            </div>

            <div className="panel-line">
              <span className="line-icon">
                <MailIcon />
              </span>
              <div>
                <p className="line-label">Institutional Email</p>
                <p className="line-value">{user.email}</p>
              </div>
            </div>

            <div className="panel-line">
              <span className="line-icon">
                <UserSmallIcon />
              </span>
              <div>
                <p className="line-label">Student ID</p>
                <p className="line-value">{user.studentId}</p>
              </div>
            </div>
          </article>
        </section>

        <section className="profile-actions-row" aria-label="Profile actions placeholders">
          <button
            type="button"
            className="placeholder-button"
            onClick={handleEditProfileClick}
          >
            Edit Profile
          </button>
          <button
            type="button"
            className="placeholder-button"
            onClick={() => setShowChangePassword((prev) => !prev)}
          >
            Change Password
          </button>
          <button type="button" className="placeholder-button" disabled>
            Change Profile Picture
          </button>
          <button type="button" className="logout-button" onClick={handleLogoutClick}>
            Sign Out
            <LogoutIcon />
          </button>
        </section>

        {showEditProfile && (
          <section className="change-password-card" aria-label="Edit profile form">
            <h3>Edit Profile</h3>
            <form onSubmit={handleProfileSubmit} className="change-password-form">
              <label>
                Full Name
                <input
                  type="text"
                  name="fullName"
                  value={editFullName}
                  onChange={(e) => {
                    setEditFullName(e.target.value)
                    setProfileError('')
                    setProfileMessage('')
                  }}
                />
              </label>

              {profileError && <p className="password-feedback error">{profileError}</p>}
              {profileMessage && <p className="password-feedback success">{profileMessage}</p>}

              <button type="submit" className="save-password-button" disabled={isSubmittingProfile}>
                {isSubmittingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </section>
        )}

        {showChangePassword && (
          <section className="change-password-card" aria-label="Change password form">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="change-password-form">
              <label>
                Current Password
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInputChange}
                />
              </label>

              <label>
                New Password
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                />
              </label>

              {passwordForm.newPassword && (
                <ul className="password-rules">
                  {passwordRules.map((rule) => (
                    <li key={rule.key} className={rule.test(passwordForm.newPassword) ? 'rule-pass' : 'rule-fail'}>
                      <span className="rule-icon">{rule.test(passwordForm.newPassword) ? '✓' : '✗'}</span>
                      {rule.label}
                    </li>
                  ))}
                </ul>
              )}

              <label>
                Confirm New Password
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInputChange}
                />
              </label>

              {passwordError && <p className="password-feedback error">{passwordError}</p>}
              {passwordMessage && <p className="password-feedback success">{passwordMessage}</p>}

              <button type="submit" className="save-password-button" disabled={isSubmittingPassword}>
                {isSubmittingPassword ? 'Saving...' : 'Save New Password'}
              </button>
            </form>
          </section>
        )}

        {showPasswordSuccessModal && (
          <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Password changed successfully">
            <div className="success-modal">
              <h3>Password Updated</h3>
              <p>Your password has been changed successfully.</p>
              <button
                type="button"
                className="modal-confirm-button"
                onClick={() => setShowPasswordSuccessModal(false)}
              >
                Okay
              </button>
            </div>
          </div>
        )}

        {showProfileSuccessModal && (
          <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Profile updated successfully">
            <div className="success-modal">
              <h3>Profile Updated</h3>
              <p>Your profile has been updated successfully.</p>
              <button
                type="button"
                className="modal-confirm-button"
                onClick={() => setShowProfileSuccessModal(false)}
              >
                Okay
              </button>
            </div>
          </div>
        )}

        {showLogoutConfirmModal && (
          <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Logout confirmation">
            <div className="success-modal">
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to sign out?</p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={() => setShowLogoutConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="modal-confirm-button"
                  onClick={handleConfirmLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  )
}

export default Profile

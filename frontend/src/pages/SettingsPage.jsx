import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { deleteAccount } from '../api/client'

function SettingsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const isAnonymous = user?.is_anonymous || !user?.email

  function handleLogout() {
    localStorage.clear()
    navigate('/')
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    setError('')
    try {
      await deleteAccount()
      localStorage.clear()
      navigate('/')
    } catch (err) {
      setError(err.message)
      setDeleting(false)
      setShowModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-violet-50">

      {/* Confirm Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ backdropFilter: 'blur(2px)', backgroundColor: 'rgba(237, 233, 254, 0.5)' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Account</h3>
            <p className="text-sm text-gray-500 mb-6">This will permanently delete your account and all your cases, incidents and evidence. This cannot be undone.</p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-violet-200 text-violet-700 hover:bg-violet-50 py-3 rounded-xl text-sm font-semibold transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="bg-white border-b border-violet-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span className="text-lg font-bold text-violet-800">CyberShield</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-purple-700 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-800 hover:to-blue-800 transition-colors">
          ← Back to Dashboard
        </button>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-800 px-6 py-6">
        <p className="text-violet-300 text-xs mb-1 uppercase tracking-widest">Account</p>
        <h2 className="text-white font-bold text-xl">Settings</h2>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-4">

        {isAnonymous ? (
          <>
            {/* Anonymous user view */}
            <div className="bg-white rounded-2xl border border-violet-100 p-6 shadow-sm text-center">
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">Browsing Anonymously</h3>
              <p className="text-xs text-gray-400 mb-6">You are not logged in to a registered account. Create an account to save your cases permanently and access them from any device.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate('/register')} className="w-full bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                  Create an Account
                </button>
                <button onClick={() => navigate('/login')} className="w-full border border-violet-200 text-violet-700 hover:bg-violet-50 py-3 rounded-xl text-sm font-semibold transition-colors">
                  Login to Existing Account
                </button>
              </div>
            </div>

            {/* Logout */}
            <div className="bg-white rounded-2xl border border-violet-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Session</h3>
              <p className="text-xs text-gray-400 mb-4">End your anonymous session.</p>
              <button onClick={handleLogout} className="w-full bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Registered user view */}
            <div className="bg-white rounded-2xl border border-violet-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Account</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-700 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                  {user?.email ? user.email[0].toUpperCase() : '?'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user?.email}</p>
                  <p className="text-xs text-gray-400">Logged in</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-violet-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Password</h3>
              <p className="text-xs text-gray-400 mb-4">Change your account password via the reset flow.</p>
              <button onClick={() => navigate('/forgot-password')} className="w-full border border-violet-200 text-violet-700 hover:bg-violet-50 py-3 rounded-xl text-sm font-semibold transition-colors">
                Change Password
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-violet-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Session</h3>
              <p className="text-xs text-gray-400 mb-4">Log out of your CyberShield account on this device.</p>
              <button onClick={handleLogout} className="w-full bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                Logout
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h3>
              <p className="text-xs text-gray-400 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
              <button onClick={() => setShowModal(true)} className="w-full border border-red-300 text-red-600 hover:bg-red-50 py-3 rounded-xl text-sm font-semibold transition-colors">
                Delete Account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SettingsPage
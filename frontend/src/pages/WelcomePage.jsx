import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAnonymous, setToken } from '../api/client'

function WelcomePage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  async function handleAnonymous() {
    try {
      const data = await loginAnonymous()
      setToken(data.token)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  const words = [
    { text: 'SAFE', top: '4%', left: '3%', rotate: '-10deg', size: '42px' },
    { text: 'HEARD', top: '8%', right: '3%', rotate: '7deg', size: '38px' },
    { text: 'PROTECTED', top: '36%', left: '1%', rotate: '-6deg', size: '32px' },
    { text: 'SUPPORTED', top: '40%', right: '1%', rotate: '5deg', size: '32px' },
    { text: 'SAFE', bottom: '18%', left: '3%', rotate: '4deg', size: '40px' },
    { text: 'BELIEVED', bottom: '14%', right: '2%', rotate: '-8deg', size: '34px' },
    { text: 'HEARD', bottom: '3%', left: '8%', rotate: '5deg', size: '30px' },
    { text: 'PROTECTED', bottom: '4%', right: '3%', rotate: '-4deg', size: '30px' },
  ]

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Learn More Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ backdropFilter: 'blur(2px)', backgroundColor: 'rgba(237, 233, 254, 0.5)' }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🛡️</div>
              <h2 className="text-xl font-bold text-violet-800">About CyberShield</h2>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Document Incidents</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Record every cyberbullying incident with the platform, date, time and a full description. Build a clear, structured case over time.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Secure Evidence</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Upload screenshots, voice notes and files. Every file is hashed with SHA256 to prove it hasn't been tampered with — making it legally defensible.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Generate Reports</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Export a professionally structured PDF report of your entire case — ready to submit to school authorities, law enforcement or legal counsel.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Your Privacy is Protected</p>
                  <p className="text-xs text-gray-500 leading-relaxed">You can use CyberShield completely anonymously — no name required. Your data is encrypted and never shared with third parties without your consent.</p>
                </div>
              </div>

              <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                <p className="text-xs text-violet-700 leading-relaxed text-center font-medium">
                  🔒 Everything you record on CyberShield is confidential. We do not share your information with anyone without your explicit consent.
                </p>
              </div>
            </div>

            <button onClick={() => setShowModal(false)} className="w-full mt-6 bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm">
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Backdrop words */}
      {words.map((w, i) => (
        <span
          key={i}
          className="absolute font-black text-violet-300 pointer-events-none select-none"
          style={{
            top: w.top || 'auto',
            bottom: w.bottom || 'auto',
            left: w.left || 'auto',
            right: w.right || 'auto',
            fontSize: w.size,
            transform: `rotate(${w.rotate})`,
            letterSpacing: '2px'
          }}
        >
          {w.text}
        </span>
      ))}

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg p-12 w-full max-w-md text-center relative z-10">
        <div className="text-4xl mb-3">🛡️</div>
        <h1 className="text-2xl font-bold text-violet-800 mb-2">CyberShield</h1>
        <p className="text-gray-400 text-sm mb-2">You are not alone. We are here to help.</p>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          A safe space to document and report cyberbullying incidents. Private, secure, and legally structured.
        </p>
        <button onClick={() => setShowModal(true)} className="text-violet-600 text-xs font-semibold hover:underline mb-6 block mx-auto">
          Learn more →
        </button>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate('/login')} className="w-full bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm">
            Login to Your Account
          </button>
          <button onClick={() => navigate('/register')} className="w-full border-2 border-violet-700 text-violet-700 hover:bg-violet-50 py-3 rounded-xl text-sm font-semibold transition-colors">
            Create an Account
          </button>
          <button onClick={handleAnonymous} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 py-3 rounded-xl text-sm transition-colors">
            Continue Anonymously
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-6">🔒 Encrypted and confidential</p>
      </div>
    </div>
  )
}

export default WelcomePage
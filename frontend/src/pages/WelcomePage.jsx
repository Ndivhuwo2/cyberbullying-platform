import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAnonymous, setToken } from '../api/client'

function WelcomePage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

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

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center px-4 relative overflow-hidden">

      <span className="absolute font-black text-pink-300 pointer-events-none select-none" style={{ top:'4%', left:'3%', fontSize:'42px', transform:'rotate(-10deg)', letterSpacing:'2px' }}>SAFE</span>
      <span className="absolute font-black text-pink-300 pointer-events-none select-none" style={{ top:'8%', right:'3%', fontSize:'38px', transform:'rotate(7deg)', letterSpacing:'2px' }}>HEARD</span>
      <span className="absolute font-black text-pink-300 pointer-events-none select-none" style={{ top:'36%', left:'1%', fontSize:'32px', transform:'rotate(-6deg)', letterSpacing:'2px' }}>PROTECTED</span>
      <span className="absolute font-black text-pink-300 pointer-events-none select-none" style={{ top:'40%', right:'1%', fontSize:'32px', transform:'rotate(5deg)', letterSpacing:'2px' }}>SUPPORTED</span>
      <span className="absolute font-black text-pink-300 pointer-events-none select-none" style={{ bottom:'18%', left:'3%', fontSize:'40px', transform:'rotate(4deg)', letterSpacing:'2px' }}>SAFE</span>
      <span className="absolute font-black text-pink-300 pointer-events-none select-none" style={{ bottom:'14%', right:'2%', fontSize:'34px', transform:'rotate(-8deg)', letterSpacing:'2px' }}>BELIEVED</span>
      <span className="absolute font-black text-pink-300 pointer-events-none select-none" style={{ bottom:'3%', left:'8%', fontSize:'30px', transform:'rotate(5deg)', letterSpacing:'2px' }}>HEARD</span>
      <span className="absolute font-black text-pink-300 pointer-events-none select-none" style={{ bottom:'4%', right:'3%', fontSize:'30px', transform:'rotate(-4deg)', letterSpacing:'2px' }}>PROTECTED</span>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg p-12 w-full max-w-md text-center relative z-10">
        <div className="text-4xl mb-3">🛡️</div>
        <h1 className="text-2xl font-bold text-pink-700 mb-2">CyberShield</h1>
        <p className="text-gray-400 text-sm mb-2">You are not alone. We are here to help.</p>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          A safe space to document and report cyberbullying incidents. Private, secure, and legally structured.
        </p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate('/login')} className="w-full bg-pink-700 hover:bg-pink-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
            Login to Your Account
          </button>
          <button onClick={() => navigate('/register')} className="w-full border-2 border-pink-700 text-pink-700 hover:bg-pink-50 py-3 rounded-xl text-sm font-semibold transition-colors">
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
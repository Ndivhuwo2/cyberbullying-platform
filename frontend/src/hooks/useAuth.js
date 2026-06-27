import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function useAuth() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  return { user, token }
}

export default useAuth
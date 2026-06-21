import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch(
        'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      )
      const data = await res.json()

      if (res.ok) {
        Cookies.set('jwt_token', data.data.token)
        navigate('/')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch {
      setError('Something went wrong')
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Go Business</h1>
        <p className="sub">Sign in to open your referral dashboard.</p>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="signin-btn">Sign in</button>

        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  )
}

export default Login
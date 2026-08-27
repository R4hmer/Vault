import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const API_URL = import.meta.env.VITE_API_URL

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to log in.'
        )
      }

      localStorage.setItem(
        'currentUser',
        JSON.stringify(data.user)
      )

      window.dispatchEvent(new Event('authChange'))

      navigate('/')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <span className="login-icon">♙</span>

          <h1>WELCOME BACK</h1>

          <p>Log in to your Vault.</p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter your password"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="login-register">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() =>
              navigate('/register')
            }
          >
            Register
          </button>
        </p>
      </section>
    </main>
  )
}

export default Login
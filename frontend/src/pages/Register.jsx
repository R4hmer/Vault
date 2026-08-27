import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Register.css'

const API_URL = import.meta.env.VITE_API_URL

function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
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
        `${API_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to create account.'
        )
      }

      navigate('/login')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-header">
          <span className="register-icon">♙</span>

          <h1>CREATE YOUR VAULT</h1>

          <p>Start turning your ideas into action.</p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          {error && (
            <p className="register-error">
              {error}
            </p>
          )}

          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            placeholder="Choose a username"
            required
          />

          <label htmlFor="register-email">
            Email
          </label>

          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Enter your email"
            required
          />

          <label htmlFor="register-password">
            Password
          </label>

          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Create a password"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Creating account...'
              : 'Create Account'}
          </button>
        </form>

        <p className="register-login">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() =>
              navigate('/login')
            }
          >
            Log In
          </button>
        </p>
      </section>
    </main>
  )
}

export default Register

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

const API_URL = import.meta.env.VITE_API_URL

function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [ideas, setIdeas] = useState([])
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)

      setUser(parsedUser)
      setUsername(parsedUser.username)
      setEmail(parsedUser.email)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      return
    }

    async function loadPublicIdeas() {
      try {
        const response = await fetch(
          `${API_URL}/users/${user.id}/public-ideas`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.error || 'Unable to load public ideas.'
          )
        }

        setIdeas(data)
      } catch (error) {
        setError(error.message)
      }
    }

    loadPublicIdeas()
  }, [user])

  function handleLogout() {
    localStorage.removeItem('currentUser')
    window.dispatchEvent(new Event('authChange'))
    setUser(null)
    navigate('/login')
  }

  function handleEdit() {
    setError('')
    setSuccess('')
    setEditing(true)
  }

  function handleCancel() {
    setUsername(user.username)
    setEmail(user.email)
    setError('')
    setSuccess('')
    setEditing(false)
  }

  async function handleSave(event) {
    event.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/auth/profile/${user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            email
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to update profile.'
        )
      }

      localStorage.setItem(
        'currentUser',
        JSON.stringify(data.user)
      )

      window.dispatchEvent(new Event('authChange'))

      setUser(data.user)
      setUsername(data.user.username)
      setEmail(data.user.email)
      setEditing(false)
      setSuccess('Profile updated successfully.')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <main className="profile-page">
        <section className="profile-header">
          <div>
            <h1>YOUR PROFILE</h1>
            <p>You are not logged in.</p>
            <span>
              Log in to see your profile and ideas.
            </span>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div>
          <h1>YOUR PROFILE</h1>
          <p>@{user.username}</p>
        </div>
      </section>

      <section className="profile-details">
        {!editing ? (
          <div className="profile-info">
            <div className="profile-info-item">
              <span>USERNAME</span>
              <p>{user.username}</p>
            </div>

            <div className="profile-info-item">
              <span>EMAIL</span>
              <p>{user.email}</p>
            </div>
          </div>
        ) : (
          <form
            className="profile-edit-form"
            onSubmit={handleSave}
          >
            <label htmlFor="profile-username">
              Username
            </label>

            <input
              id="profile-username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              required
            />

            <label htmlFor="profile-email">
              Email
            </label>

            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

            <div className="profile-edit-actions">
              <button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      {success && (
        <p className="profile-success">
          {success}
        </p>
      )}

      {error && !editing && (
        <p className="profile-error">
          {error}
        </p>
      )}

      {!editing && (
        <button
          className="profile-edit-button"
          type="button"
          onClick={handleEdit}
        >
          Edit Profile
        </button>
      )}

      <section className="profile-ideas">
        <h2>PUBLIC IDEAS</h2>

        {ideas.length === 0 ? (
          <div className="profile-empty">
            <p>Your public ideas will appear here.</p>
          </div>
        ) : (
          <div className="profile-ideas-list">
            {ideas.map((idea) => (
              <article
                className="profile-idea-card"
                key={idea.id}
              >
                <div className="profile-idea-content">
                  <h3>{idea.title}</h3>

                  <p>{idea.description}</p>

                  <span>
                    {idea.category} · {idea.status}
                  </span>
                </div>

                <div className="profile-idea-engagement">
                  <span>
                    ♥ {idea.likes_count}
                  </span>

                  <span>
                    ★ {idea.favourites_count}
                  </span>

                  <span>
                    💬 {idea.comments_count}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <button
        className="profile-logout-button"
        type="button"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </main>
  )
}

export default Profile
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Notifications.css'

const API_URL = import.meta.env.VITE_API_URL

function Notifications({ user }) {
  const navigate = useNavigate()

  const [notifications, setNotifications] =
    useState([])
  const [loading, setLoading] =
    useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setLoading(false)
      return
    }

    loadNotifications()
  }, [user])

  async function loadNotifications() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/notifications/user/${user.id}`
      )

      if (!response.ok) {
        throw new Error(
          'Failed to load notifications'
        )
      }

      const data = await response.json()

      setNotifications(data)
    } catch {
      setError(
        'Unable to load notifications.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id) {
    try {
      await fetch(
        `${API_URL}/notifications/${id}/read`,
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json'
          }
        }
      )

      setNotifications(
        (current) =>
          current.map((notification) =>
            notification.id === id
              ? {
                  ...notification,
                  is_read: true
                }
              : notification
          )
      )
    } catch {
      // Leave notification visible.
    }
  }

  if (!user) {
    return (
      <main className="notifications-page">
        <div className="notifications-empty">
          <h1>NOTIFICATIONS</h1>

          <p>
            Log in to see your notifications.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/login')
            }
          >
            Log In
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="notifications-page">
      <section className="notifications-container">
        <div className="notifications-header">
          <h1>Notifications</h1>

          <p>
            Activity on your ideas.
          </p>
        </div>

        {loading && (
          <p className="notifications-status">
            Loading notifications...
          </p>
        )}

        {error && (
          <p className="notifications-error">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          notifications.length === 0 && (
            <div className="notifications-empty">
              <p>
                You don't have any
                notifications yet.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          notifications.length > 0 && (
            <div className="notifications-list">
              {notifications.map(
                (notification) => (
                  <button
                    className={`notification-item ${
                      notification.is_read
                        ? 'read'
                        : 'unread'
                    }`}
                    key={notification.id}
                    type="button"
                    onClick={() =>
                      markAsRead(
                        notification.id
                      )
                    }
                  >
                    <span className="notification-dot" />

                    <p>
                      {notification.message}
                    </p>
                  </button>
                )
              )}
            </div>
          )}
      </section>
    </main>
  )
}

export default Notifications
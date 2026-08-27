import { useEffect, useState } from 'react'
import './Notifications.css'

const API_URL = import.meta.env.VITE_API_URL
const CURRENT_USER_ID = 1

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadNotifications()
  }, [])

  async function loadNotifications() {
    try {
      const response = await fetch(
        `${API_URL}/notifications/user/${CURRENT_USER_ID}`
      )

      if (!response.ok) {
        throw new Error('Failed to load notifications')
      }

      const data = await response.json()

      setNotifications(data)
    } catch {
      setError('Unable to load notifications.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="notifications-page">
      <div className="notifications-content">
        <div className="notification-icon">♡</div>

        <h1>NOTIFICATIONS</h1>

        <p>Your notifications are waiting.</p>

        {loading && <p>Loading...</p>}

        {error && <p>{error}</p>}

        {!loading &&
          !error &&
          notifications.length === 0 && (
            <span>
              You don't have any notifications yet.
            </span>
          )}

        {!loading &&
          !error &&
          notifications.length > 0 && (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  className={`notification-item ${
                    notification.is_read
                      ? 'read'
                      : 'unread'
                  }`}
                  key={notification.id}
                >
                  {notification.message}
                </div>
              ))}
            </div>
          )}
      </div>
    </main>
  )
}

export default Notifications
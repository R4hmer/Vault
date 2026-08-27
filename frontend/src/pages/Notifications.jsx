import { useEffect, useState } from 'react'
import { getNotifications } from '../api'
import './Notifications.css'

const CURRENT_USER_ID = 1

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await getNotifications(CURRENT_USER_ID)
        setNotifications(data)
      } catch {
        setError('Unable to load notifications.')
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  return (
    <main className="notifications-page">
      <div className="notifications-content">
        <div className="notification-icon">♡</div>

        <h1>NOTIFICATIONS</h1>

        <p>Your notifications are waiting.</p>

        {loading && <span>Loading...</span>}

        {error && <span>{error}</span>}

        {!loading && !error && notifications.length === 0 && (
          <span>
            You don't have any notifications yet.
          </span>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                className="notification-item"
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
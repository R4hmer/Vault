import './Notifications.css'

function Notifications() {
  return (
    <main className="notifications-page">
      <div className="notifications-content">
        <div className="notification-icon">♡</div>

        <h1>NOTIFICATIONS</h1>

        <p>Your notifications are waiting.</p>

        <span>
          Log in to see who favourited your ideas, liked or disliked your
          ideas, and sent you messages.
        </span>

        <button>Log In</button>
      </div>
    </main>
  )
}

export default Notifications
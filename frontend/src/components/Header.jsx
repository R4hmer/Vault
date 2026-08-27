import { NavLink } from 'react-router-dom'
import './Header.css'

function Header({ user }) {
  return (
    <header className="header">
      <NavLink to="/" className="brand">
        <span className="logo">𝒱𝒶𝓊𝓁𝓉</span>
        <span className="slogan">Ideas worth building.</span>
      </NavLink>

      <nav className="navigation">
        <NavLink to="/" className="nav-link">
          Vault
        </NavLink>

        <NavLink to="/explore" className="nav-link">
          Explore
        </NavLink>

        <NavLink to="/notifications" className="nav-link">
          Notifications
        </NavLink>

        {user ? (
          <NavLink to="/profile" className="nav-link">
            {user.username}
          </NavLink>
        ) : (
          <NavLink to="/login" className="nav-link">
            Log In
          </NavLink>
        )}
      </nav>
    </header>
  )
}

export default Header
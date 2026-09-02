import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'

import Vault from './pages/Vault'
import Explore from './pages/Explore'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import PublicProfile from './pages/PublicProfile'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem('currentUser')

    return savedUser
      ? JSON.parse(savedUser)
      : null
  })

  useEffect(() => {
    function handleAuthChange() {
      const savedUser =
        localStorage.getItem(
          'currentUser'
        )

      setUser(
        savedUser
          ? JSON.parse(savedUser)
          : null
      )
    }

    window.addEventListener(
      'authChange',
      handleAuthChange
    )

    return () => {
      window.removeEventListener(
        'authChange',
        handleAuthChange
      )
    }
  }, [])

  return (
    <BrowserRouter>
      <Header
        user={user}
        setUser={setUser}
      />

      <Routes>
        <Route
          path="/"
          element={<Vault />}
        />

        <Route
          path="/explore"
          element={<Explore />}
        />

        <Route
          path="/notifications"
          element={
            <Notifications user={user} />
          }
        />

        <Route
          path="/profile"
          element={<Profile user={user} />}
        />

        <Route
          path="/users/:userId"
          element={<PublicProfile />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App
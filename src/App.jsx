import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Vault from './pages/Vault'
import Explore from './pages/Explore'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Vault />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
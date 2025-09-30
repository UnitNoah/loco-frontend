import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import SpotList from './pages/SpotList'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Spot from './pages/Spot'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'

function App() {
  const { login, logout } = useAuthStore()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/profile`, {
      credentials: 'include', // 쿠키 포함
    })
      .then((res) => {
        if (!res.ok) throw new Error('Not logged in')
        return res.json()
      })
      .then((data) => {
        const user = data.data
        login({ email: user.email, nickname: user.nickname })
      })
      .catch(() => {
        logout()
      })
  }, [login, logout])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SpotList />} />
          <Route path="spot" element={<SpotList />} />
          <Route path="spot/:id" element={<Spot />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

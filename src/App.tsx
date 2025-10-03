import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import SpotList from './pages/SpotList'
import Favorites from './pages/Favorites'
import Profile from './pages/my-pages/Profile'
import Spot from './pages/Spot'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import Comments from './pages/my-pages/Comments'
import MySpots from './pages/my-pages/Spots'
import JoinedSpots from './pages/my-pages/JoinedSpots'
import Reports from './pages/my-pages/Reports'
import Settings from './pages/my-pages/Settings'
import Support from './pages/my-pages/Support'

function App() {
  const { login, logout, setInitialized } = useAuthStore()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/profile`,
          { credentials: "include" }
        )

        if (!res.ok) throw new Error("Not logged in")

        const data = await res.json()
        const user = data.data

        login({
          email: user.email,
          nickname: user.name, // 주의: 서버 필드명이 name임
          profileImage: user.profile_image,
        })
      } catch (err) {
        logout()
        console.log(err);
      } finally {
        setInitialized(true) // 성공/실패 관계없이 초기화 완료
      }
    }

    loadProfile()
  }, [login, logout, setInitialized])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SpotList />} />
          <Route path="spot" element={<SpotList />} />
          <Route path="spot/:id" element={<Spot />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my-spots" element={<MySpots />} />
          <Route path="my-comments" element={<Comments />} />
          <Route path="joined-spots" element={<JoinedSpots />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<Support />} />
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App

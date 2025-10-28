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
import MySpots from './pages/my-pages/MySpots'
import JoinedSpots from './pages/my-pages/JoinedSpots'
import Reports from './pages/my-pages/Reports'
import Settings from './pages/my-pages/Settings'
import Support from './pages/my-pages/Support'
import CreateRoom from './pages/CreateRoom'

function App() {
  const { login, logout, setInitialized } = useAuthStore()

  useEffect(() => {
    const loadProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/profile`, {
        credentials: "include"
      });

      if (!res.ok) {
        console.error('Profile API failed:', res.status, res.statusText);
        throw new Error("Not logged in");
      }

      const data = await res.json();
      console.log('Profile API response:', data); // Debug log
      
      // Check if data.data exists and has the expected structure
      if (!data.data) {
        console.error('Profile API response missing data field:', data);
        throw new Error("Invalid profile response");
      }
      
      // Check if user is actually logged in (not guest)
      if (data.data.status === 'guest') {
        console.log('User is not logged in (guest status)');
        throw new Error("Not logged in");
      }
      
      login({
        id: parseInt(data.data.user_id), // Convert string to number
        email: data.data.email,
        nickname: data.data.name,
        profileImage: data.data.profile_image,
      });

      // 로그인 성공 후 redirect 처리
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        window.location.replace(redirectPath);
      }

    } catch (err) {
      logout();
      console.log(err)
    } finally {
      setInitialized(true);
    }
  };


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
          <Route path="room/create" element={<CreateRoom />} />
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App

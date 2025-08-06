import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Spot from './pages/Spot'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Spot />} />
          <Route path="spot" element={<Spot />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

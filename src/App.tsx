import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import SpotList from './pages/SpotList'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Spot from './pages/Spot'

function App() {
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

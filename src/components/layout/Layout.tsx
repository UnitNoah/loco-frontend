import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Header from './Header'
import Login from '../Login'

const Layout = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header onLoginClick={() => setIsLoginOpen(true)} />
      <main className="p-4">
        <Outlet />
      </main>

      <Login open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  )
}

export default Layout 
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Header from './Header'
import Login from '../Login'
import RoomModal from '../RoomModal'
import { useCreateRoom } from '../../hooks/queries/useSpots'
import { useAuthStore } from '../../store/authStore'

const Layout = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false)
  const user = useAuthStore(state => state.user)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const hostId = user?.id || 0

  const { mutate: createRoom, isPending } = useCreateRoom(hostId)

  const handleCreateRoom = (data: { name: string; description: string; thumbnail?: string; isPrivate?: boolean }) => {
    if (!isLoggedIn || !hostId) {
      alert('로그인이 필요합니다. 먼저 로그인해주세요.')
      return
    }

    createRoom(
      {
        name: data.name,
        description: data.description,
        isPrivate: data.isPrivate,
        thumbnail: data.thumbnail,
      },
      {
        onSuccess: () => {
          setIsCreateRoomModalOpen(false)
          alert('룸이 성공적으로 생성되었습니다!')
        },
        onError: (error: any) => {
          console.error('Failed to create room:', error)
          alert(`룸 생성에 실패했습니다: ${error.response?.data?.message || error.message}`)
        },
      }
    )
  }

  return (
    <div className="min-h-screen">
      <Header 
        onLoginClick={() => setIsLoginOpen(true)}
        onCreateRoomClick={() => setIsCreateRoomModalOpen(true)}
      />
      <main className="p-4">
        <Outlet />
      </main>

      <Login open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      
      {isLoggedIn && (
        <RoomModal
          room={null}
          isOpen={isCreateRoomModalOpen}
          onClose={() => setIsCreateRoomModalOpen(false)}
          onSubmit={handleCreateRoom}
          isSubmitting={isPending}
          mode="create"
        />
      )}
    </div>
  )
}

export default Layout 
import { useState } from 'react'
import { useCreateRoom } from '../hooks/queries/useSpots'
import { useAuthStore } from '../store/authStore'

function CreateRoomForm() {
  const user = useAuthStore(state => state.user)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const hostId = user?.id || 0
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  
  const { mutate: createRoom, isPending } = useCreateRoom(hostId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user is logged in and has valid ID
    if (!isLoggedIn || !hostId) {
      alert('로그인이 필요합니다. 먼저 로그인해주세요.')
      return
    }
    
    createRoom({
      name,
      description,
      is_private: isPrivate,
      thumbnail: undefined // optional
    }, {
      onSuccess: (newRoom) => {
        console.log('Room created:', newRoom)
        // Reset form or navigate to room
        setName('')
        setDescription('')
        alert('룸이 성공적으로 생성되었습니다!')
      },
      onError: (error: any) => {
        console.error('Failed to create room:', error)
        console.error('Error details:', error.response?.data)
        alert(`룸 생성에 실패했습니다: ${error.response?.data?.message || error.message}`)
      }
    })
  }

  // If user is not properly authenticated, show login message
  if (!isLoggedIn || !hostId) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">새로운 스팟 생성</h2>
        <div className="text-center">
          <p className="text-gray-600 mb-4">스팟을 생성하려면 로그인이 필요합니다.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-[#0C8CE9] text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            로그인하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">새로운 스팟 생성</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            스팟 이름 *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="스팟 이름을 입력하세요"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C8CE9] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            설명
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="스팟에 대한 설명을 입력하세요"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C8CE9] focus:border-transparent"
          />
        </div>

        <div className="flex items-center">
          <input
            id="isPrivate"
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="h-4 w-4 text-[#0C8CE9] focus:ring-[#0C8CE9] border-gray-300 rounded"
          />
          <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
            비공개 스팟
          </label>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-[#0C8CE9] text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#0C8CE9] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? '생성 중...' : '스팟 생성'}
        </button>
      </form>
    </div>
  )
}

export default CreateRoomForm

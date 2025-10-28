import { useState, useEffect } from 'react'
import type { Room } from '../api/types'

interface EditRoomModalProps {
  room: Room | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (data: { name: string; description: string; thumbnail?: string }) => void
  isUpdating: boolean
}

function EditRoomModal({ room, isOpen, onClose, onUpdate, isUpdating }: EditRoomModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState<string | undefined>('')
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    if (room) {
      setName(room.name || '')
      setDescription(room.description || '')
      setThumbnail(room.thumbnail || '')
      setImagePreview(room.thumbnail || '')
    }
  }, [room])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setThumbnail(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({ name, description, thumbnail })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">스팟 정보 수정</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 스팟 대표 이미지 */}
          <div>
            <h3 className="text-lg font-semibold mb-2">스팟 대표 이미지</h3>
            <p className="text-xs text-gray-500 mb-4">
              운영정책에 어긋나는 이미지 등록시 이용이 제한될 수 있습니다.
            </p>
            <div className="flex gap-4">
              {/* Current Image */}
              <div className="w-40 h-40 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imagePreview || 'https://picsum.photos/160/160'}
                  alt="Current"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Change Image */}
              <label className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm text-gray-600 mt-2">이미지 변경</span>
              </label>
            </div>
          </div>

          {/* 스팟 이름 */}
          <div>
            <label htmlFor="name" className="block text-lg font-semibold mb-2">
              * 스팟 이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {name.length}/50
            </p>
          </div>

          {/* 스팟 설명 */}
          <div>
            <label htmlFor="description" className="block text-lg font-semibold mb-2">
              스팟 설명
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={50}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {description.length}/50
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isUpdating || !name.trim()}
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-md text-base font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? '수정 중...' : '수정'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="flex-1 bg-white text-gray-700 border border-gray-300 py-3 px-4 rounded-md text-base font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRoomModal


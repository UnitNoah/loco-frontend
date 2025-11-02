import { useState, useEffect, useRef } from 'react'
import type { Room } from '../api/types'

interface RoomModalProps {
  room?: Room | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description: string; thumbnail?: string; isPrivate?: boolean }) => void
  isSubmitting: boolean
  mode?: 'create' | 'edit'
}

function RoomModal({ room, isOpen, onClose, onSubmit, isSubmitting, mode = room ? 'edit' : 'create' }: RoomModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState<string | undefined>('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isPrivate, setIsPrivate] = useState(false)
  const prevSubmittingRef = useRef(false)

  // Reset form after successful submission
  useEffect(() => {
    if (prevSubmittingRef.current && !isSubmitting && mode === 'create') {
      // Form was just submitted successfully, reset fields
      setName('')
      setDescription('')
      setThumbnail('')
      setImagePreview('')
      setIsPrivate(false)
    }
    prevSubmittingRef.current = isSubmitting
  }, [isSubmitting, mode])

  // Load room data when editing or reset form when opening in create mode
  useEffect(() => {
    if (room) {
      // Edit mode: load room data
      setName(room.name || '')
      setDescription(room.description || '')
      setThumbnail(room.thumbnail || '')
      setImagePreview(room.thumbnail || '')
      setIsPrivate(room.is_private || false)
    } else if (mode === 'create' && isOpen) {
      // Create mode: reset form when modal opens (if not just submitted)
      if (!isSubmitting) {
        setName('')
        setDescription('')
        setThumbnail('')
        setImagePreview('')
        setIsPrivate(false)
      }
    }
  }, [room, mode, isOpen, isSubmitting])

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
    onSubmit({ name, description, thumbnail, isPrivate })
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose()
    }
  }

  if (!isOpen) return null

  const isEditMode = mode === 'edit'
  const title = isEditMode ? '스팟 정보 수정' : '새로운 스팟 생성'
  const submitText = isSubmitting ? (isEditMode ? '수정 중...' : '생성 중...') : (isEditMode ? '수정' : '생성')

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">{title}</h2>

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

          {/* 비공개 스팟 체크박스 - Show for create mode or allow editing */}
          {!isEditMode && (
            <div className="flex items-center">
              <input
                id="isPrivate"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
                비공개 스팟
              </label>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-md text-base font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitText}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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

export default RoomModal


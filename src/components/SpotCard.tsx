import React, { useState } from 'react'
import heartIcon from '../assets/icons/heart.svg'

interface SpotCardProps {
  id: number
  title: string
  hashtags: string[]
  image: string
  username: string
  memberCount: number
  userAvatar?: string
  isLiked?: boolean
  onCardClick?: () => void
  onLikeClick?: () => void
}

const SpotCard: React.FC<SpotCardProps> = ({ 
  id, 
  title, 
  hashtags,
  image, 
  username,
  memberCount,
  userAvatar,
  isLiked = false,
  onCardClick,
  onLikeClick
}) => {
  const [liked, setLiked] = useState(isLiked)

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(!liked)
    onLikeClick?.()
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      onClick={onCardClick}
    >
      {/* Main Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover"
      />
      
      {/* Content Section */}
      <div className="p-4">
        {/* Hashtags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {hashtags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[#D9D9D9] text-black text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-medium text-gray-900 mb-3 text-base leading-tight">
          {title}
        </h3>

        {/* User Info */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            {userAvatar ? (
              <img src={userAvatar} alt={username} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-gray-500 text-xs">?</span>
            )}
          </div>
          <div className="flex-1 flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900">{username}</p>
            <p className="text-xs text-gray-500">{memberCount}명</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-[#0C8CE9] text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors  cursor-pointer">
            들어가기
          </button>
          <button 
            onClick={handleLikeClick}
            className="w-10 h-10 bg-white border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors  cursor-pointer"
          >
            <img
              src={heartIcon}
              alt="heart"
              className={`w-5 h-5 ${liked ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SpotCard
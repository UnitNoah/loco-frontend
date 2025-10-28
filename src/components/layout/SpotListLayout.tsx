import { useState, useMemo } from 'react'
import Search from '../ui/Search'
import SpotListCard from '../SpotListCard'
import { usePublicRooms, usePrivateRooms } from '../../hooks/queries/useSpots'
import { useAuthStore } from '../../store/authStore'

const SpotListLayout = () => {
  const [activeTab, setActiveTab] = useState('공개')
  const [searchQuery, setSearchQuery] = useState('')
  const { isLoggedIn } = useAuthStore()

  const tabs = ['공개', '비공개']

  // Fetch data based on active tab
  const { data: publicRooms, isLoading: isLoadingPublic, error: publicError } = usePublicRooms()
  const { data: privateRooms, isLoading: isLoadingPrivate, error: privateError } = usePrivateRooms()

  // Get current data based on active tab
  const currentRooms = activeTab === '공개' ? publicRooms : privateRooms
  const isLoading = activeTab === '공개' ? isLoadingPublic : isLoadingPrivate
  const error = activeTab === '공개' ? publicError : privateError

  // Show login message for private rooms when not logged in
  const shouldShowLoginMessage = activeTab === '비공개' && !isLoggedIn

  // Transform rooms data and apply search filter
  const filteredRooms = useMemo(() => {
    if (!currentRooms) return []

    return currentRooms
      .filter(room => 
        searchQuery === '' || 
        room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.host_nickname?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(room => ({
        id: room.id,
        title: room.name || 'Untitled Room',
        desc: room.description || 'No description available',
        hashtags: [], // TODO: Add hashtags from room data when available
        image: room.thumbnail || '/public/vite.svg', // Fallback image
        username: room.host_nickname || 'Unknown User',
        memberCount: room.member_count || 1,
        userAvatar: room.host_profile_image_url,
        isLiked: false, // TODO: Get actual like status from user data
        numOfLikes: 0, // TODO: Get actual like count from room data
        createdAt: new Date()
      }))
  }, [currentRooms, searchQuery])

  return (
    <div className="w-full px-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        {/* Tabs on the left */}
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-[150px] px-4 py-2 font-medium transition-colors border-b-3 cursor-pointer ${
                activeTab === tab
                  ? 'text-blue-600 border-[#0C8CE9]'
                  : 'text-gray-600 hover:text-gray-800 border-[#D9D9D9]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filter on the right */}
        <div className="flex gap-3 items-center mt-5">
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
            </svg>
            필터
          </button>
        </div>
      </div>

      {/* Login Required Message */}
      {shouldShowLoginMessage && (
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">
            비공개 방을 보려면 로그인이 필요합니다.
          </div>
        </div>
      )}

      {/* Loading State */}
      {!shouldShowLoginMessage && isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      )}

      {/* Error State */}
      {!shouldShowLoginMessage && error && (
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-red-600">
            오류가 발생했습니다: {error.message}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!shouldShowLoginMessage && !isLoading && !error && filteredRooms.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">
            {searchQuery ? '검색 결과가 없습니다.' : '방이 없습니다.'}
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {!shouldShowLoginMessage && !isLoading && !error && filteredRooms.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((card) => (
            <SpotListCard
              key={card.id}
              id={card.id}
              title={card.title}
              desc={card.desc}
              hashtags={card.hashtags}
              image={card.image}
              username={card.username}
              memberCount={card.memberCount}
              userAvatar={card.userAvatar}
              isLiked={card.isLiked}
              numOfLikes={card.numOfLikes}
              createdAt={card.createdAt}
              onCardClick={() => console.log(`Clicked on ${card.title}`)}
              onLikeClick={() => console.log(`Liked ${card.title}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SpotListLayout
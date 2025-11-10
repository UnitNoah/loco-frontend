import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/layout/Sidebar"
import SpotListCard from "../../components/SpotListCard"
import { useJoinedRooms, useLeaveRoom } from "../../hooks/queries/useSpots"
import { useAuthStore } from "../../store/authStore"

const JoinedSpots = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8 // 2줄 * 4개

  const { data: rooms = [], isLoading, error } = useJoinedRooms(user?.id || 0)
  const leaveRoomMutation = useLeaveRoom(user?.id || 0)

  // Convert Room to SpotCard format
  const spotCards = rooms.map((room) => ({
    id: room.id,
    title: room.name,
    desc: room.description || "",
    hashtags: [], // No hashtags in Room API
    image: room.thumbnail || "https://picsum.photos/400/300?random=" + room.id,
    username: room.host_nickname || "Unknown",
    memberCount: room.member_count || 0,
    userAvatar: room.host_profile_image_url,
    isLiked: false, // No like data in Room API
    numOfLikes: 0,
    createdAt: new Date(), // No created date in Room API
    isPrivate: room.is_private,
  }))

  const totalPages = Math.ceil(spotCards.length / itemsPerPage)

  const currentItems = spotCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleLeaveRoom = (roomId: number) => {
    if (!user?.id) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!confirm('스팟에서 나가시겠습니까?')) {
      return
    }

    leaveRoomMutation.mutate(roomId, {
      onError: (error: any) => {
        console.error('Failed to leave room:', error)
        alert('스팟 나가기에 실패했습니다: ' + (error.response?.data?.message || error.message))
      },
    })
  }

  return (
    <div className="flex min-h-screen">
      {/* 좌측: 사이드바 */}
      <Sidebar />

      {/* 우측: 콘텐츠 */}
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-3 ml-6 mt-6">내가 참여한 스팟</h1>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && spotCards.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">참여한 스팟이 없습니다.</p>
          </div>
        )}

        {/* 카드 그리드 */}
        {!isLoading && !error && spotCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-3">
            {currentItems.map((card) => (
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
                mode="member"
                roomType={card.isPrivate ? 'private' : 'public'}
                onCardClick={() => navigate(`/spot/${card.id}?type=${card.isPrivate ? 'private' : 'public'}`)}
                onLeaveClick={() => handleLeaveRoom(card.id)}
                onLikeClick={() => console.log(`Liked ${card.title}`)}
              />
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2 mb-5">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-4 py-2 rounded-md border ${
                  currentPage === idx + 1
                    ? "bg-[#0C8CE9] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default JoinedSpots

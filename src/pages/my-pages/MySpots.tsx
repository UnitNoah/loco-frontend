import { useState } from "react"
import Sidebar from "../../components/layout/Sidebar"
import SpotListCard from "../../components/SpotListCard"
import RoomModal from "../../components/RoomModal"
import DeleteRoomModal from "../../components/DeleteRoomModal"
import { useHostedRooms, useDeleteRoom, useUpdateRoom } from "../../hooks/queries/useSpots"
import { useAuthStore } from "../../store/authStore"
import type { Room } from "../../api/types"

const MySpots = () => {
  const { user } = useAuthStore()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8 // 2줄 * 4개
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [deletingRoomId, setDeletingRoomId] = useState<number | null>(null)

  const { data: rooms = [], isLoading, error } = useHostedRooms(user?.id || 0)
  const deleteRoomMutation = useDeleteRoom(user?.id || 0)
  const updateRoomMutation = useUpdateRoom(user?.id || 0)

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
  }))

  const totalPages = Math.ceil(spotCards.length / itemsPerPage)

  const currentItems = spotCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleEditClick = (cardId: number) => {
    const room = rooms.find((r) => r.id === cardId)
    if (room) {
      setEditingRoom(room)
    }
  }

  const handleUpdate = (data: { name: string; description: string; thumbnail?: string; isPrivate?: boolean }) => {
    if (!editingRoom) return

    updateRoomMutation.mutate(
      {
        roomId: editingRoom.id,
        data: {
          name: data.name,
          description: data.description,
          thumbnail: data.thumbnail,
          isPrivate: data.isPrivate,
        },
      },
      {
        onSuccess: () => {
          setEditingRoom(null)
        },
        onError: (error) => {
          console.error('Failed to update room:', error)
          alert('스팟 수정에 실패했습니다.')
        },
      }
    )
  }

  const handleDeleteClick = (cardId: number) => {
    setDeletingRoomId(cardId)
  }

  const handleDeleteConfirm = () => {
    if (deletingRoomId !== null) {
      deleteRoomMutation.mutate(deletingRoomId, {
        onSuccess: () => {
          setDeletingRoomId(null)
        },
        onError: (error) => {
          console.error('Failed to delete room:', error)
          alert('스팟 삭제에 실패했습니다.')
          setDeletingRoomId(null)
        },
      })
    }
  }

  const deletingRoom = rooms.find((r) => r.id === deletingRoomId)

  return (
    <div className="flex min-h-screen">
      {/* 좌측: 사이드바 */}
      <Sidebar />

      {/* 우측: 콘텐츠 */}
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-3 ml-6 mt-6">내 스팟</h1>

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
            <p className="text-gray-500">생성한 스팟이 없습니다.</p>
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
                mode="owner"
                onCardClick={() => console.log(`Clicked on ${card.title}`)}
                onEditClick={() => handleEditClick(card.id)}
                onDeleteClick={() => handleDeleteClick(card.id)}
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

      {/* Edit Room Modal */}
      <RoomModal
        room={editingRoom}
        isOpen={!!editingRoom}
        onClose={() => setEditingRoom(null)}
        onSubmit={handleUpdate}
        isSubmitting={updateRoomMutation.isPending}
        mode="edit"
      />

      {/* Delete Room Modal */}
      <DeleteRoomModal
        roomTitle={deletingRoom?.name || ''}
        isOpen={!!deletingRoomId}
        onClose={() => setDeletingRoomId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteRoomMutation.isPending}
      />
    </div>
  )
}

export default MySpots

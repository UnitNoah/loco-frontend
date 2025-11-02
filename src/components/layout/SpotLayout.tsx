import { useMemo, useState } from 'react'
import { useParams, useNavigate  } from 'react-router-dom'
import KakaoMap from '../maps/KakaoMap'
import { usePublicRoom, usePrivateRoom, useJoinRoom, useLeaveRoom, useJoinedRooms } from '../../hooks/queries/useSpots'
import { useAuthStore } from '../../store/authStore'
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import PlaceCreateModal from '../modal/PlaceCreateModal'

const SpotLayout = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  
  // Get room ID from URL parameters
  const { id } = useParams<{ id: string }>()
  const roomIdNumber = id ? parseInt(id, 10) : 0

  // Get user from auth store
  const { user } = useAuthStore()

  // Fetch room details - try both public and private
  const { data: publicRoom, isLoading: publicLoading, error: publicError } = usePublicRoom(roomIdNumber, { 
    retry: false,
    staleTime: Infinity 
  })
  const { data: privateRoom, isLoading: privateLoading, error: privateError } = usePrivateRoom(roomIdNumber, {
    retry: false,
    staleTime: Infinity
  })
  
  // Determine which room data to use
  const room = publicRoom || privateRoom
  const roomLoading = publicLoading || privateLoading
  // Only show error if both queries fail
  const roomError = publicError && privateError && !publicRoom && !privateRoom ? privateError : null

  // Fetch user's joined rooms to check membership
  const { data: joinedRooms = [] } = useJoinedRooms(user?.id || 0)
  
  // Check if user is a member of this room
  // const isMember = joinedRooms.some(joinedRoom => joinedRoom.id === roomIdNumber)

  // Determine if the current user is a member or host of the room
  const isHost = useMemo(() => {
    if (!room || !user) return false
    return String(room.host_id) === String(user.id)
  }, [room, user])

  // Check if the user has already joined this room
  const isJoined = joinedRooms.some(joinedRoom => joinedRoom.id === roomIdNumber)

// User is considered a member if they are either the host or already joined
const isMember = isHost || isJoined

  // Join/Leave mutations
  const joinRoomMutation = useJoinRoom(user?.id || 0)
  const leaveRoomMutation = useLeaveRoom(user?.id || 0)

  const handleJoinRoom = () => {
    if (!user?.id) {
      alert('로그인이 필요합니다.')
      return
    }

    joinRoomMutation.mutate(
      { roomId: roomIdNumber },
      {
        onError: (error: any) => {
          console.error('Failed to join room:', error)
          alert('스팟 참여에 실패했습니다: ' + (error.response?.data?.message || error.message))
        },
      }
    )
  }

  const handleLeaveRoom = () => {
    if (!user?.id) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!confirm('스팟에서 나가시겠습니까?')) {
      return
    }

    leaveRoomMutation.mutate(roomIdNumber, {
      onError: (error: any) => {
        console.error('Failed to leave room:', error)
        alert('스팟 나가기에 실패했습니다: ' + (error.response?.data?.message || error.message))
      },
    })
  }

  const listItems = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: index + 1,
        title: '아이스크림보이 용리단길점',
        desc: '나만의 취향을 담아 달달하면서도 아이스크림을 유리숍 유리숍 유리숍…',
        thumbnail: `https://picsum.photos/seed/spot${index + 1}/320/200`,
      })),
    []
  )

  // React Router navigation
  const navigate = useNavigate();

  const handleSelect = (spotId: number) => {
    setSelectedId(spotId)
  }

  const hasDetail = selectedId !== null

  const handleGoBack = () => {
    // Simply go back to the previous page
    navigate('/')
  }

  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);

  return (
    <div className="relative h-[calc(100vh-72px)]">
      {/* 지도 (배경 전체) */}
      <div className="absolute inset-0 z-0">
        <KakaoMap
          center={{ lat: 37.5326, lng: 127.024612 }}
          width="100%"
          height="100%"
          level={5}
        />
      </div>

      {/* Overlay panels */}
      <div className="relative z-10 h-full pointer-events-none">
        <div className="h-full flex gap-4">
          {/* Left: list panel */}
          <div className="w-[340px] bg-white shadow overflow-hidden flex flex-col pointer-events-auto">
            <div className="relative h-[288px]">
              {/* Back button placed at top-left corner of left list */}
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white shadow"
                >
                <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
                </button>
              {roomLoading ? (
                <div className="w-full h-44 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-gray-500">Loading room...</div>
                </div>
              ) : roomError ? (
                <div className="w-full h-44 bg-red-100 flex items-center justify-center">
                  <div className="text-red-600">Failed to load room</div>
                </div>
              ) : (
                <img
                  src={room?.thumbnail || (roomIdNumber > 0 ? `https://picsum.photos/seed/cover${roomIdNumber}/800/480` : 'https://picsum.photos/seed/default/800/480')}
                  alt="cover"
                  className="w-full h-[288px] object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute left-4 bottom-4 right-4 text-white">
                {roomLoading ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-white/30 rounded mb-2"></div>
                    <div className="h-4 bg-white/30 rounded mb-3 w-3/4"></div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                      <div className="h-4 bg-white/30 rounded w-20"></div>
                      <div className="h-4 bg-white/30 rounded w-12"></div>
                    </div>
                    <div className="flex gap-2 justify-between">
                      <div className="h-8 bg-white/30 rounded w-[128px]"></div>
                      <div className="h-8 bg-white/30 rounded w-[128px]"></div>
                    </div>
                  </div>
                ) : roomError ? (
                  <div>
                    <p className="text-lg font-semibold mb-2 text-red-200">
                      Error loading room
                    </p>
                    <div className="flex gap-2 justify-between">
                      <button onClick={() => setIsPlaceModalOpen(true)} className="px-3 py-1.5 bg-[#01BF4F] w-[128px] rounded-md text-sm">
                        장소 등록
                      </button>
                      <button className="px-3 py-1.5 bg-[#EB5454] w-[128px] rounded-md text-sm">
                        스팟 나가기
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Room Title */}
                    <p className="text-lg font-semibold mb-2">
                      {room?.name}
                    </p>
                    
                    {/* Room Description */}
                    <p className="text-sm text-white/90 mb-3 leading-relaxed">
                      {room?.description}
                    </p>
                    
                    {/* Host Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={room?.host_profile_image_url}
                        alt="host profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium">
                        {room?.host_nickname}
                      </span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                        <span className="text-xs">{room?.member_count}명</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-between">
                      {!isMember ? (
                        <button
                          onClick={handleJoinRoom}
                          disabled={joinRoomMutation.isPending || !user?.id}
                          className="w-full bg-[#0C8CE9] text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {joinRoomMutation.isPending ? '참여 중...' : '스팟 참여하기'}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsPlaceModalOpen(true)}
                            className="px-3 py-1.5 bg-[#01BF4F] w-[128px] rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
                          >
                            장소 등록
                          </button>
                          <button
                            onClick={handleLeaveRoom}
                            disabled={leaveRoomMutation.isPending}
                            className="px-3 py-1.5 bg-[#EB5454] w-[128px] rounded-md text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {leaveRoomMutation.isPending ? '나가는 중...' : '스팟 나가기'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 border-b border-gray-100 bg-white/90">
              <input
                type="text"
                placeholder="검색어를 입력해주세요."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white/95">
              {listItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className="w-full text-left p-3 hover:bg-gray-50"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-24 h-20 rounded object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center: detail panel (togglable) with reserved space to avoid map resize */}
          {hasDetail ? (
            <div className="w-[400px] mt-4 mb-4 bg-white rounded-lg shadow overflow-hidden flex flex-col relative pointer-events-auto">
              {/* Close button */}
              <button
                aria-label="닫기"
                onClick={() => setSelectedId(null)}
                className="absolute right-3 top-3 z-10 w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center hover:bg-white"
              >
                <svg
                  className="w-4 h-4 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="relative">
                <img
                  src={`https://picsum.photos/seed/detail${selectedId}/960/540`}
                  alt="detail"
                  className="w-full h-56 object-cover"
                />
              </div>

              <div className="p-4 space-y-4 overflow-y-auto">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
                  <span className="px-2 py-0.5 rounded bg-gray-100">공개</span>
                  <span className="px-2 py-0.5 rounded bg-gray-100">
                    서울 용산구
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-100">
                    아이스크림
                  </span>
                </div>

                <h2 className="text-lg font-semibold">
                  아이스크림보이 용리단길점
                </h2>
                <div className="text-sm text-gray-700">
                  서울 용산구 한강대로50길 17
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span>리뷰 147</span>
                  <span>좋아요 284</span>
                  <span>저장 37</span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  달콤하면서 깔끔한 맛의 컨디먼트와 담백한 아이스크림을
                  유리숍 유리숍 유리숍으로 즐길 수 있는 곳.
                </p>

                <div className="flex gap-2">
                  <button className="px-3 py-2 bg-[#0C8CE9] text-white rounded-md text-sm">
                    좋아요
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                    저장하기
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                    공유하기
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">댓글 13개</h3>
                    <button className="text-xs text-gray-500">정렬</button>
                  </div>

                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">익명 사용자</p>
                          <p className="text-xs text-gray-600">
                            매장이 깔끔하고 아이스크림이 정말 맛있었어요!
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-[560px]" />
          )}
        </div>
      </div>
                 {isPlaceModalOpen && ( <PlaceCreateModal roomId={roomIdNumber} onClose={() => setIsPlaceModalOpen(false)}  /> )}
    </div>
  )
}

export default SpotLayout

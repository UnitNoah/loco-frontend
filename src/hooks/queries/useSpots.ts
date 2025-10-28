import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query'
import {
  getPublicRoomById,
  getPrivateRoomById,
  getPublicRooms,
  getPrivateRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getHostedRooms,
  getJoinedRooms,
  joinRoom,
  leaveRoom,
} from '../../api/endpoints/spots'
import type { Room, RoomCreateRequest, RoomUpdateRequest } from '../../api/types'

// Query keys for cache management
export const roomKeys = {
  all: ['rooms'] as const,
  publicDetails: () => [...roomKeys.all, 'public', 'detail'] as const,
  publicDetail: (id: number) => [...roomKeys.publicDetails(), id] as const,
  privateDetails: () => [...roomKeys.all, 'private', 'detail'] as const,
  privateDetail: (id: number) => [...roomKeys.privateDetails(), id] as const,
  public: () => [...roomKeys.all, 'public'] as const,
  private: () => [...roomKeys.all, 'private'] as const,
  hosted: (userId: number) => [...roomKeys.all, 'hosted', userId] as const,
  joined: (userId: number) => [...roomKeys.all, 'joined', userId] as const,
}

/**
 * Fetch a public room by ID
 * GET /api/v1/rooms/public/{roomId}
 */
export const usePublicRoom = (
  roomId: number,
  options?: Omit<UseQueryOptions<Room>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: roomKeys.publicDetail(roomId),
    queryFn: () => getPublicRoomById(roomId),
    enabled: roomId > 0,
    ...options,
  })
}

/**
 * Fetch a private room by ID
 * GET /api/v1/rooms/private/{roomId}
 */
export const usePrivateRoom = (
  roomId: number,
  options?: Omit<UseQueryOptions<Room>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: roomKeys.privateDetail(roomId),
    queryFn: () => getPrivateRoomById(roomId),
    enabled: roomId > 0,
    ...options,
  })
}

/**
 * Fetch all public rooms
 * GET /api/v1/rooms/public
 */
export const usePublicRooms = () => {
  return useQuery({
    queryKey: roomKeys.public(),
    queryFn: getPublicRooms,
  })
}

/**
 * Fetch all private rooms
 * GET /api/v1/rooms/private
 */
export const usePrivateRooms = () => {
  return useQuery({
    queryKey: roomKeys.private(),
    queryFn: getPrivateRooms,
  })
}

/**
 * Fetch rooms where user is host
 * GET /api/v1/rooms/hosted?userId={userId}
 */
export const useHostedRooms = (userId: number) => {
  return useQuery({
    queryKey: roomKeys.hosted(userId),
    queryFn: () => getHostedRooms(userId),
    enabled: userId > 0,
  })
}

/**
 * Fetch rooms where user is participant
 * GET /api/v1/rooms/joined?userId={userId}
 */
export const useJoinedRooms = (userId: number) => {
  return useQuery({
    queryKey: roomKeys.joined(userId),
    queryFn: () => getJoinedRooms(userId),
    enabled: userId > 0,
  })
}

/**
 * Create a new room
 * POST /api/v1/rooms?hostId={hostId}
 */
export const useCreateRoom = (hostId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RoomCreateRequest) => createRoom(data, hostId),
    onSuccess: () => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: roomKeys.public() })
      queryClient.invalidateQueries({ queryKey: roomKeys.private() })
      queryClient.invalidateQueries({ queryKey: roomKeys.hosted(hostId) })
    },
  })
}

/**
 * Update a room
 * PATCH /api/v1/rooms/{roomId}?requesterId={requesterId}
 */
export const useUpdateRoom = (requesterId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roomId, data }: { roomId: number; data: RoomUpdateRequest }) =>
      updateRoom(roomId, requesterId, data),
    onSuccess: (updatedRoom: Room) => {
      // Update cache for both public/private
      queryClient.setQueryData(roomKeys.publicDetail(updatedRoom.id), updatedRoom)
      queryClient.setQueryData(roomKeys.privateDetail(updatedRoom.id), updatedRoom)
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: roomKeys.public() })
      queryClient.invalidateQueries({ queryKey: roomKeys.private() })
      queryClient.invalidateQueries({ queryKey: roomKeys.hosted(requesterId) })
    },
  })
}

/**
 * Delete a room
 * DELETE /api/v1/rooms/{roomId}?requesterId={requesterId}
 */
export const useDeleteRoom = (requesterId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roomId: number) => deleteRoom(roomId, requesterId),
    onSuccess: (_, roomId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: roomKeys.publicDetail(roomId) })
      queryClient.removeQueries({ queryKey: roomKeys.privateDetail(roomId) })
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: roomKeys.public() })
      queryClient.invalidateQueries({ queryKey: roomKeys.private() })
      queryClient.invalidateQueries({ queryKey: roomKeys.hosted(requesterId) })
    },
  })
}

/**
 * Join a room
 * POST /api/v1/rooms/{roomId}/join?userId={userId}&inviteCode={inviteCode}
 */
export const useJoinRoom = (userId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roomId, inviteCode }: { roomId: number; inviteCode?: string }) =>
      joinRoom(roomId, userId, inviteCode),
    onSuccess: (updatedRoom: Room) => {
      queryClient.setQueryData(roomKeys.publicDetail(updatedRoom.id), updatedRoom)
      queryClient.setQueryData(roomKeys.privateDetail(updatedRoom.id), updatedRoom)
      queryClient.invalidateQueries({ queryKey: roomKeys.joined(userId) })
    },
  })
}

/**
 * Leave a room
 * POST /api/v1/rooms/{roomId}/leave?userId={userId}
 */
export const useLeaveRoom = (userId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roomId: number) => leaveRoom(roomId, userId),
    onSuccess: (updatedRoom: Room) => {
      queryClient.setQueryData(roomKeys.publicDetail(updatedRoom.id), updatedRoom)
      queryClient.setQueryData(roomKeys.privateDetail(updatedRoom.id), updatedRoom)
      queryClient.invalidateQueries({ queryKey: roomKeys.joined(userId) })
    },
  })
}


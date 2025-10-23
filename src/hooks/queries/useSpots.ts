import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query'
import {
  getRoomById,
  getPublicRooms,
  getPrivateRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getMyRooms,
  joinRoom,
  leaveRoom,
} from '../../api/endpoints/spots'
import type { Room, RoomCreateRequest, RoomUpdateRequest } from '../../api/types'

// Query keys for cache management
export const roomKeys = {
  all: ['rooms'] as const,
  details: () => [...roomKeys.all, 'detail'] as const,
  detail: (id: number) => [...roomKeys.details(), id] as const,
  public: () => [...roomKeys.all, 'public'] as const,
  private: () => [...roomKeys.all, 'private'] as const,
  my: (userId: number) => [...roomKeys.all, 'my', userId] as const,
}

/**
 * Fetch a single room by ID
 * GET /api/v1/rooms/{roomId}
 */
export const useRoom = (
  roomId: number,
  options?: Omit<UseQueryOptions<Room>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: roomKeys.detail(roomId),
    queryFn: () => getRoomById(roomId),
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
 * Fetch rooms the user is part of (host + participant)
 * GET /api/v1/rooms/my?userId={userId}
 */
export const useMyRooms = (userId: number) => {
  return useQuery({
    queryKey: roomKeys.my(userId),
    queryFn: () => getMyRooms(userId),
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
      queryClient.invalidateQueries({ queryKey: roomKeys.my(hostId) })
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
      // Update cache
      queryClient.setQueryData(roomKeys.detail(updatedRoom.id), updatedRoom)
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: roomKeys.public() })
      queryClient.invalidateQueries({ queryKey: roomKeys.private() })
      queryClient.invalidateQueries({ queryKey: roomKeys.my(requesterId) })
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
      queryClient.removeQueries({ queryKey: roomKeys.detail(roomId) })
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: roomKeys.public() })
      queryClient.invalidateQueries({ queryKey: roomKeys.private() })
      queryClient.invalidateQueries({ queryKey: roomKeys.my(requesterId) })
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
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(roomId) })
      queryClient.invalidateQueries({ queryKey: roomKeys.my(userId) })
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
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(roomId) })
      queryClient.invalidateQueries({ queryKey: roomKeys.my(userId) })
    },
  })
}


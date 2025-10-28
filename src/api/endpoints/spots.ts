import { apiClient } from '../client'
import type {
  Room,
  RoomCreateRequest,
  RoomUpdateRequest,
  ApiResponse,
} from '../types'

// Base endpoint
const ROOMS_ENDPOINT = '/api/v1/rooms'

/**
 * Fetch a public room by ID
 * GET /api/v1/rooms/public/{roomId}
 */
export const getPublicRoomById = async (roomId: number): Promise<Room> => {
  const response = await apiClient.get<ApiResponse<Room>>(`${ROOMS_ENDPOINT}/public/${roomId}`)
  return response.data.data
}

/**
 * Fetch a private room by ID
 * GET /api/v1/rooms/private/{roomId}
 */
export const getPrivateRoomById = async (roomId: number): Promise<Room> => {
  const response = await apiClient.get<ApiResponse<Room>>(`${ROOMS_ENDPOINT}/private/${roomId}`)
  return response.data.data
}

/**
 * Fetch all public rooms (latest first)
 * GET /api/v1/rooms/public
 */
export const getPublicRooms = async (): Promise<Room[]> => {
  const response = await apiClient.get<ApiResponse<Room[]>>(`${ROOMS_ENDPOINT}/public`)
  return response.data.data
}

/**
 * Fetch all private rooms (latest first)
 * GET /api/v1/rooms/private
 */
export const getPrivateRooms = async (): Promise<Room[]> => {
  const response = await apiClient.get<ApiResponse<Room[]>>(`${ROOMS_ENDPOINT}/private`)
  return response.data.data
}

/**
 * Create a new room
 * POST /api/v1/rooms?hostId={hostId}
 */
export const createRoom = async (data: RoomCreateRequest, hostId: number): Promise<Room> => {
  // Use fetch instead of axios to match the authentication pattern used in App.tsx
  const url = new URL(`${import.meta.env.VITE_API_BASE_URL}${ROOMS_ENDPOINT}`)
  url.searchParams.set('hostId', hostId.toString())
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result: ApiResponse<Room> = await response.json()
  return result.data
}

/**
 * Update an existing room
 * PATCH /api/v1/rooms/{roomId}?requesterId={requesterId}
 */
export const updateRoom = async (
  roomId: number,
  requesterId: number,
  data: RoomUpdateRequest
): Promise<Room> => {
  const response = await apiClient.patch<ApiResponse<Room>>(
    `${ROOMS_ENDPOINT}/${roomId}`,
    data,
    { params: { requesterId } }
  )
  return response.data.data
}

/**
 * Delete a room
 * DELETE /api/v1/rooms/{roomId}?requesterId={requesterId}
 */
export const deleteRoom = async (roomId: number, requesterId: number): Promise<number> => {
  const response = await apiClient.delete<ApiResponse<number>>(`${ROOMS_ENDPOINT}/${roomId}`, {
    params: { requesterId }
  })
  return response.data.data
}

/**
 * Get rooms where user is host
 * GET /api/v1/rooms/hosted?userId={userId}
 */
export const getHostedRooms = async (userId: number): Promise<Room[]> => {
  const response = await apiClient.get<ApiResponse<Room[]>>(`${ROOMS_ENDPOINT}/hosted`, {
    params: { userId }
  })
  return response.data.data
}

/**
 * Get rooms where user is participant
 * GET /api/v1/rooms/joined?userId={userId}
 */
export const getJoinedRooms = async (userId: number): Promise<Room[]> => {
  const response = await apiClient.get<ApiResponse<Room[]>>(`${ROOMS_ENDPOINT}/joined`, {
    params: { userId }
  })
  return response.data.data
}

/**
 * Join a room
 * POST /api/v1/rooms/{roomId}/join?userId={userId}&inviteCode={inviteCode}
 */
export const joinRoom = async (
  roomId: number,
  userId: number,
  inviteCode?: string
): Promise<Room> => {
  const response = await apiClient.post<ApiResponse<Room>>(`${ROOMS_ENDPOINT}/${roomId}/join`, null, {
    params: { userId, inviteCode }
  })
  return response.data.data
}

/**
 * Leave a room
 * POST /api/v1/rooms/{roomId}/leave?userId={userId}
 */
export const leaveRoom = async (roomId: number, userId: number): Promise<Room> => {
  const response = await apiClient.post<ApiResponse<Room>>(`${ROOMS_ENDPOINT}/${roomId}/leave`, null, {
    params: { userId }
  })
  return response.data.data
}


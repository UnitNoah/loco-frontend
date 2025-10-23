// Common API response wrapper (matches Spring ApiResponse)
export interface ApiResponse<T> {
  data: T
  message?: string
  status?: string
}

// User types
export interface User {
  id: number
  nickname?: string
  email?: string
  profileImage?: string
}

// Room types (matches your backend Room entity)
export interface Room {
  id: number
  name: string
  description: string
  isPrivate: boolean
  inviteCode?: string
  thumbnail?: string
  host: User
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

// Room participant
export interface RoomParticipant {
  id: number
  userId: number
  roomId: number
  joinedAt: string
  user?: User
}

// Request types (matches your backend DTOs)
export interface RoomCreateRequest {
  name: string
  description?: string
  is_private?: boolean
  thumbnail?: string
}

export interface RoomUpdateRequest {
  name?: string
  description?: string
  is_private?: boolean
  thumbnail?: string
}


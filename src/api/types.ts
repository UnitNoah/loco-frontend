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

// Room types (matches backend RoomResponse - snake_case)
export interface Room {
  id: number
  name: string
  description: string
  is_private: boolean
  thumbnail?: string | null
  host_id: number
  invite_code?: string
  host_nickname?: string
  host_profile_image_url?: string
  member_count: number
}

// Request types (matches your backend DTOs)
export interface RoomCreateRequest {
  name: string
  description?: string
  isPrivate?: boolean
  thumbnail?: string
}

export interface RoomUpdateRequest {
  name?: string
  description?: string
  isPrivate?: boolean
  thumbnail?: string
}


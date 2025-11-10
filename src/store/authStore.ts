import { create } from "zustand"
import { jwtDecode } from "jwt-decode"

type JwtPayload = {
  id?: number
  email?: string
  nickname?: string
  profileImage?: string
  exp: number
  iat: number
  sub: string
}

// UserInfo는 프론트 전역 상태에서 쓰이는 유저 정보 타입
type UserInfo = {
  id?: number
  email?: string
  nickname?: string
  profileImage?: string
}

type AuthState = {
  isInitialized: boolean   // 초기화 여부
  isLoggedIn: boolean
  user: UserInfo | null
  login: (user: UserInfo) => void
  logout: () => void
  initFromCookie: () => void
  setUser: (user: Partial<UserInfo>) => void
  setInitialized: (value: boolean) => void  // 타입 정의에도 추가
  clearAuthState: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isInitialized: false,   // 초기화 상태
  isLoggedIn: false,
  user: null,

  login: (user) => set({ isLoggedIn: true, user }),

  logout: async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/logout`, {
        method: "POST",
        credentials: "include", // include cookie
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      // Regardless of result, clear client state
      set({ isLoggedIn: false, user: null });
    }
  },



  // 초기화 상태 업데이트
  setInitialized: (value) => set({ isInitialized: value }),

  // 인증 정보만 초기화
  clearAuthState: () => set({ isLoggedIn: false, user: null }),

  // 쿠키 기반 초기화
  initFromCookie: () => {
    const token = getCookie("access_token")
    if (token) {
      const payload = jwtDecode<JwtPayload>(token)
      set({
        isLoggedIn: true,
        user: {
          id: payload.id,
          email: payload.email,
          nickname: payload.nickname,
          profileImage: payload.profileImage,
        },
      })
    }
  },

  // 프로필 수정 시 user 병합 업데이트
  setUser: (user) =>
    set((state) => ({
      user: { ...state.user, ...user },
    })),
}))

// 헬퍼 함수: document.cookie에서 값 추출
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(";").shift()!
  return null
}

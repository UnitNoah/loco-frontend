import { create } from "zustand"
import { jwtDecode } from "jwt-decode"

type JwtPayload = {
  email?: string
  nickname?: string
  profileImage?: string
  exp: number
  iat: number
  sub: string
}

// UserInfo는 프론트 전역 상태에서 쓰이는 유저 정보 타입
type UserInfo = {
  email?: string
  nickname?: string
  profileImage?: string
}

type AuthState = {
  isLoggedIn: boolean
  user: UserInfo | null
  login: (user: UserInfo) => void
  logout: () => void
  initFromCookie: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (user) => set({ isLoggedIn: true, user }),
  logout: () => {
    // 로그아웃시 쿠키도 삭제하도록 API 호출 필요할 수 있음
    set({ isLoggedIn: false, user: null })
  },
  initFromCookie: () => {
    const token = getCookie("access_token")
    if (token) {
      debugger;
      const payload = jwtDecode<JwtPayload>(token)
      set({
        isLoggedIn: true,
        user: {
          email: payload.email,
          nickname: payload.nickname,
          profileImage: payload.profileImage,
        },
      })
    }
  },
}))

// 헬퍼 함수: document.cookie에서 값 추출
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(";").shift()!
  return null
}

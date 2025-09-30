import { create } from "zustand"
import { jwtDecode } from "jwt-decode"

type JwtPayload = {
  email?: string
  nickname?: string
  exp: number
  iat: number
  sub: string
}

type AuthState = {
  isLoggedIn: boolean
  user: { email?: string; nickname?: string } | null
  login: (user: { email?: string; nickname?: string }) => void
  logout: () => void
  initFromCookie: () => void   // ← 추가
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
      const payload = jwtDecode<JwtPayload>(token)
      set({
        isLoggedIn: true,
        user: { email: payload.email, nickname: payload.nickname },
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

import { useAuthStore } from "../../store/authStore"
import { Link, useLocation } from "react-router-dom"
import logo from "../../assets/images/logo.svg"

type HeaderProps = {
  onLoginClick?: () => void
}

const Header = ({ onLoginClick }: HeaderProps) => {
  const { isLoggedIn, user, logout } = useAuthStore()
  const location = useLocation()
  const currentPath = location.pathname

  // 마이페이지 계열 경로
  const profilePaths = [
    "/profile",
    "/my-spots",
    "/my-comments",
    "/joined-spots",
    "/reports",
    "/settings",
    "/support",
  ]

  const navItems = [
    { name: "스팟", to: "/spot", match: ["/", "/spot"] },
    ...(isLoggedIn
      ? [
          { name: "즐겨찾기", to: "/favorites", match: ["/favorites"] },
          { name: "프로필", to: "/profile", match: profilePaths },
        ]
      : []),
  ]

  // 현재 경로가 네비게이션 아이템과 매칭되는지 체크
  const checkIsActive = (pathList: string[], current: string) => {
    return pathList.some((path) => {
      if (path === "/") {
        return current === "/" // '/'는 정확히 일치할 때만 활성화
      }
      return current.startsWith(path)
    })
  }
  return (
    <div className="flex justify-between items-center p-4 shadow-md sticky top-0 z-50 bg-white">
      {/* 로고 + 네비게이션 */}
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Loco Logo" className="h-8 mr-[100px]" />
        </Link>

        <div className="flex gap-12">
          {navItems.map((item) => {
            const isActive = checkIsActive(item.match, currentPath)

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative pb-1 hover:text-blue-400 transition ${
                  isActive
                    ? "font-bold text-black after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[2px] after:h-[2px] after:bg-blue-500"
                    : "text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>

      {/* 우측 버튼 영역 */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            if (isLoggedIn) {
              window.location.href = "/room/create"
            } else {
              onLoginClick?.()
            }
          }}
          className="bg-[#0C8CE9] text-white px-10 py-2 rounded-md hover:cursor-pointer"
        >
          스팟 생성
        </button>

        {isLoggedIn ? (
          <>
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 rounded-md hover:bg-gray-100 transition py-0"
            >
              {/* 유저 프로필 이미지 */}
              <img
                src={user?.profileImage ?? "https://via.placeholder.com/40"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover border"
              />
              {/* 닉네임 or 이메일 */}
              <span className="text-sm font-medium text-gray-700">
                  {user?.nickname != null && user.nickname.trim() !== "" ? user.nickname : user?.email}
              </span>
            </Link>

            <button
              onClick={logout}
              className="px-6 rounded-md outline outline-1 outline-gray-300 hover:bg-gray-100 transition cursor-pointer"
            >
              로그아웃
            </button>
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="px-10 py-2 rounded-md outline outline-1 outline-gray-300 hover:cursor-pointer cursor-pointer"
          >
            로그인
          </button>
        )}
      </div>
    </div>
  )
}

export default Header

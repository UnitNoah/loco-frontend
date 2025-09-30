import { useAuthStore } from "../../store/authStore"
import { Link } from "react-router-dom"
import logo from "../../assets/images/logo.svg"

type HeaderProps = {
  onLoginClick?: () => void
}

const Header = ({ onLoginClick }: HeaderProps) => {
  const { isLoggedIn, user, logout } = useAuthStore()

  return (
    <div className="flex justify-between items-center p-4">
      {/* 로고 + 네비게이션 */}
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Loco Logo" className="h-8 mr-[100px]" />
        </Link>
        <div className="flex gap-12">
          <Link to="/spot" className="hover:text-blue-200">
            스팟
          </Link>
          <Link to="/favorites" className="hover:text-blue-200">
            즐겨찾기
          </Link>
          <Link to="/profile" className="hover:text-blue-200">
            프로필
          </Link>
        </div>
      </div>

      {/* 우측 버튼 영역 */}
      <div className="flex gap-4">
        <button className="bg-[#0C8CE9] text-white px-10 py-2 rounded-md hover:cursor-pointer">
          스팟 생성
        </button>

        {isLoggedIn ? (
          <>
            <Link
              to="/profile"
              className="px-10 py-2 rounded-md outline outline-1 outline-gray-300 hover:cursor-pointer"
            >
              마이페이지 ({user?.nickname ?? user?.email})
            </Link>
            <button
              onClick={logout}
              className="px-10 py-2 rounded-md outline outline-1 outline-gray-300 hover:cursor-pointer"
            >
              로그아웃
            </button>
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="px-10 py-2 rounded-md outline outline-1 outline-gray-300 hover:cursor-pointer"
          >
            로그인
          </button>
        )}
      </div>
    </div>
  )
}

export default Header

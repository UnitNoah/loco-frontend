import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import Sidebar from "../../components/layout/Sidebar"

const Profile: React.FC = () => {
  const { isLoggedIn, user,isInitialized  } = useAuthStore()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 초기 데이터
  const initialNickname = user?.nickname ?? ""
  const initialImage = user?.profileImage ?? "https://via.placeholder.com/100"

  const [nickname, setNickname] = useState(initialNickname)
  const [previewImage, setPreviewImage] = useState(initialImage)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const setUser = useAuthStore((state) => state.setUser);

useEffect(() => {
  if (!isInitialized) return // 초기화 안 됐으면 아무 것도 하지 않음
  if (!isLoggedIn) {
    navigate("/login")
  }
}, [isInitialized, isLoggedIn, navigate])
  useEffect(() => {
    if (user?.nickname) {
      setNickname(user.nickname)
    }
  }, [user?.nickname])
  if (!isLoggedIn) {
    return null
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewImage(URL.createObjectURL(file)) // 미리보기만 업데이트
    }
  }

const handleSave = async () => {
  try {
    console.log("저장된 이미지 파일:", selectedFile)

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // JWT 쿠키 포함
      body: JSON.stringify({
        nickname: nickname,
        profileImageUrl: previewImage, // 선택한 이미지가 있다면 반영
      }),
    })

    if (!res.ok) {
      throw new Error("유저 정보 수정 실패")
    }

    const data = await res.json()
    console.log("업데이트 성공:", data)

    alert("프로필이 성공적으로 수정되었습니다!")

    // store 반영
    setUser({
      nickname: data.data.name,
      profileImage: data.data.profile_image,
      email: data.data.email,
    })
  } catch (error) {
    console.error(error)
    alert("수정 중 오류가 발생했습니다.")
  }
}

  const handleCancel = () => {
    setNickname(initialNickname)
    setPreviewImage(initialImage)
    setSelectedFile(null)
  }
  

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">프로필</h1>

          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img
                src={previewImage}
                alt="프로필 이미지"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-[#0C8CE9] text-white text-xs px-2 py-1 rounded-full shadow-md hover:bg-blue-600"
              >
                수정
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* 닉네임 / 이메일 */}
          <div className="space-y-4">
            {/* 닉네임 입력 */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* 이메일 입력 (읽기 전용) */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                이메일
              </label>
              <input
                type="text"
                value={user?.email ?? "이메일 없음"}
                disabled
                className="w-full border rounded-lg px-3 py-2 text-gray-500 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#0C8CE9] text-white py-3 rounded-xl hover:bg-blue-600 transition"
            >
              저장하기
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-xl hover:bg-gray-400 transition"
            >
              취소
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile

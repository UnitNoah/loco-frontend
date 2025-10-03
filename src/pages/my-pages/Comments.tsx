import Sidebar from "../../components/layout/Sidebar"
import { useState } from "react"

// 더미 데이터 예시
const dummyComments = [
  {
    id: 1,
    roomName: "서울 디저트 맛집 모음",
    spotName: "아이스크림보이 용리단길점",
    content: "여기 아이스크림 진짜 맛있어요!",
    createdAt: "2025-10-03",
  },
  {
    id: 2,
    roomName: "스터디 카페 추천",
    spotName: "강남 모던 스터디카페",
    content: "분위기 조용하고 공부하기 좋았습니다.",
    createdAt: "2025-09-29",
  },
  {
    id: 3,
    roomName: "부산 여행 스팟",
    spotName: "동백섬",
    content: "바다가 너무 예쁘고 산책하기 딱이에요.",
    createdAt: "2025-09-15",
  },
]

const Comments = () => {
  const [comments] = useState(dummyComments)

  return (
    <div className="flex min-h-screen">
      {/* 좌측: 사이드바 */}
      <Sidebar />

      {/* 우측: 콘텐츠 */}
      <main className="flex-1 bg-gray-50 p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 w-full max-w-2xl mt-5">내 댓글</h1>

        <div className="w-full max-w-2xl space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-white border rounded-lg shadow-sm p-5 hover:shadow-md transition"
            >
              {/* 상단: 방 이름 + 장소 이름 */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    스팟: {c.roomName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    장소: {c.spotName}
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {c.createdAt}
                </span>
              </div>

              {/* 댓글 본문 */}
              <p className="text-sm text-gray-700 leading-relaxed">
                {c.content}
              </p>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-gray-500 text-center py-10">
              작성한 댓글이 없습니다.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default Comments

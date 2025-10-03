import { useState } from "react"
import Sidebar from "../../components/layout/Sidebar"
import SpotListCard from "../../components/SpotListCard"
import { dummySpotCards } from "../../utils/dummyData"

const MySpots = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8 // 2줄 * 4개
  const totalPages = Math.ceil(dummySpotCards.length / itemsPerPage)

  const currentItems = dummySpotCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="flex min-h-screen">
      {/* 좌측: 사이드바 */}
      <Sidebar />

      {/* 우측: 콘텐츠 */}
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-3 ml-6 mt-6">내 스팟</h1>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-3">
          {currentItems.map((card) => (
            <SpotListCard
              key={card.id}
              id={card.id}
              title={card.title}
              desc={card.desc}
              hashtags={card.hashtags}
              image={card.image}
              username={card.username}
              memberCount={card.memberCount}
              userAvatar={card.userAvatar}
              isLiked={card.isLiked}
              numOfLikes={card.numOfLikes}
              createdAt={card.createdAt}
              mode="owner"
              onCardClick={() => console.log(`Clicked on ${card.title}`)}
              onLikeClick={() => console.log(`Liked ${card.title}`)}
            />
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8 gap-2 mb-5">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-4 py-2 rounded-md border ${
                currentPage === idx + 1
                  ? "bg-[#0C8CE9] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

export default MySpots

import { useState } from 'react'
import Search from '../ui/Search'
import SpotListCard from '../SpotListCard'
import { dummySpotCards } from '../../utils/dummyData'

const SpotListLayout = () => {
  const [activeTab, setActiveTab] = useState('공개')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = ['공개', '비공개']

  return (
    <div className="w-full px-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        {/* Tabs on the left */}
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-[150px] px-4 py-2 font-medium transition-colors border-b-3 cursor-pointer ${
                activeTab === tab
                  ? 'text-blue-600 border-[#0C8CE9]'
                  : 'text-gray-600 hover:text-gray-800 border-[#D9D9D9]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filter on the right */}
        <div className="flex gap-3 items-center mt-5">
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
            </svg>
            필터
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dummySpotCards.map((card) => (
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
            onCardClick={() => console.log(`Clicked on ${card.title}`)}
            onLikeClick={() => console.log(`Liked ${card.title}`)}
          />
        ))}
      </div>
    </div>
  )
}

export default SpotListLayout
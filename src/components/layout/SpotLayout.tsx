import { useState } from 'react'

const SpotLayout = () => {
  const [activeTab, setActiveTab] = useState('공개')
  const [searchQuery, setSearchQuery] = useState('')

  // Sample card data - replace with your actual data
  const cards = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    title: `스팟 ${index + 1}`,
    location: `위치 ${index + 1}`,
    image: `https://picsum.photos/300/200?random=${index + 1}`
  }))

  const tabs = ['공개', '비공개']

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        {/* Tabs on the left */}
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors border-b-3 cursor-pointer ${
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
        <div className="flex gap-3 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="검색어를 입력해주세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
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

      {/* TODO: implement actual cards in a separate component */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-48 object-cover p-3"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpotLayout
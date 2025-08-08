import { useMemo, useState } from 'react'

const SpotLayout = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const listItems = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: index + 1,
        title: '아이스크림보이 용리단길점',
        desc: '나만의 취향을 담아 달달하면서도 아이스크림을 유리숍 유리숍 유리숍…',
        thumbnail: `https://picsum.photos/seed/spot${index + 1}/320/200`,
      })),
    []
  )

  const handleSelect = (spotId: number) => {
    setSelectedId(spotId)
  }

  const hasDetail = selectedId !== null

  return (
    <div className="relative h-[calc(100vh-72px)]">
      {/* Full-bleed map background */}
      <div className="absolute inset-0 z-0">
        <iframe
          title="map"
          className="w-full h-full"
          src="https://maps.google.com/maps?q=Yongsan%20Seoul&t=&z=14&ie=UTF8&iwloc=&output=embed"
        />
      </div>

      {/* Overlay panels */}
      <div className="relative z-10 h-full">
        <div className="h-full flex gap-4">
          {/* Left: list panel */}
          <div className="w-[340px] bg-white shadow overflow-hidden flex flex-col">
            <div className="relative h-[288px]">
              <img src={`https://picsum.photos/seed/cover${selectedId ?? 1}/800/480`} alt="cover" className="w-full h-44 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute left-4 bottom-4 right-4 text-white">
                <p className="text-lg font-semibold mb-2">내가 좋아하는 서울 디저트 맛집 모음</p>
                <div className="flex gap-2 justify-between">
                  <button className="px-3 py-1.5 bg-[#01BF4F] w-[128px] rounded-md text-sm">장소 등록</button>
                  <button className="px-3 py-1.5 bg-[#EB5454] w-[128px] rounded-md text-sm">스팟 저장</button>
                </div>
              </div>
            </div>
            <div className="p-3 border-b border-gray-100 bg-white/90">
              <input
                type="text"
                placeholder="검색어를 입력해주세요."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white/95">
              {listItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className="w-full text-left p-3 hover:bg-gray-50"
                >
                  <div className="flex gap-3">
                    <img src={item.thumbnail} alt={item.title} className="w-24 h-20 rounded object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="mt-1 text-xs text-gray-600 line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center: detail panel (togglable) with reserved space to avoid map resize */}
          {hasDetail ? (
            <div className="w-[400px] mt-4 mb-4 bg-white rounded-lg shadow overflow-hidden flex flex-col relative">
              {/* Close button */}
              <button
                aria-label="닫기"
                onClick={() => setSelectedId(null)}
                className="absolute right-3 top-3 z-10 w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center hover:bg-white"
              >
                <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="relative">
                <img src={`https://picsum.photos/seed/detail${selectedId}/960/540`} alt="detail" className="w-full h-56 object-cover" />
              </div>
              <div className="p-4 space-y-4 overflow-y-auto">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
                  <span className="px-2 py-0.5 rounded bg-gray-100">공개</span>
                  <span className="px-2 py-0.5 rounded bg-gray-100">서울 용산구</span>
                  <span className="px-2 py-0.5 rounded bg-gray-100">아이스크림</span>
                </div>
                <h2 className="text-lg font-semibold">아이스크림보이 용리단길점</h2>
                <div className="text-sm text-gray-700">서울 용산구 한강대로50길 17</div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span>리뷰 147</span>
                  <span>좋아요 284</span>
                  <span>저장 37</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  달콤하면서 깔끔한 맛의 컨디먼트와 담백한 아이스크림을 유리숍 유리숍 유리숍으로 즐길 수 있는 곳.
                </p>

                <div className="flex gap-2">
                  <button className="px-3 py-2 bg-[#0C8CE9] text-white rounded-md text-sm">좋아요</button>
                  <button className="px-3 py-2 border border-gray-300 rounded-md text-sm">저장하기</button>
                  <button className="px-3 py-2 border border-gray-300 rounded-md text-sm">공유하기</button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">댓글 13개</h3>
                    <button className="text-xs text-gray-500">정렬</button>
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">익명 사용자</p>
                          <p className="text-xs text-gray-600">매장이 깔끔하고 아이스크림이 정말 맛있었어요!</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Reserve width so the map does not shift
            <div className="w-[560px]" />
          )}
        </div>
      </div>
    </div>
  )
}

export default SpotLayout
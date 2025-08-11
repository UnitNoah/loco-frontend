export interface SpotCard {
  id: number
  title: string
  desc: string
  hashtags: string[]
  image: string
  username: string
  memberCount: number
  userAvatar?: string
  isLiked: boolean
  numOfLikes: number
  createdAt: Date
}

export const dummySpotCards: SpotCard[] = [
  {
    id: 1,
    title: '내가 좋아하는 서울 디저트 맛집 모음',
    desc: '내가 좋아하는 서울 디저트 맛집 모음',
    hashtags: ['아이스크림', '서울', '디저트'],
    image: 'https://picsum.photos/400/300?random=1',
    username: 'new_iceCream?',
    memberCount: 50,
    userAvatar: undefined,
    isLiked: false,
    numOfLikes: 20,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    title: '강남역 맛집 투어 - 한식부터 양식까지',
    desc: '강남역 맛집 투어 - 한식부터 양식까지',
    hashtags: ['강남', '맛집', '투어'],
    image: 'https://picsum.photos/400/300?random=2',
    username: 'foodie_korea',
    memberCount: 127,
    userAvatar: undefined,
    isLiked: true,
    numOfLikes: 100,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 3,
    title: '홍대 카페거리 숨겨진 보물들',
    desc: '홍대 카페거리 숨겨진 보물들',
    hashtags: ['홍대', '카페', '인스타'],
    image: 'https://picsum.photos/400/300?random=3',
    username: 'cafe_hunter',
    memberCount: 89,
    userAvatar: undefined,
    isLiked: false,
    numOfLikes: 30,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    title: '이태원 세계음식 맛집 리스트',
    desc: '이태원 세계음식 맛집 리스트',
    hashtags: ['이태원', '세계음식', '다양성'],
    image: 'https://picsum.photos/400/300?random=4',
    username: 'global_taste',
    memberCount: 203,
    userAvatar: undefined,
    isLiked: true,
    numOfLikes: 200,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
  },
  {
    id: 5,
    title: '서울 야경 명소 베스트 10',
    desc: '서울 야경 명소 베스트 10',
    hashtags: ['야경', '서울', '명소'],
    image: 'https://picsum.photos/400/300?random=5',
    username: 'night_seoul',
    memberCount: 156,
    userAvatar: undefined,
    isLiked: false,
    numOfLikes: 100,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
  },
  {
    id: 6,
    title: '가을 단풍 명소 추천 - 서울 근교',
    desc: '가을 단풍 명소 추천 - 서울 근교',
    hashtags: ['가을', '단풍', '자연'],
    image: 'https://picsum.photos/400/300?random=6',
    username: 'nature_lover',
    memberCount: 78,
    userAvatar: undefined,
    isLiked: true,
    numOfLikes: 5,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
  },
  {
    id: 7,
    title: '서울 숨겨진 벚꽃 명소 5곳',
    desc: '서울 숨겨진 벚꽃 명소 5곳',
    hashtags: ['벚꽃', '봄', '사진'],
    image: 'https://picsum.photos/400/300?random=7',
    username: 'cherry_blossom',
    memberCount: 234,
    userAvatar: undefined,
    isLiked: false,
    numOfLikes: 100,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
  },
  {
    id: 8,
    title: '강남 스타일 - 쇼핑몰 가이드',
    desc: '강남 스타일 - 쇼핑몰 가이드',
    hashtags: ['강남', '쇼핑', '패션'],
    image: 'https://picsum.photos/400/300?random=8',
    username: 'fashion_k',
    memberCount: 95,
    userAvatar: undefined,
    isLiked: true,
    numOfLikes: 50,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
  },
  {
    id: 9,
    title: '서울 맛집 맵핑 - 지역별 정리',
    desc: '서울 맛집 맵핑 - 지역별 정리',
    hashtags: ['맛집', '지도', '정리'],
    image: 'https://picsum.photos/400/300?random=9',
    username: 'food_mapper',
    memberCount: 312,
    userAvatar: undefined,
    isLiked: false,
    numOfLikes: 10,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
  },
  {
    id: 10,
    title: '한강공원 피크닉 스팟 모음',
    desc: '한강공원 피크닉 스팟 모음',
    hashtags: ['한강', '피크닉', '공원'],
    image: 'https://picsum.photos/400/300?random=10',
    username: 'picnic_master',
    memberCount: 67,
    userAvatar: undefined,
    isLiked: true,
    numOfLikes: 100,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
  },
  {
    id: 11,
    title: '서울 전통시장 투어 가이드',
    desc: '서울 전통시장 투어 가이드',
    hashtags: ['전통시장', '투어', '문화'],
    image: 'https://picsum.photos/400/300?random=11',
    username: 'culture_explorer',
    memberCount: 143,
    userAvatar: undefined,
    isLiked: false,
    numOfLikes: 20,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
  },
  {
    id: 12,
    title: '서울 카페 호핑 코스 추천',
    desc: '서울 카페 호핑 코스 추천',
    hashtags: ['카페', '호핑', '코스'],
    image: 'https://picsum.photos/400/300?random=12',
    username: 'cafe_hopper',
    memberCount: 178,
    userAvatar: undefined,
    isLiked: true,
    numOfLikes: 300,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
  }
]

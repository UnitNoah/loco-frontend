import { Link, useLocation } from "react-router-dom"
import {
  UserCircleIcon,
  MapPinIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline"
import { useHostedRooms, useJoinedRooms } from "../../hooks/queries/useSpots"
import { useAuthStore } from "../../store/authStore"

type NavItem = {
  name: string
  to: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  badge?: string
}

const baseNavItems: Omit<NavItem, 'badge'>[] = [
  { name: "내 정보", to: "/profile", icon: UserCircleIcon },
  { name: "내 스팟", to: "/my-spots", icon: MapPinIcon },
  { name: "참여한 스팟", to: "/joined-spots", icon: UserGroupIcon },
  { name: "내 댓글", to: "/my-comments", icon: ChatBubbleLeftRightIcon },
  { name: "설정", to: "/settings", icon: Cog6ToothIcon },
  { name: "고객센터 / 문의하기", to: "/support", icon: QuestionMarkCircleIcon },
  { name: "신고 내역", to: "/reports", icon: ExclamationTriangleIcon },
]

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { user } = useAuthStore()
  
  // Fetch room counts for badges
  const { data: hostedRooms = [] } = useHostedRooms(user?.id || 0)
  const { data: joinedRooms = [] } = useJoinedRooms(user?.id || 0)
  
  // Create nav items with badges
  const navItems: NavItem[] = baseNavItems.map((item) => {
    let badge: string | undefined
    if (item.to === '/my-spots') {
      badge = hostedRooms.length.toString()
    } else if (item.to === '/joined-spots') {
      badge = joinedRooms.length.toString()
    } else if (item.to === '/my-comments') {
      badge = '13' // Keep static for now
    }
    return { ...item, badge }
  })

  return (
    <aside className="w-64 bg-[#0f172a] text-white min-h-screen flex flex-col px-4 py-6">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.name}
              to={item.to}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-700 transition ${
                isActive ? "bg-slate-800" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.name}
              </div>
              {item.badge && (
                <span className="ml-auto rounded-full bg-slate-600 px-2 py-0.5 text-xs">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar

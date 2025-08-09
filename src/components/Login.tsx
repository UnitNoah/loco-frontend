import React from 'react'

type LoginProps = {
  open: boolean
  onClose: () => void
}

const Login: React.FC<LoginProps> = ({ open, onClose }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-[520px] max-w-[92vw] rounded-2xl bg-[#54A8E0] p-8 shadow-2xl"
      >
        <button
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-4 top-4 text-white/90 hover:text-white cursor-pointer"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="text-center">
          <div className="text-[72px] leading-none font-extrabold tracking-tight text-white mb-10">
            <span className="drop-shadow">Lo</span>
            <span className="text-white/90">co</span>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center gap-4 bg-[#F1D45A] text-black px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition">
              <span className="inline-flex w-7 h-7 rounded-full bg-black/70 items-center justify-center text-white text-sm">k</span>
              <span className="flex-1 text-sm font-medium">카카오로 쉬운시작</span>
            </button>
            <button className="w-full flex items-center gap-4 bg-[#3B5998] text-white px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition">
              <span className="inline-flex w-7 h-7 rounded-full bg-white/20 items-center justify-center text-white text-sm">f</span>
              <span className="flex-1 text-sm font-medium">페이스북으로 쉬운시작</span>
            </button>
            <button className="w-full flex items-center gap-4 bg-[#2DB400] text-white px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition">
              <span className="inline-flex w-7 h-7 rounded-full bg-white items-center justify-center text-[#2DB400] text-sm font-extrabold">N</span>
              <span className="flex-1 text-sm font-medium">네이버로 쉬운시작</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
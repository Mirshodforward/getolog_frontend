import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  HiOutlineViewGrid, 
  HiOutlineUsers, 
  HiOutlineCube,
  HiOutlineUserCircle,
  HiOutlineCreditCard,
  HiOutlineTrendingDown,
  HiOutlineDownload,
  HiOutlineLogout
} from 'react-icons/hi'

function Sidebar({ isOpen, onClose }) {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: HiOutlineViewGrid },
    { path: '/clients', label: 'Clientlar', icon: HiOutlineUsers },
    { path: '/bots', label: 'Botlar', icon: HiOutlineCube },
    { path: '/users', label: 'Userlar', icon: HiOutlineUserCircle },
    { path: '/transactions', label: 'Tranzaksiyalar', icon: HiOutlineCreditCard },
    { path: '/spendings', label: 'Sarflar', icon: HiOutlineTrendingDown },
    { path: '/export', label: 'Export', icon: HiOutlineDownload }
  ]

  return (
    <aside 
      className={`
        fixed md:sticky w-56 bg-white border-r border-slate-200 
        h-screen flex flex-col z-40 top-0 left-0
        shadow-lg md:shadow-none
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Logo Section */}
      <div className="px-4 py-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-slate-800 truncate">Getolog</h1>
            <p className="text-[10px] text-slate-400 font-medium truncate">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 active:bg-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* User & Logout Section */}
      <div className="p-3 border-t border-slate-100 flex-shrink-0 space-y-2">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            <HiOutlineUserCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-400 font-medium">Logged in</p>
            <p className="text-sm font-medium text-slate-700 truncate">{username || 'Admin'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-600 
                     hover:bg-red-50 active:bg-red-100 transition-all duration-200 font-medium"
        >
          <HiOutlineLogout className="w-4 h-4 flex-shrink-0" />
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

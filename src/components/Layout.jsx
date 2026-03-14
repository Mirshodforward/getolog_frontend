import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Sidebar ni yopish URL o'zgarishi bilan
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile overlay - smooth fade */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen w-full">
        {/* Mobile/Tablet header */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">G</span>
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-800 truncate">Getolog Admin</h1>
          </div>

          {/* Right: Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`ml-2 p-1.5 sm:p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
              sidebarOpen 
                ? 'bg-blue-100 text-blue-600' 
                : 'hover:bg-slate-100 text-slate-600 active:bg-slate-200'
            }`}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? (
              <HiOutlineX className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <HiOutlineMenu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>

        {/* Page content - responsive padding */}
        <div className="flex-1 px-3 sm:px-4 md:p-5 py-3 sm:py-4 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout

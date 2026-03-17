import { useEffect, useState } from 'react'
import { getComprehensiveStats, checkHealth } from '../services/api'
import { 
  HiOutlineUsers, 
  HiOutlineUserGroup,
  HiOutlineCreditCard,
  HiOutlineCash,
  HiOutlineStar,
  HiOutlinePlay,
  HiOutlineRefresh,
  HiOutlineClock,
  HiOutlineTrendingUp,
  HiOutlineServer,
  HiOutlineDatabase,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineCube
} from 'react-icons/hi'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [backendStatus, setBackendStatus] = useState({ status: 'checking', database: null })

  useEffect(() => {
    fetchData()
    checkBackendHealth()
    const interval = setInterval(checkBackendHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkBackendHealth = async () => {
    for (let i = 0; i < 2; i++) {
      try {
        const res = await checkHealth()
        setBackendStatus({
          status: 'online',
          database: res.data.database,
          timestamp: res.data.timestamp
        })
        return
      } catch (error) {
        if (i === 0) {
          await new Promise(r => setTimeout(r, 2000))
          continue
        }
        setBackendStatus({
          status: 'offline',
          database: 'disconnected',
          error: error.message
        })
      }
    }
  }

  const fetchData = async () => {
    try {
      const res = await getComprehensiveStats()
      setData(res.data.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString('uz-UZ') + ' so\'m'
  }

  const formatShortCurrency = (value) => {
    const num = parseFloat(value || 0)
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toLocaleString()
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in">
      {/* Header - Fully Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3">
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <HiOutlineChartBar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800">Dashboard</h1>
        </div>

        {/* Actions - Stack on mobile */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Backend Status - Responsive */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex-wrap min-w-0 ${
            backendStatus.status === 'online' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
              : backendStatus.status === 'offline' 
                ? 'bg-red-50 text-red-700 border border-red-200/50'
                : 'bg-amber-50 text-amber-700 border border-amber-200/50'
          }`}>
            <span className={`status-dot flex-shrink-0 ${
              backendStatus.status === 'online' ? 'status-online' : 
              backendStatus.status === 'offline' ? 'status-offline' : 'status-pending'
            }`}></span>
            <HiOutlineServer className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">{backendStatus.status === 'online' ? 'Online' : backendStatus.status === 'offline' ? 'Offline' : 'Checking...'}</span>
            <span className="sm:hidden">{backendStatus.status === 'online' ? 'Ok' : 'Err'}</span>
            {backendStatus.database === 'connected' && (
              <HiOutlineDatabase className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            )}
          </div>

          {/* Refresh Button */}
          <button 
            onClick={fetchData} 
            className="btn-secondary text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5"
            title="Asosiy ma'lumotlarni yangilash"
          >
            <HiOutlineRefresh className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Yangilash</span>
          </button>
        </div>
      </div>

      {/* Pending Alert - Responsive */}
      {data?.pending > 0 && (
        <div className="bg-amber-50 border border-amber-200/50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-start sm:items-center gap-2 sm:gap-3">
          <HiOutlineClock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-amber-800 text-xs sm:text-sm">Kutilayotgan tranzaksiyalar</p>
            <p className="text-amber-600 text-xs">{data.pending} ta tasdiqlash kutilmoqda</p>
          </div>
        </div>
      )}

      {/* Stats Grid - 5 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
        {/* Clients */}
        <div className="stat-card hover:shadow-md active:shadow-sm transition-shadow">
          <div className="stat-icon bg-blue-100 text-blue-600 flex-shrink-0">
            <HiOutlineUsers className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="stat-label">Clientlar</p>
            <p className="stat-value text-xl sm:text-2xl">{data?.clients?.total || 0}</p>
          </div>
        </div>

        {/* Users */}
        <div className="stat-card hover:shadow-md active:shadow-sm transition-shadow">
          <div className="stat-icon bg-purple-100 text-purple-600 flex-shrink-0">
            <HiOutlineUserGroup className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="stat-label">Userlar</p>
            <p className="stat-value text-xl sm:text-2xl">{data?.users?.total || 0}</p>
          </div>
        </div>

        {/* Today Transactions */}
        <div className="stat-card hover:shadow-md active:shadow-sm transition-shadow">
          <div className="stat-icon bg-emerald-100 text-emerald-600 flex-shrink-0">
            <HiOutlineCreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="stat-label">Bugun to'lov</p>
            <p className="stat-value text-xl sm:text-2xl">{(data?.clientTransactions?.todayCount || 0) + (data?.userTransactions?.todayCount || 0)}</p>
          </div>
        </div>

        {/* Today Revenue */}
        <div className="stat-card hover:shadow-md active:shadow-sm transition-shadow">
          <div className="stat-icon bg-amber-100 text-amber-600 flex-shrink-0">
            <HiOutlineCash className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="stat-label">Bugun daromad</p>
            <p className="stat-value text-base sm:text-xl lg:text-lg">{formatShortCurrency((data?.clientTransactions?.todayTotal || 0) + (data?.userTransactions?.todayTotal || 0))}</p>
          </div>
        </div>

        {/* Active Bots */}
        <div className="stat-card hover:shadow-md active:shadow-sm transition-shadow">
          <div className="stat-icon bg-green-100 text-green-600 flex-shrink-0">
            <HiOutlinePlay className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="stat-label">Ishlab turgan</p>
            <p className="stat-value text-xl sm:text-2xl">{data?.bots?.active || 0}</p>
          </div>
        </div>
      </div>

      {/* Main Grid - 3 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Clients Section */}
        <div className="card-compact">
          <div className="section-title mb-3">
            <HiOutlineUsers className="w-4 h-4 text-blue-600" />
            Clientlar
          </div>
          
          <div className="space-y-1">
            <div className="mini-stat">
              <span className="mini-stat-label">Jami</span>
              <span className="mini-stat-value text-blue-600">{data?.clients?.total || 0}</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-label">Bot yaratgan</span>
              <span className="mini-stat-value text-purple-600">{data?.clients?.withBots || 0}</span>
            </div>
            <div className="mini-stat pl-3">
                <span className="text-xs text-slate-500">Free</span>
                <span className="text-sm text-slate-600">{data?.clients?.freeClients || 0}</span>
              </div>
              <div className="mini-stat pl-3">
                <span className="text-xs text-blue-500">Standart</span>
                <span className="text-sm text-blue-600 font-medium">{data?.clients?.standartClients || 0}</span>
              </div>
              <div className="mini-stat pl-3">
                <span className="text-xs text-emerald-500">Biznes</span>
                <span className="text-sm text-emerald-600 font-medium">{data?.clients?.biznesClients || 0}</span>
              </div>
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between bg-blue-50 px-2.5 py-1.5 rounded-lg">
                <span className="text-xs font-medium text-blue-700 flex items-center gap-1">
                  <HiOutlineCalendar className="w-3.5 h-3.5" /> Bugun
                </span>
                <span className="font-bold text-blue-700">{data?.clients?.todayNew || 0}</span>
              </div>
            </div>
          </div>


        </div>

        {/* Users Section */}
        <div className="card-compact">
          <div className="section-title mb-3">
            <HiOutlineUserGroup className="w-4 h-4 text-purple-600" />
            Userlar (Obunachilar)
          </div>
          
          <div className="space-y-1">
            <div className="mini-stat">
              <span className="mini-stat-label">Jami</span>
              <span className="mini-stat-value text-blue-600">{data?.users?.total || 0}</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-label">Faol</span>
              <span className="mini-stat-value text-emerald-600">{data?.users?.active || 0}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between bg-emerald-50 px-2.5 py-1.5 rounded-lg">
                <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                  <HiOutlineCalendar className="w-3.5 h-3.5" /> Bugun
                </span>
                <span className="font-bold text-emerald-700">{data?.users?.todayNew || 0}</span>
              </div>
            </div>
          </div>


        </div>

        {/* Client Transactions */}
        <div className="card-compact">
          <div className="section-title mb-3">
            <HiOutlineCreditCard className="w-4 h-4 text-amber-600" />
            Clientlar to'lovlari
          </div>
          
          <div className="space-y-1">
            <div className="bg-amber-50 px-2.5 py-2 rounded-lg space-y-1 mb-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-amber-700">Bugun</span>
                <span className="font-semibold text-amber-800">{data?.clientTransactions?.todayCount || 0} ta</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-amber-700">Summa</span>
                <span className="font-semibold text-amber-800 text-sm">{formatShortCurrency(data?.clientTransactions?.todayTotal)}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2.5 rounded-lg text-white">
              <div className="flex justify-between items-center">
                <span className="text-xs text-emerald-100 flex items-center gap-1">
                  <HiOutlineTrendingUp className="w-3.5 h-3.5" /> Jami daromad
                </span>
                <span className="font-bold">{formatShortCurrency(data?.clientTransactions?.totalRevenue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - 3 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Tarif Purchases */}
          <div className="card-compact">
            <div className="section-title mb-3">
              <HiOutlineStar className="w-4 h-4 text-orange-600" />
              Tarif sotib olishlar
            </div>

            <div className="space-y-2">
              <div className="bg-gradient-to-r from-orange-400 to-amber-500 px-3 py-2 rounded-lg text-white flex justify-between items-center">
                <span className="text-xs">Jami tariflar</span>
                <span className="font-bold text-lg">{data?.spendings?.clients?.total || 0}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 mb-2">
                <div className="bg-blue-50 p-2 rounded-lg text-center">
                  <p className="text-[10px] text-blue-600 font-medium">Standard</p>
                  <p className="text-base font-bold text-blue-700">
                    {data?.spendings?.clients?.byType?.['Tarif xarid (standard)']?.count || data?.spendings?.clients?.byType?.['Tarif xarid (standart)']?.count || 0}
                  </p>
                </div>
                <div className="bg-emerald-50 p-2 rounded-lg text-center">
                  <p className="text-[10px] text-emerald-600 font-medium">Biznes</p>
                  <p className="text-base font-bold text-emerald-700">
                    {data?.spendings?.clients?.byType?.['Tarif xarid (biznes)']?.count || 0}
                  </p>
                </div>
              </div>

              <div className="mini-stat">
                <span className="mini-stat-label">Jami summa</span>
                <span className="font-semibold text-orange-600 text-sm">{formatShortCurrency(data?.spendings?.clients?.amount)}</span>
              </div>

              <div className="bg-orange-50 px-2.5 py-1.5 rounded-lg flex justify-between items-center">
                <span className="text-xs text-orange-700">Bugun</span>
                <span className="font-semibold text-orange-700">{data?.spendings?.clients?.todayCount || 0} ta</span>
              </div>
            </div>
          </div>

        {/* User Subscriptions */}
        <div className="card-compact">
          <div className="section-title mb-3">
            <HiOutlinePlay className="w-4 h-4 text-blue-600" />
            Kanal obunalari
          </div>
          
          <div className="space-y-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-2 rounded-lg text-white flex justify-between items-center">
              <span className="text-xs">Jami obuna</span>
              <span className="font-bold text-lg">{data?.spendings?.users?.total || 0}</span>
            </div>

            {/* Subscription types */}
            <div className="grid grid-cols-3 gap-1.5">
              <div className="bg-blue-50 p-2 rounded-lg text-center">
                <p className="text-[10px] text-blue-600 font-medium">1 Oy</p>
                <p className="text-base font-bold text-blue-700">
                  {data?.spendings?.users?.byType?.['1 oy']?.count || 0}
                </p>
              </div>
              <div className="bg-purple-50 p-2 rounded-lg text-center">
                <p className="text-[10px] text-purple-600 font-medium">1 Yil</p>
                <p className="text-base font-bold text-purple-700">
                  {data?.spendings?.users?.byType?.['1 yil']?.count || 0}
                </p>
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg text-center">
                <p className="text-[10px] text-emerald-600 font-medium">Cheksiz</p>
                <p className="text-base font-bold text-emerald-700">
                  {data?.spendings?.users?.byType?.['cheksiz']?.count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Transactions */}
        <div className="card-compact">
          <div className="section-title mb-3">
            <HiOutlineCash className="w-4 h-4 text-indigo-600" />
            Userlar to'lovlari
          </div>
          
          <div className="space-y-1">
            <div className="bg-indigo-50 px-2.5 py-2 rounded-lg space-y-1 mb-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-indigo-700">Bugun</span>
                <span className="font-semibold text-indigo-800">{data?.userTransactions?.todayCount || 0} ta</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-indigo-700">Summa</span>
                <span className="font-semibold text-indigo-800 text-sm">{formatShortCurrency(data?.userTransactions?.todayTotal)}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2.5 rounded-lg text-white">
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-100 flex items-center gap-1">
                  <HiOutlineTrendingUp className="w-3.5 h-3.5" /> Jami daromad
                </span>
                <span className="font-bold">{formatShortCurrency(data?.userTransactions?.totalRevenue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Dashboard

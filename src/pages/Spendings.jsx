import { useEffect, useState } from 'react'
import { getSpendings, getSpendingStats } from '../services/api'
import {
  HiOutlineTrendingDown,
  HiOutlineStar,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineCash,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineCube,
  HiOutlineChevronLeft,
  HiOutlineChevronRight
} from 'react-icons/hi'

function Spendings() {
  const [spendings, setSpendings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [activeTab, setActiveTab] = useState('client')
  const [expandedRow, setExpandedRow] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    fetchSpendings()
  }, [activeTab, page])

  const fetchStats = async () => {
    try {
      const res = await getSpendingStats()
      setStats(res.data.data)
    } catch (error) {
      console.error('Stats error:', error)
    }
  }

  const fetchSpendings = async () => {
    try {
      setLoading(true)
      const res = await getSpendings(page, 25, activeTab)
      setSpendings(res.data.data.spendings)
      setPagination(res.data.data.pagination)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPage(1)
    setExpandedRow(null)
  }

  const getSpendBadge = (spend) => {
    const badges = {
      'premium': { bg: 'bg-indigo-100 text-indigo-700', label: '⭐ Premium' },
      '1 oy': { bg: 'bg-blue-100 text-blue-700', label: '📅 1 Oy' },
      '1 yil': { bg: 'bg-emerald-100 text-emerald-700', label: '📆 1 Yil' },
      'cheksiz': { bg: 'bg-amber-100 text-amber-700', label: '♾️ Cheksiz' },
    }
    const badge = badges[spend] || { bg: 'bg-slate-100 text-slate-600', label: spend || 'Noma\'lum' }
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.bg}`}>
        {badge.label}
      </span>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatMoney = (amount) => {
    return (amount || 0).toLocaleString() + ' so\'m'
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiOutlineTrendingDown className="w-6 h-6 text-orange-600" />
          <h1 className="text-xl font-bold text-slate-800">Sarflar</h1>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-3">
          <div className="stat-card">
            <div className="stat-icon bg-purple-100 text-purple-600">
              <HiOutlineStar className="w-5 h-5" />
            </div>
            <div>
              <p className="stat-value text-sm">{formatMoney(stats.client_total)}</p>
              <p className="stat-label">Klient sarfi ({stats.client_count})</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-orange-100 text-orange-600">
              <HiOutlineUser className="w-5 h-5" />
            </div>
            <div>
              <p className="stat-value text-sm">{formatMoney(stats.user_total)}</p>
              <p className="stat-label">User sarfi ({stats.user_count})</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-emerald-100 text-emerald-600">
              <HiOutlineCash className="w-5 h-5" />
            </div>
            <div>
              <p className="stat-value text-sm">{formatMoney(stats.grand_total)}</p>
              <p className="stat-label">Umumiy sarf</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-blue-100 text-blue-600">
              <HiOutlineTrendingDown className="w-5 h-5" />
            </div>
            <div>
              <p className="stat-value">{stats.total_records}</p>
              <p className="stat-label">Jami yozuvlar</p>
            </div>
          </div>
        </div>
      )}

      {/* Spending by Type mini cards */}
      {stats?.by_type && stats.by_type.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {stats.by_type
            .filter(item => !['premium', '1 yil'].includes(item.spend))
            .map((item) => (
            <div key={item.spend} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
              {getSpendBadge(item.spend)}
              <span className="text-sm font-medium text-slate-700">{item.count} ta</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-sm font-semibold text-emerald-600">{formatMoney(item.total)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => handleTabChange('client')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'client'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HiOutlineStar className="w-4 h-4" />
          Klientlar Sarfi
          {stats && <span className="ml-1 opacity-80">({stats.client_count})</span>}
        </button>
        <button
          onClick={() => handleTabChange('user')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'user'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HiOutlineUser className="w-4 h-4" />
          Foydalanuvchilar Sarfi
          {stats && <span className="ml-1 opacity-80">({stats.user_count})</span>}
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* Table & Cards */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
            {/* Mobile View */}
            <div className="block sm:hidden divide-y divide-slate-100">
              {spendings.map((spend, idx) => (
                <div 
                  key={spend.id} 
                  className="p-4 space-y-3 hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedRow(expandedRow === spend.id ? null : spend.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <div className="font-bold text-slate-800 text-sm">@{spend.username || 'N/A'}</div>
                      <div className="text-[11px] text-slate-500 font-mono">ID: {spend.user_id}</div>
                    </div>
                    {getSpendBadge(spend.spend)}
                  </div>
                  
                  {activeTab === 'user' && (
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="bg-slate-50 p-2 rounded flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Bot</span>
                        <div className="flex items-center gap-1">
                          <HiOutlineCube className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-700 font-medium truncate">{spend.bot_username || '—'}</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Admin</span>
                        <span className="text-xs text-slate-500 truncate">{spend.admin_id || '—'}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Summa</div>
                      <span className="font-bold text-emerald-600 text-sm">
                        {formatMoney(spend.amount)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Sana</div>
                      <div className="flex items-center justify-end gap-1 text-xs text-slate-500 font-medium">
                        <HiOutlineCalendar className="w-3.5 h-3.5" />
                        {formatDate(spend.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto table-container">
              <table className="w-full min-w-max">
                <thead className="table-header">
                  <tr>
                    <th>#</th>
                    <th>Foydalanuvchi</th>
                    <th>Summa</th>
                    <th>Sarf turi</th>
                    {activeTab === 'user' && <th>Bot nomi</th>}
                    {activeTab === 'user' && <th>Bot egasi (Admin)</th>}
                    <th>Sana</th>
                  </tr>
                </thead>
                <tbody>
                  {spendings.map((spend, idx) => (
                    <tr 
                      key={spend.id} 
                      className="table-row cursor-pointer hover:bg-slate-50"
                      onClick={() => setExpandedRow(expandedRow === spend.id ? null : spend.id)}
                    >
                      <td>
                        <span className="text-xs text-slate-400 font-mono">
                          {(page - 1) * 25 + idx + 1}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                            activeTab === 'client' ? 'bg-purple-500' : 'bg-orange-500'
                          }`}>
                            {(spend.username || 'N')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-sm">@{spend.username || 'N/A'}</p>
                            <p className="text-xs text-slate-400">{spend.user_id}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="font-bold text-emerald-600 text-sm">
                          {formatMoney(spend.amount)}
                        </span>
                      </td>
                      <td>
                        {getSpendBadge(spend.spend)}
                      </td>
                      {activeTab === 'user' && (
                        <td>
                          <div className="flex items-center gap-1.5">
                            <HiOutlineCube className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-sm text-slate-700 font-medium">{spend.bot_username || '—'}</span>
                          </div>
                        </td>
                      )}
                      {activeTab === 'user' && (
                        <td>
                          <span className="text-sm text-slate-500">{spend.admin_id || '—'}</span>
                        </td>
                      )}
                      <td>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <HiOutlineCalendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(spend.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {spendings.length === 0 && (
              <div className="text-center py-8 text-slate-500 border-t border-slate-100">
                <HiOutlineTrendingDown className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                Sarflar topilmadi
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                <span className="text-sm text-slate-500">
                  Sahifa {pagination.page} / {pagination.totalPages} ({pagination.total} ta)
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    <HiOutlineChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= pagination.totalPages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    <HiOutlineChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Spendings

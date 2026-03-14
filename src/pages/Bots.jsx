import { useEffect, useState, useRef } from 'react'
import { getBots, getDeletedBots, startBot, stopBot, deleteBot } from '../services/api'
import {
  HiOutlineCube,
  HiOutlineRefresh,
  HiOutlinePlay,
  HiOutlineStop,
  HiOutlineTrash,
  HiOutlineExternalLink,
  HiOutlineUserGroup,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineExclamation
} from 'react-icons/hi'

function Bots() {
  const [activeTab, setActiveTab] = useState('active')
  const [bots, setBots] = useState([])
  const [deletedBots, setDeletedBots] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [deletedPage, setDeletedPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [deletedPagination, setDeletedPagination] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [toast, setToast] = useState(null)
  const pollingRef = useRef(null)

  useEffect(() => {
    if (activeTab === 'active') {
      fetchBots()
    } else {
      fetchDeletedBots()
    }
  }, [page, deletedPage, activeTab])

  // Auto-polling: agar biror bot "kutilmoqda" holatida bo'lsa, har 5s yangilaydi
  useEffect(() => {
    const hasPending = bots.some(bot => 
      (bot.should_stop && bot.status === 'active') || 
      (!bot.should_stop && bot.status === 'stopped')
    )

    if (hasPending && activeTab === 'active') {
      pollingRef.current = setInterval(() => {
        fetchBotsSilent()
      }, 5000)
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [bots, activeTab])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchBots = async () => {
    try {
      setLoading(true)
      const res = await getBots(page, 20)
      setBots(res.data.data.bots)
      setPagination(res.data.data.pagination)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Sessiz yangilash - loading ko'rsatmaydi
  const fetchBotsSilent = async () => {
    try {
      const res = await getBots(page, 20)
      setBots(res.data.data.bots)
      setPagination(res.data.data.pagination)
    } catch (error) {
      console.error('Silent refresh error:', error)
    }
  }

  const fetchDeletedBots = async () => {
    try {
      setLoading(true)
      const res = await getDeletedBots(deletedPage, 20)
      setDeletedBots(res.data.data.bots)
      setDeletedPagination(res.data.data.pagination)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (bot) => {
    const isRunning = bot.status === 'active' && !bot.should_stop
    const isPending = (bot.should_stop && bot.status === 'active') || (!bot.should_stop && bot.status === 'stopped')
    
    if (isPending) return // kutilmoqda bo'lsa hech narsa qilmaydi

    try {
      setActionLoading(bot.id)
      if (isRunning) {
        await stopBot(bot.id)
        showToast(`"${bot.bot_name}" ga to'xtatish signali yuborildi`, 'warning')
      } else {
        await startBot(bot.id)
        showToast(`"${bot.bot_name}" ga ishga tushirish signali yuborildi`, 'success')
      }
      await fetchBotsSilent()
    } catch (error) {
      showToast(error.response?.data?.error || 'Xatolik yuz berdi', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (botId, botName) => {
    if (!confirm(`"${botName}" botini o'chirishni xohlaysizmi?\nBu amalni qaytarib bo'lmaydi!`)) return
    try {
      setActionLoading(botId)
      await deleteBot(botId)
      showToast(`"${botName}" o'chirildi`, 'error')
      await fetchBots()
    } catch (error) {
      showToast(error.response?.data?.error || 'Xatolik!', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'active') {
      setPage(1)
    } else {
      setDeletedPage(1)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusInfo = (bot) => {
    // should_stop=true, status=active → to'xtamoqda (daemon hali to'xtatmagan)
    if (bot.should_stop && bot.status === 'active') {
      return { label: "To'xtamoqda...", color: 'amber', icon: 'clock', pending: true }
    }
    // should_stop=false, status=stopped → ishga tushmoqda (daemon hali ishga tushirmagan)
    if (!bot.should_stop && bot.status === 'stopped') {
      return { label: 'Ishga tushmoqda...', color: 'blue', icon: 'clock', pending: true }
    }
    // should_stop=false, status=active → ishlayapti
    if (bot.status === 'active') {
      return { label: 'Ishlayapti', color: 'green', icon: 'check', pending: false }
    }
    // should_stop=true, status=stopped → to'xtatilgan
    return { label: "To'xtatilgan", color: 'red', icon: 'x', pending: false }
  }

  const renderStatusBadge = (bot) => {
    const info = getStatusInfo(bot)
    const colorMap = {
      green: 'badge-success',
      red: 'badge-danger',
      amber: 'badge-warning',
      blue: 'badge-info'
    }

    return (
      <span className={`badge ${colorMap[info.color]}`}>
        {info.pending ? (
          <HiOutlineClock className="w-3 h-3 animate-pulse" />
        ) : info.icon === 'check' ? (
          <span className="status-dot status-online"></span>
        ) : (
          <HiOutlineXCircle className="w-3 h-3" />
        )}
        {info.label}
      </span>
    )
  }

  const renderToggleButton = (bot) => {
    const info = getStatusInfo(bot)
    const isLoading = actionLoading === bot.id
    
    if (info.pending) {
      return (
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Kutilmoqda</span>
        </div>
      )
    }

    const isRunning = bot.status === 'active'
    
    return (
      <button
        onClick={() => handleToggle(bot)}
        disabled={isLoading}
        className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors duration-300 focus:outline-none ${
          isRunning ? 'bg-green-500' : 'bg-slate-300'
        } ${isLoading ? 'opacity-50' : ''}`}
        title={isRunning ? "To'xtatish" : 'Ishga tushirish'}
      >
        <span className={`inline-block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isRunning ? 'translate-x-8' : 'translate-x-1'
        }`}>
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : isRunning ? (
            <HiOutlineStop className="w-3 h-3 text-red-500 m-1" />
          ) : (
            <HiOutlinePlay className="w-3 h-3 text-green-500 m-1" />
          )}
        </span>
      </button>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 left-4 right-4 sm:bottom-4 sm:right-4 sm:w-auto z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white animate-fade-in ${
          toast.type === 'success' ? 'bg-green-500' : toast.type === 'warning' ? 'bg-amber-500' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <HiOutlineCube className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <h1 className="text-lg sm:text-xl font-bold text-slate-800">Botlar</h1>
        </div>
        <button 
          onClick={activeTab === 'active' ? fetchBots : fetchDeletedBots} 
          className="btn-secondary text-sm"
        >
          <HiOutlineRefresh className="w-4 h-4" />
          <span className="hidden sm:inline">Yangilash</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => handleTabChange('active')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Faol botlar
          {pagination && (
            <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
              activeTab === 'active' ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
            }`}>
              {pagination.total}
            </span>
          )}
        </button>
        <button
          onClick={() => handleTabChange('deleted')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === 'deleted'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          O'chirilgan
          {deletedPagination && (
            <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
              activeTab === 'deleted' ? 'bg-white/20' : 'bg-red-100 text-red-600'
            }`}>
              {deletedPagination.total}
            </span>
          )}
        </button>
      </div>

      {/* Active Bots Table */}
      {activeTab === 'active' && (
        <div className="table-container overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="table-header">
              <tr>
                <th>Bot</th>
                <th className="hidden sm:table-cell">Egasi</th>
                <th className="hidden md:table-cell">Kanal</th>
                <th className="hidden sm:table-cell">Userlar</th>
                <th>Status</th>
                <th>Harakatlar</th>
              </tr>
            </thead>
            <tbody>
              {bots.map((bot) => (
                <tr key={bot.id} className="table-row">
                  {/* Bot Info */}
                  <td className="text-sm sm:text-base">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-slate-800">{bot.bot_name}</span>
                      {bot.bot_username ? (
                        <a
                          href={`https://t.me/${bot.bot_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
                        >
                          @{bot.bot_username}
                          <HiOutlineExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Username yo'q</span>
                      )}
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="text-slate-600 text-sm hidden sm:table-cell">
                    @{bot.owner_username || 'N/A'}
                  </td>

                  {/* Channel */}
                  <td className="hidden md:table-cell">
                    <div className="flex flex-col gap-0.5 text-sm">
                      {bot.channel_username ? (
                        <a
                          href={`https://t.me/${bot.channel_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          @{bot.channel_username}
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">{bot.channel_id || 'N/A'}</span>
                      )}
                      {bot.manager_invite_link && (
                        <a
                          href={bot.manager_invite_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-emerald-600 hover:underline"
                        >
                          Kirish
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Users Count */}
                  <td className="text-sm hidden sm:table-cell">
                    <div className="flex items-center gap-1 text-slate-600">
                      <HiOutlineUserGroup className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{bot.users_count || 0}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="text-sm">
                    {renderStatusBadge(bot)}
                  </td>

                  {/* Actions - Toggle + Delete */}
                  <td className="text-sm">
                    <div className="flex items-center gap-1 sm:gap-3">
                      {renderToggleButton(bot)}
                      <button
                        onClick={() => handleDelete(bot.id, bot.bot_name)}
                        disabled={actionLoading === bot.id || (bot.should_stop && bot.status === 'active')}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                        title="O'chirish"
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bots.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <HiOutlineCube className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              Botlar topilmadi
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm text-slate-500">
                Sahifa {pagination.page} / {pagination.totalPages} (Jami: {pagination.total})
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
      )}

      {/* Deleted Bots Table */}
      {activeTab === 'deleted' && (
        <div className="table-container">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th>Bot</th>
                <th>Egasi</th>
                <th>Userlar</th>
                <th>Narxlar</th>
                <th>Yaratilgan</th>
                <th>O'chirilgan</th>
                <th>Sabab</th>
              </tr>
            </thead>
            <tbody>
              {deletedBots.map((bot) => (
                <tr key={bot.id} className="table-row bg-red-50/30">
                  {/* Bot Info */}
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">{bot.bot_name}</span>
                      <span className="text-xs text-slate-400">@{bot.bot_username || 'N/A'}</span>
                      <span className="text-[10px] text-slate-400">ID: {bot.original_bot_id}</span>
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="text-slate-600">
                    @{bot.owner_username || 'N/A'}
                  </td>

                  {/* Users Count */}
                  <td>
                    <span className="font-medium text-slate-600">{bot.registered_users_count || 0}</span>
                  </td>

                  {/* Prices */}
                  <td>
                    <div className="flex flex-col text-[10px] text-slate-500">
                      <span>Oylik: {bot.oy_narx?.toLocaleString() || 0}</span>
                      <span>Yillik: {bot.yil_narx?.toLocaleString() || 0}</span>
                      <span>Cheksiz: {bot.cheksiz_narx?.toLocaleString() || 0}</span>
                    </div>
                  </td>

                  {/* Created At */}
                  <td className="text-xs text-slate-500">
                    {formatDate(bot.bot_created_at)}
                  </td>

                  {/* Deleted At */}
                  <td className="text-xs text-red-600 font-medium">
                    {formatDate(bot.deleted_at)}
                  </td>

                  {/* Deletion Reason */}
                  <td className="text-xs text-slate-500 max-w-[120px] truncate" title={bot.deletion_reason}>
                    {bot.deletion_reason || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {deletedBots.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <HiOutlineTrash className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              O'chirilgan botlar topilmadi
            </div>
          )}

          {deletedPagination && deletedPagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm text-slate-500">
                Sahifa {deletedPagination.page} / {deletedPagination.totalPages} (Jami: {deletedPagination.total})
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setDeletedPage(deletedPage - 1)}
                  disabled={deletedPage === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  <HiOutlineChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletedPage(deletedPage + 1)}
                  disabled={deletedPage >= deletedPagination.totalPages}
                  className="btn-secondary disabled:opacity-50"
                >
                  <HiOutlineChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Bots

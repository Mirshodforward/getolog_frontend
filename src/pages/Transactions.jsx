import { useEffect, useState } from 'react'
import { getTransactions } from '../services/api'
import {
  HiOutlineCreditCard,
  HiOutlineFilter,
  HiOutlineUsers,
  HiOutlineUser,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineCash,
  HiOutlineChevronDown,
  HiOutlineChevronUp
} from 'react-icons/hi'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [activeTab, setActiveTab] = useState('client')

  useEffect(() => {
    fetchTransactions()
  }, [statusFilter, activeTab, showAll])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const role = activeTab === 'client' ? 'client_topup' : 'users_topup'
      const limit = showAll ? 1000 : 20
      const res = await getTransactions(1, limit, statusFilter || null, role)
      setTransactions(res.data.data.transactions)
      setPagination(res.data.data.pagination)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setShowAll(false)
    setStatusFilter('')
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="badge badge-success">
            <HiOutlineCheckCircle className="w-3 h-3" />
            Tasdiqlangan
          </span>
        )
      case 'rejected':
        return (
          <span className="badge badge-danger">
            <HiOutlineXCircle className="w-3 h-3" />
            Rad etilgan
          </span>
        )
      default:
        return (
          <span className="badge badge-warning">
            <HiOutlineClock className="w-3 h-3" />
            Kutilmoqda
          </span>
        )
    }
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

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiOutlineCreditCard className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">Tranzaksiyalar</h1>
        </div>
        <div className="text-sm text-slate-500">
          Jami: <span className="font-semibold text-slate-700">{pagination?.total || 0}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => handleTabChange('client')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'client'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HiOutlineUsers className="w-4 h-4" />
          Klientlar To'lovi
        </button>
        <button
          onClick={() => handleTabChange('users')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HiOutlineUser className="w-4 h-4" />
          Foydalanuvchilar To'lovi
        </button>
      </div>

      {/* Filters */}
      <div className="card-compact">
        <div className="flex items-center gap-3">
          <HiOutlineFilter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setShowAll(false) }}
            className="input-field w-40"
          >
            <option value="">Barchasi</option>
            <option value="approved">Tasdiqlangan</option>
            <option value="pending">Kutilmoqda</option>
            <option value="rejected">Rad etilgan</option>
          </select>
          {!showAll && pagination?.total > 20 && (
            <span className="text-sm text-slate-400 ml-auto">
              Oxirgi <span className="font-medium">20</span> ta ko'rsatilmoqda
            </span>
          )}
        </div>
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
              {transactions.map((trans) => (
                <div key={trans.id} className="p-4 space-y-3 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 ${
                        activeTab === 'client' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}>
                        {(trans.username || 'N')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">@{trans.username || 'N/A'}</p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">ID: {trans.user_id}</p>
                      </div>
                    </div>
                    {getStatusBadge(trans.status)}
                  </div>
                  
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Summa</div>
                      <span className="font-bold text-emerald-600 text-[15px] flex items-center gap-1">
                        {trans.amount?.toLocaleString()} so'm
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Sana</div>
                      <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                        <HiOutlineCalendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(trans.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto table-container">
              <table className="w-full">
                <thead className="table-header">
                  <tr>
                    <th>ID</th>
                    <th>Foydalanuvchi</th>
                    <th>Summa</th>
                    <th>Status</th>
                    <th>Sana</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((trans) => (
                    <tr key={trans.id} className="table-row">
                      <td>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-medium text-xs">
                          #{trans.id}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                            activeTab === 'client' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}>
                            {(trans.username || 'N')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-sm">@{trans.username || 'N/A'}</p>
                            <p className="text-xs text-slate-400">ID: {trans.user_id}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <HiOutlineCash className="w-4 h-4" />
                          {trans.amount?.toLocaleString()}
                          <span className="text-xs text-slate-400 font-normal">so'm</span>
                        </span>
                      </td>
                      <td>
                        {getStatusBadge(trans.status)}
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
                          {formatDate(trans.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {transactions.length === 0 && (
              <div className="text-center py-8 text-slate-500 border-t border-slate-100">
                <HiOutlineCreditCard className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                Tranzaksiyalar topilmadi
              </div>
            )}
          </div>

          {/* Show All Button */}
          {!showAll && pagination?.total > 20 && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAll(true)}
                className={`px-5 py-2 rounded-lg font-medium text-white text-sm flex items-center gap-2 ${
                  activeTab === 'client' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                <HiOutlineChevronDown className="w-4 h-4" />
                Barchasini ko'rsatish ({pagination?.total} ta)
              </button>
            </div>
          )}

          {showAll && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAll(false)}
                className="btn-secondary"
              >
                <HiOutlineChevronUp className="w-4 h-4" />
                Kamroq ko'rsatish
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Transactions

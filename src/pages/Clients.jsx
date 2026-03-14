import { useEffect, useState, useCallback, useRef } from 'react'
import { getClients, searchClients, updateClientBalance } from '../services/api'
import {
  HiOutlineUsers,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineX,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCash
} from 'react-icons/hi'

function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [modal, setModal] = useState({ open: false, client: null, action: 'add' })
  const [amount, setAmount] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const debounceTimer = useRef(null)

  useEffect(() => {
    if (!search.trim()) {
      fetchClients()
    }
  }, [page])

  // Debounce search - har harf kiritganda 400ms kutib avtomatik qidiradi
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (!search.trim()) {
      fetchClients()
      return
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(search)
    }, 400)

    return () => clearTimeout(debounceTimer.current)
  }, [search])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const res = await getClients(page, 20)
      setClients(res.data.data.clients)
      setPagination(res.data.data.pagination)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async (query) => {
    try {
      setSearchLoading(true)
      const res = await searchClients(query)
      setClients(res.data.data.clients || [])
      setPagination(null)
    } catch (error) {
      setClients([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search.trim()) return fetchClients()
    performSearch(search)
  }

  const handleBalance = async () => {
    if (!amount || !modal.client) return
    try {
      await updateClientBalance(modal.client.user_id, parseFloat(amount), modal.action)
      setModal({ open: false, client: null, action: 'add' })
      setAmount('')
      fetchClients()
      alert('Balans yangilandi!')
    } catch (error) {
      alert('Xatolik!')
    }
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HiOutlineUsers className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">Clientlar</h1>
        </div>
      </div>

      {/* Search */}
      <div className="card-compact">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="      ID, username yoki telefon raqam bo'yicha qidirish..."
              className="input-field pl-9 pr-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); setPage(1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded p-0.5"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchLoading && (
            <div className="flex items-center px-3">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <button 
            type="button" 
            onClick={() => { setSearch(''); setPage(1) }} 
            className="btn-secondary"
          >
            <HiOutlineRefresh className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="table-container overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="table-header">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th className="hidden sm:table-cell">Telefon</th>
              <th>Balans</th>
              <th className="hidden md:table-cell">Plan</th>
              <th className="hidden sm:table-cell">Botlar</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.user_id} className="table-row">
                <td className="font-mono text-slate-500 text-xs sm:text-sm">{client.user_id}</td>
                <td className="font-medium text-slate-800 text-sm">@{client.username || 'N/A'}</td>
                <td className="text-slate-500 text-xs hidden sm:table-cell">{client.phone_number || 'N/A'}</td>
                <td>
                  <span className="font-semibold text-emerald-600 text-sm">
                    {client.balance?.toLocaleString()} so'm
                  </span>
                </td>
                <td className="hidden md:table-cell">
                  <span className={`badge text-xs ${client.plan_type === 'premium' ? 'badge-info' : 'bg-slate-100 text-slate-600'}`}>
                    {client.plan_type || 'free'}
                  </span>
                </td>
                <td className="font-medium text-slate-700 text-sm hidden sm:table-cell">{client.bots_count || 0}</td>
                <td>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setModal({ open: true, client, action: 'add' })}
                      className="btn-success text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-1.5"
                      title="Qo'shish"
                    >
                      <HiOutlinePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => setModal({ open: true, client, action: 'subtract' })}
                      className="btn-danger text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-1.5"
                      title="Ayirish"
                    >
                      <HiOutlineMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clients.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <HiOutlineUsers className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            Ma'lumot topilmadi
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm text-slate-500">
              Sahifa {pagination.page} / {pagination.totalPages}
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

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-xl sm:rounded-xl p-5 w-full sm:max-w-sm shadow-xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <HiOutlineCash className={`w-5 h-5 ${modal.action === 'add' ? 'text-emerald-600' : 'text-red-600'}`} />
                {modal.action === 'add' ? 'Balans Qo\'shish' : 'Balans Ayirish'}
              </h3>
              <button 
                onClick={() => { setModal({ open: false, client: null, action: 'add' }); setAmount('') }}
                className="btn-icon text-slate-400 hover:text-slate-600"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm text-slate-500">Client</p>
                <p className="font-medium text-slate-800">@{modal.client?.username}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm text-slate-500">Joriy balans</p>
                <p className="font-bold text-emerald-600">{modal.client?.balance?.toLocaleString()} so'm</p>
              </div>
              <input
                type="number"
                className="input-field"
                placeholder="Summa (so'mda)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleBalance} 
                  className={`flex-1 ${modal.action === 'add' ? 'btn-success' : 'btn-danger'}`}
                >
                  Tasdiqlash
                </button>
                <button 
                  onClick={() => { setModal({ open: false, client: null, action: 'add' }); setAmount('') }} 
                  className="flex-1 btn-secondary"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clients

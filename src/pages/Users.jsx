import { useEffect, useState, useRef } from 'react'
import { getUsers } from '../services/api'
import {
  HiOutlineUserCircle,
  HiOutlineFilter,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineSortAscending,
  HiOutlineSortDescending,
  HiOutlineUserGroup,
  HiOutlineCash,
  HiOutlineShieldCheck,
  HiOutlineBan
} from 'react-icons/hi'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [stats, setStats] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [ownerSearch, setOwnerSearch] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('DESC')

  const searchTimer = useRef(null)
  const ownerTimer = useRef(null)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    fetchUsers()
  }, [page, statusFilter, sortBy, sortOrder])

  // Debounce user search
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setPage(1)
      fetchUsers(true)
    }, 400)
    return () => clearTimeout(searchTimer.current)
  }, [search])

  // Debounce owner search
  useEffect(() => {
    if (!ownerSearch && isInitialLoad.current) return
    clearTimeout(ownerTimer.current)
    ownerTimer.current = setTimeout(() => {
      setPage(1)
      fetchUsers(true)
    }, 400)
    return () => clearTimeout(ownerTimer.current)
  }, [ownerSearch])

  const fetchUsers = async (isSearch = false) => {
    try {
      if (isSearch) {
        setSearchLoading(true)
      } else {
        setLoading(true)
      }
      const res = await getUsers(
        page, 25,
        statusFilter || null,
        search || null,
        ownerSearch || null,
        sortBy,
        sortOrder
      )
      setUsers(res.data.data.users)
      setPagination(res.data.data.pagination)
      if (res.data.data.stats) {
        setStats(res.data.data.stats)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
    } else {
      setSortBy(field)
      setSortOrder('DESC')
    }
  }

  const renderSortIcon = (field) => {
    if (sortBy !== field) return null
    return sortOrder === 'ASC'
      ? <HiOutlineSortAscending className="w-3.5 h-3.5 text-indigo-500 inline ml-1" />
      : <HiOutlineSortDescending className="w-3.5 h-3.5 text-indigo-500 inline ml-1" />
  }

  const clearSearch = () => {
    setSearch('')
    setPage(1)
  }

  const clearOwnerSearch = () => {
    setOwnerSearch('')
    setPage(1)
  }

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`
    return amount?.toLocaleString() || '0'
  }

  if (loading && !searchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <HiOutlineUserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          <h1 className="text-lg sm:text-xl font-bold text-slate-800">Userlar</h1>
          {pagination && (
            <span className="text-xs sm:text-sm text-slate-400 ml-1">({pagination.total})</span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Jami</p>
                <p className="text-lg font-bold text-slate-800">{stats.total?.toLocaleString()}</p>
              </div>
              <HiOutlineUserGroup className="w-8 h-8 text-indigo-400 opacity-60" />
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Faol</p>
                <p className="text-lg font-bold text-emerald-600">{stats.active?.toLocaleString()}</p>
              </div>
              <HiOutlineCheckCircle className="w-8 h-8 text-emerald-400 opacity-60" />
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Chiqarilgan</p>
                <p className="text-lg font-bold text-red-600">{stats.removed?.toLocaleString()}</p>
              </div>
              <HiOutlineBan className="w-8 h-8 text-red-400 opacity-60" />
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Umumiy balans</p>
                <p className="text-lg font-bold text-amber-600">{formatCurrency(stats.total_balance)}</p>
              </div>
              <HiOutlineCash className="w-8 h-8 text-amber-400 opacity-60" />
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="card-compact">
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* User Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="User qidirish (ID, username, ism)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field w-full pr-10 text-sm"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Owner Username Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Bot egasi username..."
                value={ownerSearch}
                onChange={(e) => setOwnerSearch(e.target.value)}
                className="input-field w-full pr-10 text-sm"
              />
              {ownerSearch && (
                <button
                  onClick={clearOwnerSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <HiOutlineX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <HiOutlineFilter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                className="input-field flex-1 sm:w-36 text-sm"
              >
                <option value="">Barchasi</option>
                <option value="active">Faol</option>
                <option value="removed">Chiqarilgan</option>
                <option value="free">Free</option>
              </select>
            </div>
          </div>

          {/* Active filters display */}
          {(search || ownerSearch || statusFilter) && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 flex-wrap">
              <span className="text-xs text-slate-400">Filtrlar:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs">
                  Qidiruv: {search}
                  <HiOutlineX className="w-3 h-3 cursor-pointer" onClick={clearSearch} />
                </span>
              )}
              {ownerSearch && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs">
                  Egasi: @{ownerSearch}
                  <HiOutlineX className="w-3 h-3 cursor-pointer" onClick={clearOwnerSearch} />
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
                  Status: {statusFilter}
                  <HiOutlineX className="w-3 h-3 cursor-pointer" onClick={() => { setStatusFilter(''); setPage(1) }} />
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading indicator for search */}
      {searchLoading && (
        <div className="flex justify-center py-2">
          <div className="spinner !w-5 !h-5"></div>
        </div>
      )}

      {/* Table */}
      <div className="table-container overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="table-header">
            <tr>
              <th className="text-xs sm:text-sm">User ID</th>
              <th
                className="cursor-pointer hover:text-indigo-600 select-none hidden sm:table-cell text-xs sm:text-sm"
                onClick={() => handleSort('name')}
              >
                Ism {renderSortIcon('name')}
              </th>
              <th
                className="cursor-pointer hover:text-indigo-600 select-none text-xs sm:text-sm"
                onClick={() => handleSort('username')}
              >
                Username {renderSortIcon('username')}
              </th>
              <th className="hidden md:table-cell text-xs sm:text-sm">Muddat</th>
              <th
                className="cursor-pointer hover:text-indigo-600 select-none text-xs sm:text-sm"
                onClick={() => handleSort('balance')}
              >
                Balans {renderSortIcon('balance')}
              </th>
              <th
                className="cursor-pointer hover:text-indigo-600 select-none text-xs sm:text-sm"
                onClick={() => handleSort('status')}
              >
                Status {renderSortIcon('status')}
              </th>
              <th className="hidden lg:table-cell text-xs sm:text-sm">Bot Egasi</th>
              <th
                className="cursor-pointer hover:text-indigo-600 select-none hidden md:table-cell text-xs sm:text-sm"
                onClick={() => handleSort('created_at')}
              >
                Sana {renderSortIcon('created_at')}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={`${user.user_id}-${user.id}`} className="table-row">
                <td className="font-mono text-slate-500 text-xs">{user.user_id}</td>
                <td className="font-medium text-slate-800 text-sm hidden sm:table-cell">{user.name || '—'}</td>
                <td className="text-slate-600 text-xs sm:text-sm">
                  {user.username ? `@${user.username}` : '—'}
                </td>
                <td className="text-slate-500 text-xs hidden md:table-cell">{user.duration || '—'}</td>
                <td className="text-xs sm:text-sm">
                  <span className={`font-semibold ${
                    user.balance > 0 ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {user.balance?.toLocaleString()} so'm
                  </span>
                </td>
                <td className="text-xs sm:text-sm">
                  <span className={`badge text-xs ${
                    user.status === 'active' ? 'badge-success' :
                    user.status === 'removed' ? 'badge-danger' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.status === 'active' && <HiOutlineCheckCircle className="w-2.5 h-2.5" />}
                    {user.status === 'removed' && <HiOutlineXCircle className="w-2.5 h-2.5" />}
                    {user.status === 'active' ? 'Faol' :
                     user.status === 'removed' ? 'Chiqarilgan' :
                     user.status === 'free' ? 'Free' : user.status}
                  </span>
                </td>
                <td className="text-xs hidden lg:table-cell">
                  {user.bot_owner_username ? (
                    <span className="text-purple-600 font-medium">@{user.bot_owner_username}</span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="text-slate-400 text-xs hidden md:table-cell">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('uz-UZ') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && !searchLoading && (
          <div className="text-center py-8 text-slate-500">
            <HiOutlineUserCircle className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            {search || ownerSearch || statusFilter
              ? 'Qidiruv bo\'yicha userlar topilmadi'
              : 'Userlar topilmadi'}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm text-slate-500">
              Sahifa {pagination.page} / {pagination.totalPages}
              <span className="text-slate-400 ml-2">• {pagination.total} ta user</span>
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50"
              >
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              {(() => {
                const pages = []
                const total = pagination.totalPages
                const current = page
                let start = Math.max(1, current - 2)
                let end = Math.min(total, current + 2)

                if (start > 1) {
                  pages.push(
                    <button key={1} onClick={() => setPage(1)}
                      className="btn-secondary text-xs min-w-[32px]">1</button>
                  )
                  if (start > 2) pages.push(<span key="ds" className="text-slate-300 px-1">...</span>)
                }

                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button key={i} onClick={() => setPage(i)}
                      className={`text-xs min-w-[32px] ${i === current ? 'btn-primary' : 'btn-secondary'}`}>
                      {i}
                    </button>
                  )
                }

                if (end < total) {
                  if (end < total - 1) pages.push(<span key="de" className="text-slate-300 px-1">...</span>)
                  pages.push(
                    <button key={total} onClick={() => setPage(total)}
                      className="btn-secondary text-xs min-w-[32px]">{total}</button>
                  )
                }

                return pages
              })()}

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
    </div>
  )
}

export default Users

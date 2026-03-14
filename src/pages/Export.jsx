import {
  exportAllData,
  exportClients,
  exportUsers,
  exportBots,
  exportDeletedBots,
  exportTransactions,
  exportSpendings
} from '../services/api'
import {
  HiOutlineDownload,
  HiOutlineDatabase,
  HiOutlineUsers,
  HiOutlineUserCircle,
  HiOutlineCube,
  HiOutlineTrash,
  HiOutlineCreditCard,
  HiOutlineTrendingDown
} from 'react-icons/hi'

function Export() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2">
        <HiOutlineDownload className="w-6 h-6 text-blue-600" />
        <h1 className="text-xl font-bold text-slate-800">Export</h1>
      </div>
      <p className="text-sm text-slate-500">Barcha ma'lumotlarni Excel formatida yuklab olish</p>

      {/* Individual Exports Grid */}
      <div className="grid grid-cols-3 gap-3">

        {/* Clients */}
        <div className="card-compact hover:shadow-md transition-all border-2 border-transparent hover:border-emerald-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <HiOutlineUsers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Clientlar</h3>
              <p className="text-xs text-slate-500">Bot egalarining ro'yxati</p>
            </div>
          </div>
          <button
            onClick={exportClients}
            className="btn-success w-full justify-center"
          >
            <HiOutlineDownload className="w-4 h-4" />
            Yuklab olish
          </button>
        </div>

        {/* Users */}
        <div className="card-compact hover:shadow-md transition-all border-2 border-transparent hover:border-purple-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <HiOutlineUserCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Userlar</h3>
              <p className="text-xs text-slate-500">Obunachlar ro'yxati</p>
            </div>
          </div>
          <button
            onClick={exportUsers}
            className="w-full px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-all font-medium flex items-center justify-center gap-1.5"
          >
            <HiOutlineDownload className="w-4 h-4" />
            Yuklab olish
          </button>
        </div>

        {/* Bots */}
        <div className="card-compact hover:shadow-md transition-all border-2 border-transparent hover:border-blue-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <HiOutlineCube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Botlar</h3>
              <p className="text-xs text-slate-500">Faol botlar ro'yxati</p>
            </div>
          </div>
          <button
            onClick={exportBots}
            className="btn-primary w-full justify-center"
          >
            <HiOutlineDownload className="w-4 h-4" />
            Yuklab olish
          </button>
        </div>

        {/* Deleted Bots */}
        <div className="card-compact hover:shadow-md transition-all border-2 border-transparent hover:border-red-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
              <HiOutlineTrash className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">O'chirilgan Botlar</h3>
              <p className="text-xs text-slate-500">Arxivlangan botlar</p>
            </div>
          </div>
          <button
            onClick={exportDeletedBots}
            className="btn-danger w-full justify-center"
          >
            <HiOutlineDownload className="w-4 h-4" />
            Yuklab olish
          </button>
        </div>

        {/* Transactions */}
        <div className="card-compact hover:shadow-md transition-all border-2 border-transparent hover:border-amber-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <HiOutlineCreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Tranzaksiyalar</h3>
              <p className="text-xs text-slate-500">To'lovlar tarixi</p>
            </div>
          </div>
          <button
            onClick={exportTransactions}
            className="btn-warning w-full justify-center"
          >
            <HiOutlineDownload className="w-4 h-4" />
            Yuklab olish
          </button>
        </div>

        {/* Spendings */}
        <div className="card-compact hover:shadow-md transition-all border-2 border-transparent hover:border-orange-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
              <HiOutlineTrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Sarflar</h3>
              <p className="text-xs text-slate-500">Xaridlar tarixi</p>
            </div>
          </div>
          <button
            onClick={exportSpendings}
            className="w-full px-3 py-1.5 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-all font-medium flex items-center justify-center gap-1.5"
          >
            <HiOutlineDownload className="w-4 h-4" />
            Yuklab olish
          </button>
        </div>

      </div>
    </div>
  )
}

export default Export

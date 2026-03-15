import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { HiOutlineLockClosed } from 'react-icons/hi'

function Login() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      const data = await res.json()

      if (data.success) {
        login(data.data.token, data.data.username)
      } else {
        setError(data.error || 'Kirish xatolik')
      }
    } catch (err) {
      setError('Serverga ulanib bo\'lmadi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30 mb-4">
            <HiOutlineLockClosed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Getolog Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Boshqaruv paneliga kirish</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 animate-fade-in">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 
                         text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/30
                         transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Kirilmoqda...
                </>
              ) : (
                'Kiresh'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          © 2026 Getolog Manager
        </p>
      </div>
    </div>
  )
}

export default Login

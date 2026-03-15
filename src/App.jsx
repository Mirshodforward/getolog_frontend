import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Bots from './pages/Bots'
import Users from './pages/Users'
import Transactions from './pages/Transactions'
import Spendings from './pages/Spendings'
import Export from './pages/Export'

function ProtectedRoute({ children }) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return children
}

function AppRoutes() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="bots" element={<Bots />} />
        <Route path="users" element={<Users />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="spendings" element={<Spendings />} />
        <Route path="export" element={<Export />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

import { useAuth } from './contexts/AuthContext'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'

function LoadingScreen() {
  return (
    <div className="fullscreen-center">
      <div className="spinner" />
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <Landing />
  return <Dashboard />
}

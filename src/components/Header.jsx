import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon, LogOut } from 'lucide-react'

export default function Header() {
  const { user, signOutUser } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="brand">
          <span className="brand-icon">💜</span>
          <span className="brand-name">SymptomTrack</span>
        </div>

        <div className="header-actions">
          <button
            className="theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user && (
            <div className="user-menu">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=8B5CF6&color=fff`}
                alt={user.displayName || 'User avatar'}
                className="avatar"
              />
              <span className="user-name">{user.displayName?.split(' ')[0]}</span>
              <button
                className="icon-btn"
                onClick={signOutUser}
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

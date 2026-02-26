import { useAuth } from '../contexts/AuthContext'
import { useSymptoms } from '../hooks/useSymptoms'
import Header from './Header'
import SymptomForm from './SymptomForm'
import SymptomChart from './SymptomChart'
import SymptomList from './SymptomList'
import { Activity } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const {
    symptoms, entries, loading,
    getOrCreateSymptom, addEntry,
    updateEntry, deleteEntry,
  } = useSymptoms(user?.uid)

  async function handleFormSubmit(symptomName, date, painLevel) {
    const symptom = await getOrCreateSymptom(symptomName)
    await addEntry(symptom.id, date, painLevel)
  }

  // Quick stats
  const recentEntries = entries.slice(0, 30)
  const avgPain = recentEntries.length
    ? (recentEntries.reduce((s, e) => s + e.painLevel, 0) / recentEntries.length).toFixed(1)
    : '—'
  const highestEntry = entries.reduce((max, e) => e.painLevel > (max?.painLevel ?? 0) ? e : max, null)
  const highestSymptom = highestEntry ? symptoms.find(s => s.id === highestEntry.symptomId) : null

  return (
    <div className="app-shell">
      <Header />

      <main className="dashboard">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading your data…</p>
          </div>
        ) : (
          <>
            {/* Welcome banner — first visit */}
            {entries.length === 0 && (
              <div className="welcome-banner">
                <Activity size={20} style={{ color: 'var(--purple)' }} />
                <div>
                  <strong>Welcome! Start by logging your first symptom below.</strong>
                  <p>Type a symptom name, pick a date, and rate your pain on a scale of 1–10.</p>
                </div>
              </div>
            )}

            {/* Stats strip */}
            {entries.length > 0 && (
              <div className="stats-strip">
                <div className="stat-card">
                  <span className="stat-val">{entries.length}</span>
                  <span className="stat-label">Total Entries</span>
                </div>
                <div className="stat-card">
                  <span className="stat-val">{symptoms.length}</span>
                  <span className="stat-label">Symptoms</span>
                </div>
                <div className="stat-card">
                  <span className="stat-val" style={{ color: 'var(--orange)' }}>{avgPain}</span>
                  <span className="stat-label">Avg Pain (30d)</span>
                </div>
                {highestSymptom && (
                  <div className="stat-card">
                    <span className="stat-val" style={{ color: highestSymptom.color, fontSize: '0.95rem' }}>
                      {highestSymptom.name}
                    </span>
                    <span className="stat-label">Highest ({highestEntry.painLevel}/10)</span>
                  </div>
                )}
              </div>
            )}

            {/* Top row: form */}
            <div className="dashboard-grid">
              <SymptomForm symptoms={symptoms} onSubmit={handleFormSubmit} />

              {/* Chart */}
              <div className="chart-col">
                <SymptomChart symptoms={symptoms} entries={entries} />
              </div>
            </div>

            {/* Entry list */}
            <SymptomList
              entries={entries}
              symptoms={symptoms}
              onUpdate={updateEntry}
              onDelete={deleteEntry}
            />
          </>
        )}
      </main>
    </div>
  )
}

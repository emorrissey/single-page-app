import { useState } from 'react'
import { format } from 'date-fns'
import { Trash2, Pencil, Check, X, ClipboardList } from 'lucide-react'

function toDate(ts) {
  if (!ts) return null
  if (ts.toDate) return ts.toDate()
  if (ts instanceof Date) return ts
  return new Date(ts)
}

function painColor(v) {
  if (v <= 3) return 'var(--teal)'
  if (v <= 6) return 'var(--orange)'
  return '#EF4444'
}

function PainBadge({ level }) {
  return (
    <span className="pain-badge" style={{ background: painColor(level) + '22', color: painColor(level) }}>
      {level}
    </span>
  )
}

function EntryRow({ entry, symptom, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [editLevel, setEditLevel] = useState(entry.painLevel)
  const [deleting, setDeleting] = useState(false)

  const d = toDate(entry.date)

  async function save() {
    await onUpdate(entry.id, { painLevel: Number(editLevel) })
    setEditing(false)
  }

  function cancel() {
    setEditLevel(entry.painLevel)
    setEditing(false)
  }

  async function handleDelete() {
    setDeleting(true)
    await onDelete(entry.id)
  }

  if (!symptom) return null

  return (
    <div className={`entry-row ${deleting ? 'entry-deleting' : ''}`}>
      {/* Symptom color bar */}
      <div className="entry-bar" style={{ background: symptom.color }} />

      {/* Left: symptom + date */}
      <div className="entry-main">
        <div className="entry-symptom-name" style={{ color: symptom.color }}>
          {symptom.name}
        </div>
        <div className="entry-date">
          {d ? format(d, 'MMM d, yyyy') : '—'}
        </div>
      </div>

      {/* Right: pain level edit or display */}
      <div className="entry-right">
        {editing ? (
          <div className="inline-edit">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={editLevel}
              onChange={e => setEditLevel(Number(e.target.value))}
              className="pain-slider pain-slider-sm"
              style={{ '--slider-pct': `${(editLevel - 1) / 9 * 100}%` }}
            />
            <span className="edit-level-num" style={{ color: painColor(editLevel) }}>
              {editLevel}
            </span>
            <button className="icon-btn icon-btn-green" onClick={save} aria-label="Save">
              <Check size={14} />
            </button>
            <button className="icon-btn" onClick={cancel} aria-label="Cancel">
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <PainBadge level={entry.painLevel} />
            <button
              className="icon-btn"
              onClick={() => { setEditLevel(entry.painLevel); setEditing(true) }}
              aria-label="Edit pain level"
              title="Edit pain level"
            >
              <Pencil size={14} />
            </button>
            <button
              className="icon-btn icon-btn-red"
              onClick={handleDelete}
              aria-label="Delete entry"
              title="Delete entry"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function SymptomList({ entries, symptoms, onUpdate, onDelete }) {
  const [filter, setFilter] = useState('all')

  const filteredEntries = filter === 'all'
    ? entries
    : entries.filter(e => e.symptomId === filter)

  return (
    <div className="list-card">
      <div className="list-card-header">
        <h2 className="card-title">
          <ClipboardList size={18} style={{ color: 'var(--teal)' }} />
          Entry Log
          <span className="entry-count">{entries.length}</span>
        </h2>

        {/* Filter by symptom */}
        {symptoms.length > 1 && (
          <div className="list-filter">
            <button
              className={`filter-btn ${filter === 'all' ? 'filter-btn-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {symptoms.map(s => (
              <button
                key={s.id}
                className={`filter-btn ${filter === s.id ? 'filter-btn-active' : ''}`}
                style={filter === s.id ? { '--filter-color': s.color } : {}}
                onClick={() => setFilter(s.id)}
              >
                <span className="filter-dot" style={{ background: s.color }} />
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredEntries.length === 0 ? (
        <div className="list-empty">
          <ClipboardList size={32} style={{ opacity: 0.2 }} />
          <p>No entries yet.</p>
          <p className="list-empty-sub">Use the form above to log your first symptom entry.</p>
        </div>
      ) : (
        <div className="entries-list">
          {filteredEntries.map(entry => (
            <EntryRow
              key={entry.id}
              entry={entry}
              symptom={symptoms.find(s => s.id === entry.symptomId)}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { useState, useMemo, useEffect } from 'react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts'
import {
  format, subDays, subMonths, startOfDay, startOfMonth,
  isSameDay, isSameMonth,
} from 'date-fns'
import { TrendingUp } from 'lucide-react'

const TIME_RANGES = [
  { key: 'day', label: 'Day', days: 1 },
  { key: 'week', label: 'Week', days: 7 },
  { key: 'month', label: 'Month', days: 30 },
  { key: 'year', label: 'Year', days: 365 },
]

function toDate(ts) {
  if (!ts) return null
  if (ts.toDate) return ts.toDate()
  if (ts instanceof Date) return ts
  return new Date(ts)
}

function buildChartData(entries, symptoms, timeRange) {
  const now = new Date()
  let buckets = []
  let getLabel = () => ''
  let matchBucket = () => false

  if (timeRange === 'day') {
    // Last 24 hours in 4-hour blocks (6 buckets)
    buckets = Array.from({ length: 6 }, (_, i) => {
      const blockStart = new Date(now)
      blockStart.setMinutes(0, 0, 0)
      blockStart.setHours(blockStart.getHours() - (5 - i) * 4)
      return blockStart
    })
    getLabel = (b) => format(b, 'HH:mm')
    matchBucket = (entryDate, bucket, idx) => {
      const blockEnd = idx < 5 ? buckets[idx + 1] : new Date(now.getTime() + 1)
      return entryDate >= bucket && entryDate < blockEnd
    }
  } else if (timeRange === 'week') {
    buckets = Array.from({ length: 7 }, (_, i) => startOfDay(subDays(now, 6 - i)))
    getLabel = (b) => format(b, 'EEE')
    matchBucket = (entryDate, bucket) => isSameDay(entryDate, bucket)
  } else if (timeRange === 'month') {
    // Every 3 days for past 30 days (10 buckets)
    buckets = Array.from({ length: 10 }, (_, i) => startOfDay(subDays(now, 27 - i * 3)))
    getLabel = (b) => format(b, 'MMM d')
    matchBucket = (entryDate, bucket, idx) => {
      const nextBucket = idx < 9 ? buckets[idx + 1] : new Date(now.getTime() + 86400000)
      return entryDate >= bucket && entryDate < nextBucket
    }
  } else {
    // year — monthly for past 12 months
    buckets = Array.from({ length: 12 }, (_, i) => startOfMonth(subMonths(now, 11 - i)))
    getLabel = (b) => format(b, 'MMM')
    matchBucket = (entryDate, bucket) => isSameMonth(entryDate, bucket)
  }

  // Build cutoff window
  const cutoff = timeRange === 'day'
    ? new Date(now.getTime() - 24 * 3600 * 1000)
    : startOfDay(subDays(now, TIME_RANGES.find(t => t.key === timeRange).days - 1))

  // Bucket entries per symptom
  return buckets.map((bucket, idx) => {
    const point = { label: getLabel(bucket) }
    for (const symptom of symptoms) {
      const matching = entries.filter(e => {
        const ed = toDate(e.date)
        if (!ed) return false
        if (ed < cutoff) return false
        return e.symptomId === symptom.id && matchBucket(ed, bucket, idx)
      })
      if (matching.length > 0) {
        const avg = matching.reduce((sum, e) => sum + e.painLevel, 0) / matching.length
        point[symptom.id] = Math.round(avg * 10) / 10
      }
    }
    return point
  })
}

const CustomTooltip = ({ active, payload, label, symptoms }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map(p => {
        const sym = symptoms.find(s => s.id === p.dataKey)
        return (
          <div key={p.dataKey} className="tooltip-row">
            <span className="tooltip-dot" style={{ background: p.color }} />
            <span>{sym?.name ?? p.dataKey}:</span>
            <strong>{p.value}</strong>
          </div>
        )
      })}
    </div>
  )
}

export default function SymptomChart({ symptoms, entries }) {
  const [timeRange, setTimeRange] = useState('week')
  const [visible, setVisible] = useState([])

  // Track which symptoms the user explicitly hid (must be declared before useEffect)
  const _hiddenRef = useMemo(() => new Set(), [])

  // Sync visible symptoms when new symptoms appear
  useEffect(() => {
    setVisible(prev => {
      const ids = symptoms.map(s => s.id)
      // Add any new ones; keep explicitly-hidden ones hidden
      const newIds = ids.filter(id => !prev.includes(id) && !_hiddenRef.has(id))
      return [...prev.filter(id => ids.includes(id)), ...newIds]
    })
  }, [symptoms, _hiddenRef])

  function toggleSymptom(id) {
    setVisible(prev => {
      if (prev.includes(id)) {
        _hiddenRef.add(id)
        return prev.filter(i => i !== id)
      } else {
        _hiddenRef.delete(id)
        return [...prev, id]
      }
    })
  }

  const chartData = useMemo(
    () => buildChartData(entries, symptoms, timeRange),
    [entries, symptoms, timeRange]
  )

  const hasData = chartData.some(pt =>
    symptoms.some(s => pt[s.id] !== undefined)
  )

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h2 className="card-title">
          <TrendingUp size={18} style={{ color: 'var(--purple)' }} />
          Pain Over Time
        </h2>
        <div className="time-range-tabs">
          {TIME_RANGES.map(r => (
            <button
              key={r.key}
              className={`range-tab ${timeRange === r.key ? 'range-tab-active' : ''}`}
              onClick={() => setTimeRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Symptom toggles */}
      {symptoms.length > 0 && (
        <div className="symptom-toggles">
          {symptoms.map(s => (
            <button
              key={s.id}
              className={`toggle-pill ${visible.includes(s.id) ? 'toggle-pill-on' : 'toggle-pill-off'}`}
              style={{ '--pill-color': s.color }}
              onClick={() => toggleSymptom(s.id)}
            >
              <span className="pill-dot" style={{ background: visible.includes(s.id) ? s.color : 'var(--text-muted)' }} />
              {s.name}
            </button>
          ))}
        </div>
      )}

      {!hasData || symptoms.length === 0 ? (
        <div className="chart-empty">
          <TrendingUp size={36} style={{ opacity: 0.2 }} />
          <p>No data for this period yet.</p>
          <p className="chart-empty-sub">Log an entry to see your trends here.</p>
        </div>
      ) : (
        <div className="chart-area">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip
                content={<CustomTooltip symptoms={symptoms} />}
                cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
              />
              {symptoms
                .filter(s => visible.includes(s.id))
                .map(s => (
                  <Line
                    key={s.id}
                    type="monotoneX"
                    dataKey={s.id}
                    name={s.name}
                    stroke={s.color}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: s.color, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: s.color, stroke: 'var(--bg-card)', strokeWidth: 2 }}
                    connectNulls={false}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

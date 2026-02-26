import { useState, useRef, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Plus, Calendar, Thermometer } from 'lucide-react'

export default function SymptomForm({ symptoms, onSubmit }) {
  const [symptomInput, setSymptomInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [painLevel, setPainLevel] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  const filtered = symptomInput.trim()
    ? symptoms.filter(s =>
        s.name.toLowerCase().includes(symptomInput.trim().toLowerCase())
      )
    : symptoms

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (
        suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectSuggestion = (name) => {
    setSymptomInput(name)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = symptomInput.trim()
    if (!name) return
    setSubmitting(true)
    try {
      await onSubmit(name, selectedDate, painLevel)
      setSymptomInput('')
      setPainLevel(5)
      setSelectedDate(new Date())
      setSuccessMsg('Entry logged!')
      setTimeout(() => setSuccessMsg(''), 2500)
    } finally {
      setSubmitting(false)
    }
  }

  // Pain level label
  const painLabel = (v) => {
    if (v <= 2) return 'Minimal'
    if (v <= 4) return 'Mild'
    if (v <= 6) return 'Moderate'
    if (v <= 8) return 'Severe'
    return 'Extreme'
  }

  const painColor = (v) => {
    if (v <= 3) return 'var(--teal)'
    if (v <= 6) return 'var(--orange)'
    return '#EF4444'
  }

  return (
    <div className="form-card">
      <div className="form-card-header">
        <h2 className="card-title">
          <Plus size={18} style={{ color: 'var(--purple)' }} />
          Log an Entry
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="symptom-form" autoComplete="off">
        {/* Symptom input */}
        <div className="form-group">
          <label className="form-label">Symptom</label>
          <div className="autocomplete-wrap">
            <input
              ref={inputRef}
              type="text"
              className="form-input"
              placeholder="e.g. Migraine, Back Pain, Fatigue…"
              value={symptomInput}
              onChange={e => { setSymptomInput(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              required
            />
            {showSuggestions && filtered.length > 0 && (
              <ul className="suggestions-list" ref={suggestionsRef}>
                {filtered.slice(0, 6).map(s => (
                  <li key={s.id} onMouseDown={() => selectSuggestion(s.name)}>
                    <span className="sug-dot" style={{ background: s.color }} />
                    {s.name}
                  </li>
                ))}
                {symptomInput.trim() && !symptoms.some(
                  s => s.name.toLowerCase() === symptomInput.trim().toLowerCase()
                ) && (
                  <li className="sug-new" onMouseDown={() => setShowSuggestions(false)}>
                    <Plus size={13} /> Add "{symptomInput.trim()}" as new symptom
                  </li>
                )}
              </ul>
            )}
          </div>
          {/* Existing symptom chips */}
          {symptoms.length > 0 && (
            <div className="symptom-chips">
              {symptoms.map(s => (
                <button
                  key={s.id}
                  type="button"
                  className={`chip ${symptomInput.toLowerCase() === s.name.toLowerCase() ? 'chip-active' : ''}`}
                  style={{ '--chip-color': s.color }}
                  onClick={() => { setSymptomInput(s.name); setShowSuggestions(false) }}
                >
                  <span className="chip-dot" style={{ background: s.color }} />
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date picker */}
        <div className="form-group">
          <label className="form-label">
            <Calendar size={14} style={{ color: 'var(--teal)' }} />
            &nbsp; Date
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            maxDate={new Date()}
            dateFormat="MMMM d, yyyy"
            className="form-input datepicker-input"
            wrapperClassName="datepicker-wrapper"
            calendarClassName="custom-calendar"
            showPopperArrow={false}
          />
        </div>

        {/* Pain level slider */}
        <div className="form-group">
          <label className="form-label">
            <Thermometer size={14} style={{ color: painColor(painLevel) }} />
            &nbsp; Pain Level &nbsp;
            <span className="pain-display" style={{ color: painColor(painLevel) }}>
              {painLevel} — {painLabel(painLevel)}
            </span>
          </label>
          <div className="slider-wrap">
            <span className="slider-endpoint">1</span>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={painLevel}
              onChange={e => setPainLevel(Number(e.target.value))}
              className="pain-slider"
              style={{ '--slider-pct': `${(painLevel - 1) / 9 * 100}%` }}
            />
            <span className="slider-endpoint">10</span>
          </div>
          <div className="slider-ticks">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                type="button"
                className={`tick-btn ${painLevel === n ? 'tick-active' : ''}`}
                style={{ color: n === painLevel ? painColor(n) : undefined }}
                onClick={() => setPainLevel(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {successMsg && <div className="success-msg">{successMsg}</div>}

        <button type="submit" className="btn-primary btn-submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Log Entry'}
        </button>
      </form>
    </div>
  )
}

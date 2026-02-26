import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Activity, TrendingUp, Smartphone, Shield, Sun, Moon, ChevronRight, CheckCircle } from 'lucide-react'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const features = [
  {
    icon: Activity,
    color: 'var(--purple)',
    title: 'Log in Seconds',
    desc: 'Pick a symptom, date, and pain level. Entries persist across all your devices instantly.',
  },
  {
    icon: TrendingUp,
    color: 'var(--orange)',
    title: 'Visualize Patterns',
    desc: 'Beautiful line charts reveal trends by day, week, month, or year — for every symptom.',
  },
  {
    icon: Smartphone,
    color: 'var(--teal)',
    title: 'Any Device, Anytime',
    desc: 'Sign in with Google and your data follows you — phone, tablet, or desktop.',
  },
  {
    icon: Shield,
    color: 'var(--purple)',
    title: 'Private & Secure',
    desc: 'Your health data belongs to you. Protected by Firebase security rules.',
  },
]

const steps = [
  { num: '01', title: 'Sign in with Google', desc: 'One click — no passwords to remember.' },
  { num: '02', title: 'Add your symptoms', desc: 'Name each symptom; they\'re saved automatically.' },
  { num: '03', title: 'Log entries daily', desc: 'Pick a date and rate your pain on a 1–10 scale.' },
  { num: '04', title: 'Spot the trends', desc: 'Toggle charts by time range and per symptom.' },
]

export default function Landing() {
  const { signInWithGoogle, error } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="brand">
            <span className="brand-icon">💜</span>
            <span className="brand-name">SymptomTrack</span>
          </div>
          <div className="nav-actions">
            <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="btn-primary btn-sm" onClick={signInWithGoogle}>
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Free to use &nbsp;·&nbsp; No credit card required
          </div>
          <h1 className="hero-title">
            Track Your Pain.<br />
            <span className="gradient-text">Understand Your Body.</span>
          </h1>
          <p className="hero-subtitle">
            A beautifully simple symptom journal. Log pain levels, spot patterns with
            interactive charts, and walk into every doctor's visit with real data.
          </p>

          {error && (
            <div className="error-banner">
              Sign-in failed: {error}
            </div>
          )}

          <div className="hero-cta">
            <button className="btn-google" onClick={signInWithGoogle}>
              <GoogleIcon />
              Continue with Google
            </button>
            <p className="hero-cta-note">
              <CheckCircle size={14} style={{ color: 'var(--teal)' }} />
              &nbsp;Takes 10 seconds &nbsp;·&nbsp; Your data syncs everywhere
            </p>
          </div>

          {/* Mini chart preview */}
          <div className="hero-preview">
            <div className="preview-card">
              <div className="preview-header">
                <span className="preview-label">Pain Levels This Week</span>
                <div className="preview-tabs">
                  <span className="preview-tab">Day</span>
                  <span className="preview-tab active-tab">Week</span>
                  <span className="preview-tab">Month</span>
                  <span className="preview-tab">Year</span>
                </div>
              </div>
              <div className="preview-chart">
                <svg viewBox="0 0 400 120" className="preview-svg">
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#F97316" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#14B8A6" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[20, 50, 80].map(y => (
                    <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1"/>
                  ))}
                  {/* Purple line - Migraine */}
                  <path d="M 20,90 C 75,85 100,40 135,35 S 200,60 240,45 S 310,20 380,30"
                    fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M 20,90 C 75,85 100,40 135,35 S 200,60 240,45 S 310,20 380,30 L 380,120 L 20,120 Z"
                    fill="url(#g1)"/>
                  {/* Orange line - Back Pain */}
                  <path d="M 20,70 C 75,65 110,75 150,60 S 215,50 250,65 S 315,55 380,50"
                    fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M 20,70 C 75,65 110,75 150,60 S 215,50 250,65 S 315,55 380,50 L 380,120 L 20,120 Z"
                    fill="url(#g2)"/>
                  {/* Teal line - Fatigue */}
                  <path d="M 20,50 C 75,55 100,80 145,75 S 210,85 260,70 S 320,75 380,80"
                    fill="none" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M 20,50 C 75,55 100,80 145,75 S 210,85 260,70 S 320,75 380,80 L 380,120 L 20,120 Z"
                    fill="url(#g3)"/>
                </svg>
              </div>
              <div className="preview-legend">
                <span className="legend-item"><span className="legend-dot" style={{background:'#8B5CF6'}}/> Migraine</span>
                <span className="legend-item"><span className="legend-dot" style={{background:'#F97316'}}/> Back Pain</span>
                <span className="legend-item"><span className="legend-dot" style={{background:'#14B8A6'}}/> Fatigue</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-inner">
          <p className="section-eyebrow">Everything you need</p>
          <h2 className="section-title">Built for people who live with pain</h2>
          <p className="section-subtitle">
            Simple enough for every day. Powerful enough for your specialist.
          </p>
          <div className="features-grid">
            {features.map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon-wrap" style={{ background: f.color + '20', color: f.color }}>
                  <f.icon size={22} />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div className="section-inner">
          <p className="section-eyebrow">Simple by design</p>
          <h2 className="section-title">Up and running in under a minute</h2>
          <div className="steps-grid">
            {steps.map((s) => (
              <div className="step-card" key={s.num}>
                <div className="step-num">{s.num}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">Start tracking today.</h2>
          <p className="cta-subtitle">Free forever. No setup. Just open and log.</p>
          <button className="btn-google btn-google-lg" onClick={signInWithGoogle}>
            <GoogleIcon />
            Get started with Google
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="brand">
            <span className="brand-icon">💜</span>
            <span className="brand-name">SymptomTrack</span>
          </div>
          <p className="footer-note">
            Made with care for people managing chronic conditions.
          </p>
        </div>
      </footer>
    </div>
  )
}

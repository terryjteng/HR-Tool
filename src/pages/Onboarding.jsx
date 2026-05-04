import { useState } from 'react'
import { ONBOARDING_PHASES, TEAMS } from '../data/studioData.js'
import { PageHeader, PageContent, Card, CardHeader, Button, EATrigger, Grid } from '../components/UI.jsx'
import styles from './Pages.module.css'

const DEPT_LABELS = {
  executive: 'Executive', design: 'Design', engineering: 'Engineering',
  art: 'Art', uiux: 'UI/UX', audio: 'Audio & Voice',
}

const OWNER_COLORS = {
  HR: 'purple', IT: 'blue', Manager: 'teal', Member: 'amber', Buddy: 'coral',
  'HR + Manager': 'purple', 'IT + HR': 'blue', 'Manager + HR': 'teal',
  'Creative Director': 'teal', 'Manager + Member': 'amber',
  'Creative Lead': 'teal', Lead: 'teal',
}

const PHASE_ICONS = { pre: '📋', day1: '🤝', week1: '🚀', day30: '✅' }

const EA_ACTIONS = {
  pre: 'Draft the pre-hire welcome package for a new Kato.8 Studios collaborator — Discord invite, Google Workspace setup instructions, and agreement bundle',
  day1: 'Create the Day 1 onboarding itinerary for a new Kato.8 Studios collaborator including all required agreements to execute',
  week1: 'Draft 30-60-90 day goals for a new creative collaborator at Kato.8 Studios',
  day30: 'Draft the 30-day check-in meeting agenda and experience survey for Kato.8 Studios',
}

function NewOnboardingModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '', role: '', dept: 'art', team: 'studio',
    lead: '', startDate: '', email: '',
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const valid = form.name.trim() && form.role.trim() && form.startDate

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>New Onboarding</div>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formRow}>
            <label>Full Name *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Jordan Lee"
            />
          </div>
          <div className={styles.formRow}>
            <label>Role / Title *</label>
            <input
              value={form.role}
              onChange={e => set('role', e.target.value)}
              placeholder="e.g. 2D Animator"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className={styles.formRow}>
              <label>Department</label>
              <select value={form.dept} onChange={e => set('dept', e.target.value)}>
                {Object.entries(DEPT_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className={styles.formRow}>
              <label>Project Team</label>
              <select value={form.team} onChange={e => set('team', e.target.value)}>
                {TEAMS.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <label>Reporting Lead</label>
            <input
              value={form.lead}
              onChange={e => set('lead', e.target.value)}
              placeholder="e.g. Chris C"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className={styles.formRow}>
              <label>Start Date *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => set('startDate', e.target.value)}
              />
            </div>
            <div className={styles.formRow}>
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
            <button
              className={styles.btnSubmit}
              disabled={!valid}
              onClick={() => { onAdd(form); onClose() }}
            >
              Start Onboarding
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Onboarding() {
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [activePhase, setActivePhase] = useState('pre')
  const [showNewModal, setShowNewModal] = useState(false)

  const addSession = form => {
    const s = { id: Date.now(), ...form, checked: {} }
    setSessions(p => [...p, s])
    setActiveSessionId(s.id)
    setActivePhase('pre')
  }

  const session = sessions.find(s => s.id === activeSessionId)
  const checked = session?.checked || {}

  const toggle = id => setSessions(p =>
    p.map(s => s.id === activeSessionId
      ? { ...s, checked: { ...s.checked, [id]: !s.checked[id] } }
      : s
    )
  )

  const phase = ONBOARDING_PHASES.find(p => p.id === activePhase)
  const allTasks = ONBOARDING_PHASES.flatMap(p => p.tasks)
  const doneCount = session ? allTasks.filter(t => checked[t.id]).length : 0
  const pct = session ? Math.round(doneCount / allTasks.length * 100) : 0

  const dayNum = session?.startDate
    ? Math.max(1, Math.floor((Date.now() - new Date(session.startDate).getTime()) / 86400000) + 1)
    : null

  return (
    <>
      {showNewModal && (
        <NewOnboardingModal onClose={() => setShowNewModal(false)} onAdd={addSession} />
      )}
      <PageHeader
        title="Onboarding"
        subtitle={session
          ? `Currently onboarding: ${session.name} (${session.role})`
          : 'No active onboarding sessions'}
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowNewModal(true)}>
            + New onboarding
          </Button>
        }
      />
      <PageContent>
        {sessions.length > 1 && (
          <div className={styles.tabBar} style={{ marginBottom: 0 }}>
            {sessions.map(s => (
              <button
                key={s.id}
                className={`${styles.tab} ${activeSessionId === s.id ? styles.tabActive : ''}`}
                onClick={() => { setActiveSessionId(s.id); setActivePhase('pre') }}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}

        {!session ? (
          <Card>
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🤝</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
                No active onboarding sessions
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
                Click "+ New onboarding" to start the process for a new collaborator.
              </div>
              <Button variant="primary" size="md" onClick={() => setShowNewModal(true)}>
                + New onboarding
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className={styles.tabBar}>
              {ONBOARDING_PHASES.map(p => (
                <button
                  key={p.id}
                  className={`${styles.tab} ${activePhase === p.id ? styles.tabActive : ''}`}
                  onClick={() => setActivePhase(p.id)}
                >
                  {PHASE_ICONS[p.id]} {p.label}
                </button>
              ))}
            </div>

            <Card>
              <CardHeader title={phase.title} />
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                {phase.desc}
              </p>
              <Grid cols={2}>
                {phase.tasks.map(task => {
                  const isDone = !!checked[task.id]
                  const ownerColor = OWNER_COLORS[task.owner] || 'default'
                  return (
                    <div
                      key={task.id}
                      className={`${styles.obTask} ${isDone ? styles.obDone : ''}`}
                      onClick={() => toggle(task.id)}
                    >
                      <div className={styles.obTaskHeader}>
                        <div className={styles.obIcon} style={{ background: 'var(--bg-secondary)' }}>📌</div>
                        <div className={styles.obTaskTitle}>{task.title}</div>
                        <button
                          className={`${styles.obCheck} ${isDone ? styles.obChecked : ''}`}
                          onClick={e => { e.stopPropagation(); toggle(task.id) }}
                          aria-label={`Toggle ${task.title}`}
                        />
                      </div>
                      <div className={styles.obTaskDesc}>{task.desc}</div>
                      <span className={`${styles.obOwner} ${styles['own-' + ownerColor]}`}>
                        {task.owner}
                      </span>
                    </div>
                  )
                })}
              </Grid>
              <EATrigger
                label={`EA Agent: ${EA_ACTIONS[activePhase]?.slice(0, 80)}…`}
                prompt={`${EA_ACTIONS[activePhase]} — for ${session.name}, ${session.role}`}
              />
            </Card>

            <div className={styles.progressSection}>
              <span>{session.name} · onboarding progress</span>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${pct}%` }} />
              </div>
              <span className={styles.progressPct}>{pct}%</span>
              {dayNum !== null && (
                <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>
                  Day {dayNum} of 30
                </span>
              )}
            </div>
          </>
        )}
      </PageContent>
    </>
  )
}

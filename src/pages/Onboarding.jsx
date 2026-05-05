import { useState } from 'react'
import { ONBOARDING_PHASES, TEAMS } from '../data/studioData.js'
import { PageHeader, PageContent, Card, CardHeader, Button, EATrigger, Grid } from '../components/UI.jsx'
import styles from './Pages.module.css'

const API = 'http://localhost:3001'

const DEPT_LABELS = {
  executive:'Executive', design:'Design', engineering:'Engineering',
  art:'Art', uiux:'UI/UX', audio:'Audio & Voice',
}
const OWNER_COLORS = {
  HR:'purple', IT:'blue', Manager:'teal', Member:'amber', Buddy:'coral',
  'HR + Manager':'purple', 'IT + HR':'blue', 'Manager + HR':'teal',
  'Creative Director':'teal', 'Manager + Member':'amber', 'Creative Lead':'teal', Lead:'teal',
}
const PHASE_ICONS = { pre:'📋', day1:'🤝', week1:'🚀', day30:'✅' }

const EA_ACTIONS = {
  pre: 'Draft the pre-hire welcome package for a new Kato.8 Studios collaborator — Discord invite, Google Workspace setup, and agreement bundle',
  day1: 'Create the Day 1 onboarding itinerary for a new Kato.8 Studios collaborator including all required agreements',
  week1: 'Draft 30-60-90 day goals for a new creative collaborator at Kato.8 Studios',
  day30: 'Draft the 30-day check-in meeting agenda and experience survey for Kato.8 Studios',
}

// ─── New Onboarding Modal ─────────────────────────────────────────────────────

function NewOnboardingModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name:'', role:'', dept:'art', team:'studio', lead:'', startDate:'', email:'', revenueSharePct:'',
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
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Jordan Lee" />
          </div>
          <div className={styles.formRow}>
            <label>Role / Title *</label>
            <input value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. 2D Animator" />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className={styles.formRow}>
              <label>Department</label>
              <select value={form.dept} onChange={e => set('dept', e.target.value)}>
                {Object.entries(DEPT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className={styles.formRow}>
              <label>Project Team</label>
              <select value={form.team} onChange={e => set('team', e.target.value)}>
                {TEAMS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div className={styles.formRow}>
              <label>Start Date *</label>
              <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
            </div>
            <div className={styles.formRow}>
              <label>Revenue Share %</label>
              <input value={form.revenueSharePct} onChange={e => set('revenueSharePct', e.target.value)} placeholder="e.g. 5" />
            </div>
          </div>
          <div className={styles.formRow}>
            <label>Reporting Lead</label>
            <input value={form.lead} onChange={e => set('lead', e.target.value)} placeholder="e.g. Chris C" />
          </div>
          <div className={styles.formRow}>
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
            <button className={styles.btnSubmit} disabled={!valid} onClick={() => { onAdd(form); onClose() }}>
              Start Onboarding
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Welcome Package Modal ────────────────────────────────────────────────────

function WelcomePackageModal({ session, packageData, onClose }) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const portalUrl = `${API}/onboard/${packageData.token}`

  const emailText =
`Hi ${session.name},

Welcome to Kato.8 Studios! We're thrilled to have you joining as ${session.role}${session.team ? ` on the ${TEAMS.find(t => t.id === session.team)?.label || session.team} team` : ''}.

To complete your onboarding, please use the personalized portal link below. You'll be guided through:

  1. Signing your agreements (Revenue Share, IP Assignment, NDA)
  2. Joining our Discord server and getting your role
  3. Reading the welcome material
  4. Getting added to your team meetings

Your onboarding portal: ${portalUrl}

If you have any questions, reach out to Terry Teng at terryt@kato8studios.com or on Discord.

Welcome to the team — we're excited to build together!

— Terry & the Kato.8 crew`

  const copy = (text, setFn) => {
    navigator.clipboard.writeText(text)
    setFn(true)
    setTimeout(() => setFn(false), 2500)
  }

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} style={{ width: 520 }}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>Welcome Package — {session.name}</div>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          <div style={{ background:'var(--k8-teal-light)', borderRadius:'var(--radius-md)', padding:'12px 14px', fontSize:12, color:'var(--k8-teal)', lineHeight:1.6 }}>
            <strong>✓ Package ready.</strong> Revenue Share Agreement, IP Assignment, and NDA were automatically created and linked to the portal. The new hire signs directly in their browser.
          </div>

          <div className={styles.formRow}>
            <label>Onboarding Portal Link</label>
            <div className={styles.signLinkRow}>
              <input readOnly value={portalUrl} className={styles.signLinkInput} />
              <button className={styles.signCopyBtn} onClick={() => copy(portalUrl, setCopiedLink)}>
                {copiedLink ? '✓' : 'Copy'}
              </button>
              <button className={styles.signCopyBtn} style={{ background:'var(--bg-secondary)', color:'var(--k8-accent)', border:'0.5px solid var(--k8-accent)' }} onClick={() => window.open(portalUrl, '_blank')}>
                Open ↗
              </button>
            </div>
          </div>

          <div className={styles.formRow}>
            <label>Welcome Email — copy and paste into Gmail / Mail</label>
            <textarea
              readOnly
              value={emailText}
              rows={11}
              style={{ width:'100%', fontSize:12, resize:'none', fontFamily:'inherit', lineHeight:1.7, background:'var(--bg-secondary)', borderRadius:'var(--radius-md)', padding:'10px 12px', border:'0.5px solid var(--border-medium)' }}
            />
          </div>

          <div className={styles.modalFooter}>
            <button className={styles.btnCancel} onClick={onClose}>Close</button>
            <button className={styles.btnSubmit} onClick={() => copy(emailText, setCopiedEmail)}>
              {copiedEmail ? '✓ Copied!' : 'Copy email text'}
            </button>
            <a
              href={`mailto:${session.email || ''}?subject=Welcome to Kato.8 Studios — Your Onboarding Portal&body=${encodeURIComponent(emailText)}`}
              style={{ textDecoration:'none' }}
            >
              <button className={styles.btnSubmit} style={{ background:'var(--k8-teal)' }}>
                Open in Mail →
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Onboarding() {
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [activePhase, setActivePhase] = useState('pre')
  const [showNewModal, setShowNewModal] = useState(false)
  const [packageData, setPackageData] = useState({})   // { [sessionId]: serverData }
  const [showPackage, setShowPackage] = useState(false)
  const [creatingPkg, setCreatingPkg] = useState(false)

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

  const currentPkg = session ? packageData[session.id] : null

  const createWelcomePackage = async () => {
    if (!session) return
    setCreatingPkg(true)
    try {
      const res = await fetch(`${API}/api/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: session.name,
          role: session.role,
          email: session.email || '',
          dept: session.dept || 'art',
          team: session.team || 'studio',
          lead: session.lead || '',
          startDate: session.startDate || '',
          revenueSharePct: session.revenueSharePct || '',
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setPackageData(p => ({ ...p, [session.id]: data }))
        setShowPackage(true)
      }
    } finally {
      setCreatingPkg(false)
    }
  }

  return (
    <>
      {showNewModal && (
        <NewOnboardingModal onClose={() => setShowNewModal(false)} onAdd={addSession} />
      )}
      {showPackage && session && currentPkg && (
        <WelcomePackageModal
          session={session}
          packageData={currentPkg}
          onClose={() => setShowPackage(false)}
        />
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
          <div className={styles.tabBar} style={{ marginBottom:0 }}>
            {sessions.map(s => (
              <button
                key={s.id}
                className={`${styles.tab} ${activeSessionId===s.id?styles.tabActive:''}`}
                onClick={() => { setActiveSessionId(s.id); setActivePhase('pre') }}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}

        {!session ? (
          <Card>
            <div style={{ textAlign:'center', padding:'48px 20px' }}>
              <div style={{ fontSize:36, marginBottom:12 }}>🤝</div>
              <div style={{ fontSize:14, fontWeight:500, color:'var(--text-primary)', marginBottom:6 }}>
                No active onboarding sessions
              </div>
              <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:20, lineHeight:1.6 }}>
                Click "+ New onboarding" to start the process for a new collaborator.
              </div>
              <Button variant="primary" size="md" onClick={() => setShowNewModal(true)}>
                + New onboarding
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Welcome package send card */}
            <Card>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ fontSize:24 }}>📬</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:'var(--text-primary)' }}>
                    Welcome Package for {session.name}
                  </div>
                  <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2, lineHeight:1.5 }}>
                    {currentPkg
                      ? 'Onboarding portal created — signing agreements auto-generated and ready.'
                      : 'Auto-creates Revenue Share, IP Assignment, and NDA — then generates a personalized onboarding portal link to email.'}
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  {currentPkg && (
                    <Button variant="default" size="sm" onClick={() => setShowPackage(true)}>
                      View link
                    </Button>
                  )}
                  <Button
                    variant={currentPkg ? 'ghost' : 'primary'}
                    size="sm"
                    onClick={currentPkg ? () => setShowPackage(true) : createWelcomePackage}
                    disabled={creatingPkg}
                  >
                    {creatingPkg ? 'Creating…' : currentPkg ? '✓ Package sent' : 'Send Welcome Package'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Phase tabs */}
            <div className={styles.tabBar}>
              {ONBOARDING_PHASES.map(p => (
                <button
                  key={p.id}
                  className={`${styles.tab} ${activePhase===p.id?styles.tabActive:''}`}
                  onClick={() => setActivePhase(p.id)}
                >
                  {PHASE_ICONS[p.id]} {p.label}
                </button>
              ))}
            </div>

            <Card>
              <CardHeader title={phase.title} />
              <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:16, lineHeight:1.6 }}>
                {phase.desc}
              </p>
              <Grid cols={2}>
                {phase.tasks.map(task => {
                  const isDone = !!checked[task.id]
                  const ownerColor = OWNER_COLORS[task.owner] || 'default'
                  return (
                    <div
                      key={task.id}
                      className={`${styles.obTask} ${isDone?styles.obDone:''}`}
                      onClick={() => toggle(task.id)}
                    >
                      <div className={styles.obTaskHeader}>
                        <div className={styles.obIcon} style={{ background:'var(--bg-secondary)' }}>📌</div>
                        <div className={styles.obTaskTitle}>{task.title}</div>
                        <button
                          className={`${styles.obCheck} ${isDone?styles.obChecked:''}`}
                          onClick={e => { e.stopPropagation(); toggle(task.id) }}
                          aria-label={`Toggle ${task.title}`}
                        />
                      </div>
                      <div className={styles.obTaskDesc}>{task.desc}</div>
                      <span className={`${styles.obOwner} ${styles['own-' + ownerColor]}`}>{task.owner}</span>
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
                <div className={styles.progressFill} style={{ width:`${pct}%` }} />
              </div>
              <span className={styles.progressPct}>{pct}%</span>
              {dayNum !== null && (
                <span style={{ color:'var(--text-secondary)', marginLeft:8 }}>Day {dayNum} of 30</span>
              )}
            </div>
          </>
        )}
      </PageContent>
    </>
  )
}

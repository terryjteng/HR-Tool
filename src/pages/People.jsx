import { useState } from 'react'
import { TEAM, TEAMS } from '../data/studioData.js'
import { PageHeader, PageContent, Card, Avatar, Tag, Button, StatusBadge } from '../components/UI.jsx'
import ProfileModal from '../components/ProfileModal.jsx'
import styles from './Pages.module.css'

const AVATAR_COLORS = ['purple', 'teal', 'amber', 'coral', 'blue', 'purple']
const DEPT_COLORS  = { executive:'purple', design:'teal', engineering:'blue', art:'amber', uiux:'purple', audio:'coral' }
const DEPT_LABELS  = { executive:'Executive', design:'Design', engineering:'Engineering', art:'Art', uiux:'UI/UX', audio:'Audio & Voice' }
const TEAM_COLORS  = { studio:'purple', 'last-light':'teal', corebound:'blue', 'big-boss-cleanup':'amber' }
const DEPTS = ['executive','design','engineering','art','uiux','audio']

function AddMemberModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name:'', role:'', dept:'design', location:'', status:'active', type:'revenue-share', team:'studio' })
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }))
  const submit = e => {
    e.preventDefault()
    const words = form.name.trim().split(' ').filter(Boolean)
    const initials = words.length >= 2
      ? (words[0][0] + words[words.length-1][0]).toUpperCase()
      : form.name.slice(0, 2).toUpperCase()
    onAdd({ id:`tm-${Date.now()}`, name:form.name.trim(), initials, role:form.role.trim(), dept:form.dept, location:form.location.trim(), status:form.status, type:form.type, team:form.team })
    onClose()
  }
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>Add team member</div>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>
        <form onSubmit={submit} className={styles.modalBody}>
          <div className={styles.formRow}><label>Full name</label><input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Jamie Chen" autoFocus /></div>
          <div className={styles.formRow}><label>Role / title</label><input required value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. Motion Designer" /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className={styles.formRow}>
              <label>Department</label>
              <select value={form.dept} onChange={e => set('dept', e.target.value)}>
                {DEPTS.map(d => <option key={d} value={d}>{DEPT_LABELS[d]}</option>)}
              </select>
            </div>
            <div className={styles.formRow}>
              <label>Project team</label>
              <select value={form.team} onChange={e => set('team', e.target.value)}>
                {TEAMS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div className={styles.formRow}>
              <label>Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="revenue-share">Revenue share</option>
                <option value="intern">Intern</option>
              </select>
            </div>
            <div className={styles.formRow}>
              <label>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="onboarding">Onboarding</option>
              </select>
            </div>
          </div>
          <div className={styles.formRow}><label>Location</label><input required value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Los Angeles, CA or Remote" /></div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnSubmit}>Add member</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function People() {
  const [viewMode, setViewMode] = useState('dept')
  const [deptFilter, setDeptFilter] = useState('all')
  const [teamFilter, setTeamFilter] = useState('all')
  const [team, setTeam] = useState(TEAM)
  const [showAdd, setShowAdd] = useState(false)
  const [profileTarget, setProfileTarget] = useState(null)

  const filtered = team.filter(m => {
    if (viewMode === 'dept' && deptFilter !== 'all' && m.dept !== deptFilter) return false
    if (viewMode === 'team' && teamFilter !== 'all' && m.team !== teamFilter) return false
    return true
  })
  const internCount  = team.filter(m => m.type === 'intern').length
  const revenueCount = team.filter(m => m.type === 'revenue-share').length

  const addMember = member => setTeam(p => [...p, member])

  const openProfile = (m, i) => setProfileTarget({ member: m, avatarIdx: i })

  const handleProfileSave = updated => {
    setTeam(p => p.map(m => m.id === updated.id ? { ...m, ...updated } : m))
    setProfileTarget(null)
  }

  const renderMemberCard = (m, i) => (
    <div
      key={m.id}
      className={`${styles.memberCard} ${styles.memberCardClickable}`}
      onClick={() => openProfile(m, i)}
      title="Click to view profile"
    >
      <Avatar initials={m.initials} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} size="lg" />
      <div className={styles.memberInfo}>
        <div className={styles.memberName}>{m.name}</div>
        <div className={styles.memberMeta}>{m.role}{m.location ? ` · ${m.location}` : ''}</div>
        <div className={styles.memberTags}>
          <Tag color={DEPT_COLORS[m.dept] || 'default'}>{DEPT_LABELS[m.dept] || m.dept}</Tag>
          {m.team && <Tag color={TEAM_COLORS[m.team] || 'default'}>{TEAMS.find(t => t.id === m.team)?.label || m.team}</Tag>}
          {m.type === 'intern' ? <Tag color="purple">Intern</Tag> : <Tag color="blue">Rev share</Tag>}
          <StatusBadge status={m.status} />
        </div>
      </div>
      <div style={{ fontSize:11, color:'var(--text-tertiary)', flexShrink:0 }}>View →</div>
    </div>
  )

  return (
    <>
      <PageHeader
        title="People"
        subtitle={`${team.length} collaborators · ${revenueCount} revenue share · ${internCount} interns`}
        actions={<Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>+ Add member</Button>}
      />
      <PageContent>
        <div className={styles.viewToggleBar}>
          <div className={styles.viewToggleGroup}>
            <button className={`${styles.viewToggleBtn} ${viewMode==='dept'?styles.viewToggleActive:''}`} onClick={() => setViewMode('dept')}>By Department</button>
            <button className={`${styles.viewToggleBtn} ${viewMode==='team'?styles.viewToggleActive:''}`} onClick={() => setViewMode('team')}>By Project Team</button>
          </div>
        </div>

        {viewMode === 'dept' && (
          <>
            <div className={styles.tabBar}>
              <button className={`${styles.tab} ${deptFilter==='all'?styles.tabActive:''}`} onClick={() => setDeptFilter('all')}>
                All ({team.length})
              </button>
              {DEPTS.map(f => {
                const count = team.filter(m => m.dept === f).length
                return (
                  <button key={f} className={`${styles.tab} ${deptFilter===f?styles.tabActive:''}`} onClick={() => setDeptFilter(f)}>
                    {DEPT_LABELS[f]} {count > 0 && `(${count})`}
                  </button>
                )
              })}
            </div>
            <Card>
              {filtered.length === 0
                ? <div style={{ padding:'24px 0', textAlign:'center', color:'var(--text-secondary)', fontSize:13 }}>No members in this department.</div>
                : filtered.map((m, i) => renderMemberCard(m, i))}
            </Card>
          </>
        )}

        {viewMode === 'team' && (
          <>
            <div className={styles.tabBar}>
              <button className={`${styles.tab} ${teamFilter==='all'?styles.tabActive:''}`} onClick={() => setTeamFilter('all')}>
                All ({team.length})
              </button>
              {TEAMS.map(t => {
                const count = team.filter(m => m.team === t.id).length
                return (
                  <button key={t.id} className={`${styles.tab} ${teamFilter===t.id?styles.tabActive:''}`} onClick={() => setTeamFilter(t.id)}>
                    {t.label} {count > 0 && `(${count})`}
                  </button>
                )
              })}
            </div>
            {teamFilter === 'all' ? (
              TEAMS.map(t => {
                const members = team.filter(m => m.team === t.id)
                if (!members.length) return null
                return (
                  <div key={t.id} className={styles.teamGroupSection}>
                    <div className={styles.teamGroupHeader}>
                      <span className={styles.teamGroupIcon}>{t.icon}</span>
                      <span className={styles.teamGroupLabel}>{t.label}</span>
                      <span className={styles.teamGroupCount}>{members.length} members</span>
                      <div className={styles.teamGroupDesc}>{t.desc}</div>
                    </div>
                    <Card>
                      {members.map((m, i) => renderMemberCard(m, i))}
                    </Card>
                  </div>
                )
              })
            ) : (
              <Card>
                {filtered.length === 0
                  ? <div style={{ padding:'24px 0', textAlign:'center', color:'var(--text-secondary)', fontSize:13 }}>No members on this team.</div>
                  : filtered.map((m, i) => renderMemberCard(m, i))}
              </Card>
            )}
          </>
        )}
      </PageContent>

      {showAdd && <AddMemberModal onClose={() => setShowAdd(false)} onAdd={addMember} />}
      {profileTarget && (
        <ProfileModal
          member={profileTarget.member}
          avatarIdx={profileTarget.avatarIdx}
          onClose={() => setProfileTarget(null)}
          onSave={handleProfileSave}
        />
      )}
    </>
  )
}

import { useState } from 'react'
import { TEAMS } from '../data/studioData.js'
import { saveProfile, getProfile } from '../data/profiles.js'
import { Avatar, Tag, Button } from './UI.jsx'
import styles from '../pages/Pages.module.css'

const AVATAR_COLORS = ['purple', 'teal', 'amber', 'coral', 'blue', 'purple']
const DEPT_COLORS = { executive:'purple', design:'teal', engineering:'blue', art:'amber', uiux:'purple', audio:'coral' }
const DEPT_LABELS = { executive:'Executive', design:'Design', engineering:'Engineering', art:'Art', uiux:'UI/UX', audio:'Audio & Voice' }
const TEAM_COLORS = { studio:'purple', 'last-light':'teal', corebound:'blue', 'big-boss-cleanup':'amber' }
const DEPTS = ['executive','design','engineering','art','uiux','audio']
const TIMEZONES = ['PT (UTC-8)','MT (UTC-7)','CT (UTC-6)','ET (UTC-5)','GMT (UTC+0)','BST (UTC+1)','IST (UTC+5:30)','JST (UTC+9)','AEST (UTC+10)']
const STATUSES = ['active','onboarding','on-leave','former']

export default function ProfileModal({ member, avatarIdx = 0, onClose, onSave }) {
  const saved = getProfile(member.id)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    role:         saved.role         ?? member.role    ?? '',
    dept:         saved.dept         ?? member.dept    ?? 'art',
    team:         saved.team         ?? member.team    ?? 'studio',
    location:     saved.location     ?? member.location ?? '',
    type:         saved.type         ?? member.type    ?? 'revenue-share',
    memberStatus: saved.memberStatus ?? member.status  ?? 'active',
    isCurrent:    saved.isCurrent    !== false,
    timezone:     saved.timezone     ?? '',
    email:        saved.email        ?? '',
    discord:      saved.discord      ?? '',
    startDate:    saved.startDate    ?? '',
    notes:        saved.notes        ?? '',
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = () => {
    saveProfile(member.id, { ...form })
    onSave?.({ ...member, ...form, status: form.memberStatus })
    setEditing(false)
  }

  const avColor = AVATAR_COLORS[avatarIdx % AVATAR_COLORS.length]

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.profileModal}>
        {/* Header */}
        <div className={styles.profileHeaderBar}>
          <Avatar initials={member.initials} color={avColor} size="lg" />
          <div style={{ flex: 1 }}>
            <div className={styles.profileName}>{member.name}</div>
            <div className={styles.profileRole}>{form.role}</div>
            <div style={{ display:'flex', gap:6, marginTop:6, flexWrap:'wrap' }}>
              <Tag color={DEPT_COLORS[form.dept] || 'default'}>{DEPT_LABELS[form.dept] || form.dept}</Tag>
              <Tag color={TEAM_COLORS[form.team] || 'default'}>{TEAMS.find(t => t.id === form.team)?.label || form.team}</Tag>
              {form.type === 'intern' ? <Tag color="purple">Intern</Tag> : <Tag color="blue">Rev share</Tag>}
              <Tag color={form.isCurrent ? 'green' : 'default'}>{form.isCurrent ? 'Current member' : 'Former member'}</Tag>
            </div>
          </div>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>

        {!editing ? (
          <>
            <div className={styles.profileBody}>
              <div className={styles.profileGrid}>
                {[
                  ['Email',      form.email],
                  ['Discord',    form.discord],
                  ['Location',   form.location],
                  ['Time zone',  form.timezone],
                  ['Start date', form.startDate],
                  ['Status',     form.memberStatus],
                ].map(([label, val]) => (
                  <div key={label} className={styles.profileField}>
                    <div className={styles.profileFieldLabel}>{label}</div>
                    <div className={styles.profileFieldVal}>{val || '—'}</div>
                  </div>
                ))}
              </div>
              {form.notes && (
                <div className={styles.profileNotes}>{form.notes}</div>
              )}
            </div>
            <div className={styles.profileFooter}>
              <Button variant="primary" size="sm" onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.profileBody}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className={styles.formRow}>
                  <label>Role / Title</label>
                  <input value={form.role} onChange={e => set('role', e.target.value)} />
                </div>
                <div className={styles.formRow}>
                  <label>Department</label>
                  <select value={form.dept} onChange={e => set('dept', e.target.value)}>
                    {DEPTS.map(d => <option key={d} value={d}>{DEPT_LABELS[d]}</option>)}
                  </select>
                </div>
                <div className={styles.formRow}>
                  <label>Project Team</label>
                  <select value={form.team} onChange={e => set('team', e.target.value)}>
                    {TEAMS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div className={styles.formRow}>
                  <label>Collaborator Type</label>
                  <select value={form.type} onChange={e => set('type', e.target.value)}>
                    <option value="revenue-share">Revenue share</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>
                <div className={styles.formRow}>
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                </div>
                <div className={styles.formRow}>
                  <label>Discord</label>
                  <input value={form.discord} onChange={e => set('discord', e.target.value)} placeholder="username" />
                </div>
                <div className={styles.formRow}>
                  <label>Location</label>
                  <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Remote or City, CA" />
                </div>
                <div className={styles.formRow}>
                  <label>Time Zone</label>
                  <select value={form.timezone} onChange={e => set('timezone', e.target.value)}>
                    <option value="">— select —</option>
                    {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>
                <div className={styles.formRow}>
                  <label>Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
                </div>
                <div className={styles.formRow}>
                  <label>Status</label>
                  <select value={form.memberStatus} onChange={e => set('memberStatus', e.target.value)}>
                    {STATUSES.map(s => (
                      <option key={s} value={s}>
                        {s === 'active' ? 'Active' : s === 'onboarding' ? 'Onboarding' : s === 'on-leave' ? 'On leave' : 'Former member'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <label>Current / Former Member</label>
                <div style={{ display:'flex', gap:16, marginTop:5 }}>
                  {[true, false].map(v => (
                    <label key={String(v)} style={{ display:'flex', gap:6, alignItems:'center', fontSize:13, cursor:'pointer' }}>
                      <input type="radio" checked={form.isCurrent === v} onChange={() => set('isCurrent', v)} />
                      {v ? 'Current member' : 'Former member'}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.formRow}>
                <label>Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="Add any additional context, notes, or history…"
                  rows={3}
                  style={{ width:'100%', resize:'vertical', fontSize:13 }}
                />
              </div>
            </div>
            <div className={styles.profileFooter}>
              <button className={styles.btnCancel} onClick={() => setEditing(false)}>Cancel</button>
              <button className={styles.btnSubmit} onClick={handleSave}>Save Profile</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

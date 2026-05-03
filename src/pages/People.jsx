import { useState } from 'react'
import { TEAM } from '../data/studioData.js'
import { PageHeader, PageContent, Card, CardHeader, Avatar, Tag, Button, StatusBadge } from '../components/UI.jsx'
import styles from './Pages.module.css'

const COLORS = ['purple', 'teal', 'amber', 'coral', 'blue', 'purple']
const DEPT_COLORS = { executive: 'purple', creative: 'teal', production: 'amber', tech: 'blue', operations: 'coral' }

const DEPTS = ['executive', 'creative', 'production', 'tech', 'operations']

function AddMemberModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', role: '', dept: 'creative', location: '', status: 'active' })

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const words = form.name.trim().split(' ').filter(Boolean)
    const initials = words.length >= 2
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : form.name.slice(0, 2).toUpperCase()
    onAdd({
      id: `tm-${Date.now()}`,
      name: form.name.trim(),
      initials,
      role: form.role.trim(),
      dept: form.dept,
      location: form.location.trim(),
      status: form.status,
      type: 'revenue-share',
    })
    onClose()
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>Add team member</div>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formRow}>
            <label>Full name</label>
            <input
              required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Jamie Chen"
              autoFocus
            />
          </div>
          <div className={styles.formRow}>
            <label>Role / title</label>
            <input
              required
              value={form.role}
              onChange={e => set('role', e.target.value)}
              placeholder="e.g. Motion Designer"
            />
          </div>
          <div className={styles.formRow}>
            <label>Department</label>
            <select value={form.dept} onChange={e => set('dept', e.target.value)}>
              {DEPTS.map(d => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className={styles.formRow}>
            <label>Location</label>
            <input
              required
              value={form.location}
              onChange={e => set('location', e.target.value)}
              placeholder="e.g. Los Angeles, CA or Remote"
            />
          </div>
          <div className={styles.formRow}>
            <label>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="onboarding">Onboarding</option>
            </select>
          </div>
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
  const [filter, setFilter] = useState('all')
  const [team, setTeam] = useState(TEAM)
  const [showAdd, setShowAdd] = useState(false)

  const filtered = filter === 'all' ? team : team.filter(m => m.dept === filter)

  function addMember(member) {
    setTeam(prev => [...prev, member])
  }

  return (
    <>
      <PageHeader
        title="People"
        subtitle={`${team.length} collaborators · Revenue share team`}
        actions={<Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>+ Add member</Button>}
      />
      <PageContent>
        <div className={styles.tabBar}>
          {['all', ...DEPTS].map(f => (
            <button
              key={f}
              className={`${styles.tab} ${filter === f ? styles.tabActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? `All (${team.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <Card>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
              No team members in this department yet.
            </div>
          ) : (
            filtered.map((m, i) => (
              <div key={m.id} className={styles.memberCard}>
                <Avatar initials={m.initials} color={COLORS[i % COLORS.length]} size="lg" />
                <div className={styles.memberInfo}>
                  <div className={styles.memberName}>{m.name}</div>
                  <div className={styles.memberMeta}>{m.role} · {m.location}</div>
                  <div className={styles.memberTags}>
                    <Tag color={DEPT_COLORS[m.dept] || 'default'}>{m.dept}</Tag>
                    <Tag color="blue">Revenue share</Tag>
                    <StatusBadge status={m.status} />
                  </div>
                </div>
              </div>
            ))
          )}
        </Card>
      </PageContent>

      {showAdd && (
        <AddMemberModal onClose={() => setShowAdd(false)} onAdd={addMember} />
      )}
    </>
  )
}

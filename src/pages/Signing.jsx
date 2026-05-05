import { useState, useEffect, useCallback } from 'react'
import { PageHeader, PageContent, Card, Tag, Button } from '../components/UI.jsx'
import styles from './Pages.module.css'

const API = 'http://localhost:3001'

const TEMPLATES = [
  {
    id: 'revenue-share',
    label: 'Revenue Share Agreement',
    icon: '💰',
    desc: 'CA-compliant revenue share agreement with IP clause, payout triggers, and offboarding terms.',
  },
  {
    id: 'ip-assignment',
    label: 'IP Assignment Agreement',
    icon: '⚖️',
    desc: 'Assigns all creative work produced for Kato.8 Studios. Critical for all collaborators.',
  },
  {
    id: 'nda',
    label: 'Non-Disclosure Agreement',
    icon: '🔒',
    desc: 'Studio-wide NDA covering projects, client relationships, and unreleased work. 3-year survival.',
  },
  {
    id: 'offer-letter',
    label: 'Offer Letter',
    icon: '📄',
    desc: 'Formal offer letter with role, revenue share terms, start date, and department details.',
  },
]

const STATUS_COLOR = { pending: 'amber', signed: 'green', declined: 'red' }
const STATUS_LABEL = { pending: 'Awaiting Signature', signed: 'Signed', declined: 'Declined' }

const DEPT_LABELS = {
  executive: 'Executive', design: 'Design', engineering: 'Engineering',
  art: 'Art', uiux: 'UI/UX', audio: 'Audio & Voice',
}

const TEAM_LABELS = {
  studio: 'General Studio', 'last-light': 'Last Light',
  corebound: 'Corebound', 'big-boss-cleanup': 'Big Boss Cleanup',
}

function CreateModal({ onClose, onCreated }) {
  const [step, setStep] = useState(1)
  const [template, setTemplate] = useState(null)
  const [form, setForm] = useState({
    recipientName: '', recipientEmail: '', role: '',
    dept: 'art', team: 'studio', lead: '', startDate: '', revenueSharePct: '',
  })
  const [created, setCreated] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const valid2 = form.recipientName.trim() && form.recipientEmail.trim() && form.role.trim()
  const sigUrl = created ? `${API}/sign/${created.token}` : ''
  const needsRevShare = template?.id === 'revenue-share' || template?.id === 'offer-letter'

  const create = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/signing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: template.id, ...form }),
      })
      if (!res.ok) throw new Error(await res.text() || 'Server error')
      setCreated(await res.json())
      setStep(3)
      onCreated()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(sigUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} style={{ width: step === 1 ? 520 : undefined }}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            {step === 1 && 'Choose Template'}
            {step === 2 && `Send — ${template?.label}`}
            {step === 3 && 'Document Ready'}
          </div>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>

        {step === 1 && (
          <div className={styles.modalBody}>
            <div className={styles.signTemplateGrid}>
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  className={`${styles.signTemplateCard} ${template?.id === t.id ? styles.signTemplateActive : ''}`}
                  onClick={() => setTemplate(t)}
                >
                  <div className={styles.signTemplateIcon}>{t.icon}</div>
                  <div className={styles.signTemplateLabel}>{t.label}</div>
                  <div className={styles.signTemplateDesc}>{t.desc}</div>
                </button>
              ))}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
              <button className={styles.btnSubmit} disabled={!template} onClick={() => setStep(2)}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.modalBody}>
            <div className={styles.formRow}>
              <label>Recipient Name *</label>
              <input
                value={form.recipientName}
                onChange={e => set('recipientName', e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div className={styles.formRow}>
              <label>Recipient Email *</label>
              <input
                type="email"
                value={form.recipientEmail}
                onChange={e => set('recipientEmail', e.target.value)}
                placeholder="email@example.com"
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
                  {Object.entries(TEAM_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
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
            {needsRevShare && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className={styles.formRow}>
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => set('startDate', e.target.value)}
                  />
                </div>
                <div className={styles.formRow}>
                  <label>Revenue Share %</label>
                  <input
                    value={form.revenueSharePct}
                    onChange={e => set('revenueSharePct', e.target.value)}
                    placeholder="e.g. 5"
                  />
                </div>
              </div>
            )}
            {error && (
              <div style={{ color: 'var(--k8-danger)', fontSize: 12 }}>{error}</div>
            )}
            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={() => setStep(1)}>← Back</button>
              <button
                className={styles.btnSubmit}
                disabled={!valid2 || loading}
                onClick={create}
              >
                {loading ? 'Creating…' : 'Create & Get Link'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && created && (
          <div className={styles.modalBody}>
            <div className={styles.signSuccessBanner}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                Document created
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Share the signing link with {created.recipientName}
              </div>
            </div>
            <div className={styles.formRow}>
              <label>Signing Link</label>
              <div className={styles.signLinkRow}>
                <input readOnly value={sigUrl} className={styles.signLinkInput} />
                <button className={styles.signCopyBtn} onClick={copyLink}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Send this link to <strong>{created.recipientEmail}</strong>. They'll see the full
              document and sign with a canvas signature pad — no account needed.
            </p>
            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={onClose}>Done</button>
              <button
                className={styles.btnSubmit}
                onClick={() => window.open(sigUrl, '_blank')}
              >
                Preview Document →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Signing() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/signing`)
      if (res.ok) setDocs(await res.json())
    } catch (_) {}
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const del = async id => {
    if (!window.confirm('Delete this document? This cannot be undone.')) return
    await fetch(`${API}/api/signing/${id}`, { method: 'DELETE' })
    load()
  }

  const copyLink = (token, id) => {
    navigator.clipboard.writeText(`${API}/sign/${token}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  const counts = {
    all: docs.length,
    pending: docs.filter(d => d.status === 'pending').length,
    signed: docs.filter(d => d.status === 'signed').length,
    declined: docs.filter(d => d.status === 'declined').length,
  }
  const filtered = filter === 'all' ? docs : docs.filter(d => d.status === filter)

  return (
    <>
      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onCreated={load} />
      )}
      <PageHeader
        title="Document Signing"
        subtitle={`${counts.pending} awaiting signature · ${counts.signed} signed · Kato.8 in-house platform`}
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
            + Create Document
          </Button>
        }
      />
      <PageContent>
        <div className={styles.signTabBar}>
          {[['all', 'All'], ['pending', 'Pending'], ['signed', 'Signed'], ['declined', 'Declined']].map(([k, l]) => (
            <button
              key={k}
              className={`${styles.signTab} ${filter === k ? styles.signTabActive : ''}`}
              onClick={() => setFilter(k)}
            >
              {l}
              {counts[k] > 0 && (
                <span className={styles.signTabCount}>{counts[k]}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <Card>
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-secondary)', fontSize: 13 }}>
              Loading…
            </div>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✍️</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
                {filter === 'all' ? 'No documents yet' : `No ${filter} documents`}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
                {filter === 'all'
                  ? 'Create a document to send revenue share agreements, IP assignments, NDAs, or offer letters for signature.'
                  : `No documents with "${filter}" status.`}
              </div>
              {filter === 'all' && (
                <Button variant="primary" size="md" onClick={() => setShowCreate(true)}>
                  + Create Document
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <Card style={{ padding: 0 }}>
            {filtered.map((doc, i) => {
              const tpl = TEMPLATES.find(t => t.id === (doc.template || doc.templateId))
              const dateStr = doc.createdAt
                ? new Date(doc.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })
                : ''
              return (
                <div
                  key={doc.id}
                  className={styles.signDocRow}
                  style={{ borderTop: i > 0 ? '0.5px solid var(--border-light)' : undefined }}
                >
                  <div className={styles.signDocIcon}>{tpl?.icon || '📄'}</div>
                  <div className={styles.signDocInfo}>
                    <div className={styles.signDocTitle}>
                      {doc.title || tpl?.label || doc.template}
                    </div>
                    <div className={styles.signDocMeta}>
                      {doc.recipientName}
                      {doc.recipientEmail && ` · ${doc.recipientEmail}`}
                      {doc.role && ` · ${doc.role}`}
                    </div>
                    <div className={styles.signDocTags}>
                      <Tag color={STATUS_COLOR[doc.status] || 'default'}>
                        {STATUS_LABEL[doc.status] || doc.status}
                      </Tag>
                      {tpl && <Tag color="default">{tpl.label}</Tag>}
                      {dateStr && (
                        <span className={styles.signDocDate}>{dateStr}</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.signDocActions}>
                    {doc.status !== 'signed' && doc.token && (
                      <button
                        className={styles.signActionBtn}
                        onClick={() => copyLink(doc.token, doc.id)}
                      >
                        {copiedId === doc.id ? '✓ Copied' : '🔗 Copy link'}
                      </button>
                    )}
                    {doc.token && (
                      <button
                        className={styles.signActionBtn}
                        onClick={() => window.open(`${API}/sign/${doc.token}`, '_blank')}
                      >
                        View
                      </button>
                    )}
                    <button
                      className={`${styles.signActionBtn} ${styles.signDeleteBtn}`}
                      onClick={() => del(doc.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </Card>
        )}
      </PageContent>
    </>
  )
}

import { useState } from 'react'
import { DOCUMENTS } from '../data/studioData.js'
import { PageHeader, PageContent, Card, CardHeader, Button, StatusBadge, Tag } from '../components/UI.jsx'
import styles from './Pages.module.css'

const ICONS = { template: '📄', policy: '📋', reference: '📁' }
const ICON_COLORS = { template: '#EEEDFE', policy: '#E1F5EE', reference: '#FAEEDA' }

const FILTERS = [
  { key: 'all', label: 'All docs' },
  { key: 'template', label: 'Templates' },
  { key: 'policy', label: 'Policies' },
  { key: 'reference', label: 'Reference' },
]

const ATTENTION_STATUSES = ['pending-sigs', 'expiring', 'needs-update', 'draft']

export default function Documents() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? DOCUMENTS : DOCUMENTS.filter(d => d.type === filter)

  const needsAttention = DOCUMENTS.filter(d => ATTENTION_STATUSES.includes(d.status))

  return (
    <>
      <PageHeader
        title="Documents"
        subtitle="Templates, policies, and signed agreements"
        actions={<Button variant="primary" size="sm">+ Upload doc</Button>}
      />
      <PageContent>
        {needsAttention.length > 0 && (
          <Card>
            <CardHeader title={`Needs attention (${needsAttention.length})`} />
            {needsAttention.map((doc, i) => (
              <div key={doc.id} className={styles.docRow} style={{ borderBottom: i < needsAttention.length - 1 ? '0.5px solid var(--border-light)' : 'none' }}>
                <div className={styles.docIcon} style={{ background: ICON_COLORS[doc.type] }}>
                  {ICONS[doc.type]}
                </div>
                <div className={styles.docName}>{doc.name}</div>
                <div className={styles.docLocation}>{doc.location}</div>
                {doc.note && <div className={styles.docNote}>{doc.note}</div>}
                <StatusBadge status={doc.status} />
                <button className={styles.docAction}>Open ↗</button>
              </div>
            ))}
          </Card>
        )}

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Document vault</span>
            <button style={{ fontSize: 12, color: 'var(--k8-accent)', cursor: 'pointer', background: 'none', border: 'none' }}>
              Open Drive ↗
            </button>
          </div>

          <div className={styles.tabBar} style={{ marginBottom: 12 }}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`${styles.tab} ${filter === f.key ? styles.tabActive : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.map((doc, i) => (
            <div key={doc.id} className={styles.docRow} style={{ borderBottom: i < filtered.length - 1 ? '0.5px solid var(--border-light)' : 'none' }}>
              <div className={styles.docIcon} style={{ background: ICON_COLORS[doc.type] }}>
                {ICONS[doc.type]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className={styles.docName}>{doc.name}</div>
                <div className={styles.docLocation}>{doc.location}</div>
              </div>
              {doc.note && <div className={styles.docNote}>{doc.note}</div>}
              <StatusBadge status={doc.status} />
              <button className={styles.docAction}>Open ↗</button>
            </div>
          ))}
        </Card>
      </PageContent>
    </>
  )
}

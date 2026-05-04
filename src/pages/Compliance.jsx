import { useState } from 'react'
import { COMPLIANCE_ITEMS } from '../data/studioData.js'
import { PageHeader, PageContent, MetricCard, Grid, Tag, Button } from '../components/UI.jsx'
import styles from './Pages.module.css'

const SECTIONS = [
  { id: 'employment', label: 'Employment law & classification', icon: '⚖️' },
  { id: 'docs',       label: 'Documents & signatures',          icon: '📋' },
  { id: 'safety',     label: 'Workplace safety (CA)',           icon: '🛡️' },
  { id: 'privacy',    label: 'Data privacy & CCPA',             icon: '🔒' },
  { id: 'agreements', label: 'Revenue share agreements',        icon: '🤝' },
]

const PRIORITY_COLOR  = { critical: 'red', high: 'amber', medium: 'default', done: 'green' }
const PRIORITY_STRIPE = { critical: 'var(--k8-danger)', high: 'var(--k8-amber)', medium: 'var(--border-medium)', done: 'var(--k8-teal)' }

const EA_PROMPTS = {
  'c-001': 'Draft the CA SB 553 workplace violence prevention section for Kato.8 Studios employee handbook',
  'c-002': 'Help me write a CA SB 1162 pay transparency policy for Kato.8 Studios revenue share agreements',
  'c-006': 'Help me send the 2 pending IP Assignment Agreements via DocuSign for Kato.8 Studios',
  'c-007': 'Check that all Kato.8 Studios revenue share agreements are signed in DocuSign',
  'c-008': 'Help me renew the Kato.8 Studios NDA template before June 1',
  'c-009': 'Audit NDA status for all 33 Kato.8 Studios team members in DocuSign',
  'c-011': 'Create an IIPP document for Kato.8 Studios in compliance with California regulations',
  'c-014': 'Draft a CCPA privacy notice for Kato.8 Studios collaborators',
  'c-017': 'Audit the revenue share percentages documented for each Kato.8 Studios team member',
  'c-018': 'Review the revenue definition clause in Kato.8 Studios revenue share agreements',
  'c-020': 'Draft an offboarding clause for the Kato.8 Studios revenue share agreements',
}

export default function Compliance() {
  const [checked, setChecked] = useState(() => {
    const init = {}
    COMPLIANCE_ITEMS.forEach(i => { init[i.id] = i.done })
    return init
  })
  const [collapsed, setCollapsed] = useState(() =>
    Object.fromEntries(SECTIONS.map(s => [s.id, true]))
  )
  const [showDone, setShowDone] = useState(false)

  const toggle    = id => setChecked(p => ({ ...p, [id]: !p[id] }))
  const toggleSec = id => setCollapsed(p => ({ ...p, [id]: !p[id] }))

  const done     = Object.values(checked).filter(Boolean).length
  const total    = COMPLIANCE_ITEMS.length
  const score    = Math.round(done / total * 100)
  const critical = COMPLIANCE_ITEMS.filter(i => !checked[i.id] && i.priority === 'critical').length
  const high     = COMPLIANCE_ITEMS.filter(i => !checked[i.id] && i.priority === 'high').length

  return (
    <>
      <PageHeader
        title="Compliance"
        subtitle="California HR compliance · Revenue share studio"
        actions={<Button variant="primary" size="sm">Export report</Button>}
      />
      <PageContent>
        {/* Score cards */}
        <Grid cols={3}>
          <MetricCard label="Compliance score" value={`${score}%`} delta="CA labor law" deltaType="up" />
          <MetricCard label="Critical items"   value={critical}   delta="Need immediate action" deltaType="warn" />
          <MetricCard label="High priority"    value={high}       delta="Action this week"      deltaType="warn" />
        </Grid>

        {/* Controls */}
        <div className={styles.compControls}>
          <div className={styles.compControlsLeft}>
            <button
              className={`${styles.compToggleBtn} ${!showDone ? styles.compToggleActive : ''}`}
              onClick={() => setShowDone(false)}
            >
              Open items
            </button>
            <button
              className={`${styles.compToggleBtn} ${showDone ? styles.compToggleActive : ''}`}
              onClick={() => setShowDone(true)}
            >
              Show all
            </button>
          </div>
          <div className={styles.compControlsRight}>
            <button className={styles.compExpandAll} onClick={() => setCollapsed(Object.fromEntries(SECTIONS.map(s => [s.id, false])))}>
              Expand all
            </button>
            <button className={styles.compExpandAll} onClick={() => setCollapsed(Object.fromEntries(SECTIONS.map(s => [s.id, true])))}>
              Collapse all
            </button>
          </div>
        </div>

        {/* Sections */}
        {SECTIONS.map(sec => {
          const allItems    = COMPLIANCE_ITEMS.filter(i => i.cat === sec.id)
          const visibleItems = showDone ? allItems : allItems.filter(i => !checked[i.id])
          if (visibleItems.length === 0) return null

          const secDone  = allItems.filter(i => checked[i.id]).length
          const pct      = Math.round(secDone / allItems.length * 100)
          const hasCrit  = allItems.some(i => !checked[i.id] && i.priority === 'critical')
          const hasHigh  = allItems.some(i => !checked[i.id] && i.priority === 'high')
          const accent   = hasCrit ? 'var(--k8-danger)' : hasHigh ? 'var(--k8-amber)' : 'var(--k8-teal)'

          return (
            <div key={sec.id} className={styles.compSection}>
              {/* Section header */}
              <div className={styles.compSecHeader} onClick={() => toggleSec(sec.id)}>
                <div className={styles.compSecHeaderLeft}>
                  <span className={styles.compSecIcon}>{sec.icon}</span>
                  <span className={styles.compSecLabel}>{sec.label}</span>
                  {hasCrit && <span className={styles.compUrgentPill}>Critical</span>}
                </div>
                <div className={styles.compSecHeaderRight}>
                  <span className={styles.compSecCount}>{secDone} / {allItems.length}</span>
                  <div className={styles.compProgBar}>
                    <div className={styles.compProgFill} style={{ width: `${pct}%`, background: accent }} />
                  </div>
                  <span className={styles.compChevron}>{collapsed[sec.id] ? '›' : '∨'}</span>
                </div>
              </div>

              {/* Section items */}
              {!collapsed[sec.id] && (
                <div className={styles.compItemList}>
                  {visibleItems.map(item => (
                    <div
                      key={item.id}
                      className={`${styles.compItem} ${checked[item.id] ? styles.compItemDone : ''}`}
                      style={{ '--priority-color': PRIORITY_STRIPE[item.priority] }}
                    >
                      <div className={styles.compPriorityStripe} />
                      <button
                        className={`${styles.checkBox} ${checked[item.id] ? styles.checked : ''}`}
                        onClick={() => toggle(item.id)}
                        aria-label={`Mark ${item.title} as ${checked[item.id] ? 'incomplete' : 'complete'}`}
                      />
                      <div className={styles.compBody}>
                        <div className={styles.compTitle}>{item.title}</div>
                        <div className={styles.compDesc}>{item.desc}</div>
                        <div className={styles.compMeta}>
                          <Tag color={PRIORITY_COLOR[item.priority]}>
                            {item.priority === 'done' ? 'Complete' : item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          </Tag>
                          {item.due && (
                            <span className={`${styles.compDue} ${item.priority === 'critical' ? styles.compDueCritical : ''}`}>
                              Due: {item.due}
                            </span>
                          )}
                          {EA_PROMPTS[item.id] && !checked[item.id] && (
                            <span className={styles.compAction}>◈ Draft with EA →</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </PageContent>
    </>
  )
}

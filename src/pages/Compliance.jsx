import { useState } from 'react'
import { COMPLIANCE_ITEMS } from '../data/studioData.js'
import { PageHeader, PageContent, Card, MetricCard, Grid, Tag, Button, EATrigger } from '../components/UI.jsx'
import styles from './Pages.module.css'

const CATS = ['all','employment','docs','safety','privacy','agreements']
const CAT_LABELS = { all:'All', employment:'Employment law', docs:'Documents', safety:'Safety', privacy:'Privacy', agreements:'Agreements' }
const PRIORITY_COLOR = { critical:'red', high:'amber', medium:'default', done:'green' }

const SECTIONS = [
  { id:'employment', label:'Employment law & classification' },
  { id:'docs', label:'Documents & signatures' },
  { id:'safety', label:'Workplace safety (CA)' },
  { id:'privacy', label:'Data privacy & CCPA' },
  { id:'agreements', label:'Revenue share agreements' },
]

export default function Compliance() {
  const [filter, setFilter] = useState('all')
  const [checked, setChecked] = useState(() => {
    const init = {}
    COMPLIANCE_ITEMS.forEach(i => { init[i.id] = i.done })
    return init
  })
  const [collapsed, setCollapsed] = useState({})

  const toggle = id => setChecked(p => ({ ...p, [id]: !p[id] }))
  const toggleSec = id => setCollapsed(p => ({ ...p, [id]: !p[id] }))

  const visible = filter === 'all' ? COMPLIANCE_ITEMS : COMPLIANCE_ITEMS.filter(i => i.cat === filter)
  const done = Object.values(checked).filter(Boolean).length
  const total = COMPLIANCE_ITEMS.length
  const critical = COMPLIANCE_ITEMS.filter(i => !checked[i.id] && i.priority === 'critical').length
  const high = COMPLIANCE_ITEMS.filter(i => !checked[i.id] && i.priority === 'high').length

  const EA_PROMPTS = {
    'c-001': 'Draft the CA SB 553 workplace violence prevention section for Kato.8 Studios employee handbook',
    'c-002': 'Help me write a CA SB 1162 pay transparency policy for Kato.8 Studios revenue share agreements',
    'c-006': 'Help me send the 2 pending IP Assignment Agreements via DocuSign for Kato.8 Studios',
    'c-007': 'Check that all Kato.8 Studios revenue share agreements are signed in DocuSign',
    'c-008': 'Help me renew the Kato.8 Studios NDA template before June 1',
    'c-011': 'Create an IIPP document for Kato.8 Studios',
    'c-014': 'Draft a CCPA privacy notice for Kato.8 Studios collaborators',
    'c-017': 'Audit the revenue share percentages documented for each Kato.8 Studios team member',
    'c-020': 'Draft an offboarding clause for the Kato.8 Studios revenue share agreements',
  }

  return (
    <>
      <PageHeader
        title="Compliance"
        subtitle="California HR compliance · Revenue share studio"
        actions={<Button variant="primary" size="sm">Export report</Button>}
      />
      <PageContent>
        <Grid cols={3}>
          <MetricCard label="Compliance score" value={`${Math.round(done/total*100)}%`} delta="CA labor law" deltaType="up" />
          <MetricCard label="Critical items" value={critical} delta="Need immediate action" deltaType="warn" />
          <MetricCard label="High priority" value={high} delta="Action this week" deltaType="warn" />
        </Grid>

        <div className={styles.tabBar}>
          {CATS.map(c => (
            <button key={c} className={`${styles.tab} ${filter===c?styles.tabActive:''}`} onClick={() => setFilter(c)}>
              {CAT_LABELS[c]}
            </button>
          ))}
        </div>

        {SECTIONS.map(sec => {
          const items = visible.filter(i => i.cat === sec.id)
          if (!items.length) return null
          const secDone = items.filter(i => checked[i.id]).length
          const pct = Math.round(secDone / items.length * 100)
          return (
            <div key={sec.id} style={{ background:'var(--bg-primary)', border:'0.5px solid var(--border-light)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
              <div className={styles.sectionHeader} onClick={() => toggleSec(sec.id)}>
                <span>{sec.label}</span>
                <div className={styles.sectionHeaderRight}>
                  <span>{secDone} / {items.length}</span>
                  <div className={styles.progBar}><div className={styles.progFill} style={{ width:`${pct}%` }} /></div>
                  <span>{collapsed[sec.id] ? '▸' : '▾'}</span>
                </div>
              </div>
              {!collapsed[sec.id] && (
                <div style={{ padding:'0 16px' }}>
                  {items.map(item => (
                    <div key={item.id} className={`${styles.compItem} ${checked[item.id] ? styles.done : ''}`}>
                      <button
                        className={`${styles.checkBox} ${checked[item.id] ? styles.checked : ''}`}
                        onClick={() => toggle(item.id)}
                        aria-label={`Mark ${item.title} as ${checked[item.id]?'incomplete':'complete'}`}
                      />
                      <div className={styles.compBody}>
                        <div className={styles.compTitle}>{item.title}</div>
                        <div className={styles.compDesc}>{item.desc}</div>
                        <div className={styles.compMeta}>
                          <Tag color={PRIORITY_COLOR[item.priority]}>
                            {item.priority === 'done' ? 'Complete' : item.priority}
                          </Tag>
                          {item.due && <span className={styles.compDue}>Due: {item.due}</span>}
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

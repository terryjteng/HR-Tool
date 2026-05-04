import { useState, useEffect } from 'react'
import { INTEGRATIONS } from '../data/studioData.js'
import { PageHeader, PageContent, Card, Tag, Button, EATrigger } from '../components/UI.jsx'
import styles from './Pages.module.css'

export default function Integrations() {
  const [selected, setSelected] = useState('docusign')
  const [driveStatus, setDriveStatus] = useState(null) // null=loading, true=connected, false=not connected
  const int = INTEGRATIONS.find(i => i.id === selected) || INTEGRATIONS[0]

  useEffect(() => {
    fetch('http://localhost:3001/api/drive/status')
      .then(r => r.json())
      .then(d => setDriveStatus(!!d.connected))
      .catch(() => setDriveStatus(false))
  }, [])

  const disconnectDrive = () => {
    fetch('http://localhost:3001/api/drive/disconnect', { method: 'POST' })
      .then(() => setDriveStatus(false))
  }

  const PRIORITY_LABELS = { 1:'Set up now', 2:'This week', 3:'This month' }

  const EA_PROMPTS = {
    docusign: 'Help me connect the DocuSign webhook to the Kato.8 Studios EA agent so signed documents are tracked automatically',
    gdrive: 'Set up the recommended Google Drive folder structure for Kato.8 Studios HR files',
    gcal: 'Have the EA agent set up the Kato.8 Studios HR calendar with all compliance deadlines and onboarding milestones for the next 90 days',
    discord: 'Help me set up the #hr-ops Discord channel and connect the EA agent webhook for Kato.8 Studios',
    'ea-agent': 'Walk me through the full EA agent integration setup for Kato.8 Studios HR platform',
    notion: 'Build a Notion hiring pipeline for Kato.8 Studios for Senior Animator, VFX Artist, and Ops Coordinator roles',
  }

  return (
    <>
      <PageHeader
        title="Connections"
        subtitle="Platform integrations — DocuSign, Google, Discord, and EA Agent"
      />
      <PageContent>
        <Card style={{ padding:0 }}>
          <div className={styles.intDetail}>
            <div className={styles.intList}>
              {['Set up now','This week','This month','Already connected'].map(group => {
                const items = INTEGRATIONS.filter(i => {
                  if (group === 'Already connected') return i.status === 'active'
                  if (group === 'Set up now') return i.status !== 'active' && i.priority === 1
                  if (group === 'This week') return i.status !== 'active' && i.priority === 2
                  if (group === 'This month') return i.status !== 'active' && i.priority === 3
                  return false
                })
                if (!items.length) return null
                return (
                  <div key={group}>
                    <div style={{ padding:'6px 12px', background:'var(--bg-secondary)', borderBottom:'0.5px solid var(--border-light)', fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text-tertiary)' }}>
                      {group}
                    </div>
                    {items.map(i => (
                      <div
                        key={i.id}
                        className={`${styles.intListItem} ${selected===i.id?styles.intListActive:''}`}
                        onClick={() => setSelected(i.id)}
                      >
                        <div className={styles.intListIcon} style={{ background:i.color }}>{i.icon}</div>
                        <div className={styles.intListInfo}>
                          <div className={styles.intListName}>{i.name}</div>
                          <div className={styles.intListCat}>{i.category}</div>
                        </div>
                        <Tag color={i.status==='active'?'green':'amber'}>
                          {i.status==='active'?'Live':'Setup'}
                        </Tag>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            <div className={styles.intDetailPane}>
              <div className={styles.intDetailTop}>
                <div className={styles.intDetailIcon} style={{ background:int.color }}>{int.icon}</div>
                <div style={{ flex:1 }}>
                  <div className={styles.intDetailName}>{int.name}</div>
                  <div className={styles.intDetailDesc}>{int.desc}</div>
                  <div style={{ marginTop:8 }}>
                    <Tag color={int.status==='active'?'green':'amber'}>
                      {int.status==='active'?'Connected and active':'Setup needed'}
                    </Tag>
                  </div>
                </div>
              </div>

              <div style={{ fontSize:12, fontWeight:500, color:'var(--text-secondary)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.05em' }}>Capabilities</div>
              <div className={styles.benefits}>
                {int.capabilities.map(c => <div key={c} className={styles.benefit}>{c}</div>)}
              </div>

              <div style={{ fontSize:12, fontWeight:500, color:'var(--text-secondary)', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.05em' }}>Setup checklist</div>
              {int.setupSteps.map((step, i) => (
                <div key={i} className={styles.setupStep}>
                  <div className={`${styles.stepNum} ${step.done?styles.stepNumDone:''}`}>
                    {step.done ? '✓' : i+1}
                  </div>
                  <div className={styles.stepText}>{step.text}</div>
                </div>
              ))}

              {selected === 'gdrive' && (
                <div className={styles.driveConnectBox}>
                  <div style={{ fontSize: 22 }}>📁</div>
                  <div className={styles.driveConnectInfo}>
                    {driveStatus === null && 'Checking Google Drive connection…'}
                    {driveStatus === true && (
                      <><strong>Google Drive connected</strong> — terryt.kato.8@gmail.com</>
                    )}
                    {driveStatus === false && (
                      <><strong>Connect Google Drive</strong> — Link terryt.kato.8@gmail.com to
                      sync HR documents, signed agreements, and templates.</>
                    )}
                  </div>
                  {driveStatus === true && (
                    <button
                      className={styles.signActionBtn}
                      onClick={disconnectDrive}
                    >
                      Disconnect
                    </button>
                  )}
                  {driveStatus === false && (
                    <a href="http://localhost:3001/auth/google">
                      <Button variant="primary" size="sm">Connect Drive</Button>
                    </a>
                  )}
                </div>
              )}

              <EATrigger
                label={`EA Agent: ${int.name} — ${int.status==='active'?'optimize integration':'complete setup'}`}
                prompt={EA_PROMPTS[int.id] || `Help me with the ${int.name} integration for Kato.8 Studios`}
              />
            </div>
          </div>
        </Card>
      </PageContent>
    </>
  )
}

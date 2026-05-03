import { useState } from 'react'
import { ONBOARDING_PHASES } from '../data/studioData.js'
import { PageHeader, PageContent, Card, CardHeader, Tag, Button, EATrigger, Grid } from '../components/UI.jsx'
import styles from './Pages.module.css'

const OWNER_COLORS = { HR:'purple', IT:'blue', Manager:'teal', Member:'amber', Buddy:'coral', 'HR + Manager':'purple', 'IT + HR':'blue', 'Manager + HR':'teal', 'Creative Director':'teal', 'Manager + Member':'amber' }
const PHASE_ICONS = { pre:'📋', day1:'🤝', week1:'🚀', day30:'✅' }

export default function Onboarding() {
  const [activePhase, setActivePhase] = useState('pre')
  const [checked, setChecked] = useState({})

  const phase = ONBOARDING_PHASES.find(p => p.id === activePhase)
  const allTasks = ONBOARDING_PHASES.flatMap(p => p.tasks)
  const doneCount = allTasks.filter(t => checked[t.id] || t.done).length
  const pct = Math.round(doneCount / allTasks.length * 100)

  const toggle = id => setChecked(p => ({ ...p, [id]: !p[id] }))

  const EA_ACTIONS = {
    pre: 'Draft the pre-hire welcome package for a new Kato.8 Studios collaborator — Discord invite, Google Workspace setup instructions, and DocuSign agreement bundle',
    day1: 'Create the Day 1 onboarding itinerary for a new Kato.8 Studios collaborator including all required agreements to execute',
    week1: 'Draft 30-60-90 day goals for a new creative collaborator at Kato.8 Studios',
    day30: 'Draft the 30-day check-in meeting agenda and experience survey for Kato.8 Studios',
  }

  return (
    <>
      <PageHeader
        title="Onboarding"
        subtitle="Currently onboarding: Alex Martinez (3D Artist)"
        actions={<Button variant="primary" size="sm">+ New onboarding</Button>}
      />
      <PageContent>
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
          <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:16, lineHeight:1.6 }}>{phase.desc}</p>
          <Grid cols={2}>
            {phase.tasks.map(task => {
              const isDone = checked[task.id] ?? task.done
              const ownerColor = OWNER_COLORS[task.owner] || 'default'
              return (
                <div key={task.id} className={`${styles.obTask} ${isDone?styles.obDone:''}`}>
                  <div className={styles.obTaskHeader}>
                    <div className={styles.obIcon} style={{ background:'var(--bg-secondary)' }}>📌</div>
                    <div className={styles.obTaskTitle}>{task.title}</div>
                    <button
                      className={`${styles.obCheck} ${isDone?styles.obChecked:''}`}
                      onClick={() => toggle(task.id)}
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
            label={`EA Agent: ${EA_ACTIONS[activePhase]?.slice(0,80)}...`}
            prompt={EA_ACTIONS[activePhase]}
          />
        </Card>

        <div className={styles.progressSection}>
          <span>Alex Martinez · onboarding progress</span>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width:`${pct}%` }} />
          </div>
          <span className={styles.progressPct}>{pct}%</span>
          <span style={{ color:'var(--text-secondary)', marginLeft:8 }}>Day 3 of 30</span>
        </div>
      </PageContent>
    </>
  )
}

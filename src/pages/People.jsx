// People.jsx
import { useState } from 'react'
import { TEAM } from '../data/studioData.js'
import { PageHeader, PageContent, Card, CardHeader, Avatar, Tag, Button, StatusBadge } from '../components/UI.jsx'
import styles from './Pages.module.css'

const COLORS = ['purple','teal','amber','coral','blue','purple']
const DEPT_COLORS = { executive:'purple', creative:'teal', production:'amber', tech:'blue', operations:'coral' }

export default function People() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? TEAM : TEAM.filter(m => m.dept === filter)

  return (
    <>
      <PageHeader
        title="People"
        subtitle={`${TEAM.length} collaborators · Revenue share team`}
        actions={<Button variant="primary" size="sm">+ Add member</Button>}
      />
      <PageContent>
        <div className={styles.tabBar}>
          {['all','executive','creative','production','tech'].map(f => (
            <button key={f} className={`${styles.tab} ${filter===f?styles.tabActive:''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All members' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <Card>
          {filtered.map((m, i) => (
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
          ))}
        </Card>
      </PageContent>
    </>
  )
}

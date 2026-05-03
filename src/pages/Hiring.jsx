// ─── Hiring.jsx ───────────────────────────────────────────────────────────────
import { OPEN_ROLES } from '../data/studioData.js'
import { PageHeader, PageContent, Card, CardHeader, Tag, Button, EATrigger } from '../components/UI.jsx'
import styles from './Pages.module.css'

export function Hiring() {
  const STAGE_COLOR = { 'Offer stage':'red', 'Screening':'amber', 'Phone screen':'purple' }
  return (
    <>
      <PageHeader
        title="Hiring"
        subtitle="3 open roles · Notion pipeline · No ATS subscription needed at current scale"
        actions={<Button variant="primary" size="sm">+ New role</Button>}
      />
      <PageContent>
        <Card>
          <CardHeader title="Open roles — Kato.8 Studios" />
          {OPEN_ROLES.map(r => (
            <div key={r.id} className={styles.roleRow}>
              <div className={`${styles.taskDot} ${styles['dot-' + (STAGE_COLOR[r.stage]==='red'?'red':STAGE_COLOR[r.stage]==='amber'?'amber':'purple')]}`} />
              <div className={styles.roleTitle}>{r.title}</div>
              <div className={styles.roleMeta}>{r.candidates} candidates</div>
              <Tag color={STAGE_COLOR[r.stage] || 'default'}>{r.stage}</Tag>
              <Tag color="blue">{r.dept}</Tag>
            </div>
          ))}
        </Card>
        <Card>
          <CardHeader title="Hiring pipeline tool" />
          <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:12, lineHeight:1.6 }}>
            No Greenhouse subscription — at 3 open roles, a Notion kanban board is the right fit. Free, flexible, and your team already knows it.
          </p>
          <EATrigger
            label="EA Agent: Build a Notion hiring pipeline for Sr. Animator, VFX Artist, and Ops Coordinator"
            prompt="Build a Notion hiring pipeline for Kato.8 Studios for these 3 open roles: Senior Animator, VFX Artist, Studio Operations Coordinator. Include CA SB 1162 pay range fields."
          />
        </Card>
      </PageContent>
    </>
  )
}

export default Hiring

// ─── Hiring.jsx ───────────────────────────────────────────────────────────────
import { OPEN_ROLES } from '../data/studioData.js'
import { PageHeader, PageContent, Card, CardHeader, Tag, Button, EATrigger } from '../components/UI.jsx'
import styles from './Pages.module.css'

export function Hiring() {
  const STAGE_COLOR = { 'Actively Hiring': 'teal', 'Offer stage': 'red', 'Screening': 'amber', 'Phone screen': 'purple' }
  return (
    <>
      <PageHeader
        title="Hiring"
        subtitle="1 open role · Art department · Revenue share position"
        actions={<Button variant="primary" size="sm">+ New role</Button>}
      />
      <PageContent>
        <Card>
          <CardHeader title="Open roles — Kato.8 Studios" />
          {OPEN_ROLES.map(r => (
            <div key={r.id} className={styles.roleRow}>
              <div className={`${styles.taskDot} ${styles['dot-green']}`} />
              <div className={styles.roleTitle}>{r.title}</div>
              <div className={styles.roleMeta}>
                {r.candidates > 0 ? `${r.candidates} candidates` : 'Accepting applications'}
              </div>
              <Tag color={STAGE_COLOR[r.stage] || 'default'}>{r.stage}</Tag>
              <Tag color="amber">{r.dept}</Tag>
            </div>
          ))}
        </Card>
        <Card>
          <CardHeader title="Role details — 2D Animator" />
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 14 }}>
            <p style={{ marginBottom: 8 }}>
              Kato.8 Studios is seeking a <strong style={{ color: 'var(--text-primary)' }}>2D Animator</strong> to join the Art department under Chris C (Lead Artist).
              This is a revenue-share position — compensation is a % of studio revenue, per CA SB 1162 disclosure requirements.
            </p>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>Skills needed:</strong> 2D animation, frame-by-frame or rigging workflows, experience with Adobe Animate or similar tools preferred.
            </p>
          </div>
          <EATrigger
            label="EA Agent: Build a Notion hiring pipeline for the 2D Animator role"
            prompt="Build a Notion hiring pipeline for Kato.8 Studios for the 2D Animator role in the Art department. Include CA SB 1162 revenue share % disclosure fields, portfolio review columns, and stage tracking: Applied, Screen, Portfolio Review, Interview, Offer, Hired/Passed."
          />
        </Card>
        <Card>
          <CardHeader title="Hiring pipeline tool" />
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            At 1 open role, a Notion kanban board is the right fit. Free, flexible, no ATS subscription needed.
          </p>
          <EATrigger
            label="EA Agent: Draft outreach message for 2D Animator candidates"
            prompt="Draft a concise, warm outreach message for 2D Animator candidates applying to Kato.8 Studios. Mention the revenue-share model, the studio's creative focus, and ask them to share a portfolio link."
          />
        </Card>
      </PageContent>
    </>
  )
}

export default Hiring

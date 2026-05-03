import { TEAM, COMPLIANCE_ITEMS, INTEGRATIONS, OPEN_ROLES } from '../data/studioData.js'
import { PageHeader, PageContent, Card, CardHeader, MetricCard, Grid, Avatar, Tag, Button, EATrigger, StatusBadge } from '../components/UI.jsx'
import styles from './Pages.module.css'

const AVATAR_COLORS = ['purple','teal','amber','coral','blue','purple']

export default function Dashboard({ onNavigate }) {
  const urgentCompliance = COMPLIANCE_ITEMS.filter(i => !i.done && i.priority === 'critical').length
  const highCompliance = COMPLIANCE_ITEMS.filter(i => !i.done && (i.priority === 'high')).length
  const activeMembers = TEAM.filter(t => t.status === 'active').length
  const onboarding = TEAM.filter(t => t.status === 'onboarding').length

  const PRIORITY_TASKS = [
    { dot: 'red', text: 'CA SB 553 handbook update', meta: 'Due May 6' },
    { dot: 'red', text: 'IP Assignment — 2 pending signatures', meta: 'Overdue' },
    { dot: 'amber', text: 'Revenue Share Agreements — verify all signed', meta: 'This week' },
    { dot: 'amber', text: 'NDA renewal — expires June 1', meta: 'Jun 1' },
    { dot: 'purple', text: 'Discord #hr-ops channel + EA webhook', meta: 'Setup needed' },
    { dot: 'green', text: 'Alex Martinez onboarding — Day 3', meta: 'In progress' },
  ]

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Kato.8 Studios · Revenue share team · Mission Hills, CA"
        actions={
          <>
            <Tag color="purple">Head of HR</Tag>
            <Tag color="blue">CTO</Tag>
            <Button variant="primary" size="sm" onClick={() => onNavigate('people')}>+ Add member</Button>
          </>
        }
      />
      <PageContent>

        {/* EA Banner */}
        <div className={styles.eaBanner}>
          <div className={styles.eaBannerIcon}>◈</div>
          <div className={styles.eaBannerText}>
            <div className={styles.eaBannerTitle}>Executive Assistant — {urgentCompliance + 2} items need attention today</div>
            <div className={styles.eaBannerSub}>2 overdue IP signatures · CA handbook update due May 6 · DocuSign webhook not connected</div>
          </div>
          <div className={styles.eaBannerActions}>
            <Button variant="default" size="sm" onClick={() => onNavigate('compliance')}>View tasks</Button>
            <Button variant="default" size="sm" onClick={() => onNavigate('ea')}>Ask EA</Button>
          </div>
        </div>

        {/* Metrics */}
        <Grid cols={4}>
          <MetricCard label="Team members" value={TEAM.length} delta={`${activeMembers} active · ${onboarding} onboarding`} deltaType="up" />
          <MetricCard label="Open roles" value={OPEN_ROLES.length} delta="2 departments" deltaType="warn" />
          <MetricCard label="Compliance issues" value={urgentCompliance + highCompliance} delta={`${urgentCompliance} critical`} deltaType="warn" />
          <MetricCard label="Documents in DocuSign" value="4" delta="2 pending sigs" deltaType="warn" />
        </Grid>

        <Grid cols={2}>
          {/* Priority tasks */}
          <Card>
            <CardHeader title="Priority tasks" action="View all →" onAction={() => onNavigate('compliance')} />
            <div className={styles.taskList}>
              {PRIORITY_TASKS.map((t, i) => (
                <div key={i} className={styles.taskRow}>
                  <div className={`${styles.taskDot} ${styles['dot-' + t.dot]}`} />
                  <span className={styles.taskText}>{t.text}</span>
                  <span className={styles.taskMeta}>{t.meta}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader title="Team activity" action="View all →" onAction={() => onNavigate('people')} />
            <div className={styles.personList}>
              {TEAM.map((m, i) => (
                <div key={m.id} className={styles.personRow}>
                  <Avatar initials={m.initials} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} />
                  <div className={styles.personInfo}>
                    <div className={styles.personName}>{m.name}</div>
                    <div className={styles.personRole}>{m.role}</div>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              ))}
            </div>
          </Card>
        </Grid>

        {/* Integrations status */}
        <Card>
          <CardHeader title="Integration status" action="Manage →" onAction={() => onNavigate('integrations')} />
          <div className={styles.intGrid}>
            {INTEGRATIONS.map(int => (
              <div key={int.id} className={styles.intRow} onClick={() => onNavigate('integrations')}>
                <div className={styles.intDot} style={{ background: int.status === 'active' ? 'var(--k8-teal)' : 'var(--k8-amber)' }} />
                <span className={styles.intName}>{int.name}</span>
                <Tag color={int.status === 'active' ? 'green' : 'amber'}>
                  {int.status === 'active' ? 'Live' : 'Setup needed'}
                </Tag>
              </div>
            ))}
          </div>
        </Card>

      </PageContent>
    </>
  )
}

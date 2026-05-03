import styles from './UI.module.css'

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.pageActions}>{actions}</div>}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`${styles.card} ${className}`}>{children}</div>
}

export function CardHeader({ title, action, onAction }) {
  return (
    <div className={styles.cardHeader}>
      <span className={styles.cardTitle}>{title}</span>
      {action && <button className={styles.cardAction} onClick={onAction}>{action}</button>}
    </div>
  )
}

export function MetricCard({ label, value, delta, deltaType = 'neutral' }) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue}>{value}</div>
      {delta && <div className={`${styles.metricDelta} ${styles[deltaType]}`}>{delta}</div>}
    </div>
  )
}

export function Tag({ children, color = 'default' }) {
  return <span className={`${styles.tag} ${styles['tag-' + color]}`}>{children}</span>
}

export function Avatar({ initials, color = 'purple', size = 'md' }) {
  return (
    <div className={`${styles.avatar} ${styles['av-' + color]} ${styles['av-' + size]}`}>
      {initials}
    </div>
  )
}

export function Button({ children, variant = 'default', onClick, size = 'md' }) {
  return (
    <button
      className={`${styles.btn} ${styles['btn-' + variant]} ${styles['btn-size-' + size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function StatusBadge({ status }) {
  const map = {
    active: { label: 'Active', color: 'green' },
    onboarding: { label: 'Onboarding', color: 'purple' },
    'review-due': { label: 'Review due', color: 'amber' },
    'revenue-share': { label: 'Rev. share', color: 'blue' },
    current: { label: 'Current', color: 'green' },
    'pending-sigs': { label: 'Pending sigs', color: 'red' },
    expiring: { label: 'Expiring', color: 'amber' },
    'needs-update': { label: 'Needs update', color: 'amber' },
    draft: { label: 'Draft', color: 'default' },
    'set-up': { label: 'Set up now', color: 'purple' },
    pending: { label: 'Pending', color: 'amber' },
  }
  const cfg = map[status] || { label: status, color: 'default' }
  return <Tag color={cfg.color}>{cfg.label}</Tag>
}

export function EATrigger({ label, prompt }) {
  return (
    <div className={styles.eaTrigger}>
      <span className={styles.eaIcon}>◈</span>
      <span className={styles.eaText}>{label}</span>
      <button className={styles.eaBtn} onClick={() => console.log('EA prompt:', prompt)}>
        Run ↗
      </button>
    </div>
  )
}

export function PageContent({ children }) {
  return <div className={styles.pageContent}>{children}</div>
}

export function Grid({ cols = 2, children }) {
  return <div className={`${styles.grid} ${styles['grid-' + cols]}`}>{children}</div>
}

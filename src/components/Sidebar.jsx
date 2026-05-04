import styles from './Sidebar.module.css'

const NAV = [
  { section: 'Core', items: [
    { id: 'dashboard',  icon: '⊞', label: 'Dashboard' },
    { id: 'people',     icon: '◎', label: 'People',     badge: '33' },
    { id: 'org',        icon: '⌥', label: 'Org Chart' },
    { id: 'docs',       icon: '≡', label: 'Documents',  badge: '4', badgeWarn: true },
    { id: 'handbooks',  icon: '📖', label: 'Handbooks',  badge: '3' },
  ]},
  { section: 'Operations', items: [
    { id: 'compliance', icon: '✓', label: 'Compliance', badge: '10', badgeWarn: true },
    { id: 'hiring',     icon: '+', label: 'Hiring',     badge: '1' },
    { id: 'onboarding', icon: '→', label: 'Onboarding' },
    { id: 'signing',    icon: '✍', label: 'Signing' },
  ]},
  { section: 'Integrations', items: [
    { id: 'integrations', icon: '⟳', label: 'Connections' },
    { id: 'ea',           icon: '◈', label: 'EA Agent',  badge: '●', badgeLive: true },
  ]},
]

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.logo}>
        <div className={styles.logoMark}>K8</div>
        <div>
          <div className={styles.logoName}>Kato.8 Studios</div>
          <div className={styles.logoSub}>HR Command Center</div>
        </div>
      </div>

      {NAV.map(group => (
        <div key={group.section} className={styles.navGroup}>
          <div className={styles.navLabel}>{group.section}</div>
          {group.items.map(item => (
            <button
              key={item.id}
              className={`${styles.navItem} ${currentPage === item.id ? styles.active : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={currentPage === item.id ? 'page' : undefined}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel2}>{item.label}</span>
              {item.badge && (
                <span className={`${styles.badge} ${item.badgeWarn ? styles.badgeWarn : ''} ${item.badgeLive ? styles.badgeLive : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      ))}

      <div className={styles.footer}>
        <div className={styles.footerMode}>Revenue Share Mode</div>
        <div className={styles.footerStatus}>● All systems operational</div>
      </div>
    </nav>
  )
}

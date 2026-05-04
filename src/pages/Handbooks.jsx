import { useState } from 'react'
import { HANDBOOKS } from '../data/handbooks.js'
import { PageHeader, PageContent, Card, Tag, Button } from '../components/UI.jsx'
import styles from './Pages.module.css'

const HANDBOOK_META = {
  studio: { color: 'purple', icon: '📖', badge: 'General' },
  sb553:  { color: 'red',    icon: '🛡️', badge: 'Required · Due May 6' },
  ccpa:   { color: 'blue',   icon: '🔒', badge: 'Required' },
}

function ContentBlock({ item }) {
  switch (item.type) {
    case 'heading':
      return <div className={styles.hbHeading}>{item.text}</div>
    case 'para':
      return <p className={styles.hbPara}>{item.text}</p>
    case 'bullet':
      return (
        <div className={styles.hbBullet}>
          <span className={styles.hbBulletDot}>·</span>
          <span>{item.text}</span>
        </div>
      )
    case 'subbullet':
      return (
        <div className={styles.hbSubbullet}>
          <span className={styles.hbBulletDot}>–</span>
          <span>{item.text}</span>
        </div>
      )
    case 'bold':
      return <div className={styles.hbBold}>{item.text}</div>
    case 'divider':
      return <div className={styles.hbDivider} />
    default:
      return <p className={styles.hbPara}>{item.text}</p>
  }
}

export default function Handbooks() {
  const [activeId, setActiveId] = useState('sb553')
  const active = HANDBOOKS.find(h => h.id === activeId)

  function handlePrint() {
    window.print()
  }

  return (
    <>
      <PageHeader
        title="HR Handbooks"
        subtitle="CA-compliant policies for Kato.8 Studios · Revenue share studio"
        actions={
          <>
            <Button variant="default" size="sm" onClick={handlePrint}>Print / Save PDF</Button>
          </>
        }
      />
      <PageContent>
        {/* Handbook selector */}
        <div className={styles.hbSelector}>
          {HANDBOOKS.map(h => {
            const meta = HANDBOOK_META[h.id] || {}
            return (
              <div
                key={h.id}
                className={`${styles.hbCard} ${activeId === h.id ? styles.hbCardActive : ''}`}
                onClick={() => setActiveId(h.id)}
              >
                <div className={styles.hbCardIcon}>{meta.icon}</div>
                <div className={styles.hbCardInfo}>
                  <div className={styles.hbCardTitle}>{h.title}</div>
                  <div className={styles.hbCardSub}>{h.subtitle}</div>
                  {meta.badge && (
                    <Tag color={meta.color} style={{ marginTop: 6, display: 'inline-block' }}>
                      {meta.badge}
                    </Tag>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Handbook document */}
        {active && (
          <Card className={styles.hbDocument}>
            <div className={styles.hbDocHeader}>
              <div>
                <div className={styles.hbDocTitle}>{active.title}</div>
                <div className={styles.hbDocSub}>{active.subtitle}</div>
                <div className={styles.hbDocMeta}>Kato.8 Studios · Last updated: {active.lastUpdated} · terryt@kato8studios.com</div>
              </div>
              <div className={styles.hbDocActions}>
                <Tag color={HANDBOOK_META[active.id]?.color || 'default'}>
                  {HANDBOOK_META[active.id]?.badge || 'Policy'}
                </Tag>
              </div>
            </div>

            <div className={styles.hbDocDivider} />

            <div className={styles.hbToc}>
              <div className={styles.hbTocLabel}>Sections</div>
              <div className={styles.hbTocItems}>
                {active.sections.map((sec, i) => (
                  <a
                    key={sec.id}
                    href={`#hb-${sec.id}`}
                    className={styles.hbTocItem}
                    onClick={e => {
                      e.preventDefault()
                      document.getElementById(`hb-${sec.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                  >
                    <span className={styles.hbTocNum}>{i + 1}</span>
                    {sec.title}
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.hbDocDivider} />

            <div className={styles.hbBody}>
              {active.sections.map((sec, i) => (
                <div key={sec.id} id={`hb-${sec.id}`} className={styles.hbSection}>
                  <div className={styles.hbSectionHeader}>
                    <span className={styles.hbSectionNum}>{i + 1}</span>
                    <span className={styles.hbSectionTitle}>{sec.title}</span>
                  </div>
                  <div className={styles.hbSectionBody}>
                    {sec.content.map((item, j) => (
                      <ContentBlock key={j} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.hbDocFooter}>
              <div>Kato.8 Studios · {active.title} · Effective {active.lastUpdated}</div>
              <div>Questions: terryt@kato8studios.com</div>
            </div>
          </Card>
        )}
      </PageContent>
    </>
  )
}

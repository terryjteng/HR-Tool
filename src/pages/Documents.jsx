import { DOCUMENTS } from '../data/studioData.js'
import { PageHeader, PageContent, Card, CardHeader, Button, StatusBadge, Tag } from '../components/UI.jsx'
import styles from './Pages.module.css'

const ICONS = { template:'📄', policy:'📋', reference:'📁' }
const ICON_COLORS = { template:'#EEEDFE', policy:'#E1F5EE', reference:'#FAEEDA' }

export default function Documents() {
  return (
    <>
      <PageHeader
        title="Documents"
        subtitle="Templates, policies, and signed agreements"
        actions={<Button variant="primary" size="sm">+ Upload doc</Button>}
      />
      <PageContent>
        <Card>
          <CardHeader title="Document vault" action="Open Drive →" />
          {DOCUMENTS.map(doc => (
            <div key={doc.id} className={styles.docRow}>
              <div className={styles.docIcon} style={{ background: ICON_COLORS[doc.type] }}>
                {ICONS[doc.type]}
              </div>
              <div className={styles.docName}>{doc.name}</div>
              <div className={styles.docLocation}>{doc.location}</div>
              {doc.note && <div className={styles.docNote}>{doc.note}</div>}
              <StatusBadge status={doc.status} />
            </div>
          ))}
        </Card>
      </PageContent>
    </>
  )
}

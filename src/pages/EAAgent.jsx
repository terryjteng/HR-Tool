import { PageHeader, PageContent, Card, CardHeader, Tag, Grid } from '../components/UI.jsx'
import styles from './Pages.module.css'

const EA_COMMANDS = [
  { label:'Draft offer / revenue share agreement', prompt:'Draft a revenue share offer letter for a new Kato.8 Studios collaborator' },
  { label:'Check compliance deadlines this week', prompt:'What HR compliance tasks are due this week for Kato.8 Studios?' },
  { label:'Headcount + open roles report', prompt:'Summarize current headcount, open roles, and team structure at Kato.8 Studios' },
  { label:'Start onboarding flow', prompt:'Kick off onboarding for a new Kato.8 Studios collaborator — what needs to happen before Day 1?' },
  { label:'Schedule performance check-ins', prompt:'Schedule the Day 30 check-in and 90-day review for Alex Martinez at Kato.8 Studios via Google Calendar' },
  { label:'Pending signatures in DocuSign', prompt:'What documents are pending signature in DocuSign for Kato.8 Studios right now?' },
  { label:'Update revenue share agreement', prompt:'Help me update the Kato.8 Studios revenue share agreement template' },
  { label:'Discord #hr-ops setup', prompt:'Help me set up the Kato.8 Studios #hr-ops Discord channel with EA agent notifications' },
  { label:'Draft SB 553 handbook section', prompt:'Draft the CA SB 553 workplace violence prevention section for the Kato.8 Studios employee handbook' },
  { label:'CCPA privacy notice', prompt:'Draft a CCPA privacy notice for Kato.8 Studios collaborators' },
]

const WORKFLOWS = [
  { icon:'✍️', title:'DocuSign signing events', desc:'When an agreement is signed or declined in DocuSign, EA updates the compliance checklist and files the document to Google Drive automatically.', status:'Needs webhook setup' },
  { icon:'📅', title:'Onboarding milestone scheduling', desc:'EA creates Google Calendar events for all onboarding checkpoints (Day 1, Week 1 goals, Day 30 review) when a new collaborator is added.', status:'Active' },
  { icon:'💬', title:'Discord compliance alerts', desc:'EA posts to #hr-ops when compliance items are due, documents are expiring, or agreements need signatures.', status:'Needs Discord webhook' },
  { icon:'📁', title:'Drive document indexing', desc:'EA reads Google Drive to answer team questions about policies, find templates, and check what agreements are on file.', status:'Active' },
]

export default function EAAgent() {
  return (
    <>
      <PageHeader
        title="Executive Assistant"
        subtitle="AI agent with full HR platform access — drafting, scheduling, compliance, and onboarding"
        actions={<Tag color="green">● Connected</Tag>}
      />
      <PageContent>
        <div style={{
          background:'linear-gradient(135deg, var(--k8-accent-light) 0%, var(--k8-teal-light) 100%)',
          border:'0.5px solid var(--k8-accent)',
          borderRadius:'var(--radius-lg)',
          padding:'16px 20px'
        }}>
          <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--k8-accent)', color:'#fff', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>◈</div>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:'var(--text-primary)' }}>EA Agent — HR Integration Active</div>
              <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:3, lineHeight:1.6 }}>
                The EA agent has full access to this HR platform and can act on your behalf across all modules. Connected to: Google Drive, Google Calendar. Pending: DocuSign webhook, Discord webhook.
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader title="Quick commands" />
          <div className={styles.eaCommands}>
            {EA_COMMANDS.map((cmd, i) => (
              <button key={i} className={styles.eaCmd}>
                {cmd.label} ↗
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Automated workflows" />
          {WORKFLOWS.map((w, i) => (
            <div key={i} style={{ display:'flex', gap:12, padding:'12px 0', borderBottom: i < WORKFLOWS.length-1 ? '0.5px solid var(--border-light)' : 'none' }}>
              <div style={{ width:36, height:36, borderRadius:8, background:'var(--bg-secondary)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{w.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:'var(--text-primary)' }}>{w.title}</div>
                <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2, lineHeight:1.5 }}>{w.desc}</div>
              </div>
              <Tag color={w.status === 'Active' ? 'green' : 'amber'}>{w.status}</Tag>
            </div>
          ))}
        </Card>
      </PageContent>
    </>
  )
}

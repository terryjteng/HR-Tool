// ─── OrgChart.jsx ─────────────────────────────────────────────────────────────
import { ORG } from '../data/studioData.js'
import { PageHeader, PageContent, Card, CardHeader, Button } from '../components/UI.jsx'
import styles from './Pages.module.css'

const COLOR_MAP = {
  executive: { bg:'#EEEDFE', name:'#26215C', role:'#534AB7', border:'#AFA9EC' },
  creative:  { bg:'#E1F5EE', name:'#04342C', role:'#0F6E56', border:'#5DCAA5' },
  production:{ bg:'#FAEEDA', name:'#412402', role:'#854F0B', border:'#EF9F27' },
  tech:      { bg:'#E6F1FB', name:'#042C53', role:'#185FA5', border:'#85B7EB' },
  ops:       { bg:'#FAECE7', name:'#4A1B0C', role:'#993C1D', border:'#F0997B' },
  vacant:    { bg:'var(--bg-secondary)', name:'var(--text-secondary)', role:'var(--text-tertiary)', border:'var(--border-medium)', dashed:true },
}

function OrgNode({ node }) {
  const c = COLOR_MAP[node.color] || COLOR_MAP.vacant
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'0 6px' }}>
      <div
        style={{
          padding:'8px 12px', borderRadius:8, border:`0.5px ${c.dashed?'dashed':'solid'} ${c.border}`,
          background:c.bg, cursor:'pointer', textAlign:'center', minWidth:100, maxWidth:150,
          transition:'all 0.15s'
        }}
        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,.08)' }}
        onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}
      >
        <div style={{ fontSize:12, fontWeight:500, color:c.name, whiteSpace:'nowrap' }}>{node.name}</div>
        <div style={{ fontSize:10, color:c.role, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:130 }}>{node.role}</div>
        {node.vacant && <div style={{ fontSize:9, background:'#FAEEDA', color:'#633806', padding:'1px 5px', borderRadius:6, marginTop:3, display:'inline-block' }}>Hiring</div>}
      </div>
      {node.children && (
        <>
          <div style={{ width:1, height:18, background:'var(--border-medium)' }} />
          <div style={{ position:'relative', display:'flex', gap:0 }}>
            {node.children.length > 1 && (
              <div style={{
                position:'absolute', top:0, height:1, background:'var(--border-medium)',
                left:`calc(${100/node.children.length/2}% + 6px)`,
                right:`calc(${100/node.children.length/2}% + 6px)`
              }} />
            )}
            {node.children.map(child => <OrgNode key={child.id} node={child} />)}
          </div>
        </>
      )}
    </div>
  )
}

export default function OrgChart() {
  return (
    <>
      <PageHeader
        title="Org Chart"
        subtitle="Kato.8 Studios · 4 departments · 3 open roles"
        actions={<Button variant="primary" size="sm">+ Add role</Button>}
      />
      <PageContent>
        <Card>
          <CardHeader title="Kato.8 Studios organization" action="Export →" />
          <div style={{ overflowX:'auto' }}>
            <div style={{ minWidth:900, padding:'10px 0 20px', display:'flex', flexDirection:'column', alignItems:'center' }}>
              <OrgNode node={ORG} />
            </div>
          </div>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap', paddingTop:14, borderTop:'0.5px solid var(--border-light)', fontSize:12, color:'var(--text-secondary)' }}>
            {Object.entries(COLOR_MAP).filter(([k])=>k!=='ops').map(([k,v])=>(
              <div key={k} style={{ display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:v.border }} />
                {k.charAt(0).toUpperCase()+k.slice(1)}
              </div>
            ))}
          </div>
        </Card>
      </PageContent>
    </>
  )
}

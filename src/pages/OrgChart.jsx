import { useState } from 'react'
import { ORG, TEAM, TEAMS } from '../data/studioData.js'
import { PageHeader, PageContent, Card, Avatar, Tag, Button } from '../components/UI.jsx'
import ProfileModal from '../components/ProfileModal.jsx'
import styles from './Pages.module.css'

const COLOR_MAP = {
  executive:   { bg:'#EEEDFE', name:'#26215C', role:'#534AB7', border:'#AFA9EC' },
  design:      { bg:'#E1F5EE', name:'#04342C', role:'#0F6E56', border:'#5DCAA5' },
  engineering: { bg:'#E6F1FB', name:'#042C53', role:'#185FA5', border:'#85B7EB' },
  art:         { bg:'#FAEEDA', name:'#412402', role:'#854F0B', border:'#EF9F27' },
  uiux:        { bg:'#F5EFFE', name:'#2E1065', role:'#7C3AED', border:'#C4B5FD' },
  audio:       { bg:'#FAECE7', name:'#4A1B0C', role:'#993C1D', border:'#F0997B' },
  vacant:      { bg:'var(--bg-secondary)', name:'var(--text-secondary)', role:'var(--text-tertiary)', border:'var(--border-medium)', dashed:true },
}
const DEPT_LABELS = { executive:'Executive', design:'Design', engineering:'Engineering', art:'Art', uiux:'UI/UX', audio:'Audio', vacant:'Vacant' }
const TEAM_COLORS_CSS = { studio:'var(--k8-accent)', 'last-light':'var(--k8-teal)', corebound:'var(--k8-blue)', 'big-boss-cleanup':'var(--k8-amber)' }
const AVATAR_COLORS = ['purple','teal','amber','coral','blue','purple','teal','amber']

function OrgNode({ node, onPersonClick }) {
  const c = COLOR_MAP[node.color] || COLOR_MAP.vacant
  if (node.isGroup) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'0 8px' }}>
        <div style={{ padding:'3px 14px', borderRadius:20, background:c.border, color:'#fff', fontSize:10, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
          {node.name}
        </div>
        {node.children && (
          <>
            <div style={{ width:1, height:16, background:'var(--border-medium)' }} />
            <div style={{ position:'relative', display:'flex', gap:0 }}>
              {node.children.length > 1 && (
                <div style={{ position:'absolute', top:0, height:1, background:'var(--border-medium)', left:`calc(${100/node.children.length/2}% + 6px)`, right:`calc(${100/node.children.length/2}% + 6px)` }} />
              )}
              {node.children.map(child => (
                <OrgNode key={child.id} node={child} onPersonClick={onPersonClick} />
              ))}
            </div>
          </>
        )}
      </div>
    )
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'0 5px' }}>
      <div
        style={{ padding:'7px 11px', borderRadius:8, border:`0.5px ${c.dashed?'dashed':'solid'} ${c.border}`, background:c.bg, cursor:'pointer', textAlign:'center', minWidth:88, maxWidth:130, transition:'all 0.15s' }}
        onClick={() => !node.vacant && onPersonClick && onPersonClick(node)}
        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,.1)' }}
        onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}
        title={node.vacant ? '' : `Click to view ${node.name}'s profile`}
      >
        <div style={{ fontSize:11, fontWeight:600, color:c.name, whiteSpace:'nowrap' }}>{node.name}</div>
        <div style={{ fontSize:9, color:c.role, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:118 }}>{node.role}</div>
        {node.intern  && <div style={{ fontSize:8, background:'#EEEDFE', color:'#534AB7', padding:'1px 5px', borderRadius:6, marginTop:3, display:'inline-block' }}>Intern</div>}
        {node.vacant  && <div style={{ fontSize:8, background:'#FAEEDA', color:'#633806', padding:'1px 5px', borderRadius:6, marginTop:3, display:'inline-block' }}>Hiring</div>}
      </div>
      {node.children && (
        <>
          <div style={{ width:1, height:16, background:'var(--border-medium)' }} />
          <div style={{ position:'relative', display:'flex', gap:0 }}>
            {node.children.length > 1 && (
              <div style={{ position:'absolute', top:0, height:1, background:'var(--border-medium)', left:`calc(${100/node.children.length/2}% + 5px)`, right:`calc(${100/node.children.length/2}% + 5px)` }} />
            )}
            {node.children.map(child => (
              <OrgNode key={child.id} node={child} onPersonClick={onPersonClick} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function TeamView({ onPersonClick }) {
  return (
    <div className={styles.teamGridView}>
      {TEAMS.map((t, ti) => {
        const members = TEAM.filter(m => m.team === t.id)
        const leads   = members.filter(m => m.role.toLowerCase().includes('lead') || m.role.toLowerCase().includes('ceo') || m.role.toLowerCase().includes('founder'))
        const rest    = members.filter(m => !leads.includes(m))
        return (
          <div key={t.id} className={styles.teamCard} style={{ '--team-accent': TEAM_COLORS_CSS[t.id] }}>
            <div className={styles.teamCardHeader}>
              <span className={styles.teamCardIcon}>{t.icon}</span>
              <div>
                <div className={styles.teamCardName}>{t.label}</div>
                <div className={styles.teamCardDesc}>{t.desc}</div>
              </div>
              <span className={styles.teamCardCount}>{members.length}</span>
            </div>
            {leads.length > 0 && (
              <div className={styles.teamLeadSection}>
                <div className={styles.teamLeadLabel}>Leads</div>
                <div className={styles.teamLeadRow}>
                  {leads.map((m, i) => (
                    <div
                      key={m.id}
                      className={styles.teamMemberPill}
                      style={{ borderColor: TEAM_COLORS_CSS[t.id], cursor:'pointer' }}
                      onClick={() => onPersonClick(m)}
                    >
                      <Avatar initials={m.initials} color={AVATAR_COLORS[(ti * 4 + i) % AVATAR_COLORS.length]} size="sm" />
                      <div>
                        <div className={styles.teamMemberName}>{m.name}</div>
                        <div className={styles.teamMemberRole}>{m.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {rest.length > 0 && (
              <div className={styles.teamRestRow}>
                {rest.map((m, i) => (
                  <div
                    key={m.id}
                    className={styles.teamChip}
                    style={{ cursor:'pointer' }}
                    onClick={() => onPersonClick(m)}
                  >
                    <Avatar initials={m.initials} color={AVATAR_COLORS[(ti * 4 + i) % AVATAR_COLORS.length]} size="xs" />
                    <span className={styles.teamChipName}>{m.name}</span>
                    {m.type === 'intern' && <span className={styles.teamInternDot} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function OrgChart() {
  const [view, setView] = useState('dept')
  const [profileMember, setProfileMember] = useState(null)

  const openProfile = node => {
    if (!node || node.vacant) return
    const member = TEAM.find(m => m.id === node.id) || node
    const idx = TEAM.findIndex(m => m.id === member.id)
    setProfileMember({ member, avatarIdx: idx >= 0 ? idx : 0 })
  }

  return (
    <>
      {profileMember && (
        <ProfileModal
          member={profileMember.member}
          avatarIdx={profileMember.avatarIdx}
          onClose={() => setProfileMember(null)}
          onSave={() => setProfileMember(null)}
        />
      )}
      <PageHeader
        title="Org Chart"
        subtitle="Kato.8 Studios · 6 departments · 4 project teams · 39 active members"
        actions={<Button variant="primary" size="sm">+ Add role</Button>}
      />
      <PageContent>
        <Card>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <span style={{ fontSize:13, fontWeight:500, color:'var(--text-primary)' }}>Kato.8 Studios organization</span>
            <div className={styles.viewToggleGroup}>
              <button className={`${styles.viewToggleBtn} ${view==='dept'?styles.viewToggleActive:''}`} onClick={() => setView('dept')}>By Department</button>
              <button className={`${styles.viewToggleBtn} ${view==='team'?styles.viewToggleActive:''}`} onClick={() => setView('team')}>By Project Team</button>
            </div>
          </div>

          {view === 'dept' && (
            <>
              <div style={{ overflowX:'auto', overflowY:'visible', margin:'0 -20px', padding:'0 20px' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'12px 80px 28px', width:'max-content', minWidth:'100%' }}>
                  <OrgNode node={ORG} onPersonClick={openProfile} />
                </div>
              </div>
              <div style={{ display:'flex', gap:14, flexWrap:'wrap', paddingTop:14, borderTop:'0.5px solid var(--border-light)', fontSize:12, color:'var(--text-secondary)', marginTop:8 }}>
                {Object.entries(COLOR_MAP).map(([k, v]) => (
                  <div key={k} style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:v.border }} />
                    {DEPT_LABELS[k]}
                  </div>
                ))}
                <span style={{ marginLeft:'auto', fontSize:11 }}>Click any person to view / edit profile</span>
              </div>
            </>
          )}

          {view === 'team' && (
            <>
              <TeamView onPersonClick={openProfile} />
              <div style={{ display:'flex', gap:14, flexWrap:'wrap', paddingTop:14, borderTop:'0.5px solid var(--border-light)', fontSize:12, color:'var(--text-secondary)' }}>
                {TEAMS.map(t => (
                  <div key={t.id} style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background: TEAM_COLORS_CSS[t.id] }} />
                    {t.label}
                  </div>
                ))}
                <span style={{ marginLeft:'auto', fontSize:11 }}>· = intern · Click any member to view / edit profile</span>
              </div>
            </>
          )}
        </Card>
      </PageContent>
    </>
  )
}

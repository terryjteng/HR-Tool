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

const VERTICALS = [
  { id:'studio',           label:'Overall Studio',    icon:'◈', accent:'var(--k8-accent)', desc:'Full org — all departments and teams' },
  { id:'social',           label:'Social Media',      icon:'📣', accent:'#E1306C',         desc:'Marketing, social media & brand' },
  { id:'last-light',       label:'Last Light',        icon:'◐', accent:'var(--k8-teal)',   desc:'Last Light project team' },
  { id:'corebound',        label:'Corebound',         icon:'◉', accent:'var(--k8-blue)',   desc:'Corebound project team' },
  { id:'big-boss-cleanup', label:'Big Boss Cleanup',  icon:'◎', accent:'var(--k8-amber)',  desc:'Big Boss Cleanup project team' },
]

// ─── Social / marketing vertical members ─────────────────────────────────────
const SOCIAL_IDS = ['ceo', 'exec-001', 'ux-001', 'ux-002', 'ux-003', 'ux-004']

// ─── Org tree component (dept view) ──────────────────────────────────────────
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

// ─── Project-team / social vertical card view ─────────────────────────────────
function VerticalTeamView({ memberIds, teamId, accent, onPersonClick }) {
  const members = memberIds
    ? TEAM.filter(m => memberIds.includes(m.id) && m.status !== 'former')
    : TEAM.filter(m => m.team === teamId && m.status !== 'former')

  const deptOrder = ['executive', 'design', 'engineering', 'art', 'uiux', 'audio']
  const byDept = deptOrder.reduce((acc, d) => {
    const group = members.filter(m => m.dept === d)
    if (group.length) acc[d] = group
    return acc
  }, {})

  const isLead = m => m.role.toLowerCase().includes('lead') || m.role.toLowerCase().includes('ceo') || m.role.toLowerCase().includes('founder')

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {Object.entries(byDept).map(([dept, deptMembers]) => {
        const c = COLOR_MAP[dept] || COLOR_MAP.vacant
        const leads = deptMembers.filter(isLead)
        const rest  = deptMembers.filter(m => !isLead(m))
        return (
          <div key={dept}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:c.border }} />
              <span style={{ fontSize:11, fontWeight:700, color:c.name, textTransform:'uppercase', letterSpacing:'0.06em' }}>
                {DEPT_LABELS[dept]}
              </span>
              <span style={{ fontSize:11, color:'var(--text-tertiary)' }}>{deptMembers.length} member{deptMembers.length !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {[...leads, ...rest].map((m, i) => {
                const isL = isLead(m)
                return (
                  <div
                    key={m.id}
                    onClick={() => onPersonClick(m)}
                    style={{
                      display:'flex', alignItems:'center', gap:8, padding:'8px 12px',
                      borderRadius:8, border:`0.5px solid ${isL ? c.border : 'var(--border-light)'}`,
                      background: isL ? c.bg : 'var(--bg-primary)',
                      cursor:'pointer', transition:'all 0.15s', minWidth:160,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 3px 10px rgba(0,0,0,.08)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}
                  >
                    <Avatar initials={m.initials} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} size="sm" />
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:isL ? 600 : 500, color:'var(--text-primary)', whiteSpace:'nowrap' }}>{m.name}</div>
                      <div style={{ fontSize:10, color:'var(--text-secondary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:120 }}>{m.role}</div>
                      {m.type === 'intern' && <span style={{ fontSize:9, background:'#EEEDFE', color:'#534AB7', padding:'1px 4px', borderRadius:4, marginTop:2, display:'inline-block' }}>Intern</span>}
                      {isL && !m.type !== 'intern' && <span style={{ fontSize:9, background:c.bg, color:c.role, border:`0.5px solid ${c.border}`, padding:'1px 4px', borderRadius:4, marginTop:2, display:'inline-block' }}>Lead</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Studio-wide "By Team" cards ─────────────────────────────────────────────
function TeamView({ onPersonClick }) {
  return (
    <div className={styles.teamGridView}>
      {TEAMS.map((t, ti) => {
        const members = TEAM.filter(m => m.team === t.id && m.status !== 'former')
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
                    <div key={m.id} className={styles.teamMemberPill} style={{ borderColor: TEAM_COLORS_CSS[t.id], cursor:'pointer' }} onClick={() => onPersonClick(m)}>
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
                  <div key={m.id} className={styles.teamChip} style={{ cursor:'pointer' }} onClick={() => onPersonClick(m)}>
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function OrgChart() {
  const [vertical, setVertical]     = useState('studio')
  const [deptView,  setDeptView]    = useState('dept')
  const [profileMember, setProfileMember] = useState(null)

  const openProfile = node => {
    if (!node || node.vacant) return
    const member = TEAM.find(m => m.id === node.id) || node
    const idx = TEAM.findIndex(m => m.id === member.id)
    setProfileMember({ member, avatarIdx: idx >= 0 ? idx : 0 })
  }

  const currentVertical = VERTICALS.find(v => v.id === vertical)
  const activeTeamCount = TEAM.filter(m => m.status !== 'former' && (vertical === 'studio' ? true : vertical === 'social' ? SOCIAL_IDS.includes(m.id) : m.team === vertical)).length

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

        {/* Vertical selector */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
          {VERTICALS.map(v => {
            const count = v.id === 'studio' ? TEAM.filter(m => m.status !== 'former').length
              : v.id === 'social' ? TEAM.filter(m => SOCIAL_IDS.includes(m.id) && m.status !== 'former').length
              : TEAM.filter(m => m.team === v.id && m.status !== 'former').length
            const active = vertical === v.id
            return (
              <button
                key={v.id}
                onClick={() => setVertical(v.id)}
                style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'7px 14px', borderRadius:8,
                  border:`0.5px solid ${active ? v.accent : 'var(--border-light)'}`,
                  background: active ? `color-mix(in srgb, ${v.accent} 10%, white)` : 'var(--bg-primary)',
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize:12, fontWeight: active ? 600 : 400,
                  cursor:'pointer', transition:'all 0.15s',
                }}
              >
                <span style={{ fontSize:13 }}>{v.icon}</span>
                {v.label}
                <span style={{
                  fontSize:10, fontWeight:600, padding:'1px 5px', borderRadius:10,
                  background: active ? v.accent : 'var(--bg-secondary)',
                  color: active ? '#fff' : 'var(--text-secondary)',
                }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <Card>
          {/* Header row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>
                {currentVertical?.icon} {currentVertical?.label}
              </span>
              <span style={{ fontSize:12, color:'var(--text-secondary)', marginLeft:8 }}>
                {currentVertical?.desc} · {activeTeamCount} members
              </span>
            </div>
            {vertical === 'studio' && (
              <div className={styles.viewToggleGroup}>
                <button className={`${styles.viewToggleBtn} ${deptView==='dept'?styles.viewToggleActive:''}`} onClick={() => setDeptView('dept')}>By Department</button>
                <button className={`${styles.viewToggleBtn} ${deptView==='team'?styles.viewToggleActive:''}`} onClick={() => setDeptView('team')}>By Project Team</button>
              </div>
            )}
          </div>

          {/* Studio — full org tree or team grid */}
          {vertical === 'studio' && deptView === 'dept' && (
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
          {vertical === 'studio' && deptView === 'team' && (
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

          {/* Social Media vertical */}
          {vertical === 'social' && (
            <>
              <div style={{ background:'#FFF0F5', border:'0.5px solid #FECDD3', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:12, color:'#9F1239' }}>
                <strong>Social Media & Marketing</strong> — This vertical covers brand, content, and social operations. Aaron Rodriguez leads marketing strategy; Tessa Lee's UI/UX team handles social media execution and content publishing.
              </div>
              <VerticalTeamView memberIds={SOCIAL_IDS} accent="#E1306C" onPersonClick={openProfile} />
            </>
          )}

          {/* Project team verticals */}
          {['last-light','corebound','big-boss-cleanup'].includes(vertical) && (
            <>
              {(() => {
                const t = TEAMS.find(t => t.id === vertical)
                return (
                  <div style={{ background:`color-mix(in srgb, ${TEAM_COLORS_CSS[vertical]} 8%, white)`, border:`0.5px solid color-mix(in srgb, ${TEAM_COLORS_CSS[vertical]} 30%, white)`, borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:12, color:'var(--text-primary)' }}>
                    <strong>{t?.icon} {t?.label}</strong> — {t?.desc}
                  </div>
                )
              })()}
              <VerticalTeamView teamId={vertical} accent={TEAM_COLORS_CSS[vertical]} onPersonClick={openProfile} />
              <div style={{ paddingTop:14, borderTop:'0.5px solid var(--border-light)', marginTop:16, fontSize:11, color:'var(--text-secondary)' }}>
                Click any member to view / edit profile · Lead cards are highlighted
              </div>
            </>
          )}
        </Card>
      </PageContent>
    </>
  )
}

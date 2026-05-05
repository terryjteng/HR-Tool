// ─── TEAM DATA ────────────────────────────────────────────────────────────────
export const TEAM = [
  // ── Executive ──────────────────────────────────────────────────────────────
  { id:'ceo',      name:'Terry Teng',       initials:'TT', dept:'executive', type:'revenue-share', status:'active', location:'Mission Hills, CA', role:'Founder & CEO',              team:'studio',           email:'terryt.kato.8@gmail.com',            timezone:'PST', noMeetingDays:'Tuesdays',                  oneOnOneDays:'Mon, Wed–Fri' },
  { id:'exec-001', name:'Aaron Rodriguez',  initials:'AR', dept:'executive', type:'revenue-share', status:'active', location:'Remote',           role:'Marketing & Creative Writer', team:'studio',           email:'ajr.contact@gmail.com',              timezone:'PST', noMeetingDays:'N/A',                       oneOnOneDays:'Flexible with notice' },

  // ── Design — Last Light ────────────────────────────────────────────────────
  { id:'des-001',  name:'Ryan Kenfield',    initials:'RK', dept:'design', type:'revenue-share', status:'active', location:'Remote', role:'Lead Game Designer',    team:'last-light',       email:'ryankenfield@gmail.com',             timezone:'MST', noMeetingDays:'Fri, Sat, Sun',             oneOnOneDays:'Flexible with notice' },
  { id:'des-002',  name:'Luis Castrejon',   initials:'LC', dept:'design', type:'revenue-share', status:'active', location:'Remote', role:'Game Designer',         team:'last-light',       email:'luis.c.castrejon@gmail.com',         timezone:'CST', noMeetingDays:'Mon–Fri 8AM–4PM',           oneOnOneDays:'Mon–Fri after 4PM, weekends' },
  { id:'des-003',  name:'Ashlee Walker',    initials:'AW', dept:'design', type:'intern',         status:'active', location:'Remote', role:'Design Intern',         team:'last-light',       email:'Akw4723@gmail.com',                  timezone:'CST', noMeetingDays:'N/A',                       oneOnOneDays:'Flexible if planned in advance' },
  { id:'des-004',  name:'Cori M',           initials:'CM', dept:'design', type:'intern',         status:'active', location:'Remote', role:'Design Intern',         team:'last-light' },

  // ── Design — Corebound ─────────────────────────────────────────────────────
  { id:'des-005',  name:'Pride St. Clair',  initials:'PC', dept:'design', type:'revenue-share', status:'active', location:'Remote', role:'Lead Game Designer',    team:'corebound',        email:'pridethesaint@gmail.com',            timezone:'PST', noMeetingDays:'N/A',                       oneOnOneDays:'Mon–Fri' },
  { id:'des-006',  name:'Ryan Folk',        initials:'RF', dept:'design', type:'revenue-share', status:'active', location:'Remote', role:'Game & Level Designer', team:'corebound',        email:'rhinoswim@gmail.com',                timezone:'CST', noMeetingDays:'N/A',                       oneOnOneDays:'Mon–Fri, preferably 12–2 CST' },
  { id:'des-007',  name:'Lauren Palumbo',   initials:'LP', dept:'design', type:'revenue-share', status:'active', location:'Remote', role:'Game Designer & Writer', team:'corebound',       email:'laurenpalumbo4@gmail.com',           timezone:'EST', noMeetingDays:'Mon, Wed',                  oneOnOneDays:'Fri, weekends, Mon/Wed before 4PM EST' },

  // ── Design — Big Boss Cleanup ──────────────────────────────────────────────
  { id:'des-008',  name:'Sophia J',         initials:'SJ', dept:'design', type:'revenue-share', status:'active', location:'Remote', role:'Lead Game Designer',    team:'big-boss-cleanup', email:'sophiaj1044@gmail.com',              timezone:'PST', noMeetingDays:'N/A',                       oneOnOneDays:'Weekdays before 9:30–10AM PST' },

  // ── Former designers ───────────────────────────────────────────────────────
  { id:'des-FRM',  name:'Ryan Piehl',       initials:'RP', dept:'design', type:'revenue-share', status:'former', location:'Remote', role:'Game Designer',         team:'corebound',        email:'Ryanpiehl19@gmail.com',              timezone:'EST' },

  // ── Engineering — Last Light ───────────────────────────────────────────────
  { id:'eng-001',  name:'Carlos Trujillo',  initials:'CT', dept:'engineering', type:'revenue-share', status:'active', location:'Remote', role:'Lead Engineer',    team:'last-light',       email:'trujillo.r.c.06@gmail.com',          timezone:'PST', noMeetingDays:'N/A',                       oneOnOneDays:'Flexible with notice' },

  // ── Engineering — Corebound ────────────────────────────────────────────────
  { id:'eng-002',  name:'Rhianna Pinkerton',initials:'RH', dept:'engineering', type:'revenue-share', status:'active', location:'Remote', role:'Lead Engineer',    team:'corebound',        email:'rhiannapinkerton@gmail.com',         timezone:'PST', noMeetingDays:'N/A',                       oneOnOneDays:'Flexible with notice' },

  // ── Engineering — Big Boss Cleanup ────────────────────────────────────────
  { id:'eng-003',  name:'Daniel Fornell',   initials:'DF', dept:'engineering', type:'revenue-share', status:'active', location:'Remote', role:'Unreal Developer', team:'big-boss-cleanup', email:'dafornell@gmail.com',                timezone:'EST', noMeetingDays:'Sundays',                   oneOnOneDays:'Daily post 1:30PM EST, very flexible' },
  { id:'eng-004',  name:'Michael A',        initials:'MA', dept:'engineering', type:'revenue-share', status:'active', location:'Remote', role:'Eng / Dev',        team:'big-boss-cleanup' },

  // ── Art — Last Light ──────────────────────────────────────────────────────
  { id:'art-001',  name:'Bryan N',          initials:'BN', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'Lead Artist',             team:'last-light',       email:'artillory@gmail.com',                timezone:'PST', noMeetingDays:'Variable',                  oneOnOneDays:'Flexible with notice' },
  { id:'art-002',  name:'Mia Colebrooke',   initials:'MC', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'Animator',                team:'last-light',       email:'mvcolebrooke@gmail.com',             timezone:'CST', noMeetingDays:'N/A',                       oneOnOneDays:'Mon/Fri open, other days flexible' },
  { id:'art-003',  name:'Keolani Baumgart', initials:'KB', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'2D/Pixel Artist',         team:'last-light',       email:'keolanibaumgart@gmail.com',          timezone:'CST', noMeetingDays:'Mon–Fri 10AM–4PM',          oneOnOneDays:'Mon–Fri after 4PM CST, weekends' },
  { id:'art-004',  name:'Pedro Silva',      initials:'PS', dept:'art', type:'intern',         status:'active', location:'Remote', role:'Art Intern (2D / UX-UI)', team:'last-light',       email:'pedroslim2@gmail.com',               timezone:'CET', noMeetingDays:'Mondays',                   oneOnOneDays:'Flexible if previously agreed' },
  { id:'art-012',  name:'AJ Heyen',         initials:'AJ', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'3D Artist',               team:'last-light',       email:'aj@heyenarts.com',                   timezone:'CST', noMeetingDays:'Mon–Fri 1PM–11PM',          oneOnOneDays:'Weekdays before 1PM' },

  // ── Art — Corebound ───────────────────────────────────────────────────────
  { id:'art-005',  name:'Hailey Hebden',    initials:'HH', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'Lead Artist',             team:'corebound',        email:'haileyhebden@gmail.com',             timezone:'EST', noMeetingDays:'N/A',                       oneOnOneDays:'Mon or Tues after 10AM, all other days after 5PM' },
  { id:'art-006',  name:'Elizabeth Polilli',initials:'EP', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'Animator',                team:'corebound',        email:'erpolilli2002@gmail.com',            timezone:'EST', noMeetingDays:'Mondays',                   oneOnOneDays:'Flexible if told in advance' },
  { id:'art-007',  name:'Raynia P',         initials:'RP', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'2D Artist',               team:'corebound',        email:'raydiant.illustrations@gmail.com' },
  { id:'art-008',  name:'Juno Tran-Cao',    initials:'JT', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'Animator',                team:'corebound',        email:'trancaojuno@gmail.com',              timezone:'EST', noMeetingDays:'N/A',                       oneOnOneDays:'Flexible if planned in advance' },
  { id:'art-013',  name:'Mario Medrano',    initials:'MM', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'2D Artist & Animator',    team:'corebound',        email:'artist.mariojdmedrano@gmail.com',    timezone:'CST', noMeetingDays:'N/A',                       oneOnOneDays:'Can be scheduled with notice' },

  // ── Art — Big Boss Cleanup ────────────────────────────────────────────────
  { id:'art-009',  name:'Chris Camp',       initials:'CC', dept:'art', type:'revenue-share', status:'former', location:'Remote', role:'Lead Artist',             team:'big-boss-cleanup', email:'chrisrcampart@dayfornite.com',       timezone:'EST' },
  { id:'art-010',  name:'Luna Choe',        initials:'LC', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'3D Artist',               team:'big-boss-cleanup', email:'Choesenfilms@gmail.com',             timezone:'EST', noMeetingDays:'Tues–Sat after 4PM EST',    oneOnOneDays:'Flexible if planned in advance' },
  { id:'art-011',  name:'Jacob Holton',     initials:'JH', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'3D Artist',               team:'big-boss-cleanup', email:'jacob.holton@gmail.com',             timezone:'PST', noMeetingDays:'Sat, Sun, Mon–Fri after 5:30PM', oneOnOneDays:'Flexible with notice' },
  { id:'art-014',  name:'Jacob Chavez',     initials:'JC', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'3D Artist',               team:'big-boss-cleanup', email:'jcb.ccz@gmail.com',                  timezone:'CST', noMeetingDays:'Mondays',                   oneOnOneDays:'Tues–Fri around noon, flexible' },
  { id:'art-015',  name:'Thane Wisherop',   initials:'TW', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'3D Artist',               team:'big-boss-cleanup', email:'thanefunkey@gmail.com',              timezone:'PST', noMeetingDays:'Sat, Sun',                  oneOnOneDays:'Flexible with notice' },
  { id:'art-016',  name:'Ritvik Bhadury',   initials:'RB', dept:'art', type:'revenue-share', status:'active', location:'Remote', role:'3D Artist',               team:'big-boss-cleanup', email:'ritvikbhadury402@gmail.com',         timezone:'EST', noMeetingDays:'Wed, Sat, Sun',             oneOnOneDays:'Flexible with notice' },

  // ── UI/UX — Studio ────────────────────────────────────────────────────────
  { id:'ux-001',   name:'Tessa Lee',        initials:'TL', dept:'uiux', type:'intern',  status:'active', location:'Remote', role:'UI/UX Lead Intern',           team:'studio',           email:'tgtlee@gmail.com',                   timezone:'EST', noMeetingDays:'Mon–Thurs',                 oneOnOneDays:'Fridays and weekends' },
  { id:'ux-002',   name:'Adam Manning',     initials:'AM', dept:'uiux', type:'intern',  status:'active', location:'Remote', role:'UI/UX Eng Intern',            team:'studio',           email:'adam@thomasavl.com',                 timezone:'PST', noMeetingDays:'N/A',                       oneOnOneDays:'N/A' },
  { id:'ux-003',   name:'Katie L',          initials:'KL', dept:'uiux', type:'intern',  status:'active', location:'Remote', role:'UI/UX & Social Media Intern', team:'studio' },
  { id:'ux-004',   name:'Kit Hannay',       initials:'KH', dept:'uiux', type:'revenue-share', status:'active', location:'Remote', role:'UI Artist & 2D Animator', team:'studio',        email:'crowyoteayt@gmail.com',              timezone:'EST', noMeetingDays:'Tues–Thurs 10AM–5PM',       oneOnOneDays:'Can be scheduled with notice, prefer mornings/evenings' },

  // ── Audio & Voice — Studio ────────────────────────────────────────────────
  { id:'aud-001',  name:'Schwa Alvarez',    initials:'SA', dept:'audio', type:'revenue-share', status:'active', location:'Remote', role:'Sound Designer',        team:'studio',           email:'jschwaalvarez@gmail.com',            timezone:'PST', noMeetingDays:'Sun, Fri/Sat evenings',     oneOnOneDays:'Mon–Fri flexible if planned in advance' },
  { id:'aud-002',  name:'Ayako Yamauchi',   initials:'AY', dept:'audio', type:'revenue-share', status:'active', location:'Remote', role:'Sound Designer',        team:'studio',           email:'ayamauchistudio@gmail.com',          timezone:'PST', noMeetingDays:'N/A, discuss time by time', oneOnOneDays:'Flexible if planned in advance' },
  { id:'aud-003',  name:'Sandy C',          initials:'SC', dept:'audio', type:'revenue-share', status:'active', location:'Remote', role:'Music',                 team:'studio' },
  { id:'aud-004',  name:'Michael TB',       initials:'MT', dept:'audio', type:'revenue-share', status:'active', location:'Remote', role:'Voice',                 team:'studio' },
  { id:'aud-005',  name:'Janey',            initials:'JN', dept:'audio', type:'revenue-share', status:'active', location:'Remote', role:'Voice',                 team:'studio' },
  { id:'aud-006',  name:'Emmanuel',         initials:'EM', dept:'audio', type:'revenue-share', status:'active', location:'Remote', role:'2nd Voice',             team:'studio' },
]

// ─── PROJECT TEAMS ────────────────────────────────────────────────────────────
export const TEAMS = [
  { id:'studio',           label:'General Studio',   color:'purple', icon:'◈', desc:'Studio ops, UI/UX, audio & voice, marketing — cross-project support' },
  { id:'last-light',       label:'Last Light',        color:'teal',   icon:'◐', desc:'Art, design, and engineering for Last Light' },
  { id:'corebound',        label:'Corebound',         color:'blue',   icon:'◉', desc:'Art, design, and engineering for Corebound' },
  { id:'big-boss-cleanup', label:'Big Boss Cleanup',  color:'amber',  icon:'◎', desc:'Art, design, and engineering for Big Boss Cleanup' },
]

// ─── OPEN ROLES ───────────────────────────────────────────────────────────────
export const OPEN_ROLES = [
  { id:'role-001', title:'2D Animator',       dept:'art',     stage:'Actively Hiring', candidates:0, urgent:false },
  { id:'role-002', title:'Lead Artist (BBC)', dept:'art',     stage:'Actively Hiring', candidates:0, urgent:true,  note:'Chris Camp departed — Big Boss Cleanup needs a lead.' },
]

// ─── ORG CHART ────────────────────────────────────────────────────────────────
export const ORG = {
  id: 'ceo',
  name: 'Terry Teng',
  role: 'Founder & CEO',
  color: 'executive',
  children: [
    {
      id: 'grp-exec',
      name: 'Executive',
      isGroup: true,
      color: 'executive',
      children: [
        { id:'exec-001', name:'Aaron Rodriguez', role:'Marketing & Creative Writer', color:'executive' },
      ],
    },
    {
      id: 'grp-design',
      name: 'Design',
      isGroup: true,
      color: 'design',
      children: [
        {
          id: 'des-001',
          name: 'Ryan Kenfield',
          role: 'Lead Designer — Last Light',
          color: 'design',
          children: [
            { id:'des-002', name:'Luis Castrejon', role:'Game Designer',   color:'design' },
            { id:'des-003', name:'Ashlee Walker',  role:'Design Intern',   color:'design', intern:true },
            { id:'des-004', name:'Cori M',         role:'Design Intern',   color:'design', intern:true },
          ],
        },
        {
          id: 'des-005',
          name: 'Pride St. Clair',
          role: 'Lead Designer — Corebound',
          color: 'design',
          children: [
            { id:'des-006', name:'Ryan Folk',      role:'Game Designer',   color:'design' },
            { id:'des-007', name:'Lauren Palumbo', role:'Game Designer & Writer', color:'design' },
          ],
        },
        { id:'des-008', name:'Sophia J', role:'Lead Designer — BBC', color:'design' },
      ],
    },
    {
      id: 'grp-eng',
      name: 'Engineering',
      isGroup: true,
      color: 'engineering',
      children: [
        { id:'eng-001', name:'Carlos Trujillo',   role:'Lead Engineer',    color:'engineering' },
        { id:'eng-002', name:'Rhianna Pinkerton', role:'Lead Engineer',    color:'engineering' },
        {
          id: 'eng-003',
          name: 'Daniel Fornell',
          role: 'Unreal Developer',
          color: 'engineering',
          children: [
            { id:'eng-004', name:'Michael A', role:'Eng / Dev', color:'engineering' },
          ],
        },
      ],
    },
    {
      id: 'grp-art',
      name: 'Art',
      isGroup: true,
      color: 'art',
      children: [
        {
          id: 'art-001',
          name: 'Bryan N',
          role: 'Lead Artist — Last Light',
          color: 'art',
          children: [
            { id:'art-002', name:'Mia Colebrooke',   role:'Animator',        color:'art' },
            { id:'art-003', name:'Keolani Baumgart', role:'2D/Pixel Artist', color:'art' },
            { id:'art-004', name:'Pedro Silva',      role:'Art Intern',      color:'art', intern:true },
            { id:'art-012', name:'AJ Heyen',         role:'3D Artist',       color:'art' },
          ],
        },
        {
          id: 'art-005',
          name: 'Hailey Hebden',
          role: 'Lead Artist — Corebound',
          color: 'art',
          children: [
            { id:'art-006', name:'Elizabeth Polilli', role:'Animator',          color:'art' },
            { id:'art-007', name:'Raynia P',          role:'2D Artist',         color:'art' },
            { id:'art-008', name:'Juno Tran-Cao',     role:'Animator',          color:'art' },
            { id:'art-013', name:'Mario Medrano',     role:'2D Artist / Anim.', color:'art' },
          ],
        },
        {
          id: 'grp-art-bbc',
          name: 'BBC Art',
          isGroup: true,
          color: 'art',
          children: [
            { id:'vacant-bbc-lead', name:'Lead Artist', role:'Open role — BBC', color:'vacant', vacant:true },
            { id:'art-010', name:'Luna Choe',      role:'3D Artist', color:'art' },
            { id:'art-011', name:'Jacob Holton',   role:'3D Artist', color:'art' },
            { id:'art-014', name:'Jacob Chavez',   role:'3D Artist', color:'art' },
            { id:'art-015', name:'Thane Wisherop', role:'3D Artist', color:'art' },
            { id:'art-016', name:'Ritvik Bhadury', role:'3D Artist', color:'art' },
          ],
        },
      ],
    },
    {
      id: 'grp-uiux',
      name: 'UI/UX',
      isGroup: true,
      color: 'uiux',
      children: [
        {
          id: 'ux-001',
          name: 'Tessa Lee',
          role: 'UI/UX Lead',
          color: 'uiux',
          children: [
            { id:'ux-002', name:'Adam Manning', role:'UI/UX Eng Intern',           color:'uiux', intern:true },
            { id:'ux-003', name:'Katie L',      role:'UI/UX & SM Intern',          color:'uiux', intern:true },
            { id:'ux-004', name:'Kit Hannay',   role:'UI Artist & 2D Animator',    color:'uiux' },
          ],
        },
      ],
    },
    {
      id: 'grp-audio',
      name: 'Audio & Voice',
      isGroup: true,
      color: 'audio',
      children: [
        { id:'aud-001', name:'Schwa Alvarez',  role:'Sound Designer', color:'audio' },
        { id:'aud-002', name:'Ayako Yamauchi', role:'Sound Designer', color:'audio' },
        { id:'aud-003', name:'Sandy C',        role:'Music',          color:'audio' },
        { id:'aud-004', name:'Michael TB',     role:'Voice',          color:'audio' },
        { id:'aud-005', name:'Janey',          role:'Voice',          color:'audio' },
        { id:'aud-006', name:'Emmanuel',       role:'2nd Voice',      color:'audio' },
      ],
    },
  ],
}

// ─── COMPLIANCE ───────────────────────────────────────────────────────────────
export const COMPLIANCE_ITEMS = [
  { id:'c-001', cat:'employment', title:'Update handbook — CA SB 553 (Workplace Violence Prevention)', desc:'All CA employers need a written Workplace Violence Prevention Plan. Must include incident response and investigation procedures.', priority:'critical', due:'2026-05-06', done:false },
  { id:'c-002', cat:'employment', title:'Pay transparency policy — CA SB 1162', desc:'All CA job postings must include pay scale ranges. Revenue share % counts as compensation — must be disclosed on all listings.', priority:'high', due:null, done:false },
  { id:'c-003', cat:'employment', title:'FLSA exempt / non-exempt classification review', desc:'All team members correctly classified. Revenue share collaborators documented per CA AB 5 contractor tests.', priority:'done', due:null, done:true },
  { id:'c-004', cat:'employment', title:'CA AB 5 independent contractor classification', desc:'All revenue share participants reviewed against AB 5 ABC test. Creative professional exemptions documented.', priority:'done', due:null, done:true },
  { id:'c-005', cat:'employment', title:'At-will acknowledgment in all agreements', desc:'All active agreements include CA at-will language where applicable.', priority:'done', due:null, done:true },
  { id:'c-006', cat:'docs', title:'IP Assignment Agreements — pending signatures', desc:'Multiple team members have unsigned IP Assignment Agreements. Critical for a creative studio — all work must be legally assigned.', priority:'critical', due:'Overdue', done:false },
  { id:'c-007', cat:'docs', title:'Revenue Share Agreements — verify all members signed', desc:'Verify every active team member has a fully executed Revenue Share Agreement on file.', priority:'high', due:null, done:false },
  { id:'c-008', cat:'docs', title:'NDA renewal — expires June 1', desc:'Studio-wide NDA template expires June 1. Requires review and re-execution with all active members.', priority:'high', due:'2026-06-01', done:false },
  { id:'c-009', cat:'docs', title:'NDAs on file — all current members', desc:'Confirm all active members have signed current NDA.', priority:'high', due:null, done:false },
  { id:'c-010', cat:'docs', title:'Revenue Share Agreement templates current', desc:'Offer letter and revenue share templates reviewed and current.', priority:'done', due:null, done:true },
  { id:'c-011', cat:'safety', title:'IIPP — Injury and Illness Prevention Program annual review', desc:'CA requires a written IIPP for all employers. Annual review due. Covers hazard assessment, training, and recordkeeping.', priority:'high', due:null, done:false },
  { id:'c-012', cat:'safety', title:'Ergonomics policy for workstations', desc:'CA ergonomics regulation (Title 8, §5110) — important for animation/3D art studio with repetitive computer work across remote and local members.', priority:'medium', due:null, done:false },
  { id:'c-013', cat:'safety', title:'Emergency evacuation plan posted', desc:'Studio evacuation routes posted and communicated to all team members.', priority:'done', due:null, done:true },
  { id:'c-014', cat:'privacy', title:'CCPA privacy notice for collaborators', desc:'CA CCPA requires a privacy notice explaining what personal data is collected and how it is used — applies to all collaborators.', priority:'high', due:null, done:false },
  { id:'c-015', cat:'privacy', title:'Data retention & deletion policy', desc:'Policy defining how long agreements, communications, and project files are retained and procedures for secure deletion.', priority:'medium', due:null, done:false },
  { id:'c-016', cat:'privacy', title:'Secure HR file storage — Google Drive access controls', desc:'HR records in restricted Google Drive with role-based access. Only Studio Head and HR can access full member files.', priority:'done', due:null, done:true },
  { id:'c-017', cat:'agreements', title:'Revenue share % documented per member', desc:'Each revenue share team member must have their revenue share percentage formally documented in their signed agreement.', priority:'high', due:null, done:false },
  { id:'c-018', cat:'agreements', title:'Revenue definition clause — clear and agreed', desc:'Agreements define "gross revenue", "net revenue", payout triggers, and dispute resolution process.', priority:'high', due:null, done:false },
  { id:'c-019', cat:'agreements', title:'Vesting or cliff terms — documented', desc:'If revenue share has any vesting schedule or cliff, it must be explicitly documented to avoid future disputes.', priority:'medium', due:null, done:false },
  { id:'c-020', cat:'agreements', title:'Offboarding clause — what happens to share if member leaves', desc:'All agreements cover what happens to a member\'s revenue share upon voluntary or involuntary exit.', priority:'high', due:null, done:false },
]

// ─── ONBOARDING PHASES ────────────────────────────────────────────────────────
export const ONBOARDING_PHASES = [
  {
    id:'pre', label:'Pre-hire', title:'Pre-hire preparation',
    desc:'Everything to complete before the new collaborator\'s first day. Strong pre-hire prevents chaotic Day 1s.',
    tasks:[
      { id:'ob-01', title:'Send Revenue Share Agreement for signature', desc:'Send via the signing portal. Include % terms, payout triggers, IP clause, and offboarding terms. Do not start work until signed.', owner:'HR' },
      { id:'ob-02', title:'Send IP Assignment Agreement', desc:'All creative work produced must be legally assigned to Kato.8 Studios. Critical — send via the signing portal alongside Revenue Share.', owner:'HR' },
      { id:'ob-03', title:'Send NDA', desc:'Current NDA template. Covers studio projects, client relationships, and unreleased work.', owner:'HR' },
      { id:'ob-04', title:'Discord invite — all relevant channels', desc:'Add to #general, #creative or relevant dept channel, #projects, and DM with welcome context.', owner:'IT' },
      { id:'ob-05', title:'Google Workspace account setup', desc:'Create @kato8.com email. Add to relevant Drive folders: projects, assets, style guides, handbooks.', owner:'IT' },
      { id:'ob-06', title:'Assign onboarding buddy', desc:'Pair with an experienced team member in the same department. Brief the buddy on their role.', owner:'Manager' },
    ],
  },
  {
    id:'day1', label:'Day 1', title:'Day 1 — orientation & setup',
    desc:'Goal: new collaborator feels welcomed, can access everything, and understands the studio\'s work and culture by end of day.',
    tasks:[
      { id:'ob-07', title:'Studio / virtual tour + team introductions', desc:'Walk through all departments via Discord video. Introduce to studio head and department leads.', owner:'Manager + HR' },
      { id:'ob-08', title:'Confirm all documents signed', desc:'Verify Revenue Share Agreement, IP Assignment, and NDA are all fully executed before any creative work begins.', owner:'HR' },
      { id:'ob-09', title:'Workstation + software access', desc:'Confirm access to all required tools: Adobe CC, Autodesk Maya, ZBrush, project management tools, render farm if applicable.', owner:'IT' },
      { id:'ob-10', title:'Creative workflow walkthrough', desc:'Walk through studio pipeline: brief → concept → production → review → delivery. Show asset naming conventions and handoff process.', owner:'Creative Lead' },
      { id:'ob-11', title:'Security & IP practices briefing', desc:'Password hygiene, VPN policy, no client assets on personal devices, social media policy re: unreleased work.', owner:'IT + HR' },
    ],
  },
  {
    id:'week1', label:'Week 1', title:'Week 1 — ramp-up & context',
    desc:'Shift from logistics to immersion. New collaborator should understand the studio\'s work, aesthetic direction, and what success looks like in their role.',
    tasks:[
      { id:'ob-12', title:'30-60-90 day goals set with manager', desc:'Formal meeting to align on expectations. 3–5 measurable goals for 30, 60, 90 days. Signed off by both parties.', owner:'Manager + Member' },
      { id:'ob-13', title:'Review active studio projects + reel', desc:'Walk through current project briefs, style guides, and studio reel. Department lead presents the aesthetic DNA and quality bar.', owner:'Lead' },
      { id:'ob-14', title:'Handbook read & confirm', desc:'New collaborator reads and acknowledges the studio handbook — PTO (for future use), communication norms, review process.', owner:'Member' },
      { id:'ob-15', title:'First task assigned', desc:'Assign a scoped, achievable first task with real output. Builds confidence and gives manager a first signal on workflow fit.', owner:'Manager' },
      { id:'ob-16', title:'End-of-week buddy check-in', desc:'Informal Discord call with buddy. What went well? What was confusing? Any blockers? Buddy flags anything to manager.', owner:'Buddy' },
    ],
  },
  {
    id:'day30', label:'Day 30', title:'Day 30 check-in',
    desc:'First formal milestone. Two-way conversation about fit, satisfaction, and trajectory. Catch friction early before it becomes a separation.',
    tasks:[
      { id:'ob-17', title:'30-day structured check-in meeting', desc:'Review 30-day goals, two-way feedback, address concerns, confirm role clarity, set 60-day goals.', owner:'HR + Manager' },
      { id:'ob-18', title:'New collaborator experience survey', desc:'5-question survey: onboarding clarity, tool readiness, team integration, role clarity, overall NPS.', owner:'HR' },
      { id:'ob-19', title:'Confirm all documents complete', desc:'Final audit: Revenue Share, IP Assignment, NDA all signed. Google Drive access confirmed. Discord fully set up.', owner:'HR' },
      { id:'ob-20', title:'Transition to fully active status', desc:'Close onboarding phase. Member moved to Active. Next milestone: 90-day review.', owner:'HR' },
    ],
  },
]

// ─── INTEGRATIONS ─────────────────────────────────────────────────────────────
export const INTEGRATIONS = [
  {
    id:'signing', name:'In-House Signing', category:'e-Signatures', status:'active', priority:1, icon:'✍️', color:'#FAEEDA',
    desc:'Native signing platform built into the HR Tool. Revenue Share, IP Assignment, NDA, and Offer Letters — sent and signed in the browser.',
    capabilities:['Revenue Share Agreements','IP Assignments','NDAs','Offer Letters','Audit trail'],
    setupSteps:[
      { done:true,  text:'Signing platform live at /signing' },
      { done:true,  text:'Revenue Share Agreement template active' },
      { done:true,  text:'IP Assignment template active' },
      { done:true,  text:'NDA template active' },
      { done:false, text:'Auto-file signed docs to Google Drive /HR/Signed/' },
    ],
  },
  {
    id:'gdrive', name:'Google Drive', category:'Document Storage', status:'active', priority:1, icon:'📁', color:'#E1F5EE',
    desc:'HR document backbone. All agreements, templates, compliance docs, and member files stored here with role-based access.',
    capabilities:['Document storage','Template library','Signed agreement archive','EA agent read access'],
    setupSteps:[
      { done:true,  text:'Connected to EA Agent' },
      { done:true,  text:'HR folder structure created' },
      { done:false, text:'Auto-receive signed docs from signing platform' },
      { done:false, text:'Expiry tracking sheet for agreements' },
    ],
  },
  {
    id:'gcal', name:'Google Calendar', category:'Scheduling', status:'active', priority:1, icon:'📅', color:'#E6F1FB',
    desc:'Powers all HR scheduling — onboarding milestones, compliance deadlines, performance check-ins, review cycles.',
    capabilities:['Compliance deadline tracking','Onboarding milestones','Review cycles','EA scheduling'],
    setupSteps:[
      { done:true,  text:'Connected to EA Agent' },
      { done:false, text:'Compliance deadline calendar created' },
      { done:false, text:'Onboarding milestone events for new hires' },
    ],
  },
  {
    id:'social-dash', name:'Social Media Dashboard', category:'Marketing', status:'active', priority:2, icon:'📊', color:'#E1F5EE',
    desc:'Kato.8 Studios social media command center. Team data, assignees, and content pipeline sync with the HR platform.',
    capabilities:['Team member sync','Content calendar','Platform analytics','AI content agent'],
    setupSteps:[
      { done:true,  text:'Social Media Dashboard deployed' },
      { done:true,  text:'Team data endpoint at /api/team' },
      { done:false, text:'Live assignee sync from HR Tool' },
      { done:false, text:'Social media metrics feed into team dashboard' },
    ],
  },
  {
    id:'discord', name:'Discord', category:'Team Communications', status:'active', priority:2, icon:'💬', color:'#EEEDFE',
    desc:'Primary team communication platform. HR notifications, onboarding welcome, and EA Agent announcements route through Discord.',
    capabilities:['HR notifications','Onboarding announcements','EA Agent alerts','Team comms'],
    setupSteps:[
      { done:true,  text:'#general channel active' },
      { done:false, text:'Create private #hr-ops channel (HR + Studio Head only)' },
      { done:false, text:'Connect EA Agent via Discord webhook' },
      { done:false, text:'Set compliance deadline bot reminders' },
    ],
  },
  {
    id:'ea-agent', name:'Executive Assistant Agent', category:'AI Automation', status:'active', priority:1, icon:'◈', color:'#E1F5EE',
    desc:'AI agent with full read/write access to the HR platform. Handles drafting, scheduling, compliance monitoring, and onboarding workflows.',
    capabilities:['Draft agreements','Schedule reviews','Compliance monitoring','Onboarding automation','Discord alerts'],
    setupSteps:[
      { done:true,  text:'Connected to HR platform' },
      { done:true,  text:'Google Drive access active' },
      { done:true,  text:'Google Calendar access active' },
      { done:false, text:'Connect Discord webhook' },
      { done:false, text:'Signing platform event webhooks' },
    ],
  },
  {
    id:'notion', name:'Notion', category:'ATS / Project Tracking', status:'pending', priority:2, icon:'📋', color:'#F1EFE8',
    desc:'Lightweight applicant tracker for open roles. Notion board handles pipeline, portfolio review, and candidate notes.',
    capabilities:['Hiring pipeline','Portfolio review','Interview notes','Candidate tracking'],
    setupSteps:[
      { done:false, text:'Create Hiring Pipeline database in Notion' },
      { done:false, text:'Add columns: Applied, Screen, Portfolio Review, Interview, Offer, Hired/Passed' },
      { done:false, text:'Create role pages for open roles' },
      { done:false, text:'Add pay range field per SB 1162' },
    ],
  },
]

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────
export const DOCUMENTS = [
  { id:'doc-001', name:'Revenue Share Agreement — Template', type:'template', status:'current',      location:'Signing Platform', updated:'2026-04-01' },
  { id:'doc-002', name:'IP Assignment Agreement — Template', type:'template', status:'pending-sigs', location:'Signing Platform', updated:'2026-04-01', note:'Pending signatures' },
  { id:'doc-003', name:'NDA — Studio Standard',             type:'template', status:'expiring',     location:'Signing Platform', updated:'2025-06-01', note:'Expires Jun 1, 2026' },
  { id:'doc-004', name:'Offer Letter Template — Revenue Share', type:'template', status:'current',  location:'Signing Platform', updated:'2026-03-15' },
  { id:'doc-005', name:'Employee Handbook v2.1',            type:'policy',   status:'needs-update', location:'Google Drive',     updated:'2025-11-01', note:'CA SB 553 section needed' },
  { id:'doc-006', name:'CCPA Privacy Notice — Draft',       type:'policy',   status:'draft',        location:'Google Drive',     updated:'2026-04-20' },
  { id:'doc-007', name:'Job Description Library',           type:'reference', status:'current',     location:'Google Drive',     updated:'2026-04-28' },
]

// ─── TEAM DATA ────────────────────────────────────────────────────────────────
export const TEAM = [
  { id: 'tm-001', name: 'Studio Head', initials: 'SH', dept: 'executive', type: 'revenue-share', status: 'active', location: 'Mission Hills, CA', role: 'Studio Head / CEO' },
  { id: 'tm-002', name: 'Sam Rodriguez', initials: 'SR', dept: 'creative', type: 'revenue-share', status: 'review-due', location: 'Los Angeles, CA', role: 'Creative Director' },
  { id: 'tm-003', name: 'Jordan Park', initials: 'JP', dept: 'creative', type: 'revenue-share', status: 'active', location: 'Remote', role: 'Lead Animator' },
  { id: 'tm-004', name: 'Alex Martinez', initials: 'AM', dept: 'creative', type: 'revenue-share', status: 'onboarding', location: 'Los Angeles, CA', role: '3D Artist' },
  { id: 'tm-005', name: 'Taylor Kim', initials: 'TK', dept: 'production', type: 'revenue-share', status: 'active', location: 'Los Angeles, CA', role: 'Head of Production' },
  { id: 'tm-006', name: 'Morgan Lee', initials: 'ML', dept: 'production', type: 'revenue-share', status: 'active', location: 'Remote', role: 'Sound Designer' },
]

export const OPEN_ROLES = [
  { id: 'role-001', title: 'Senior Animator', dept: 'creative', stage: 'Offer stage', candidates: 4, urgent: true },
  { id: 'role-002', title: 'VFX Artist', dept: 'creative', stage: 'Screening', candidates: 12, urgent: false },
  { id: 'role-003', title: 'Studio Ops Coordinator', dept: 'operations', stage: 'Phone screen', candidates: 7, urgent: false },
]

// ─── ORG CHART ────────────────────────────────────────────────────────────────
export const ORG = {
  id: 'root',
  name: 'Studio Head',
  role: 'Kato.8 Studios',
  color: 'executive',
  children: [
    {
      id: 'creative-dir',
      name: 'Creative Director',
      role: 'Sam Rodriguez',
      color: 'creative',
      children: [
        {
          id: 'anim-lead',
          name: 'Lead Animator',
          role: 'Jordan Park',
          color: 'creative',
          children: [
            { id: 'anim-1', name: 'Animator', role: 'Team member', color: 'creative' },
            { id: 'anim-2', name: 'Sr. Animator', role: 'Open role', color: 'vacant', vacant: true },
          ],
        },
        {
          id: 'art-lead',
          name: '3D Art Lead',
          role: 'Team lead',
          color: 'creative',
          children: [
            { id: 'art-1', name: '3D Artist', role: 'Alex Martinez', color: 'creative' },
            { id: 'art-2', name: 'VFX Artist', role: 'Open role', color: 'vacant', vacant: true },
          ],
        },
      ],
    },
    {
      id: 'prod-head',
      name: 'Head of Production',
      role: 'Taylor Kim',
      color: 'production',
      children: [
        { id: 'prod-1', name: 'Producer', role: 'Team member', color: 'production' },
        { id: 'sound-1', name: 'Sound Designer', role: 'Morgan Lee', color: 'production' },
      ],
    },
    {
      id: 'cto',
      name: 'CTO / Tech Lead',
      role: 'Technology Dept',
      color: 'tech',
      children: [
        { id: 'pipe-1', name: 'Pipeline Eng.', role: 'Tools & pipeline', color: 'tech' },
        { id: 'it-1', name: 'IT / Systems', role: 'Infra & support', color: 'tech' },
      ],
    },
    {
      id: 'ops-lead',
      name: 'Studio Ops Lead',
      role: 'Operations Dept',
      color: 'ops',
      children: [
        { id: 'hr-1', name: 'HR / Admin', role: 'People ops', color: 'ops' },
        { id: 'ops-coord', name: 'Ops Coordinator', role: 'Open role', color: 'vacant', vacant: true },
      ],
    },
  ],
}

// ─── COMPLIANCE ───────────────────────────────────────────────────────────────
export const COMPLIANCE_ITEMS = [
  // Employment law
  { id: 'c-001', cat: 'employment', title: 'Update handbook — CA SB 553 (Workplace Violence Prevention)', desc: 'All CA employers need a written Workplace Violence Prevention Plan. Must include incident response and investigation procedures.', priority: 'critical', due: '2026-05-06', done: false },
  { id: 'c-002', cat: 'employment', title: 'Pay transparency policy — CA SB 1162', desc: 'All CA job postings must include pay scale ranges. Revenue share % counts as compensation — must be disclosed.', priority: 'high', due: null, done: false },
  { id: 'c-003', cat: 'employment', title: 'FLSA exempt / non-exempt classification review', desc: 'All team members correctly classified. Revenue share collaborators documented per CA AB 5 contractor tests.', priority: 'done', due: null, done: true },
  { id: 'c-004', cat: 'employment', title: 'CA AB 5 independent contractor classification', desc: 'All revenue share participants reviewed against AB 5 ABC test. Creative professional exemptions documented.', priority: 'done', due: null, done: true },
  { id: 'c-005', cat: 'employment', title: 'At-will acknowledgment in all agreements', desc: 'All active agreements include CA at-will language where applicable.', priority: 'done', due: null, done: true },
  // Documents
  { id: 'c-006', cat: 'docs', title: 'IP Assignment Agreements — 2 pending signatures', desc: 'Two team members have unsigned IP Assignment Agreements. Critical for a creative studio — all work must be legally assigned.', priority: 'critical', due: 'Overdue', done: false },
  { id: 'c-007', cat: 'docs', title: 'Revenue Share Agreements — all members signed', desc: 'Verify every active team member has a fully executed Revenue Share Agreement on file in DocuSign.', priority: 'high', due: null, done: false },
  { id: 'c-008', cat: 'docs', title: 'NDA renewal — expires June 1', desc: 'Studio-wide NDA template expires June 1. Requires review and re-execution with all members and contractors.', priority: 'high', due: '2026-06-01', done: false },
  { id: 'c-009', cat: 'docs', title: 'NDAs on file — all current members', desc: 'Confirmed all 6 active members have signed current NDA in DocuSign.', priority: 'done', due: null, done: true },
  { id: 'c-010', cat: 'docs', title: 'Revenue Share Agreements — templates current', desc: 'Offer letter and revenue share templates reviewed and current.', priority: 'done', due: null, done: true },
  // Safety
  { id: 'c-011', cat: 'safety', title: 'IIPP — Injury and Illness Prevention Program annual review', desc: 'CA requires a written IIPP for all employers. Annual review due. Covers hazard assessment, training, and recordkeeping.', priority: 'high', due: null, done: false },
  { id: 'c-012', cat: 'safety', title: 'Ergonomics policy for workstations', desc: 'CA ergonomics regulation (Title 8, §5110) — important for animation/3D art studio with repetitive computer work.', priority: 'medium', due: null, done: false },
  { id: 'c-013', cat: 'safety', title: 'Emergency evacuation plan posted', desc: 'Studio evacuation routes posted and communicated to all team members.', priority: 'done', due: null, done: true },
  // Privacy
  { id: 'c-014', cat: 'privacy', title: 'CCPA privacy notice for collaborators', desc: 'CA CCPA requires a privacy notice explaining what personal data is collected and how it is used — applies even to contractors.', priority: 'high', due: null, done: false },
  { id: 'c-015', cat: 'privacy', title: 'Data retention & deletion policy', desc: 'Policy defining how long agreements, communications, and project files are retained and procedures for secure deletion.', priority: 'medium', due: null, done: false },
  { id: 'c-016', cat: 'privacy', title: 'Secure HR file storage — Google Drive access controls', desc: 'HR records in restricted Google Drive with role-based access. Only Studio Head and HR can access full member files.', priority: 'done', due: null, done: true },
  // Comp / agreements (no payroll section — revenue share only)
  { id: 'c-017', cat: 'agreements', title: 'Revenue share % documented per member', desc: 'Each team member\'s revenue share percentage formally documented in their signed agreement.', priority: 'high', due: null, done: false },
  { id: 'c-018', cat: 'agreements', title: 'Revenue definition clause — clear and agreed', desc: 'Agreements define "gross revenue", "net revenue", payout triggers, and dispute resolution process.', priority: 'high', due: null, done: false },
  { id: 'c-019', cat: 'agreements', title: 'Vesting or cliff terms — documented', desc: 'If revenue share has any vesting schedule or cliff, it must be explicitly documented to avoid future disputes.', priority: 'medium', due: null, done: false },
  { id: 'c-020', cat: 'agreements', title: 'Offboarding clause — what happens to share if member leaves', desc: 'All agreements cover what happens to a member\'s revenue share upon voluntary or involuntary exit.', priority: 'high', due: null, done: false },
]

// ─── ONBOARDING PHASES ────────────────────────────────────────────────────────
export const ONBOARDING_PHASES = [
  {
    id: 'pre',
    label: 'Pre-hire',
    title: 'Pre-hire preparation',
    desc: 'Everything to complete before the new collaborator\'s first day. Strong pre-hire prevents chaotic Day 1s.',
    tasks: [
      { id: 'ob-01', title: 'Send Revenue Share Agreement for signature', desc: 'Send via DocuSign. Include % terms, payout triggers, IP clause, and offboarding terms. Do not start work until signed.', owner: 'HR', done: true },
      { id: 'ob-02', title: 'Send IP Assignment Agreement', desc: 'All creative work produced must be legally assigned to Kato.8 Studios. Critical — send via DocuSign alongside Revenue Share.', owner: 'HR', done: true },
      { id: 'ob-03', title: 'Send NDA', desc: 'Current NDA template from DocuSign. Covers studio projects, client relationships, and unreleased work.', owner: 'HR', done: true },
      { id: 'ob-04', title: 'Discord invite — all relevant channels', desc: 'Add to #general, #creative or relevant dept channel, #projects, and DM with welcome context.', owner: 'IT', done: false },
      { id: 'ob-05', title: 'Google Workspace account setup', desc: 'Create @kato8.com email. Add to relevant Drive folders: projects, assets, style guides, handbooks.', owner: 'IT', done: false },
      { id: 'ob-06', title: 'Assign onboarding buddy', desc: 'Pair with an experienced team member in the same department. Brief the buddy on their role.', owner: 'Manager', done: true },
    ],
  },
  {
    id: 'day1',
    label: 'Day 1',
    title: 'Day 1 — orientation & setup',
    desc: 'Goal: new collaborator feels welcomed, can access everything, and understands the studio\'s work and culture by end of day.',
    tasks: [
      { id: 'ob-07', title: 'Studio / virtual tour + team introductions', desc: 'Walk through all departments (in-person or via Discord video). Introduce to studio head and creative director.', owner: 'Manager + HR', done: false },
      { id: 'ob-08', title: 'Confirm all documents signed in DocuSign', desc: 'Verify Revenue Share Agreement, IP Assignment, and NDA are all fully executed before any creative work begins.', owner: 'HR', done: false },
      { id: 'ob-09', title: 'Workstation + software access', desc: 'Confirm access to all required tools: Adobe CC, Autodesk Maya, ZBrush, project management, render farm (if applicable).', owner: 'IT', done: false },
      { id: 'ob-10', title: 'Creative workflow walkthrough', desc: 'Walk through studio pipeline: brief → concept → production → review → delivery. Show asset naming conventions and handoff process.', owner: 'Creative Director', done: false },
      { id: 'ob-11', title: 'Security & IP practices briefing', desc: 'Password hygiene, VPN policy, no client assets on personal devices, social media policy re: unreleased work.', owner: 'IT + HR', done: false },
    ],
  },
  {
    id: 'week1',
    label: 'Week 1',
    title: 'Week 1 — ramp-up & context',
    desc: 'Shift from logistics to immersion. New collaborator should understand the studio\'s work, aesthetic direction, and what success looks like in their role.',
    tasks: [
      { id: 'ob-12', title: '30-60-90 day goals set with manager', desc: 'Formal meeting to align on expectations. 3–5 measurable goals for 30, 60, 90 days. Signed off by both parties.', owner: 'Manager + Member', done: false },
      { id: 'ob-13', title: 'Review active studio projects + reel', desc: 'Walk through current project briefs, style guides, and studio reel. Creative Director presents the aesthetic DNA and quality bar.', owner: 'Creative Director', done: false },
      { id: 'ob-14', title: 'Handbook read & confirm', desc: 'New collaborator reads and acknowledges the studio handbook — PTO (for future use), communication norms, review process.', owner: 'Member', done: false },
      { id: 'ob-15', title: 'First task assigned', desc: 'Assign a scoped, achievable first task with real output. Builds confidence and gives manager a first signal on workflow fit.', owner: 'Manager', done: false },
      { id: 'ob-16', title: 'End-of-week buddy check-in', desc: 'Informal Discord call with buddy. What went well? What was confusing? Any blockers? Buddy flags anything to manager.', owner: 'Buddy', done: false },
    ],
  },
  {
    id: 'day30',
    label: 'Day 30',
    title: 'Day 30 check-in',
    desc: 'First formal milestone. Two-way conversation about fit, satisfaction, and trajectory. Catch friction early before it becomes a separation.',
    tasks: [
      { id: 'ob-17', title: '30-day structured check-in meeting', desc: 'Review 30-day goals, two-way feedback, address concerns, confirm role clarity, set 60-day goals.', owner: 'HR + Manager', done: false },
      { id: 'ob-18', title: 'New collaborator experience survey', desc: '5-question survey: onboarding clarity, tool readiness, team integration, role clarity, overall NPS.', owner: 'HR', done: false },
      { id: 'ob-19', title: 'Confirm all documents complete', desc: 'Final audit: Revenue Share, IP Assignment, NDA all signed. Google Drive access confirmed. Discord fully set up.', owner: 'HR', done: false },
      { id: 'ob-20', title: 'Transition to fully active status', desc: 'Close onboarding phase. Member moved to Active. Next milestone: 90-day review.', owner: 'HR', done: false },
    ],
  },
]

// ─── INTEGRATIONS ─────────────────────────────────────────────────────────────
export const INTEGRATIONS = [
  {
    id: 'docusign',
    name: 'DocuSign',
    category: 'e-Signatures',
    status: 'active',
    priority: 1,
    icon: '✍️',
    color: '#FAEEDA',
    desc: 'All Revenue Share Agreements, IP Assignments, and NDAs live here. Fully set up and in use.',
    capabilities: ['Revenue Share Agreements', 'IP Assignments', 'NDAs', 'Offer templates', 'Audit trail'],
    setupSteps: [
      { done: true, text: 'DocuSign Business Pro account active' },
      { done: true, text: 'Revenue Share Agreement template uploaded' },
      { done: true, text: 'IP Assignment template uploaded' },
      { done: true, text: 'NDA template uploaded' },
      { done: false, text: 'Connect webhook → EA Agent for signature completion events' },
      { done: false, text: 'Auto-file signed docs to Google Drive /HR/Signed/' },
    ],
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    category: 'Document Storage',
    status: 'active',
    priority: 1,
    icon: '📁',
    color: '#E1F5EE',
    desc: 'HR document backbone. All agreements, templates, compliance docs, and member files stored here with role-based access.',
    capabilities: ['Document storage', 'Template library', 'Signed agreement archive', 'EA agent read access'],
    setupSteps: [
      { done: true, text: 'Connected to EA Agent' },
      { done: true, text: 'HR folder structure created' },
      { done: false, text: 'Auto-receive signed docs from DocuSign' },
      { done: false, text: 'Expiry tracking sheet for agreements' },
    ],
  },
  {
    id: 'gcal',
    name: 'Google Calendar',
    category: 'Scheduling',
    status: 'active',
    priority: 1,
    icon: '📅',
    color: '#E6F1FB',
    desc: 'Powers all HR scheduling — onboarding milestones, compliance deadlines, performance check-ins, review cycles.',
    capabilities: ['Compliance deadline tracking', 'Onboarding milestones', 'Review cycles', 'EA scheduling'],
    setupSteps: [
      { done: true, text: 'Connected to EA Agent' },
      { done: false, text: 'Compliance deadline calendar created' },
      { done: false, text: 'Onboarding milestone events for Alex M.' },
    ],
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'Team Communications',
    status: 'active',
    priority: 2,
    icon: '💬',
    color: '#EEEDFE',
    desc: 'Primary team communication platform. HR notifications, onboarding welcome, and EA Agent announcements route through Discord.',
    capabilities: ['HR notifications', 'Onboarding announcements', 'EA Agent alerts', 'Team comms'],
    setupSteps: [
      { done: true, text: '#general channel active' },
      { done: false, text: 'Create private #hr-ops channel (HR + Studio Head only)' },
      { done: false, text: 'Connect EA Agent via Discord webhook' },
      { done: false, text: 'Set compliance deadline bot reminders' },
    ],
  },
  {
    id: 'ea-agent',
    name: 'Executive Assistant Agent',
    category: 'AI Automation',
    status: 'active',
    priority: 1,
    icon: '◈',
    color: '#E1F5EE',
    desc: 'AI agent with full read/write access to the HR platform. Handles drafting, scheduling, compliance monitoring, and onboarding workflows.',
    capabilities: ['Draft agreements', 'Schedule reviews', 'Compliance monitoring', 'Onboarding automation', 'Discord alerts'],
    setupSteps: [
      { done: true, text: 'Connected to HR platform' },
      { done: true, text: 'Google Drive access active' },
      { done: true, text: 'Google Calendar access active' },
      { done: false, text: 'Connect Discord webhook' },
      { done: false, text: 'DocuSign event webhooks' },
    ],
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'ATS / Project Tracking',
    status: 'pending',
    priority: 2,
    icon: '📋',
    color: '#F1EFE8',
    desc: 'Lightweight applicant tracker for the 3 open roles. No ATS needed at current scale — Notion board handles pipeline, portfolio review, and candidate notes.',
    capabilities: ['Hiring pipeline', 'Portfolio review', 'Interview notes', 'Candidate tracking'],
    setupSteps: [
      { done: false, text: 'Create Hiring Pipeline database in Notion' },
      { done: false, text: 'Add columns: Applied, Screen, Portfolio Review, Interview, Offer, Hired/Passed' },
      { done: false, text: 'Create role pages for Sr. Animator, VFX Artist, Ops Coordinator' },
      { done: false, text: 'Add pay range fields per SB 1162' },
    ],
  },
]

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────
export const DOCUMENTS = [
  { id: 'doc-001', name: 'Revenue Share Agreement — Template', type: 'template', status: 'current', location: 'DocuSign', updated: '2026-04-01' },
  { id: 'doc-002', name: 'IP Assignment Agreement — Template', type: 'template', status: 'pending-sigs', location: 'DocuSign', updated: '2026-04-01', note: '2 pending signatures' },
  { id: 'doc-003', name: 'NDA — Studio Standard', type: 'template', status: 'expiring', location: 'DocuSign', updated: '2025-06-01', note: 'Expires Jun 1, 2026' },
  { id: 'doc-004', name: 'Offer Letter Template — Revenue Share', type: 'template', status: 'current', location: 'DocuSign', updated: '2026-03-15' },
  { id: 'doc-005', name: 'Employee Handbook v2.1', type: 'policy', status: 'needs-update', location: 'Google Drive', updated: '2025-11-01', note: 'CA SB 553 update needed' },
  { id: 'doc-006', name: 'CCPA Privacy Notice — Draft', type: 'policy', status: 'draft', location: 'Google Drive', updated: '2026-04-20' },
  { id: 'doc-007', name: 'Job Description Library', type: 'reference', status: 'current', location: 'Google Drive', updated: '2026-04-28' },
]

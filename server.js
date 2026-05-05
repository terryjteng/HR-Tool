import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── Actions persistence ──────────────────────────────────────────────────────

const ACTIONS_FILE = join(__dirname, 'actions.json')

function loadActions() {
  if (!existsSync(ACTIONS_FILE)) return []
  try { return JSON.parse(readFileSync(ACTIONS_FILE, 'utf8')) } catch { return [] }
}

function saveActions(actions) {
  writeFileSync(ACTIONS_FILE, JSON.stringify(actions, null, 2))
}

// ─── Action tool definitions (mirrors EA app) ────────────────────────────��────

const ACTION_TOOLS = [
  {
    name: 'list_actions',
    description: 'List studio action items, optionally filtered by area, priority, status, owner, or due date.',
    input_schema: {
      type: 'object',
      properties: {
        areaTag: { type: 'string', enum: ['overall', 'web', 'social', 'last-light', 'corebound', 'big-boss-cleanup'] },
        priority: { type: 'string', enum: ['normal', 'urgent', 'decision'] },
        status: { type: 'string', enum: ['open', 'in-progress', 'done'] },
        owner: { type: 'string', description: 'Filter by owner name (case-insensitive)' },
        dueBefore: { type: 'string', description: 'ISO date YYYY-MM-DD' },
        dueAfter: { type: 'string', description: 'ISO date YYYY-MM-DD' },
        limit: { type: 'number' },
      },
      required: [],
    },
  },
  {
    name: 'create_action',
    description: 'Create a new action item in the studio tracker.',
    input_schema: {
      type: 'object',
      required: ['task'],
      properties: {
        task: { type: 'string', description: 'Description of the action item' },
        owner: { type: 'string' },
        dueDate: { type: 'string', description: 'YYYY-MM-DD format' },
        areaTag: { type: 'string', enum: ['overall', 'web', 'social', 'last-light', 'corebound', 'big-boss-cleanup'] },
        priority: { type: 'string', enum: ['normal', 'urgent', 'decision'] },
        status: { type: 'string', enum: ['open', 'in-progress', 'done'] },
        notes: { type: 'string' },
      },
    },
  },
  {
    name: 'create_multiple_actions',
    description: 'Create several action items at once.',
    input_schema: {
      type: 'object',
      required: ['actions'],
      properties: {
        actions: {
          type: 'array',
          items: {
            type: 'object',
            required: ['task'],
            properties: {
              task: { type: 'string' },
              owner: { type: 'string' },
              dueDate: { type: 'string' },
              areaTag: { type: 'string', enum: ['overall', 'web', 'social', 'last-light', 'corebound', 'big-boss-cleanup'] },
              priority: { type: 'string', enum: ['normal', 'urgent', 'decision'] },
              status: { type: 'string', enum: ['open', 'in-progress', 'done'] },
              notes: { type: 'string' },
            },
          },
        },
      },
    },
  },
  {
    name: 'update_action',
    description: 'Update an existing action item by ID. Only provided fields are changed.',
    input_schema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
        task: { type: 'string' },
        owner: { type: 'string' },
        dueDate: { type: 'string' },
        areaTag: { type: 'string', enum: ['overall', 'web', 'social', 'last-light', 'corebound', 'big-boss-cleanup'] },
        priority: { type: 'string', enum: ['normal', 'urgent', 'decision'] },
        status: { type: 'string', enum: ['open', 'in-progress', 'done'] },
        notes: { type: 'string' },
      },
    },
  },
  {
    name: 'delete_action',
    description: 'Permanently delete an action item by ID.',
    input_schema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
      },
    },
  },
]

async function executeTool(name, input) {
  switch (name) {
    case 'list_actions': {
      let actions = loadActions()
      if (input.areaTag) actions = actions.filter(a => a.areaTag === input.areaTag)
      if (input.priority) actions = actions.filter(a => a.priority === input.priority)
      if (input.status) actions = actions.filter(a => a.status === input.status)
      if (input.owner) actions = actions.filter(a => a.owner?.toLowerCase().includes(input.owner.toLowerCase()))
      if (input.dueBefore) actions = actions.filter(a => a.dueDate && a.dueDate <= input.dueBefore)
      if (input.dueAfter) actions = actions.filter(a => a.dueDate && a.dueDate >= input.dueAfter)
      if (input.limit) actions = actions.slice(0, input.limit)
      return { count: actions.length, actions }
    }
    case 'create_action': {
      const actions = loadActions()
      const now = new Date().toISOString()
      const action = {
        id: randomUUID(),
        task: input.task,
        owner: input.owner || '',
        dueDate: input.dueDate || '',
        areaTag: input.areaTag || 'overall',
        priority: input.priority || 'normal',
        status: input.status || 'open',
        notes: input.notes || '',
        createdAt: now,
        updatedAt: now,
      }
      actions.unshift(action)
      saveActions(actions)
      return { success: true, action }
    }
    case 'create_multiple_actions': {
      const actions = loadActions()
      const now = new Date().toISOString()
      const created = (input.actions || []).map(a => ({
        id: randomUUID(),
        task: a.task,
        owner: a.owner || '',
        dueDate: a.dueDate || '',
        areaTag: a.areaTag || 'overall',
        priority: a.priority || 'normal',
        status: a.status || 'open',
        notes: a.notes || '',
        createdAt: now,
        updatedAt: now,
      }))
      actions.unshift(...created)
      saveActions(actions)
      return { success: true, count: created.length, actions: created }
    }
    case 'update_action': {
      const actions = loadActions()
      const idx = actions.findIndex(a => a.id === input.id)
      if (idx === -1) return { success: false, error: 'Action not found', id: input.id }
      const { id, ...updates } = input
      actions[idx] = { ...actions[idx], ...updates, updatedAt: new Date().toISOString() }
      saveActions(actions)
      return { success: true, id }
    }
    case 'delete_action': {
      const actions = loadActions()
      const exists = actions.some(a => a.id === input.id)
      if (!exists) return { success: false, error: 'Action not found', id: input.id }
      saveActions(actions.filter(a => a.id !== input.id))
      return { success: true }
    }
    default:
      return { error: `Unknown tool: ${name}` }
  }
}

// ─── HR Platform system prompt ───────────────────────��────────────────────────

const SYSTEM_PROMPT = `You are the Executive Assistant (EA) for Kato.8 Studios, a revenue-share creative studio based in Mission Hills, California. You have full knowledge of the HR platform and act as a knowledgeable HR partner.

You also have access to the studio's action tracking system with tools to list, create, update, and delete action items. Today's date is ${new Date().toISOString().split('T')[0]}.

Area tags: overall (Overall Studio), web (Website/UI·UX), social (Social & Marketing), last-light (Last Light), corebound (Corebound), big-boss-cleanup (Big Boss Cleanup).

STUDIO OVERVIEW:
- Name: Kato.8 Studios
- Model: Revenue-share (no traditional salaries — all compensation is revenue share %)
- Location: Mission Hills, California (hybrid — most members remote)
- Focus: Animation, 2D/3D Art, UI/UX Design, Engineering, Sound Design, Voice
- Total team: 33 members (28 revenue share + 5 interns)

CURRENT TEAM (33 members):
EXECUTIVE: Terry Teng — Founder & CEO — Mission Hills, CA

DESIGN DEPT (7):
- Ryan K — Lead Designer (reports to Terry; manages Luis C, Ashlee W*, Cori M*)
- Pride SC — Lead Designer (reports to Terry; manages Ryan P)
- Sophia J — Lead Designer (reports to Terry)
- Luis C — Designer
- Ryan P — Designer
- Ashlee W* — Design Intern
- Cori M* — Design Intern

ENGINEERING DEPT (4):
- Carlos T — Lead Engineer (reports to Terry)
- Rhianna — Lead Engineer (reports to Terry)
- Daniel F — Lead Eng / Dev (reports to Terry; manages Michael A)
- Michael A — Eng / Dev

ART DEPT (11 + 1 open):
- Bryan N — Lead Artist (reports to Terry; manages Mia C, Keolani B, Pedro S*)
- Hailey H — Lead Artist (reports to Terry; manages Liz P, Ray P, Juno TC)
- Chris C — Lead Artist (reports to Terry; manages Luna, Jacob; has open 2D Animator role)
- Mia C, Keolani B, Liz P, Ray P, Juno TC, Luna, Jacob — Artists
- Pedro S* — Art Intern

UI/UX DEPT (3):
- Tessa L — UI/UX Lead (reports to Terry; manages Adam M*, Katie L*)
- Adam M* — UI/UX Eng Intern
- Katie L* — UI/UX + SM Intern

AUDIO & VOICE DEPT (7):
- Schwa — Sound (reports to Terry)
- Ayako — Sound (reports to Terry)
- Sandy C — Music (reports to Terry)
- Lauren P — Narration (reports to Terry)
- Michael TB — Voice (reports to Terry)
- Janey — Voice (reports to Terry)
- Emmanuel — 2nd Voice (reports to Terry)

(* = intern)

OPEN ROLES (1):
- 2D Animator — Art dept — under Chris C — Actively Hiring

COMPLIANCE STATUS (as of 2026-05-02):
CRITICAL / OVERDUE:
- CA SB 553 Workplace Violence Prevention Plan — Due 2026-05-06 (4 days away)
- IP Assignment Agreements — 2 team members unsigned (overdue)

HIGH PRIORITY:
- Revenue Share Agreements — verify all 33 members fully executed
- NDAs on file for all 33 members
- NDA template renewal — expires June 1, 2026
- CA SB 1162 Pay transparency — must disclose revenue share % on 2D Animator posting
- CCPA Privacy Notice — draft exists, needs finalization
- IIPP annual review needed
- Revenue share % documented per each of 28 members
- Revenue definition clause, offboarding clause in all agreements

INTEGRATIONS: DocuSign (active), Google Drive (active), Google Calendar (active), Discord (active, #hr-ops pending), Notion (pending), EA Agent (active).

INSTRUCTIONS:
- Be concise, direct, and action-oriented. Lead with the answer.
- When drafting documents, produce real complete draft text.
- When answering CA compliance questions, cite specific laws (SB 553, AB 5, SB 1162, CCPA).
- Always use revenue-share language, not salary/wage language.
- Use action tools to manage studio tasks when asked — confirm concisely what you did.
- After making tool-based changes, summarize what was created/updated.
- Format with markdown: headers (##), bold (**text**), bullet lists.`

// ─── EA Agent endpoint (streaming + agentic tool loop) ─────────────────────���──

app.post('/api/ea', async (req, res) => {
  const { messages } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`)

  try {
    let currentMessages = [...messages]

    while (true) {
      const toolUseBlocks = []
      let currentToolBlock = null

      const stream = client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        tools: ACTION_TOOLS,
        messages: currentMessages,
      })

      for await (const event of stream) {
        if (event.type === 'content_block_start') {
          if (event.content_block.type === 'tool_use') {
            currentToolBlock = {
              id: event.content_block.id,
              name: event.content_block.name,
              inputJson: '',
              input: {},
            }
            send({ type: 'tool_start', tool: event.content_block.name, id: event.content_block.id })
          }
        } else if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            send({ type: 'text', text: event.delta.text })
          } else if (event.delta.type === 'input_json_delta' && currentToolBlock) {
            currentToolBlock.inputJson += event.delta.partial_json
          }
        } else if (event.type === 'content_block_stop') {
          if (currentToolBlock) {
            try { currentToolBlock.input = JSON.parse(currentToolBlock.inputJson) } catch { currentToolBlock.input = {} }
            toolUseBlocks.push({ ...currentToolBlock })
            currentToolBlock = null
          }
        }
      }

      const finalMsg = await stream.finalMessage()

      if (finalMsg.stop_reason !== 'tool_use' || toolUseBlocks.length === 0) break

      // Execute all tools and collect results
      const toolResults = []
      for (const block of toolUseBlocks) {
        const result = await executeTool(block.name, block.input)
        send({ type: 'tool_done', tool: block.name, id: block.id, result })
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(result),
        })
      }

      currentMessages = [
        ...currentMessages,
        { role: 'assistant', content: finalMsg.content },
        { role: 'user', content: toolResults },
      ]
    }

    res.write('data: [DONE]\n\n')
  } catch (err) {
    send({ type: 'error', error: err.message })
    res.write('data: [DONE]\n\n')
  } finally {
    res.end()
  }
})

// ─── Actions REST CRUD (shared with EA app) ───────────────────────────────��───

app.get('/api/ping', (_req, res) => res.json({ ok: true, service: 'kato8-hr-tool' }))

app.get('/api/actions', (req, res) => {
  let actions = loadActions()
  const { areaTag, priority, status, owner } = req.query
  if (areaTag) actions = actions.filter(a => a.areaTag === areaTag)
  if (priority) actions = actions.filter(a => a.priority === priority)
  if (status) actions = actions.filter(a => a.status === status)
  if (owner) actions = actions.filter(a => a.owner?.toLowerCase().includes(owner.toLowerCase()))
  res.json(actions)
})

app.post('/api/actions', (req, res) => {
  const actions = loadActions()
  const now = new Date().toISOString()
  // Accept a provided id so the EA app can sync its locally-generated ids
  const action = {
    id: req.body.id || randomUUID(),
    task: req.body.task || '',
    owner: req.body.owner || '',
    dueDate: req.body.dueDate || '',
    areaTag: req.body.areaTag || 'overall',
    priority: req.body.priority || 'normal',
    status: req.body.status || 'open',
    notes: req.body.notes || '',
    createdAt: req.body.createdAt || now,
    updatedAt: now,
  }
  // Avoid duplicates
  if (!actions.some(a => a.id === action.id)) {
    actions.unshift(action)
    saveActions(actions)
  }
  res.json(action)
})

app.post('/api/actions/batch', (req, res) => {
  const actions = loadActions()
  const now = new Date().toISOString()
  const existingIds = new Set(actions.map(a => a.id))
  const incoming = (req.body.actions || [])
    .filter(a => !existingIds.has(a.id))
    .map(a => ({
      id: a.id || randomUUID(),
      task: a.task || '',
      owner: a.owner || '',
      dueDate: a.dueDate || '',
      areaTag: a.areaTag || 'overall',
      priority: a.priority || 'normal',
      status: a.status || 'open',
      notes: a.notes || '',
      createdAt: a.createdAt || now,
      updatedAt: now,
    }))
  actions.unshift(...incoming)
  saveActions(actions)
  res.json(incoming)
})

app.patch('/api/actions/:id', (req, res) => {
  const actions = loadActions()
  const idx = actions.findIndex(a => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  actions[idx] = { ...actions[idx], ...req.body, id: req.params.id, updatedAt: new Date().toISOString() }
  saveActions(actions)
  res.json(actions[idx])
})

app.delete('/api/actions/:id', (req, res) => {
  const actions = loadActions()
  const filtered = actions.filter(a => a.id !== req.params.id)
  if (filtered.length === actions.length) return res.status(404).json({ error: 'not found' })
  saveActions(filtered)
  res.json({ ok: true })
})

// ─── Document Signing Platform ───────────────────────────────────────────────

const SIGNING_FILE = join(__dirname, 'signing.json')

function loadSigning() {
  if (!existsSync(SIGNING_FILE)) return []
  try { return JSON.parse(readFileSync(SIGNING_FILE, 'utf8')) } catch { return [] }
}
function saveSigning(docs) { writeFileSync(SIGNING_FILE, JSON.stringify(docs, null, 2)) }

function makeToken() { return randomUUID().replace(/-/g, '').slice(0, 20) }

// ─── Document content generators ─────────────────────────────────────────────

function fmtDate(iso) {
  return new Date(iso || Date.now()).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
}

function docContent(templateId, r, iso) {
  const d = fmtDate(iso)
  const pct = r.revenueSharePct || '___%'
  switch (templateId) {
    case 'revenue-share': return `
<h2>REVENUE SHARE AGREEMENT</h2>
<p class="doc-meta">Kato.8 Studios · Mission Hills, California · Effective ${d}</p>
<p>This Revenue Share Agreement ("Agreement") is entered into as of <strong>${d}</strong> between <strong>Kato.8 Studios</strong>, a California-based creative studio ("Studio"), and <strong>${r.name}</strong> ("Collaborator").</p>
<h3>1. Engagement</h3>
<p>Studio engages Collaborator to provide <strong>${r.role}</strong> services for the Studio's projects on a revenue-share basis. This is not an employment agreement. Collaborator is an independent collaborator as defined under CA AB 5 creative professional provisions.</p>
<h3>2. Compensation</h3>
<p>Studio agrees to pay Collaborator <strong>${pct}%</strong> of net studio revenue. "Net revenue" means gross revenue received by Studio, less platform fees, payment processing fees, and direct production costs agreed upon in writing. Payouts occur within 60 days of each revenue event exceeding $500. No advances or guarantees are provided.</p>
<h3>3. Intellectual Property</h3>
<p>All creative work, concepts, designs, code, audio, and deliverables produced by Collaborator under this Agreement are works made for hire and are the exclusive property of Kato.8 Studios. To the extent any work is not a work made for hire by operation of law, Collaborator hereby irrevocably assigns all right, title, and interest to Studio.</p>
<h3>4. Confidentiality</h3>
<p>Collaborator shall keep all project details, business information, and unreleased materials strictly confidential. This obligation survives termination of this Agreement.</p>
<h3>5. Term &amp; Termination</h3>
<p>This Agreement is at-will. Either party may terminate with 30 days written notice. Upon termination, Collaborator's revenue share entitlement for work completed prior to termination continues per the schedule above. All IP remains with Studio.</p>
<h3>6. Governing Law</h3>
<p>This Agreement is governed by the laws of the State of California. Any dispute shall be resolved in Los Angeles County, California.</p>
<p class="sig-block"><strong>Studio:</strong> Terry Teng, Founder &amp; CEO — Kato.8 Studios &nbsp;&nbsp;&nbsp; <strong>Collaborator:</strong> ${r.name}</p>`

    case 'ip-assignment': return `
<h2>INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT</h2>
<p class="doc-meta">Kato.8 Studios · Mission Hills, California · Effective ${d}</p>
<p>This IP Assignment Agreement ("Agreement") is entered into as of <strong>${d}</strong> between <strong>Kato.8 Studios</strong> ("Studio") and <strong>${r.name}</strong> ("Assignor").</p>
<h3>1. Assignment of IP</h3>
<p>Assignor hereby irrevocably assigns and transfers to Studio all right, title, and interest in and to all Intellectual Property created, developed, or conceived by Assignor in connection with any Studio project, including but not limited to: concept art, character designs, environment designs, animations, code, scripts, audio compositions, sound effects, voice recordings, and all derivative works thereof.</p>
<h3>2. Works Made for Hire</h3>
<p>To the extent permitted by law, all works created by Assignor for Studio are "works made for hire" under the U.S. Copyright Act. To the extent any work is not a work made for hire, Assignor assigns all copyright and related rights to Studio effective as of the date of creation.</p>
<h3>3. Moral Rights Waiver</h3>
<p>To the maximum extent permitted by law, Assignor waives any moral rights or rights of attribution in and to the assigned works.</p>
<h3>4. Representations</h3>
<p>Assignor represents that: (a) Assignor has full right and authority to make this assignment; (b) the assigned works do not infringe any third party's rights; and (c) Assignor has not previously assigned or encumbered any rights herein.</p>
<h3>5. Continuing Obligation</h3>
<p>This assignment applies to all works created during Assignor's engagement with Studio and survives termination of any other agreement between the parties.</p>
<h3>6. Governing Law</h3>
<p>This Agreement is governed by California law. Disputes shall be resolved in Los Angeles County, California.</p>
<p class="sig-block"><strong>Studio:</strong> Terry Teng, Founder &amp; CEO — Kato.8 Studios &nbsp;&nbsp;&nbsp; <strong>Assignor:</strong> ${r.name}</p>`

    case 'nda': return `
<h2>NON-DISCLOSURE AGREEMENT</h2>
<p class="doc-meta">Kato.8 Studios · Mission Hills, California · Effective ${d}</p>
<p>This Non-Disclosure Agreement ("Agreement") is entered into as of <strong>${d}</strong> between <strong>Kato.8 Studios</strong> ("Disclosing Party") and <strong>${r.name}</strong> ("Receiving Party").</p>
<h3>1. Confidential Information</h3>
<p>"Confidential Information" means all non-public information disclosed by Studio to Receiving Party, including: unreleased game projects and titles, gameplay mechanics, art and design assets, business strategies, financial information, partner relationships, source code, and any information designated as confidential. This includes but is not limited to the projects: Last Light, Corebound, and Big Boss Cleanup.</p>
<h3>2. Obligations</h3>
<p>Receiving Party agrees to: (a) hold all Confidential Information in strict confidence; (b) not disclose Confidential Information to any third party without prior written consent; (c) use Confidential Information solely for purposes of Receiving Party's engagement with Studio; (d) not post, publish, or share any Confidential Information on social media, Discord, or any public channel.</p>
<h3>3. Exceptions</h3>
<p>Obligations do not apply to information that: (a) is or becomes publicly known through no breach by Receiving Party; (b) was rightfully known to Receiving Party before disclosure; (c) is required to be disclosed by law or court order (with prompt written notice to Studio).</p>
<h3>4. Term</h3>
<p>This Agreement is effective from ${d} and obligations survive for <strong>3 years</strong> following termination of Receiving Party's engagement with Studio.</p>
<h3>5. Remedies</h3>
<p>Receiving Party acknowledges that breach may cause irreparable harm for which monetary damages are inadequate, and Studio shall be entitled to seek injunctive relief in addition to any other available remedies.</p>
<h3>6. Governing Law</h3>
<p>This Agreement is governed by California law. Jurisdiction is Los Angeles County, California.</p>
<p class="sig-block"><strong>Disclosing Party:</strong> Terry Teng, Founder &amp; CEO — Kato.8 Studios &nbsp;&nbsp;&nbsp; <strong>Receiving Party:</strong> ${r.name}</p>`

    case 'offer-letter': return `
<h2>COLLABORATOR OFFER LETTER</h2>
<p class="doc-meta">Kato.8 Studios · Mission Hills, California · ${d}</p>
<p>Dear <strong>${r.name}</strong>,</p>
<p>We are excited to welcome you to <strong>Kato.8 Studios</strong>! This letter confirms the terms of your engagement as a revenue-share collaborator.</p>
<h3>Role Details</h3>
<table class="offer-table">
  <tr><td>Role / Title</td><td><strong>${r.role}</strong></td></tr>
  <tr><td>Department</td><td>${r.dept || '—'}</td></tr>
  <tr><td>Project Team</td><td>${r.team || '—'}</td></tr>
  <tr><td>Reporting to</td><td>${r.lead || 'Terry Teng'}</td></tr>
  <tr><td>Start Date</td><td>${r.startDate ? fmtDate(r.startDate + 'T00:00:00') : '—'}</td></tr>
  <tr><td>Compensation</td><td>Revenue share — <strong>${pct}%</strong> of net studio revenue</td></tr>
  <tr><td>Engagement Type</td><td>Revenue-share collaborator (not employment) · At-will</td></tr>
  <tr><td>Location</td><td>${r.location || 'Remote'}</td></tr>
</table>
<h3>Compensation</h3>
<p>Your compensation is <strong>${pct}%</strong> of net studio revenue as defined in your Revenue Share Agreement. This is a revenue-share arrangement, not a salary or wage. No compensation is guaranteed until revenue events occur per the Revenue Share Agreement terms.</p>
<h3>Required Agreements</h3>
<p>Before beginning any work, please sign the following documents (sent separately via DocuSign / Studio Signing):</p>
<ul><li>Revenue Share Agreement</li><li>Intellectual Property Assignment Agreement</li><li>Non-Disclosure Agreement</li></ul>
<h3>Next Steps</h3>
<p>Your onboarding team will reach out to schedule your Day 1 orientation. If you have any questions, contact Terry Teng at terryt@kato8studios.com or on Discord.</p>
<p>We look forward to building together.</p>
<p>Warmly,<br/><strong>Terry Teng</strong><br/>Founder &amp; CEO, Kato.8 Studios<br/>terryt@kato8studios.com</p>
<p class="sig-block"><strong>Accepted by:</strong> ${r.name} &nbsp;&nbsp;&nbsp; <strong>Date:</strong> ____________</p>`

    default: return '<p>Unknown document template.</p>'
  }
}

// ─── Public signing page (served as HTML) ────────────────────────────────────

function signingPageHTML(doc) {
  const content = docContent(doc.templateId, doc.recipient, doc.createdAt)
  const isSigned   = doc.status === 'signed'
  const isDeclined = doc.status === 'declined'
  const isActive   = !isSigned && !isDeclined

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${doc.title} — Kato.8 Studios</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#F4F3F0;color:#1a1a2e;min-height:100vh}
.top-bar{background:#1a1a2e;color:#fff;padding:14px 24px;display:flex;align-items:center;gap:14px}
.top-logo{width:36px;height:36px;border-radius:10px;background:#7C3AED;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff}
.top-title{font-size:14px;font-weight:500;flex:1}
.top-status{font-size:11px;padding:3px 10px;border-radius:20px;font-weight:600}
.status-sent{background:#FAEEDA;color:#854F0B}
.status-signed{background:#E1F5EE;color:#0F6E56}
.status-declined{background:#FEE2E2;color:#991B1B}
.banner{padding:10px 24px;font-size:13px;text-align:center;font-weight:500}
.banner-signed{background:#E1F5EE;color:#0F6E56;border-bottom:1px solid #5DCAA5}
.banner-declined{background:#FEE2E2;color:#991B1B;border-bottom:1px solid #FCA5A5}
.wrapper{max-width:820px;margin:0 auto;padding:24px 16px 80px}
.doc-card{background:#fff;border-radius:12px;border:1px solid #E5E3DF;padding:40px 48px;margin-bottom:20px;line-height:1.7}
.doc-card h2{font-size:20px;font-weight:700;color:#1a1a2e;margin-bottom:4px;text-align:center}
.doc-card h3{font-size:14px;font-weight:600;color:#1a1a2e;margin:20px 0 8px;padding-bottom:4px;border-bottom:1px solid #E5E3DF}
.doc-card p{font-size:13px;color:#444;margin-bottom:10px}
.doc-meta{text-align:center;font-size:12px;color:#888;margin-bottom:24px!important;padding-bottom:16px;border-bottom:2px solid #1a1a2e}
.sig-block{background:#F9F8F6;padding:12px;border-radius:8px;font-size:12px;margin-top:24px!important;border:1px dashed #ccc}
.offer-table{width:100%;border-collapse:collapse;font-size:13px;margin:10px 0}
.offer-table td{padding:8px 12px;border-bottom:0.5px solid #E5E3DF}
.offer-table td:first-child{color:#666;font-size:12px;width:140px}
.doc-card ul{padding-left:20px;font-size:13px;color:#444;margin-bottom:10px}
.doc-card ul li{margin-bottom:4px}
.sign-card{background:#fff;border-radius:12px;border:1px solid #E5E3DF;padding:28px 32px}
.sign-card h3{font-size:15px;font-weight:600;margin-bottom:6px}
.sign-card p{font-size:13px;color:#666;margin-bottom:16px}
.name-row{margin-bottom:14px}
.name-row label{display:block;font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px}
.name-row input{width:100%;padding:10px 12px;border:1.5px solid #D1CEC9;border-radius:8px;font-size:14px;font-family:inherit;outline:none;transition:border 0.15s}
.name-row input:focus{border-color:#7C3AED}
.canvas-wrap{position:relative;border:2px dashed #D1CEC9;border-radius:10px;background:#FAFAFA;cursor:crosshair;margin-bottom:8px;overflow:hidden}
.canvas-wrap:hover{border-color:#7C3AED}
#sigCanvas{display:block;width:100%;height:180px}
.canvas-hint{text-align:center;font-size:11px;color:#aaa;margin-bottom:14px}
.btn-row{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}
.btn{padding:10px 22px;border-radius:24px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all 0.15s;font-family:inherit}
.btn-ghost{background:#F4F3F0;color:#444;border:1.5px solid #D1CEC9}
.btn-ghost:hover{border-color:#888}
.btn-danger{background:#FEE2E2;color:#991B1B;border:1.5px solid #FCA5A5}
.btn-danger:hover{background:#FECACA}
.btn-primary{background:#7C3AED;color:#fff}
.btn-primary:hover{opacity:0.88}
.btn-primary:disabled{opacity:0.45;cursor:default}
.error{font-size:12px;color:#991B1B;margin-top:8px;min-height:18px}
.success-card{background:#E1F5EE;border-radius:12px;padding:32px;text-align:center;border:1px solid #5DCAA5}
.success-card h3{font-size:18px;color:#0F6E56;margin-bottom:8px}
.success-card p{font-size:13px;color:#0F6E56;margin-bottom:14px}
.signed-details{background:#F4F3F0;border-radius:8px;padding:12px 16px;font-size:12px;color:#666;margin-top:12px;text-align:left}
.print-btn{margin-top:14px;background:#fff;color:#0F6E56;border:1.5px solid #5DCAA5;padding:8px 20px;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
.footer{text-align:center;padding:20px;font-size:11px;color:#aaa}
@media print{.sign-card,.top-bar .top-status{display:none}.top-bar{background:#fff;color:#1a1a2e;border-bottom:2px solid #1a1a2e}.doc-card{border:none;padding:0}}
</style>
</head>
<body>
<div class="top-bar">
  <div class="top-logo">K8</div>
  <div class="top-title">${doc.title} · Kato.8 Studios Document Signing</div>
  <span class="top-status status-${doc.status==='pending'?'sent':doc.status}">${doc.status==='pending'?'PENDING':doc.status.toUpperCase()}</span>
</div>
${isSigned  ? `<div class="banner banner-signed">✓ Signed by ${doc.signerName || doc.recipient.name} on ${fmtDate(doc.signedAt)}</div>` : ''}
${isDeclined ? `<div class="banner banner-declined">✗ This document was declined on ${fmtDate(doc.declinedAt)}</div>` : ''}
<div class="wrapper">
  <div class="doc-card">${content}</div>
  ${isSigned ? `
  <div class="success-card">
    <h3>✓ Document Signed</h3>
    <p>Signed by <strong>${doc.signerName}</strong> · ${fmtDate(doc.signedAt)}</p>
    ${doc.signature ? `<img src="${doc.signature}" style="border:1px solid #5DCAA5;border-radius:8px;max-width:300px;background:#fff;padding:8px;margin-top:8px" alt="Signature"/>` : ''}
    <br/><button class="print-btn" onclick="window.print()">Download / Print PDF</button>
  </div>` : ''}
  ${isDeclined ? `<div class="success-card" style="background:#FEE2E2;border-color:#FCA5A5"><h3 style="color:#991B1B">Document Declined</h3><p style="color:#991B1B">This document was declined. The studio has been notified.</p></div>` : ''}
  ${isActive ? `
  <div class="sign-card">
    <h3>Sign this document</h3>
    <p>By signing, you confirm you have read and agree to the terms above.</p>
    <div class="name-row">
      <label>Full name (to confirm identity)</label>
      <input type="text" id="signerName" placeholder="Type your full legal name" autocomplete="name" />
    </div>
    <div class="canvas-wrap">
      <canvas id="sigCanvas"></canvas>
    </div>
    <div class="canvas-hint">Draw your signature above · <button class="btn btn-ghost" style="padding:3px 10px;font-size:11px" onclick="clearCanvas()">Clear</button></div>
    <div class="btn-row">
      <button class="btn btn-danger" onclick="declineDoc()">Decline</button>
      <button class="btn btn-primary" id="signBtn" onclick="submitSig()">Sign Document →</button>
    </div>
    <div class="error" id="errMsg"></div>
  </div>` : ''}
</div>
<div class="footer">Kato.8 Studios · Document Signing Platform · terryt@kato8studios.com</div>
<script>
const TOKEN = '${doc.token}';
const API = window.location.origin;
const canvas = document.getElementById('sigCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let drawing = false;
if (canvas) {
  canvas.width = canvas.offsetWidth; canvas.height = 180;
  ctx.strokeStyle = '#1a1a2e'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const sc = canvas.width / r.width;
    return { x:(e.clientX-r.left)*sc, y:(e.clientY-r.top)*sc };
  }
  canvas.addEventListener('mousedown', e => { drawing=true; const p=pos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); });
  canvas.addEventListener('mousemove', e => { if(!drawing)return; const p=pos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); });
  canvas.addEventListener('mouseup', ()=>drawing=false);
  canvas.addEventListener('mouseleave', ()=>drawing=false);
  canvas.addEventListener('touchstart', e=>{ e.preventDefault(); drawing=true; const p=pos(e.touches[0]); ctx.beginPath(); ctx.moveTo(p.x,p.y); },{passive:false});
  canvas.addEventListener('touchmove', e=>{ e.preventDefault(); if(!drawing)return; const p=pos(e.touches[0]); ctx.lineTo(p.x,p.y); ctx.stroke(); },{passive:false});
  canvas.addEventListener('touchend', ()=>drawing=false);
  window.addEventListener('resize', ()=>{ const d=ctx.getImageData(0,0,canvas.width,canvas.height); canvas.width=canvas.offsetWidth; ctx.putImageData(d,0,0); ctx.strokeStyle='#1a1a2e'; ctx.lineWidth=2.2; ctx.lineCap='round'; ctx.lineJoin='round'; });
}
function clearCanvas() { if(ctx) ctx.clearRect(0,0,canvas.width,canvas.height); }
function isEmpty() { if(!ctx)return true; const d=ctx.getImageData(0,0,canvas.width,canvas.height).data; return !Array.from(d).some(v=>v!==0); }
async function submitSig() {
  const name = document.getElementById('signerName').value.trim();
  const err = document.getElementById('errMsg');
  err.textContent = '';
  if (!name) { err.textContent = 'Please type your full name to confirm identity.'; return; }
  if (isEmpty()) { err.textContent = 'Please draw your signature above.'; return; }
  const sig = canvas.toDataURL('image/png');
  const btn = document.getElementById('signBtn');
  btn.textContent = 'Signing…'; btn.disabled = true;
  try {
    const res = await fetch(API + '/api/signing/token/' + TOKEN + '/sign', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ signature: sig, signerName: name })
    });
    const data = await res.json();
    if (data.success) {
      document.querySelector('.sign-card').outerHTML = '<div class="success-card"><h3>✓ Document Signed</h3><p>Thank you, <strong>'+name+'</strong>. Your signature has been recorded. Kato.8 Studios will be in touch.</p><img src="'+sig+'" style="border:1px solid #5DCAA5;border-radius:8px;max-width:300px;background:#fff;padding:8px;margin-top:12px;display:block;margin-left:auto;margin-right:auto" alt="Signature"/><br/><button class="print-btn" onclick="window.print()">Download / Print PDF</button></div>';
    } else { err.textContent = 'Error: ' + (data.error || 'Unknown error'); btn.textContent='Sign Document →'; btn.disabled=false; }
  } catch(e) { err.textContent='Connection error. Please try again.'; btn.textContent='Sign Document →'; btn.disabled=false; }
}
async function declineDoc() {
  if (!confirm('Are you sure you want to decline this document?')) return;
  try {
    await fetch(API + '/api/signing/token/' + TOKEN + '/decline', { method:'POST' });
    document.querySelector('.sign-card').outerHTML = '<div class="success-card" style="background:#FEE2E2;border-color:#FCA5A5"><h3 style="color:#991B1B">Document Declined</h3><p style="color:#991B1B">You have declined to sign. Kato.8 Studios has been notified.</p></div>';
  } catch(e) { alert('Error. Please try again.'); }
}
</script>
</body>
</html>`
}

// ─── Signing REST endpoints ───────────────────────────────────────────────────

app.get('/api/signing', (_req, res) => res.json(loadSigning()))

const DOC_TITLES = {
  'revenue-share': 'Revenue Share Agreement',
  'ip-assignment': 'IP Assignment Agreement',
  'nda': 'Non-Disclosure Agreement',
  'offer-letter': 'Offer Letter',
}

app.post('/api/signing', (req, res) => {
  const docs = loadSigning()
  const now = new Date().toISOString()
  const b = req.body
  const templateId = b.templateId || b.template || 'revenue-share'
  const recipient = (b.recipient && typeof b.recipient === 'object') ? b.recipient : {
    name: b.recipientName || '',
    email: b.recipientEmail || '',
    role: b.role || '',
    dept: b.dept || '',
    team: b.team || '',
    lead: b.lead || '',
    startDate: b.startDate || '',
    revenueSharePct: b.revenueSharePct || '',
  }
  const doc = {
    id: randomUUID(),
    token: makeToken(),
    templateId,
    template: templateId,
    title: b.title || DOC_TITLES[templateId] || 'Document',
    recipient,
    recipientName: recipient.name,
    recipientEmail: recipient.email,
    role: recipient.role,
    status: 'pending',
    createdAt: now,
    signedAt: null,
    declinedAt: null,
    signature: null,
    signerName: null,
  }
  docs.unshift(doc)
  saveSigning(docs)
  res.json(doc)
})

app.get('/api/signing/:id', (req, res) => {
  const doc = loadSigning().find(d => d.id === req.params.id)
  if (!doc) return res.status(404).json({ error: 'not found' })
  res.json(doc)
})

app.patch('/api/signing/:id', (req, res) => {
  const docs = loadSigning()
  const idx = docs.findIndex(d => d.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  docs[idx] = { ...docs[idx], ...req.body, id: docs[idx].id, token: docs[idx].token }
  saveSigning(docs)
  res.json(docs[idx])
})

app.delete('/api/signing/:id', (req, res) => {
  const docs = loadSigning()
  const filtered = docs.filter(d => d.id !== req.params.id)
  if (filtered.length === docs.length) return res.status(404).json({ error: 'not found' })
  saveSigning(filtered)
  res.json({ ok: true })
})

// Public: get doc by token (JSON — for signing page AJAX on initial load check)
app.get('/api/signing/token/:token', (req, res) => {
  const doc = loadSigning().find(d => d.token === req.params.token)
  if (!doc) return res.status(404).json({ error: 'not found' })
  const { signature, ...safe } = doc  // don't expose signature in GET
  res.json(safe)
})

// Public: submit signature
app.post('/api/signing/token/:token/sign', (req, res) => {
  const docs = loadSigning()
  const idx = docs.findIndex(d => d.token === req.params.token)
  if (idx === -1) return res.status(404).json({ error: 'Document not found' })
  if (docs[idx].status === 'signed') return res.json({ success: true, alreadySigned: true })
  if (docs[idx].status === 'declined') return res.status(400).json({ error: 'Document was declined' })
  docs[idx].status = 'signed'
  docs[idx].signedAt = new Date().toISOString()
  docs[idx].signature = req.body.signature || null
  docs[idx].signerName = req.body.signerName || docs[idx].recipient.name
  saveSigning(docs)
  res.json({ success: true })
})

// Public: decline document
app.post('/api/signing/token/:token/decline', (req, res) => {
  const docs = loadSigning()
  const idx = docs.findIndex(d => d.token === req.params.token)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  docs[idx].status = 'declined'
  docs[idx].declinedAt = new Date().toISOString()
  saveSigning(docs)
  res.json({ success: true })
})

// Public: signing HTML page
app.get('/sign/:token', (req, res) => {
  const doc = loadSigning().find(d => d.token === req.params.token)
  if (!doc) {
    return res.status(404).send(`<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;text-align:center">
      <h2>Document not found</h2><p>This signing link is invalid or has expired.</p>
      <p><a href="http://localhost:5173">Back to HR Platform</a></p></body></html>`)
  }
  res.setHeader('Content-Type', 'text/html')
  res.send(signingPageHTML(doc))
})

// ─── Onboarding Portal ────────────────────────────────────────────────────────

const ONBOARD_FILE = join(__dirname, 'onboarding.json')
function loadOnboarding() {
  if (!existsSync(ONBOARD_FILE)) return []
  try { return JSON.parse(readFileSync(ONBOARD_FILE, 'utf8')) } catch { return [] }
}
function saveOnboarding(s) { writeFileSync(ONBOARD_FILE, JSON.stringify(s, null, 2)) }

const ONBOARD_DOC_TITLES = {
  'revenue-share': 'Revenue Share Agreement',
  'ip-assignment': 'IP Assignment Agreement',
  'nda': 'Non-Disclosure Agreement',
}
const ONBOARD_DOC_ICONS = {
  'revenue-share': '💰', 'ip-assignment': '⚖️', 'nda': '🔒',
}

// POST /api/onboard — create session + auto-generate 3 signing docs
app.post('/api/onboard', (req, res) => {
  const { name, role, email, dept, team, lead, startDate, revenueSharePct } = req.body
  if (!name || !role) return res.status(400).json({ error: 'name and role required' })
  const signing = loadSigning()
  const docs = []
  for (const template of ['revenue-share', 'ip-assignment', 'nda']) {
    const recipient = { name, email: email || '', role, dept: dept || 'art', team: team || 'studio', lead: lead || '', startDate: startDate || '', revenueSharePct: revenueSharePct || '' }
    const doc = {
      id: randomUUID(), token: makeToken(), templateId: template, template,
      title: ONBOARD_DOC_TITLES[template], recipient,
      recipientName: name, recipientEmail: email || '', role,
      status: 'pending', createdAt: new Date().toISOString(),
      signedAt: null, declinedAt: null, signature: null, signerName: null,
    }
    signing.push(doc)
    docs.push({ id: doc.id, token: doc.token, template, title: doc.title })
  }
  saveSigning(signing)
  const session = {
    id: randomUUID(), token: makeToken(), name, role,
    email: email || '', dept: dept || 'art', team: team || 'studio',
    lead: lead || '', startDate: startDate || '', revenueSharePct: revenueSharePct || '',
    docs, discordUsername: null, welcomeRead: false, calendarAdded: false,
    status: 'pending', createdAt: new Date().toISOString(),
  }
  const sessions = loadOnboarding()
  sessions.push(session)
  saveOnboarding(sessions)
  res.json(session)
})

app.get('/api/onboard', (_req, res) => res.json(loadOnboarding()))
app.get('/api/onboard/:id', (req, res) => {
  const s = loadOnboarding().find(s => s.id === req.params.id)
  if (!s) return res.status(404).json({ error: 'not found' })
  res.json(s)
})
app.patch('/api/onboard/:id', (req, res) => {
  const sessions = loadOnboarding()
  const idx = sessions.findIndex(s => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  sessions[idx] = { ...sessions[idx], ...req.body }
  saveOnboarding(sessions)
  res.json(sessions[idx])
})

// Discord username submission (HTML form POST — uses urlencoded body)
app.post('/onboard/:token/discord', (req, res) => {
  const sessions = loadOnboarding()
  const idx = sessions.findIndex(s => s.token === req.params.token)
  if (idx === -1) return res.status(404).send('Not found')
  sessions[idx].discordUsername = (req.body.username || '').trim()
  saveOnboarding(sessions)
  res.redirect(`/onboard/${req.params.token}`)
})

// Mark a step complete (JSON POST from portal JS)
app.post('/onboard/:token/complete', (req, res) => {
  const sessions = loadOnboarding()
  const idx = sessions.findIndex(s => s.token === req.params.token)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  const { step } = req.body
  if (step === 'welcomeRead') sessions[idx].welcomeRead = true
  if (step === 'calendarAdded') sessions[idx].calendarAdded = true
  saveOnboarding(sessions)
  res.json({ ok: true })
})

// Public onboarding portal
app.get('/onboard/:token', (req, res) => {
  const sessions = loadOnboarding()
  const session = sessions.find(s => s.token === req.params.token)
  if (!session) return res.status(404).send(`<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;text-align:center"><h2>Invalid onboarding link</h2><p>This link is invalid or has expired. Contact terryt@kato8studios.com.</p></body></html>`)
  const signing = loadSigning()
  const docsWithStatus = session.docs.map(d => {
    const sd = signing.find(sd => sd.id === d.id)
    return { ...d, status: sd?.status || 'pending' }
  })
  const allDocsSigned = docsWithStatus.every(d => d.status === 'signed')
  const steps = [
    { done: allDocsSigned },
    { done: !!session.discordUsername },
    { done: session.welcomeRead },
    { done: session.calendarAdded },
  ]
  const progress = Math.round(steps.filter(s => s.done).length / steps.length * 100)
  res.setHeader('Content-Type', 'text/html')
  res.send(onboardingPortalHTML(session, docsWithStatus, allDocsSigned, progress))
})

function onboardingPortalHTML(session, docs, allDocsSigned, progress) {
  const teamLabel = { studio:'General Studio', 'last-light':'Last Light', corebound:'Corebound', 'big-boss-cleanup':'Big Boss Cleanup' }[session.team] || session.team
  const startStr = session.startDate ? fmtDate(session.startDate + 'T00:00:00') : ''
  const ds = s => s === 'signed' ? 'ds-signed' : s === 'declined' ? 'ds-declined' : 'ds-pending'
  const dsLabel = s => s === 'signed' ? '✓ Signed' : s === 'declined' ? '✗ Declined' : 'Tap to sign →'
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Onboarding Portal — ${session.name} · Kato.8 Studios</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#F4F3F0;color:#1a1a2e;min-height:100vh}
.top-bar{background:#1a1a2e;color:#fff;padding:14px 24px;display:flex;align-items:center;gap:14px}.top-logo{width:36px;height:36px;border-radius:10px;background:#7C3AED;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
.wrapper{max-width:640px;margin:0 auto;padding:24px 16px 80px}
.welcome{background:#fff;border-radius:12px;border:1px solid #E5E3DF;padding:28px 28px 24px;margin-bottom:16px;text-align:center}
.welcome-icon{font-size:40px;margin-bottom:12px}.welcome-title{font-size:20px;font-weight:700;margin-bottom:6px}
.welcome-sub{font-size:13px;color:#666;line-height:1.6}
.prog-wrap{margin-top:16px;height:8px;background:#E5E3DF;border-radius:4px;overflow:hidden}
.prog-fill{height:100%;background:#7C3AED;border-radius:4px}
.prog-label{font-size:11px;color:#888;margin-top:6px}
.step{background:#fff;border-radius:12px;border:1px solid #E5E3DF;margin-bottom:12px;overflow:hidden}
.step.done{border-color:#5DCAA5}
.step-hdr{display:flex;align-items:center;gap:12px;padding:16px 20px}
.step-num{width:30px;height:30px;border-radius:50%;background:#E5E3DF;color:#666;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.step.done .step-num{background:#5DCAA5;color:#fff}
.step-title{font-size:14px;font-weight:600;flex:1}
.badge{font-size:10px;padding:3px 9px;border-radius:20px;font-weight:600}
.b-done{background:#E1F5EE;color:#0F6E56}.b-pend{background:#FAEEDA;color:#854F0B}
.step-body{padding:0 20px 20px}
.doc-link{display:flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid #E5E3DF;border-radius:8px;margin-bottom:8px;text-decoration:none;color:#1a1a2e;font-size:13px;transition:border 0.15s}
.doc-link:hover{border-color:#7C3AED}
.ds-label{font-size:10px;padding:2px 8px;border-radius:10px;font-weight:600;margin-left:auto;white-space:nowrap}
.ds-pending{background:#FAEEDA;color:#854F0B}.ds-signed{background:#E1F5EE;color:#0F6E56}.ds-declined{background:#FEE2E2;color:#991B1B}
.discord-form{display:flex;gap:8px;margin-top:10px}
.discord-form input{flex:1;padding:10px 12px;border:1.5px solid #D1CEC9;border-radius:8px;font-size:13px;font-family:inherit}
.discord-form input:focus{outline:none;border-color:#7C3AED}
.btn{padding:9px 20px;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:inherit;transition:all 0.15s}
.btn-p{background:#7C3AED;color:#fff}.btn-p:hover{opacity:0.88}.btn-p:disabled{opacity:0.5;cursor:default}
.btn-t{background:#0F6E56;color:#fff}.btn-t:hover{opacity:0.88}
.hint{font-size:12px;color:#888;line-height:1.5}
.success{font-size:13px;color:#0F6E56;font-weight:500;margin-top:6px}
.meeting-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #F0EDE9;font-size:13px}
.meeting-row:last-child{border-bottom:none}
.mtg-name{flex:1;font-weight:500}.mtg-time{font-size:12px;color:#888}
.welcome-text{font-size:13px;color:#444;line-height:1.8}
.refresh{display:block;width:100%;padding:9px;background:#F9F8F6;border:1px solid #E5E3DF;border-radius:8px;font-size:12px;color:#888;text-align:center;cursor:pointer;margin-top:8px;font-family:inherit}
.refresh:hover{background:#E5E3DF}
.footer{text-align:center;padding:24px;font-size:11px;color:#aaa}
</style></head><body>
<div class="top-bar">
  <div class="top-logo">K8</div>
  <div style="font-size:14px;font-weight:500">Kato.8 Studios — Your Onboarding Portal</div>
</div>
<div class="wrapper">
  <div class="welcome">
    <div class="welcome-icon">🎉</div>
    <div class="welcome-title">Welcome, ${session.name}!</div>
    <div class="welcome-sub">
      You're joining as <strong>${session.role}</strong>${teamLabel ? ` on the <strong>${teamLabel}</strong> team` : ''}.
      ${startStr ? `<br>Start date: <strong>${startStr}</strong>` : ''}
    </div>
    <div class="prog-wrap"><div class="prog-fill" style="width:${progress}%"></div></div>
    <div class="prog-label">${steps ? steps.filter(s=>s.done).length : 0} of 4 steps complete · ${progress}%</div>
  </div>

  <!-- Step 1: Agreements -->
  <div class="step${allDocsSigned?' done':''}">
    <div class="step-hdr">
      <div class="step-num">${allDocsSigned?'✓':'1'}</div>
      <div class="step-title">Sign Your Agreements</div>
      <span class="badge ${allDocsSigned?'b-done':'b-pend'}">${allDocsSigned?'Complete':'Action needed'}</span>
    </div>
    <div class="step-body">
      <p class="hint" style="margin-bottom:10px">Please sign all 3 documents before your start date. Each opens in a new tab.</p>
      ${docs.map(d => `<a href="/sign/${d.token}" class="doc-link" target="_blank">
        <span>${ONBOARD_DOC_ICONS[d.template]||'📄'}</span>
        <span>${d.title}</span>
        <span class="ds-label ${ds(d.status)}">${dsLabel(d.status)}</span>
      </a>`).join('')}
      <button class="refresh" onclick="location.reload()">↻ Refresh status after signing</button>
    </div>
  </div>

  <!-- Step 2: Discord -->
  <div class="step${session.discordUsername?' done':''}">
    <div class="step-hdr">
      <div class="step-num">${session.discordUsername?'✓':'2'}</div>
      <div class="step-title">Join Our Discord Server</div>
      <span class="badge ${session.discordUsername?'b-done':'b-pend'}">${session.discordUsername?'Complete':'Pending'}</span>
    </div>
    <div class="step-body">
      ${session.discordUsername
        ? `<p class="success">✓ Discord username on file: <strong>${session.discordUsername}</strong></p>
           <p class="hint" style="margin-top:6px">Our team will add you to the Kato.8 Studios server and assign your department role. Check your Discord requests.</p>`
        : `<p class="hint" style="margin-bottom:0">Submit your Discord username and we'll add you to the studio server and assign your role.</p>
           <form class="discord-form" action="/onboard/${session.token}/discord" method="POST">
             <input name="username" placeholder="Your Discord username" required />
             <button type="submit" class="btn btn-p">Submit</button>
           </form>`
      }
    </div>
  </div>

  <!-- Step 3: Welcome material -->
  <div class="step${session.welcomeRead?' done':''}">
    <div class="step-hdr">
      <div class="step-num">${session.welcomeRead?'✓':'3'}</div>
      <div class="step-title">Read Welcome Material</div>
      <span class="badge ${session.welcomeRead?'b-done':'b-pend'}">${session.welcomeRead?'Complete':'Pending'}</span>
    </div>
    <div class="step-body">
      <div class="welcome-text">
        <p><strong>Welcome to Kato.8 Studios!</strong></p>
        <p style="margin-top:10px">We're a remote-first creative studio building original games. Here's what you need to know:</p>
        <p style="margin-top:10px"><strong>Communication:</strong> Discord is our primary tool. Please keep notifications on during core hours and respond to DMs within 24 hours.</p>
        <p style="margin-top:10px"><strong>Standards:</strong> Quality over speed. If you're unsure about something, ask. Creative feedback is collaborative — we're building together.</p>
        <p style="margin-top:10px"><strong>IP &amp; Confidentiality:</strong> All work you create for Kato.8 is owned by the studio. Do not share unreleased project details publicly on social or otherwise.</p>
        <p style="margin-top:10px"><strong>Revenue share:</strong> Payouts happen within 60 days of revenue events. Your percentage is in your Revenue Share Agreement.</p>
        <p style="margin-top:10px">Questions? Contact Terry Teng: <a href="mailto:terryt@kato8studios.com">terryt@kato8studios.com</a></p>
      </div>
      ${!session.welcomeRead
        ? `<button class="btn btn-t" style="margin-top:16px" onclick="completeStep('welcomeRead',this)">✓ I've read the welcome material</button>`
        : `<p class="success" style="margin-top:10px">✓ Completed</p>`}
    </div>
  </div>

  <!-- Step 4: Calendar -->
  <div class="step${session.calendarAdded?' done':''}">
    <div class="step-hdr">
      <div class="step-num">${session.calendarAdded?'✓':'4'}</div>
      <div class="step-title">Get Added to Team Meetings</div>
      <span class="badge ${session.calendarAdded?'b-done':'b-pend'}">${session.calendarAdded?'Complete':'Pending'}</span>
    </div>
    <div class="step-body">
      <p class="hint" style="margin-bottom:12px">Your lead will add you to these recurring meetings. Let them know your timezone.</p>
      <div class="meeting-row"><span class="mtg-name">All-Studio Weekly Sync</span><span class="mtg-time">Mondays · 6:00 PM PT</span></div>
      <div class="meeting-row"><span class="mtg-name">Department Check-in</span><span class="mtg-time">Wednesdays · 5:00 PM PT</span></div>
      <div class="meeting-row"><span class="mtg-name">1:1 with Lead</span><span class="mtg-time">Bi-weekly · time TBD with lead</span></div>
      <div style="margin-top:14px">
        ${!session.calendarAdded
          ? `<button class="btn btn-t" onclick="completeStep('calendarAdded',this)">✓ I've been added to the meetings</button>`
          : `<p class="success">✓ Confirmed</p>`}
      </div>
    </div>
  </div>
</div>
<div class="footer">Kato.8 Studios · terryt@kato8studios.com · Mission Hills, California</div>
<script>
async function completeStep(step, btn) {
  if(btn){btn.disabled=true;btn.textContent='Saving…';}
  try {
    const r = await fetch('/onboard/${session.token}/complete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({step})});
    if(r.ok) location.reload();
    else if(btn){btn.disabled=false;btn.textContent='Error — try again';}
  } catch(e){if(btn){btn.disabled=false;btn.textContent='Error — try again';}}
}
</script>
</body></html>`
}

// ─── Google Drive Integration ─────────────────────────────────────────────────
// Setup: add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env
// Then click "Connect Google Drive" in the HR platform
// Redirect URI: http://localhost:3001/auth/google/callback

import { google } from 'googleapis'
import { createWriteStream } from 'fs'

const TOKENS_FILE = join(__dirname, 'google_tokens.json')

function loadTokens() {
  if (!existsSync(TOKENS_FILE)) return null
  try { return JSON.parse(readFileSync(TOKENS_FILE, 'utf8')) } catch { return null }
}
function saveTokens(t) { writeFileSync(TOKENS_FILE, JSON.stringify(t, null, 2)) }

function getDriveClient() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return null
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3001/auth/google/callback'
  )
  const tokens = loadTokens()
  if (tokens) auth.setCredentials(tokens)
  return auth
}

// Status: check if Drive is connected
app.get('/api/drive/status', async (req, res) => {
  const auth = getDriveClient()
  if (!auth) return res.json({ connected: false, reason: 'no_credentials' })
  const tokens = loadTokens()
  if (!tokens) return res.json({ connected: false, reason: 'not_authorized' })
  try {
    const drive = google.drive({ version: 'v3', auth })
    const about = await drive.about.get({ fields: 'user' })
    res.json({ connected: true, email: about.data.user.emailAddress, name: about.data.user.displayName })
  } catch (err) {
    res.json({ connected: false, reason: 'auth_error', error: err.message })
  }
})

// Start OAuth flow
app.get('/auth/google', (req, res) => {
  const auth = getDriveClient()
  if (!auth) return res.status(400).send('Google OAuth credentials not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env')
  const url = auth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.metadata.readonly'],
    prompt: 'consent',
  })
  res.redirect(url)
})

// OAuth callback
app.get('/auth/google/callback', async (req, res) => {
  const { code, error } = req.query
  if (error) return res.redirect('http://localhost:5173?drive_error=' + error)
  const auth = getDriveClient()
  if (!auth) return res.status(400).send('OAuth not configured')
  try {
    const { tokens } = await auth.getToken(code)
    saveTokens(tokens)
    res.redirect('http://localhost:5173?drive_connected=1')
  } catch (err) {
    res.redirect('http://localhost:5173?drive_error=' + encodeURIComponent(err.message))
  }
})

// List Drive files
app.get('/api/drive/files', async (req, res) => {
  const auth = getDriveClient()
  if (!auth || !loadTokens()) return res.status(401).json({ error: 'Drive not connected' })
  try {
    const drive = google.drive({ version: 'v3', auth })
    const q = req.query.q || ''
    const params = {
      pageSize: 50,
      fields: 'files(id,name,mimeType,size,modifiedTime,webViewLink,parents)',
      orderBy: 'modifiedTime desc',
    }
    if (q) params.q = `name contains '${q.replace(/'/g, "\\'")}' and trashed=false`
    else params.q = 'trashed=false'
    if (req.query.folder) params.q += ` and '${req.query.folder}' in parents`
    const result = await drive.files.list(params)
    res.json(result.data.files || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Disconnect Drive
app.post('/api/drive/disconnect', (req, res) => {
  if (existsSync(TOKENS_FILE)) {
    try { unlinkSync(TOKENS_FILE) } catch (_) {}
  }
  res.json({ ok: true })
})

// ─── Serve built frontend in production ──────────────────────────────────────

const distPath = join(__dirname, 'dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (_req, res) => res.sendFile(join(distPath, 'index.html')))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`EA Agent server running on http://localhost:${PORT}`))

import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json())

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

// ─── Serve built frontend in production ──────────────────────���────────────────

const distPath = join(__dirname, 'dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (_req, res) => res.sendFile(join(distPath, 'index.html')))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`EA Agent server running on http://localhost:${PORT}`))

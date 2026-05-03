import { useState, useRef, useEffect } from 'react'
import { PageHeader, PageContent, Card, CardHeader, Tag } from '../components/UI.jsx'
import styles from './Pages.module.css'

const EA_COMMANDS = [
  { label: 'Draft offer / revenue share agreement', prompt: 'Draft a revenue share offer letter for a new Kato.8 Studios collaborator. Include all standard sections: role description, revenue share %, IP assignment clause, at-will language, and start date.' },
  { label: 'Check compliance deadlines', prompt: 'What HR compliance tasks are currently overdue or due soon for Kato.8 Studios? Prioritize critical items first and tell me what action to take for each.' },
  { label: 'Headcount + open roles report', prompt: 'Give me a current headcount summary, open roles status with candidate counts, and a quick team structure overview for Kato.8 Studios.' },
  { label: 'Alex Martinez onboarding status', prompt: 'Alex Martinez is currently onboarding as a 3D Artist and is in the Day 1 phase. What tasks are still pending for today, and what should happen in the next 7 days?' },
  { label: 'Schedule performance check-ins', prompt: 'Draft a Google Calendar plan: schedule the Day 30 check-in and 90-day review for Alex Martinez, and quarterly check-ins for the full team. Include event titles, descriptions, and who to invite.' },
  { label: 'DocuSign pending signatures', prompt: 'Which documents are currently pending signature in DocuSign for Kato.8 Studios? Who needs to sign, how urgent is each, and what\'s the recommended follow-up action?' },
  { label: 'Revenue share agreement review', prompt: 'Review the current Kato.8 Studios revenue share agreement structure. What key clauses should be audited given CA AB 5, SB 1162, and current team size? What\'s missing?' },
  { label: 'Discord #hr-ops setup guide', prompt: 'Give me a step-by-step plan to set up the Kato.8 Studios private #hr-ops Discord channel. Include: who gets access, what EA webhook notifications to configure, and how to set up compliance deadline reminders.' },
  { label: 'Draft CA SB 553 handbook section', prompt: 'Draft a complete CA SB 553 Workplace Violence Prevention Plan section for the Kato.8 Studios employee handbook. This is critical and overdue — make it compliant and complete. Include: policy statement, definitions, incident procedures, and training requirements.' },
  { label: 'CCPA privacy notice for collaborators', prompt: 'Draft a complete CCPA-compliant privacy notice for Kato.8 Studios collaborators. Cover: what personal data is collected, how it\'s used, retention periods, third-party sharing, and collaborator rights under California law.' },
]

const WORKFLOWS = [
  { icon: '✍️', title: 'DocuSign signing events', desc: 'When an agreement is signed or declined, EA updates the compliance checklist and files the document to Google Drive automatically.', status: 'Needs webhook' },
  { icon: '📅', title: 'Onboarding milestone scheduling', desc: 'EA creates Google Calendar events for all onboarding checkpoints (Day 1, Week 1, Day 30 review) when a new collaborator is added.', status: 'Active' },
  { icon: '💬', title: 'Discord compliance alerts', desc: 'EA posts to #hr-ops when compliance items are due, documents are expiring, or agreements need signatures.', status: 'Needs webhook' },
  { icon: '📁', title: 'Drive document indexing', desc: 'EA reads Google Drive to answer team questions about policies, find templates, and check what agreements are on file.', status: 'Active' },
]

function Message({ role, content }) {
  return (
    <div className={`${styles.chatMsg} ${role === 'user' ? styles.msgUser : styles.msgAssistant}`}>
      <div className={styles.chatAvatar} style={role === 'assistant'
        ? { background: 'var(--k8-accent)', color: '#fff' }
        : { background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }
      }>
        {role === 'assistant' ? '◈' : 'You'}
      </div>
      <div className={styles.chatBubble} style={role === 'user'
        ? { background: 'var(--k8-accent)', color: '#fff', borderBottomRightRadius: 4 }
        : { background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderBottomLeftRadius: 4 }
      }>
        <MdContent text={content} />
      </div>
    </div>
  )
}

function MdContent({ text }) {
  const lines = text.split('\n')
  return (
    <div className={styles.mdContent}>
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return <div key={i} className={styles.mdH2}>{line.slice(3)}</div>
        if (line.startsWith('# ')) return <div key={i} className={styles.mdH1}>{line.slice(2)}</div>
        if (line.startsWith('**') && line.endsWith('**') && line.length > 4) return <div key={i} className={styles.mdBold}>{line.slice(2, -2)}</div>
        if (line.startsWith('- ') || line.startsWith('• ')) return <div key={i} className={styles.mdBullet}><span className={styles.mdBulletDot}>·</span>{renderInline(line.slice(2))}</div>
        if (line === '') return <div key={i} style={{ height: 6 }} />
        return <div key={i} className={styles.mdPara}>{renderInline(line)}</div>
      })}
    </div>
  )
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export default function EAAgent() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [serverError, setServerError] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamText])

  async function sendMessage(prompt) {
    const text = prompt || input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setStreamText('')
    setServerError(false)

    try {
      const response = await fetch('/api/ea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!response.ok) throw new Error(`Server ${response.status}`)

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.error) throw new Error(parsed.error)
            accumulated += parsed.text
            setStreamText(accumulated)
          } catch {}
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: accumulated }])
    } catch (err) {
      setServerError(true)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Connection error: ${err.message}. Make sure the EA server is running (\`npm run dev\`) and ANTHROPIC_API_KEY is set in your .env file.`,
      }])
    } finally {
      setStreamText('')
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const connected = !serverError

  return (
    <>
      <PageHeader
        title="Executive Assistant"
        subtitle="AI agent with full HR platform access — drafting, scheduling, compliance, and onboarding"
        actions={<Tag color={connected ? 'green' : 'amber'}>{connected ? '● Connected' : '○ Server offline'}</Tag>}
      />
      <PageContent>
        {/* Status banner */}
        <div className={styles.eaBanner}>
          <div className={styles.eaBannerIcon}>◈</div>
          <div className={styles.eaBannerText}>
            <div className={styles.eaBannerTitle}>EA Agent — HR Integration Active</div>
            <div className={styles.eaBannerSub}>
              Connected to: Google Drive, Google Calendar · Pending: DocuSign webhook, Discord webhook · Today: CA SB 553 due in 4 days
            </div>
          </div>
        </div>

        {/* Chat window */}
        <Card className={styles.chatCard}>
          <div className={styles.chatWindow}>
            {messages.length === 0 && !streamText && (
              <div className={styles.chatEmpty}>
                <div className={styles.chatEmptyIcon}>◈</div>
                <div>Ask EA anything about the studio, or use a quick command below</div>
                <div style={{ fontSize: 11, opacity: 0.65 }}>Draft agreements · Check compliance · Manage onboarding · Schedule reviews</div>
              </div>
            )}

            {messages.map((msg, i) => (
              <Message key={i} role={msg.role} content={msg.content} />
            ))}

            {streamText && (
              <div className={`${styles.chatMsg} ${styles.msgAssistant}`}>
                <div className={styles.chatAvatar} style={{ background: 'var(--k8-accent)', color: '#fff' }}>◈</div>
                <div className={styles.chatBubble} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderBottomLeftRadius: 4 }}>
                  <MdContent text={streamText} />
                  <span className={styles.cursor}>▋</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className={styles.chatInputBar}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask EA anything about the studio…"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              {loading ? '…' : 'Send ↗'}
            </button>
          </div>
        </Card>

        {/* Quick commands */}
        <Card>
          <CardHeader title="Quick commands" />
          <div className={styles.eaCommands}>
            {EA_COMMANDS.map((cmd, i) => (
              <button
                key={i}
                className={styles.eaCmd}
                onClick={() => sendMessage(cmd.prompt)}
                disabled={loading}
              >
                {cmd.label} ↗
              </button>
            ))}
          </div>
        </Card>

        {/* Automated workflows */}
        <Card>
          <CardHeader title="Automated workflows" />
          {WORKFLOWS.map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < WORKFLOWS.length - 1 ? '0.5px solid var(--border-light)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{w.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{w.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.5 }}>{w.desc}</div>
              </div>
              <Tag color={w.status === 'Active' ? 'green' : 'amber'}>{w.status}</Tag>
            </div>
          ))}
        </Card>
      </PageContent>
    </>
  )
}

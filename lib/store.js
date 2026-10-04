// Record storage for the HR API.
//
// In production, records live in the Supabase table `hr_records` (see
// supabase/hr_records.sql), reached over PostgREST with the service role key.
// Without SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (local dev), each collection
// falls back to a JSON file next to server.js, as before.

import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const useSupabase = !!(SUPABASE_URL && SUPABASE_KEY)

const FILES = {
  actions: 'actions.json',
  signing: 'signing.json',
  onboarding: 'onboarding.json',
}

// ─── Supabase (PostgREST) ────────────────────────────────────────────────────

async function rest(method, query, body, prefer) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/hr_records?${query}`, {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Supabase ${method} failed: ${res.status} ${await res.text()}`)
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

const q = (coll, extra = '') => `collection=eq.${encodeURIComponent(coll)}${extra}`
const row = (coll, obj) => ({
  collection: coll,
  id: obj.id,
  token: obj.token ?? null,
  data: obj,
  created_at: obj.createdAt || new Date().toISOString(),
})

// ─── JSON files (local dev) ──────────────────────────────────────────────────

function fileLoad(coll) {
  const f = join(ROOT, FILES[coll] || `${coll}.json`)
  if (!existsSync(f)) return []
  try { return JSON.parse(readFileSync(f, 'utf8')) } catch { return [] }
}
function fileSave(coll, items) {
  writeFileSync(join(ROOT, FILES[coll] || `${coll}.json`), JSON.stringify(items, null, 2))
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const store = {
  usingSupabase: useSupabase,

  // Newest first.
  async list(coll) {
    if (!useSupabase) return fileLoad(coll)
    const rows = await rest('GET', q(coll, '&select=data&order=created_at.desc'))
    return rows.map(r => r.data)
  },

  async get(coll, id) {
    if (!useSupabase) return fileLoad(coll).find(x => x.id === id) || null
    const rows = await rest('GET', q(coll, `&id=eq.${encodeURIComponent(id)}&select=data`))
    return rows[0]?.data || null
  },

  async getByToken(coll, token) {
    if (!useSupabase) return fileLoad(coll).find(x => x.token === token) || null
    const rows = await rest('GET', q(coll, `&token=eq.${encodeURIComponent(token)}&select=data`))
    return rows[0]?.data || null
  },

  // Inserts records whose id is not already stored; returns the ones inserted.
  async insertNew(coll, objs) {
    if (!objs.length) return []
    if (!useSupabase) {
      const items = fileLoad(coll)
      const ids = new Set(items.map(x => x.id))
      const fresh = objs.filter(o => !ids.has(o.id))
      fileSave(coll, [...fresh, ...items])
      return fresh
    }
    const rows = await rest('POST', 'on_conflict=collection,id', objs.map(o => row(coll, o)),
      'resolution=ignore-duplicates,return=representation')
    return (rows || []).map(r => r.data)
  },

  // Replaces a stored record (matched by id). Returns false if it did not exist.
  async put(coll, obj) {
    if (!useSupabase) {
      const items = fileLoad(coll)
      const idx = items.findIndex(x => x.id === obj.id)
      if (idx === -1) return false
      items[idx] = obj
      fileSave(coll, items)
      return true
    }
    const rows = await rest('PATCH', q(coll, `&id=eq.${encodeURIComponent(obj.id)}`),
      { data: obj, token: obj.token ?? null }, 'return=representation')
    return rows.length > 0
  },

  async remove(coll, id) {
    if (!useSupabase) {
      const items = fileLoad(coll)
      const kept = items.filter(x => x.id !== id)
      if (kept.length === items.length) return false
      fileSave(coll, kept)
      return true
    }
    const rows = await rest('DELETE', q(coll, `&id=eq.${encodeURIComponent(id)}`), undefined, 'return=representation')
    return rows.length > 0
  },

  // Small key/value settings (e.g. Google OAuth tokens).
  async kvGet(key) {
    if (!useSupabase) {
      const f = join(ROOT, `${key}.json`)
      if (!existsSync(f)) return null
      try { return JSON.parse(readFileSync(f, 'utf8')) } catch { return null }
    }
    return (await this.get('kv', key))?.value ?? null
  },
  async kvSet(key, value) {
    if (!useSupabase) return writeFileSync(join(ROOT, `${key}.json`), JSON.stringify(value, null, 2))
    await rest('POST', 'on_conflict=collection,id', [row('kv', { id: key, value })], 'resolution=merge-duplicates')
  },
  async kvDelete(key) {
    if (!useSupabase) {
      const f = join(ROOT, `${key}.json`)
      if (existsSync(f)) try { unlinkSync(f) } catch {}
      return
    }
    await this.remove('kv', key)
  },
}

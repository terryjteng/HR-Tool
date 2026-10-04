// Record storage for the HR API.
//
// Each collection (actions, signing, onboarding, kv) is one JSON document.
// In production the documents live in a private Vercel Blob store attached to
// this project (BLOB_READ_WRITE_TOKEN is added by Vercel when the store is
// connected). Locally, without that token, they are JSON files next to
// server.js, as before.
//
// Writes are read-modify-write with optimistic concurrency: a write only
// succeeds if the document is unchanged since it was read (Blob ETag), and
// otherwise re-reads and retries, so concurrent requests don't lose updates.

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { get, put, BlobPreconditionFailedError, BlobError } from '@vercel/blob'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN
// On Vercel the filesystem is read-only and per-instance, so the file fallback
// would silently return empty lists. Refuse instead until the Blob store is set.
const ready = useBlob || !process.env.VERCEL

const FILES = {
  actions: 'actions.json',
  signing: 'signing.json',
  onboarding: 'onboarding.json',
  kv: 'settings.json',
}

class Conflict extends Error {}

// ─── Backends: read → { items, etag }, write(items, etag) or throw Conflict ──

const blobBackend = {
  path: coll => `hr/${coll}.json`,
  async read(coll) {
    const res = await get(this.path(coll), { access: 'private', useCache: false })
    if (!res || res.statusCode !== 200) return { items: [], etag: null }
    const text = await new Response(res.stream).text()
    return { items: text ? JSON.parse(text) : [], etag: res.blob.etag }
  },
  async write(coll, items, etag) {
    try {
      await put(this.path(coll), JSON.stringify(items), {
        access: 'private',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: !!etag,
        ...(etag ? { ifMatch: etag } : {}),
      })
    } catch (err) {
      // Changed since we read it, or created by someone else in the meantime.
      if (err instanceof BlobPreconditionFailedError) throw new Conflict()
      if (!etag && err instanceof BlobError && /exist/i.test(err.message)) throw new Conflict()
      throw err
    }
  },
}

const fileBackend = {
  file: coll => join(ROOT, FILES[coll] || `${coll}.json`),
  async read(coll) {
    const f = this.file(coll)
    if (!existsSync(f)) return { items: [], etag: null }
    try { return { items: JSON.parse(readFileSync(f, 'utf8')), etag: null } } catch { return { items: [], etag: null } }
  },
  async write(coll, items) {
    writeFileSync(this.file(coll), JSON.stringify(items, null, 2))
  },
}

const backend = useBlob ? blobBackend : fileBackend

function assertReady() {
  if (!ready) throw new Error('Storage not configured: connect a private Vercel Blob store to this project')
}

async function read(coll) {
  assertReady()
  return (await backend.read(coll)).items
}

// Applies fn(items) → { items, result } and saves, retrying on write conflicts.
async function mutate(coll, fn) {
  assertReady()
  for (let attempt = 0; attempt < 6; attempt++) {
    const { items, etag } = await backend.read(coll)
    const { items: next, result, changed = true } = fn(items)
    if (!changed) return result
    try {
      await backend.write(coll, next, etag)
      return result
    } catch (err) {
      if (!(err instanceof Conflict)) throw err
      await new Promise(r => setTimeout(r, 50 + Math.random() * 150 * (attempt + 1)))
    }
  }
  throw new Error(`Could not save ${coll}: too many concurrent writes`)
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const store = {
  backend: useBlob ? 'vercel-blob' : 'files',
  ready,

  // Newest first (records are kept sorted by createdAt descending).
  async list(coll) {
    return read(coll)
  },

  async get(coll, id) {
    return (await read(coll)).find(x => x.id === id) || null
  },

  async getByToken(coll, token) {
    return (await read(coll)).find(x => x.token === token) || null
  },

  // Inserts records whose id is not already stored; returns the ones inserted.
  async insertNew(coll, objs) {
    if (!objs.length) return []
    return mutate(coll, items => {
      const ids = new Set(items.map(x => x.id))
      const fresh = objs.filter(o => !ids.has(o.id))
      const next = [...fresh, ...items].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
      return { items: next, result: fresh, changed: fresh.length > 0 }
    })
  },

  // Replaces a stored record (matched by id). Returns false if it did not exist.
  async put(coll, obj) {
    return mutate(coll, items => {
      const idx = items.findIndex(x => x.id === obj.id)
      if (idx === -1) return { items, result: false, changed: false }
      const next = items.slice()
      next[idx] = obj
      return { items: next, result: true }
    })
  },

  async remove(coll, id) {
    return mutate(coll, items => {
      const next = items.filter(x => x.id !== id)
      return { items: next, result: next.length !== items.length, changed: next.length !== items.length }
    })
  },

  // Small settings (e.g. Google OAuth tokens), kept in the 'kv' collection.
  async kvGet(key) {
    return (await this.get('kv', key))?.value ?? null
  },
  async kvSet(key, value) {
    await mutate('kv', items => ({ items: [{ id: key, value }, ...items.filter(x => x.id !== key)], result: undefined }))
  },
  async kvDelete(key) {
    await this.remove('kv', key)
  },
}

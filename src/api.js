// The HR API is served from the same origin (Express in dev via the Vite proxy,
// a Vercel function in production). Links shared with recipients need the
// absolute origin.
export const API = window.location.origin

// fetch() for the HR API, with the Clerk session token the server requires.
export async function apiFetch(path, init = {}) {
  const token = await window.Clerk?.session?.getToken()
  return fetch(`${API}${path}`, {
    ...init,
    headers: { ...init.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  })
}

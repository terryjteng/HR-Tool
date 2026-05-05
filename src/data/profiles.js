const KEY = 'k8-profiles'

export function loadProfiles() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') }
  catch { return {} }
}

export function saveProfile(id, data) {
  const all = loadProfiles()
  all[id] = { ...all[id], ...data }
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function getProfile(id) {
  return loadProfiles()[id] || {}
}

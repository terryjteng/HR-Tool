// Vercel entry point: the Express app in server.js handles /api, /sign, /onboard
// and /auth routes (see the rewrites in vercel.json).
import app from '../server.js'

export const config = { maxDuration: 300 }

export default app

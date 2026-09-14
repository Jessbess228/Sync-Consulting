import { createHash, timingSafeEqual } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from '@koa/router'
import { bookingMailConfigured, sendBookingEmail } from './mail.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const LAYOUT_PATH = resolve(ROOT, 'public', 'layout.json')
const PORT = 9000
const COOKIE = 'sc_cms'

function loadEnv() {
  const file = resolve(ROOT, '.env')
  if (!existsSync(file)) return
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnv()

const CMS_PASSWORD = process.env.CMS_PASSWORD || ''

function digest(value) {
  return createHash('sha256').update(value).digest()
}

function passwordsMatch(input) {
  if (!CMS_PASSWORD || typeof input !== 'string') return false
  return timingSafeEqual(digest(input), digest(CMS_PASSWORD))
}

function sessionToken() {
  return digest(`cms:${CMS_PASSWORD}`).toString('hex')
}

function isSignedIn(ctx) {
  const token = ctx.cookies.get(COOKIE)
  if (!CMS_PASSWORD || !token) return false
  const expected = Buffer.from(sessionToken())
  const actual = Buffer.from(token)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    overwrite: true,
  }
}

function isValidLayout(data) {
  return Boolean(data && typeof data === 'object' && Array.isArray(data.content))
}

const router = new Router()

router.post('/cms-api/login', async (ctx) => {
  const password = ctx.request.body?.password
  if (!passwordsMatch(password)) {
    ctx.status = 401
    ctx.body = { error: 'Invalid password' }
    return
  }

  ctx.cookies.set(COOKIE, sessionToken(), cookieOptions())
  ctx.status = 204
})

router.get('/cms-api/session', async (ctx) => {
  ctx.status = isSignedIn(ctx) ? 204 : 401
})

router.put('/cms-api/layout', async (ctx) => {
  if (!isSignedIn(ctx)) {
    ctx.status = 401
    ctx.body = { error: 'Sign in required' }
    return
  }

  const data = ctx.request.body
  if (!isValidLayout(data)) {
    ctx.status = 400
    ctx.body = { error: 'Invalid layout' }
    return
  }

  await mkdir(dirname(LAYOUT_PATH), { recursive: true })
  await writeFile(LAYOUT_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  ctx.body = data
})

const BOOKINGS_PATH = resolve(ROOT, 'cms', 'bookings.json')

router.post('/cms-api/bookings', async (ctx) => {
  const body = ctx.request.body || {}
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const txt = Boolean(body.txt)
  const call = Boolean(body.call)

  if (!name || (!email && !phone)) {
    ctx.status = 400
    ctx.body = { error: 'Name and an email or phone number are required' }
    return
  }

  const booking = { name, email, phone, message, txt, call }

  try {
    await sendBookingEmail(booking)
  } catch (error) {
    console.error('Booking email failed:', error)
    ctx.status = 502
    ctx.body = { error: 'Could not send booking email' }
    return
  }

  let list = []
  if (existsSync(BOOKINGS_PATH)) {
    try {
      const parsed = JSON.parse(readFileSync(BOOKINGS_PATH, 'utf8'))
      if (Array.isArray(parsed)) list = parsed
    } catch {
      list = []
    }
  }

  list.push({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    ...booking,
  })

  await mkdir(dirname(BOOKINGS_PATH), { recursive: true })
  await writeFile(BOOKINGS_PATH, `${JSON.stringify(list, null, 2)}\n`, 'utf8')
  ctx.status = 201
  ctx.body = { ok: true }
})

const app = new Koa()
app.use(
  bodyParser({
    jsonLimit: '10mb',
    enableTypes: ['json'],
  }),
)
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
  if (!CMS_PASSWORD) {
    console.warn('CMS_PASSWORD is not set. Admin login and save are locked.')
  }
  if (!bookingMailConfigured()) {
    console.warn('SMTP_USER / SMTP_PASS are not set. Booking emails will fail until they are.')
  }
  console.log(`CMS API: http://127.0.0.1:${PORT}/cms-api`)
})

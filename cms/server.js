import { createHash, timingSafeEqual } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from '@koa/router'

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
  console.log(`CMS API: http://127.0.0.1:${PORT}/cms-api`)
})

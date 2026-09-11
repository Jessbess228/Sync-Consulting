import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from '@koa/router'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DRAFT_PATH = resolve(ROOT, 'gen', 'draft.json')
const PUBLISHED_PATH = resolve(ROOT, 'public', 'layout.json')
const PORT = 9000

function isValidLayout(data) {
  return Boolean(data && typeof data === 'object' && Array.isArray(data.content))
}

async function readJson(filePath) {
  const raw = await readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

async function writeJson(filePath, data) {
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

async function loadLayoutFile(filePath) {
  if (!existsSync(filePath)) {
    return null
  }

  try {
    const data = await readJson(filePath)
    if (!isValidLayout(data)) {
      return null
    }
    return data
  } catch {
    return null
  }
}

const router = new Router()

router.get('/cms-api/layout', async (ctx) => {
  const status = ctx.query.status === 'published' ? 'published' : 'draft'
  const filePath = status === 'published' ? PUBLISHED_PATH : DRAFT_PATH
  const data = await loadLayoutFile(filePath)
  if (!data) {
    ctx.status = 404
    ctx.body = { error: 'Layout not found' }
    return
  }
  ctx.body = data
})

router.put('/cms-api/layout', async (ctx) => {
  const data = ctx.request.body
  if (!isValidLayout(data)) {
    ctx.status = 400
    ctx.body = { error: 'Invalid layout' }
    return
  }

  await writeJson(DRAFT_PATH, data)
  ctx.body = data
})

router.post('/cms-api/publish', async (ctx) => {
  const draft = await loadLayoutFile(DRAFT_PATH)
  if (!draft) {
    ctx.status = 404
    ctx.body = { error: 'Draft not found' }
    return
  }
  await writeJson(PUBLISHED_PATH, draft)
  ctx.body = draft
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
  console.log(`CMS API: http://127.0.0.1:${PORT}/cms-api/layout`)
})

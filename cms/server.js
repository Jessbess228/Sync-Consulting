import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from '@koa/router'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const LAYOUT_PATH = resolve(ROOT, 'public', 'layout.json')
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

async function loadLayout() {
  if (!existsSync(LAYOUT_PATH)) {
    return null
  }

  try {
    const data = await readJson(LAYOUT_PATH)
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
  const data = await loadLayout()
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

  await writeJson(LAYOUT_PATH, data)
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
  console.log(`CMS API: http://127.0.0.1:${PORT}/cms-api/layout`)
})

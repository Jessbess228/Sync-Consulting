import '@puckeditor/core/puck.css'
import { Puck, type Data } from '@puckeditor/core'
import { useEffect, useState } from 'react'
import {
  exportLayout,
  fetchDraftLayout,
  getDefaultLayout,
  importLayout,
  publishLayout,
  resetDraft,
  saveDraft,
} from '../lib/layoutStorage'
import { puckConfig } from '../puck/config'
import { messages } from './Home.messages'

type CmsStatus = 'loading' | 'offline' | 'saving' | 'saved' | 'published' | 'error'

const statusLabel: Record<CmsStatus, string> = {
  loading: 'Loading draft…',
  offline: 'CMS offline — export JSON to keep work',
  saving: 'Saving draft…',
  saved: 'Draft saved',
  published: 'Published',
  error: 'Layout error',
}

export function AdminMode() {
  const [data, setData] = useState<Data | null>(null)
  const [status, setStatus] = useState<CmsStatus>('loading')

  useEffect(() => {
    let cancelled = false

    fetchDraftLayout()
      .then((draft) => {
        if (cancelled) return
        setData(draft)
        setStatus('saved')
      })
      .catch(() => {
        if (cancelled) return
        setData(getDefaultLayout())
        setStatus('offline')
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!data) return

    const timeout = window.setTimeout(() => {
      setStatus('saving')
      saveDraft(data)
        .then(() => setStatus('saved'))
        .catch(() => setStatus('offline'))
    }, 400)

    return () => window.clearTimeout(timeout)
  }, [data])

  const handleSave = async () => {
    if (!data) return
    try {
      setStatus('saving')
      await saveDraft(data)
      setStatus('saved')
    } catch {
      setStatus('offline')
    }
  }

  const handlePublish = async (nextData: Data | null = data) => {
    if (!nextData) return
    try {
      setStatus('saving')
      setData(nextData)
      await saveDraft(nextData)
      await publishLayout()
      setStatus('published')
    } catch {
      setStatus('offline')
    }
  }

  const handleReset = async () => {
    try {
      const fresh = await resetDraft()
      setData(fresh)
      setStatus('saved')
    } catch {
      setData(getDefaultLayout())
      setStatus('offline')
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const imported = await importLayout(file)
      setData(imported)
      setStatus('saving')
      await saveDraft(imported)
      setStatus('saved')
    } catch (error) {
      console.error('Unable to import layout', error)
      setStatus('error')
    } finally {
      event.target.value = ''
    }
  }

  if (!data) {
    return <div className="admin-mode-shell">{messages.loading}</div>
  }

  return (
    <div className="admin-mode-shell">
      <Puck
        config={puckConfig}
        data={data}
        onChange={setData}
        onPublish={(nextData) => {
          void handlePublish(nextData)
        }}
        renderHeaderActions={() => (
          <div className="puck-header-actions">
            <span className={`puck-header-status puck-header-status--${status}`}>{statusLabel[status]}</span>
            <button type="button" className="puck-header-button" onClick={() => void handleSave()}>
              Save draft
            </button>
            <button type="button" className="puck-header-button" onClick={() => void handlePublish()}>
              Publish
            </button>
            <button
              type="button"
              className="puck-header-button puck-header-button--secondary"
              onClick={() => exportLayout(data)}
            >
              Export JSON
            </button>
            <button
              type="button"
              className="puck-header-button puck-header-button--secondary"
              onClick={() => void handleReset()}
            >
              Reset
            </button>
            <label className="puck-header-button puck-header-button--secondary puck-import-button">
              Import JSON
              <input type="file" accept="application/json" hidden onChange={(event) => void handleImport(event)} />
            </label>
            <a href="#/" className="puck-header-link">
              View site
            </a>
          </div>
        )}
      />
    </div>
  )
}

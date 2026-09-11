import '@puckeditor/core/puck.css'
import '../puck/editor.css'
import { Puck, type Data } from '@puckeditor/core'
import { useEffect, useState } from 'react'
import { fetchPublicLayout, saveLayout } from '../lib/layoutStorage'
import { puckConfig } from '../puck/config'
import { NumberField } from '../puck/NumberField'

type SaveStatus = 'loading' | 'idle' | 'saving' | 'saved' | 'error'

const statusLabel: Record<SaveStatus, string> = {
  loading: 'Loading…',
  idle: '',
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Couldn’t save',
}

export function AdminMode() {
  const [data, setData] = useState<Data | null>(null)
  const [status, setStatus] = useState<SaveStatus>('loading')

  useEffect(() => {
    let cancelled = false

    fetchPublicLayout()
      .then((layout) => {
        if (cancelled) return
        setData(layout)
        setStatus('idle')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleChange = (nextData: Data) => {
    setData(nextData)
    setStatus('idle')
  }

  const handleSave = async (nextData: Data | null = data) => {
    if (!nextData) return
    try {
      setStatus('saving')
      setData(nextData)
      await saveLayout(nextData)
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  if (!data) {
    return <div className="admin-mode-shell">Loading…</div>
  }

  return (
    <div className="admin-mode-shell">
      <Puck
        config={puckConfig}
        data={data}
        onChange={handleChange}
        overrides={{
          fieldTypes: {
            number: NumberField,
          },
        }}
        onPublish={(nextData) => {
          void handleSave(nextData)
        }}
        renderHeaderActions={() => (
          <div className="puck-header-actions">
            <span className={`puck-header-status puck-header-status--${status}`}>{statusLabel[status]}</span>
            <button type="button" className="puck-header-button" onClick={() => void handleSave()}>
              Save
            </button>
            <a href="#/" className="puck-header-link">
              View site
            </a>
          </div>
        )}
      />
    </div>
  )
}

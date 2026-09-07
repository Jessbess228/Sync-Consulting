import { Puck, type Data } from '@puckeditor/core'
import '@puckeditor/core/puck.css'
import { useCallback, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  exportLayout,
  importLayout,
  loadLayout,
  resetLayout,
  saveLayout,
} from '../lib/layoutStorage'
import { puckConfig } from '../puck/config'

export function AdminMode() {
  const navigate = useNavigate()
  const [data, setData] = useState<Data>(() => loadLayout())
  const [editorKey, setEditorKey] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const latestData = useRef(data)

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }, [])

  const handleSave = useCallback(
    (next: Data) => {
      saveLayout(next)
      latestData.current = next
      setData(next)
      showToast('Saved')
    },
    [showToast],
  )

  const handleReset = useCallback(() => {
    if (!window.confirm('Reset the page to the default Sync Consulting layout?')) {
      return
    }
    const next = resetLayout()
    latestData.current = next
    setData(next)
    setEditorKey((key) => key + 1)
    showToast('Reset to default')
  }, [showToast])

  const handleExport = useCallback(() => {
    exportLayout(latestData.current)
  }, [])

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleImportFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return
      try {
        const next = await importLayout(file)
        saveLayout(next)
        latestData.current = next
        setData(next)
        setEditorKey((key) => key + 1)
        showToast('Imported layout')
      } catch {
        showToast('Import failed')
      }
    },
    [showToast],
  )

  return (
    <div className="sc-admin-shell">
      <div className="sc-admin-toolbar">
        <div className="sc-admin-toolbar__brand">Sync Consulting · Layout</div>
        <Link className="sc-admin-btn" to="/">
          View site
        </Link>
        <button type="button" className="sc-admin-btn" onClick={handleExport}>
          Export JSON
        </button>
        <button type="button" className="sc-admin-btn" onClick={handleImportClick}>
          Import JSON
        </button>
        <button type="button" className="sc-admin-btn" onClick={handleReset}>
          Reset to default
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleImportFile}
        />
      </div>

      <div className="sc-admin-editor">
        <Puck
          key={editorKey}
          config={puckConfig}
          data={data}
          onChange={(next) => {
            latestData.current = next
          }}
          onPublish={handleSave}
          overrides={{
            headerActions: ({ children }) => (
              <>
                <button
                  type="button"
                  className="sc-admin-btn sc-admin-btn--primary"
                  onClick={() => handleSave(latestData.current)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="sc-admin-btn"
                  onClick={() => navigate('/')}
                >
                  Preview
                </button>
                {children}
              </>
            ),
          }}
        />
      </div>

      {toast ? <div className="sc-admin-toast">{toast}</div> : null}
    </div>
  )
}

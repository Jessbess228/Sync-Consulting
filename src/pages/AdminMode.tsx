import '@puckeditor/core/puck.css'
import '../puck/editor.css'
import { Puck, type Data } from '@puckeditor/core'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { checkCmsSession, fetchPublicLayout, loginCms, saveLayout } from '../lib/layoutStorage'
import { applyComponentDefaults } from '../puck/applyDefaults'
import { puckConfig } from '../puck/config'
import { NumberField } from '../puck/NumberField'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const statusLabel: Record<SaveStatus, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Couldn’t save',
}

function AdminGate({ onUnlocked }: { onUnlocked: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const result = await loginCms(password)
      if (result === 'ok') {
        onUnlocked()
        return
      }
      setError(result === 'offline' ? 'CMS isn’t running. Start it with npm start.' : 'Wrong password')
    } catch {
      setError('Couldn’t reach the CMS')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="sc-gate">
      <form className="sc-gate__form" onSubmit={(event) => void handleSubmit(event)}>
        <p className="sc-gate__mark">Log in</p>
        <label className="sc-gate__label" htmlFor="cms-password">
          Password
        </label>
        <input
          id="cms-password"
          className="sc-gate__input"
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        {error ? <p className="sc-gate__error">{error}</p> : null}
        <button className="sc-gate__submit" type="submit" disabled={submitting || !password}>
          {submitting ? 'Checking…' : 'Enter'}
        </button>
        <Link className="sc-gate__back" to="/">
          Back to site
        </Link>
      </form>
    </div>
  )
}

export function AdminMode() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null)
  const [data, setData] = useState<Data | null>(null)
  const [status, setStatus] = useState<SaveStatus>('idle')

  useEffect(() => {
    let cancelled = false

    checkCmsSession()
      .then((ok) => {
        if (!cancelled) setUnlocked(ok)
      })
      .catch(() => {
        if (!cancelled) setUnlocked(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!unlocked) return
    let cancelled = false

    fetchPublicLayout()
      .then((layout) => {
        if (cancelled) return
        setData(applyComponentDefaults(layout, puckConfig))
        setStatus('idle')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [unlocked])

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
      const stillSignedIn = await checkCmsSession()
      if (!stillSignedIn) {
        setUnlocked(false)
        setData(null)
        return
      }
      setStatus('error')
    }
  }

  if (unlocked === null) {
    return <div className="admin-mode-shell">Loading…</div>
  }

  if (!unlocked) {
    return <AdminGate onUnlocked={() => setUnlocked(true)} />
  }

  if (!data) {
    return (
      <div className="admin-mode-shell">{status === 'error' ? 'Couldn’t load layout' : 'Loading…'}</div>
    )
  }

  return (
    <div className="admin-mode-shell">
      <Puck
        config={puckConfig}
        data={data}
        iframe={{ syncHostStyles: true, waitForStyles: true }}
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
            <Link to="/" className="puck-header-link">
              View site
            </Link>
          </div>
        )}
      />
    </div>
  )
}

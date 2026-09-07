import { Render } from '@puckeditor/core'
import { Link } from 'react-router-dom'
import { loadLayout } from '../lib/layoutStorage'
import { puckConfig } from '../puck/config'

export function PublicPage() {
  const data = loadLayout()

  return (
    <div className="sc-grid-bg" style={{ minHeight: '100vh' }}>
      <Render config={puckConfig} data={data} />
      <Link className="sc-admin-fab" to="/admin">
        Admin
      </Link>
    </div>
  )
}

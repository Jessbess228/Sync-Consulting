import { Render, type Data } from '@puckeditor/core'
import { useEffect, useState } from 'react'
import { emptyLayout, fetchPublicLayout } from '../lib/layoutStorage'
import { puckConfig } from '../puck/config'

export function Home() {
  const [layoutData, setLayoutData] = useState<Data | null>(null)

  useEffect(() => {
    fetchPublicLayout()
      .then(setLayoutData)
      .catch(() => setLayoutData(emptyLayout()))
  }, [])

  if (!layoutData) {
    return <div className="site-shell">Loading…</div>
  }

  return <Render config={puckConfig} data={layoutData} />
}

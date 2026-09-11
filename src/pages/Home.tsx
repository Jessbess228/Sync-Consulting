import { Render, type Data } from '@puckeditor/core'
import { useEffect, useState } from 'react'
import { fetchPublishedLayout, getDefaultLayout } from '../lib/layoutStorage'
import { puckConfig } from '../puck/config'
import { messages } from './Home.messages'

export function Home() {
  const [layoutData, setLayoutData] = useState<Data | null>(null)

  useEffect(() => {
    fetchPublishedLayout()
      .then(setLayoutData)
      .catch(() => setLayoutData(getDefaultLayout()))
  }, [])

  if (!layoutData) {
    return <div className="site-shell">{messages.loading}</div>
  }

  return <Render config={puckConfig} data={layoutData} />
}

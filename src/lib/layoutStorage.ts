import type { Data } from '@puckeditor/core'

const CMS_API = '/cms-api'

function isValidLayout(data: unknown): data is Data {
  return Boolean(data && typeof data === 'object' && Array.isArray((data as Data).content))
}

export function emptyLayout(): Data {
  return {
    root: { props: { title: 'Sync Consulting' } },
    content: [],
  }
}

async function readLayoutResponse(response: Response): Promise<Data> {
  if (!response.ok) {
    throw new Error(`Layout request failed (${response.status})`)
  }

  const data: unknown = await response.json()
  if (!isValidLayout(data)) {
    throw new Error('Invalid layout')
  }

  return data
}

async function requestLayout(url: string, init?: RequestInit): Promise<Data> {
  return readLayoutResponse(await fetch(url, init))
}

export async function fetchPublicLayout(): Promise<Data> {
  return requestLayout(`${import.meta.env.BASE_URL}layout.json`)
}

export async function checkCmsSession(): Promise<boolean> {
  try {
    const response = await fetch(`${CMS_API}/session`, { credentials: 'include' })
    return response.ok
  } catch {
    return false
  }
}

export async function loginCms(password: string): Promise<'ok' | 'unauthorized' | 'offline'> {
  try {
    const response = await fetch(`${CMS_API}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (response.ok) return 'ok'
    if (response.status === 401) return 'unauthorized'
    return 'offline'
  } catch {
    return 'offline'
  }
}

export async function saveLayout(data: Data): Promise<Data> {
  return requestLayout(`${CMS_API}/layout`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

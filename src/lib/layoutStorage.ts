import type { Data } from '@puckeditor/core'
import { defaultData } from '../puck/defaultData'

const CMS_API = '/cms-api'

export function isValidLayout(data: unknown): data is Data {
  return Boolean(data && typeof data === 'object' && Array.isArray((data as Data).content))
}

export function getDefaultLayout(): Data {
  return structuredClone(defaultData)
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

export async function fetchDraftLayout(): Promise<Data> {
  const response = await fetch(`${CMS_API}/layout?status=draft`)
  if (response.status === 404) {
    return getDefaultLayout()
  }

  return readLayoutResponse(response)
}

export async function fetchPublishedLayout(): Promise<Data> {
  return requestLayout(`${import.meta.env.BASE_URL}layout.json`)
}

export async function saveDraft(data: Data): Promise<Data> {
  return requestLayout(`${CMS_API}/layout`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function publishLayout(): Promise<Data> {
  return requestLayout(`${CMS_API}/publish`, { method: 'POST' })
}

export async function resetDraft(): Promise<Data> {
  return saveDraft(getDefaultLayout())
}

export function exportLayout(data: Data): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'sync-consulting-layout.json'
  anchor.click()
  URL.revokeObjectURL(url)
}

export function importLayout(file: File): Promise<Data> {
  return file.text().then((raw) => {
    const parsed: unknown = JSON.parse(raw)
    if (!isValidLayout(parsed)) {
      throw new Error('Invalid layout file')
    }
    return parsed
  })
}

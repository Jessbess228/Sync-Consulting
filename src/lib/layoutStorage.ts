import type { Data } from '@puckeditor/core'
import { defaultData } from '../puck/defaultData'

export const STORAGE_KEY = 'sync-consulting-layout'

export function loadLayout(): Data {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(defaultData)
    const parsed = JSON.parse(raw) as Data
    if (!parsed || !Array.isArray(parsed.content)) {
      return structuredClone(defaultData)
    }
    return parsed
  } catch {
    return structuredClone(defaultData)
  }
}

export function saveLayout(data: Data): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetLayout(): Data {
  localStorage.removeItem(STORAGE_KEY)
  return structuredClone(defaultData)
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
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Data
        if (!parsed || !Array.isArray(parsed.content)) {
          reject(new Error('Invalid layout file'))
          return
        }
        resolve(parsed)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(reader.error ?? new Error('Read failed'))
    reader.readAsText(file)
  })
}

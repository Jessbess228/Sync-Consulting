import { useEffect, useState, type ComponentType, type ReactNode } from 'react'

type NumberFieldConfig = {
  min?: number
  max?: number
  placeholder?: string
}

type NumberFieldProps = {
  field: NumberFieldConfig
  value?: number
  onChange: (value: number) => void
  name: string
  id?: string
  label?: string
  readOnly?: boolean
  Label?: ComponentType<{
    label?: string
    readOnly?: boolean
    children: ReactNode
  }>
}

function clamp(value: number, min?: number, max?: number) {
  let next = value
  if (typeof min === 'number') next = Math.max(min, next)
  if (typeof max === 'number') next = Math.min(max, next)
  return next
}

function toInputValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) return String(parsed)
  }
  return ''
}

export function NumberField({
  field,
  value,
  onChange,
  name,
  id,
  label,
  readOnly,
  Label,
}: NumberFieldProps) {
  const [draft, setDraft] = useState(() => toInputValue(value))

  useEffect(() => {
    setDraft(toInputValue(value))
  }, [value])

  const commit = (raw: string) => {
    if (raw.trim() === '') {
      setDraft(toInputValue(value))
      return
    }

    const parsed = Number(raw)
    if (Number.isNaN(parsed)) {
      setDraft(toInputValue(value))
      return
    }

    const next = clamp(parsed, field.min, field.max)
    setDraft(String(next))
    onChange(next)
  }

  const input = (
    <input
      className="puck-number-input"
      id={id}
      name={name}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      readOnly={readOnly}
      placeholder={field.placeholder}
      value={draft}
      onChange={(event) => setDraft(event.currentTarget.value)}
      onBlur={(event) => commit(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          commit(event.currentTarget.value)
        }
      }}
    />
  )

  if (!Label) return input

  return (
    <Label label={label} readOnly={readOnly}>
      {input}
    </Label>
  )
}

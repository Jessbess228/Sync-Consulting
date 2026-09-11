import type { ComponentData, Config, Data } from '@puckeditor/core'

function applyItemDefaults(item: ComponentData, config: Config): ComponentData {
  const component = config.components[item.type]
  if (!component) return item

  const defaults = component.defaultProps ?? {}
  const fields = component.fields ?? {}
  const props: Record<string, unknown> = { ...defaults, ...item.props }

  for (const [key, field] of Object.entries(fields)) {
    if (!field || typeof field !== 'object' || field.type !== 'slot') continue
    const slot = props[key]
    if (Array.isArray(slot)) {
      props[key] = slot.map((child) => applyItemDefaults(child as ComponentData, config))
    }
  }

  return { ...item, props }
}

export function applyComponentDefaults(data: Data, config: Config): Data {
  return {
    ...data,
    content: (data.content ?? []).map((item) => applyItemDefaults(item, config)),
  }
}

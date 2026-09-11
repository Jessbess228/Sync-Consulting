/**
 * Typed px is the size at a 1280px laptop.
 * It shrinks on phones and grows on widescreens, capped at 1.75×.
 */
export function fluidPx(value: number | undefined, min = 12, max?: number) {
  const px = value || 0
  if (px <= 0) return 0
  const floor = Math.min(min, px)
  const cap = Math.min(max ?? Number.POSITIVE_INFINITY, Math.round(px * 1.75))
  return `clamp(${floor}px, ${(px / 12.8).toFixed(3)}vw, ${Math.max(px, cap)}px)`
}

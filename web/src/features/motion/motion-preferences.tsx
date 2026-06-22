import { createContext, useContext, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { MotionConfig, useReducedMotion } from 'motion/react'

export type MotionIntensity = 'system' | 'full' | 'reduced' | 'off'

interface PunkdomMotionSettings {
  intensity: MotionIntensity
  disabled: boolean
  reduced: boolean
}

const PunkdomMotionContext = createContext<PunkdomMotionSettings>({
  intensity: 'system',
  disabled: false,
  reduced: false,
})

export function normalizeMotionIntensity(value?: string | null): MotionIntensity {
  if (value === 'full' || value === 'reduced' || value === 'off' || value === 'system') return value
  return 'system'
}

export function PunkdomMotionProvider({
  intensity,
  children,
}: {
  intensity?: string | null
  children: ReactNode
}) {
  const normalized = normalizeMotionIntensity(intensity)
  const systemReduced = useReducedMotion()
  const disabled = normalized === 'off'
  const reduced = disabled || normalized === 'reduced' || (normalized === 'system' && Boolean(systemReduced))
  const reducedMotion = normalized === 'full' ? 'never' : (reduced ? 'always' : 'user')
  const settings = useMemo<PunkdomMotionSettings>(() => ({
    intensity: normalized,
    disabled,
    reduced,
  }), [disabled, normalized, reduced])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.punkdomMotion = normalized
  }, [normalized])

  return (
    <PunkdomMotionContext.Provider value={settings}>
      <MotionConfig reducedMotion={reducedMotion}>
        {children}
      </MotionConfig>
    </PunkdomMotionContext.Provider>
  )
}

export function usePunkdomMotion() {
  return useContext(PunkdomMotionContext)
}

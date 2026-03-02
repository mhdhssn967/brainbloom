import { useCallback } from 'react'
import SoundManager from '@/engine/SoundManager'
import { useSettingsStore } from '@/store/settingsStore'

/**
 * Hook that gives components access to sound with auto volume sync.
 * @returns {{ play, setVolume, mute }}
 */
export function useSound() {
  const volume = useSettingsStore(s => s.volume)

  const play = useCallback((key) => {
    SoundManager.setVolume(volume)
    SoundManager.play(key)
  }, [volume])

  return { play, setVolume: SoundManager.setVolume, mute: SoundManager.mute }
}
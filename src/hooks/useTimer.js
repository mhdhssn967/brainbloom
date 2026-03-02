import { TimerEngine } from '@/engine/TimerEngine.js'
import { useState, useEffect, useRef, useCallback } from 'react'


/**
 * React hook wrapping TimerEngine.
 * @param {number} duration  seconds
 * @param {function} onComplete  called when timer hits 0
 * @returns {{ remaining, progress, isRunning, start, pause, resume, reset }}
 */
export function useTimer(duration, onComplete) {
  const [remaining, setRemaining]   = useState(duration)
  const [isRunning, setIsRunning]   = useState(false)
  const engineRef                   = useRef(null)

  useEffect(() => {
    engineRef.current = new TimerEngine({
      duration,
      onTick:     (r) => setRemaining(r),
      onComplete: () => { setIsRunning(false); onComplete?.() },
    })
    return () => engineRef.current?.stop()
  }, [duration])

  const start  = useCallback(() => { engineRef.current?.start();  setIsRunning(true)  }, [])
  const pause  = useCallback(() => { engineRef.current?.pause();  setIsRunning(false) }, [])
  const resume = useCallback(() => { engineRef.current?.resume(); setIsRunning(true)  }, [])
  const reset  = useCallback((d) => { engineRef.current?.reset(d); setRemaining(d ?? duration); setIsRunning(false) }, [duration])

  return {
    remaining,
    progress: remaining / duration,
    isRunning,
    start, pause, resume, reset,
  }
}
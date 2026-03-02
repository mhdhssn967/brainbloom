import { clamp } from '@/utils/math'

/**
 * TimerBar — horizontal progress bar showing time remaining.
 * Turns orange below 50%, red below 25%.
 * @param {number} progress  1.0 (full) → 0.0 (empty)
 * @param {number} remaining  seconds left (for display)
 */
export default function TimerBar({ progress, remaining }) {
  const p = clamp(progress, 0, 1)
  const color = p > 0.5 ? '#4CAF50' : p > 0.25 ? '#FF9800' : '#F44336'

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div style={{
        width: '100%', height: 10, borderRadius: 99,
        background: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 99,
          width: `${p * 100}%`,
          background: color,
          transition: 'width 1s linear, background 0.3s ease',
          boxShadow: `0 0 10px ${color}80`,
        }} />
      </div>
      <div style={{
        position: 'absolute', right: 0, top: -20,
        fontFamily: "'Boogaloo', cursive",
        fontSize: 16, color,
      }}>{remaining}s</div>
    </div>
  )
}
/**
 * LoadingScreen — shown during lazy-load of game chunks.
 * Fullscreen, matches dark theme, no layout shift.
 */
export default function LoadingScreen() {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#06020f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16,
    }}>
      <div style={{
        fontSize: 48,
        animation: 'floatBob 1s ease-in-out infinite',
      }}>🎮</div>
      <p style={{
        fontFamily: "'Boogaloo', cursive",
        fontSize: 22, color: 'rgba(255,255,255,0.5)',
        letterSpacing: 2,
      }}>Loading...</p>
    </div>
  )
}
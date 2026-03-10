import Router from '@/router'
import '@/index.css'
import '@/styles/animations.css'

export default function App() {
  // App.jsx — add this style tag once
<style>{`
  * { touch-action: manipulation; }
  button { touch-action: manipulation; }
`}</style>
  return <Router />
}
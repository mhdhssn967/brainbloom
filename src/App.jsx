import Router from '@/router'
import '@/index.css'
import '@/styles/animations.css'

export default function App() {
  document.addEventListener("pointerdown", (e) => {
  e.target.releasePointerCapture(e.pointerId);
}, true);
  return <Router />
}

import { StrictMode } from 'react'
import { createRoot }  from 'react-dom/client'
import App from './App'

document.addEventListener("pointerdown", (e) => {
  e.target.releasePointerCapture(e.pointerId);
}, true);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

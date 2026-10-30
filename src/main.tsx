import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { useGameStore } from './store/gameStore'
import './styles/index.css'

if (typeof window !== 'undefined') {
  ;(window as unknown as { __GAME_STORE__: typeof useGameStore }).__GAME_STORE__ = useGameStore
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
